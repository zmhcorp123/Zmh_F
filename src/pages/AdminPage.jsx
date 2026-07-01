import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";
import { adminApi } from "../services/api";
import { packages as defaultPackages } from "../data/siteData";

const adminTabs = [
  { name: "Overview", icon: "shield" },
  { name: "Approvals", icon: "users" },
  { name: "Users", icon: "users" },
  { name: "Bookings", icon: "calendar" },
  { name: "Ongoing", icon: "route" },
  { name: "Cancelled Orders", icon: "bill" },
  { name: "Bills", icon: "bill" },
  { name: "Settings", icon: "settings" },
];

const bookingStatuses = ["new", "needs review", "ongoing", "completed", "cancelled"];
const userStatuses = ["pending", "active", "suspended"];

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Not selected";
}

function SettingsPanel() {
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [packageRows, setPackageRows] = useState(defaultPackages);

  useEffect(() => {
    let active = true;
    adminApi.getSettings().then((data) => {
      if (!active) return;
      const packageSetting = (data.settings || []).find((item) => item.key === "packages");
      if (Array.isArray(packageSetting?.value)) setPackageRows(packageSetting.value);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const updatePackage = (slug, field, value) => {
    setPackageRows((current) => current.map((item) => item.slug === slug ? { ...item, [field]: value } : item));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaved("");
    setError("");
    try {
      await adminApi.settings({ packages: packageRows });
      setSaved("Package pricing saved.");
    } catch (err) {
      setError(err.message || "Could not save settings.");
    }
  };

  return (
    <div className="admin-settings">
      <form className="form-card package-settings-form" onSubmit={save}>
        <h3>Package Pricing</h3>
        {packageRows.map((item) => (
          <div className="package-setting-row" key={item.slug}>
            <label>{item.name} price<input value={item.price || ""} onChange={(event) => updatePackage(item.slug, "price", event.target.value)} placeholder="Custom" /></label>
            <label>Included items<textarea value={(item.features || []).join("\n")} onChange={(event) => updatePackage(item.slug, "features", event.target.value.split("\n").map((line) => line.trim()).filter(Boolean))} placeholder="One included item per line" /></label>
          </div>
        ))}
        <Button type="submit" icon="settings">Save Package Settings</Button>
      </form>
      {saved && <div className="success admin-save">{saved}</div>}
      {error && <div className="form-error admin-save">{error}</div>}
    </div>
  );
}

export function AdminPage() {
  const [tab, setTab] = useState("Overview");
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      adminApi.users(),
      adminApi.bookings(),
      adminApi.bills(),
    ]).then(([userData, bookingData, billData]) => {
      if (!active) return;
      setUsers(userData.users || []);
      setBookings(bookingData.bookings || []);
      setBills(billData.bills || []);
    }).catch((err) => {
      if (active) setError(err.message || "Could not load admin data.");
    });
    return () => { active = false; };
  }, []);

  const pendingUsers = useMemo(() => users.filter((user) => user.status === "pending"), [users]);
  const verifiedPendingUsers = useMemo(() => pendingUsers.filter((user) => user.isEmailVerified), [pendingUsers]);
  const newBookings = useMemo(() => bookings.filter((booking) => !["ongoing", "completed", "cancelled"].includes(booking.status)), [bookings]);
  const ongoingBookings = useMemo(() => bookings.filter((booking) => booking.status === "ongoing"), [bookings]);
  const cancelledBookings = useMemo(() => bookings.filter((booking) => booking.status === "cancelled"), [bookings]);

  const metrics = useMemo(() => [
    ["Pending approvals", pendingUsers.length, "users"],
    ["Users", users.length, "users"],
    ["Bookings", bookings.length, "calendar"],
    ["Ongoing", ongoingBookings.length, "route"],
  ], [users, pendingUsers, bookings, ongoingBookings]);

  const approveUser = async (id) => {
    setSavingId(id);
    setError("");
    setNotice("");
    try {
      const data = await adminApi.approveUser(id);
      setUsers((current) => current.map((user) => user._id === id ? data.user : user));
      setNotice(data.message || "User approved and email sent.");
    } catch (err) {
      setError(err.message || "Could not approve user.");
    } finally {
      setSavingId("");
    }
  };

  const updateUser = async (id, payload) => {
    setSavingId(id);
    setError("");
    setNotice("");
    try {
      const data = await adminApi.updateUser(id, payload);
      setUsers((current) => current.map((user) => user._id === id ? data.user : user));
    } catch (err) {
      setError(err.message || "Could not update user.");
    } finally {
      setSavingId("");
    }
  };

  const updateBooking = async (event, booking) => {
    event.preventDefault();
    setSavingId(booking._id);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await adminApi.updateBooking(booking._id, {
        status: form.get("status"),
        requestedDate: form.get("requestedDate"),
        adminResponse: form.get("adminResponse"),
        notes: form.get("notes"),
      });
      setBookings((current) => current.map((item) => item._id === booking._id ? data.booking : item));
      setNotice(data.emailSent ? "Booking saved and customer email sent." : "Booking saved.");
    } catch (err) {
      setError(err.message || "Could not update booking.");
    } finally {
      setSavingId("");
    }
  };

  const renderBookingCards = (items, emptyText, readOnly = false) => (
    <div className="booking-admin-list">
      {items.length ? items.map((booking) => (
        <form className="booking-admin-card" key={booking._id} onSubmit={(event) => updateBooking(event, booking)}>
          <div>
            <span className="eyebrow">{booking.email || booking.user?.email || "Public request"}</span>
            <h3>{booking.companyName}</h3>
            <p>{booking.services?.join(", ") || "No services selected"}</p>
          </div>
          <label>Status<select name="status" defaultValue={booking.status} disabled={readOnly}>{bookingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
          <label>Requested Date<input name="requestedDate" type="date" defaultValue={booking.requestedDate ? booking.requestedDate.slice(0, 10) : ""} disabled={readOnly} /></label>
          <label>Admin Response<textarea name="adminResponse" defaultValue={booking.adminResponse || ""} placeholder="Write the response the user will see..." disabled={readOnly} /></label>
          <label>Internal Notes<textarea name="notes" defaultValue={booking.notes || ""} placeholder="Private admin notes" disabled={readOnly} /></label>
          <div className="booking-admin-footer">
            <span>Created {formatDate(booking.createdAt)}</span>
            {readOnly ? <span className="status-pill">{booking.status}</span> : <button type="submit" className="table-action" disabled={savingId === booking._id}>{savingId === booking._id ? "Saving" : "Send response"}</button>}
          </div>
        </form>
      )) : <div className="empty-state">{emptyText}</div>}
    </div>
  );

  return (
    <>
      <SEO title="Admin Panel" description="Manage real MongoDB users, bookings, bills, and admin responses." />
      <section className="admin-page">
        <aside className="admin-sidebar">
          <span className="eyebrow">Admin</span>
          <h1>Control Center</h1>
          {adminTabs.map((item) => (
            <button key={item.name} className={tab === item.name ? "active" : ""} onClick={() => setTab(item.name)}>
              <Icon name={item.icon} size={18} /> {item.name}
            </button>
          ))}
        </aside>
        <div className="admin-main">
          <div className="admin-hero">
            <div>
              <span className="eyebrow">MongoDB connected</span>
              <h2>{tab === "Overview" ? "Manage users, bookings, bills, and responses" : tab}</h2>
              <p>Review booking requests, confirm dates, and send responses that clients can see in their portal.</p>
            </div>
            <Button to="/user-dashboard" variant="secondary" icon="user">User Dashboard</Button>
          </div>

          {error && <div className="form-error">{error}</div>}
          {notice && <div className="success">{notice}</div>}

          {tab === "Overview" && (
            <>
              <div className="grid four admin-metrics">
                {metrics.map(([label, value, icon]) => (
                  <article className="card" key={label}><div className="card-icon"><Icon name={icon} /></div><strong className="price">{value}</strong><p>{label}</p></article>
                ))}
              </div>
              <SettingsPanel />
            </>
          )}

          {tab === "Approvals" && (
            <div className="admin-table-wrap">
              <div className="approval-summary">
                <strong>{pendingUsers.length} pending accounts</strong>
                <span>{verifiedPendingUsers.length} verified by OTP and ready for admin approval</span>
              </div>
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Company</th><th>Email</th><th>OTP</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {pendingUsers.length ? pendingUsers.map((user) => (
                    <tr key={user._id}>
                      <td data-label="Name">{user.name}</td>
                      <td data-label="Company">{user.company || "-"}</td>
                      <td data-label="Email">{user.email}</td>
                      <td data-label="OTP">{user.isEmailVerified ? "Verified" : "Not verified"}</td>
                      <td data-label="Status">{user.status}</td>
                      <td data-label="Action"><button type="button" className="table-action" disabled={savingId === user._id} onClick={() => approveUser(user._id)}>{savingId === user._id ? "Approving" : "Approve & email"}</button></td>
                    </tr>
                  )) : <tr><td colSpan="6">No pending approvals.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {tab === "Users" && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {users.length ? users.map((user) => (
                    <tr key={user._id}>
                      <td data-label="Name">{user.name}</td>
                      <td data-label="Company">{user.company || "-"}</td>
                      <td data-label="Email">{user.email}</td>
                      <td data-label="Role">{user.role}</td>
                      <td data-label="Status"><select defaultValue={user.status} onChange={(event) => updateUser(user._id, { status: event.target.value })}>{userStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                      <td data-label="Action"><button type="button" className="table-action" disabled={savingId === user._id || user.status === "active"} onClick={() => approveUser(user._id)}>{savingId === user._id ? "Saving" : user.status === "active" ? "Approved" : "Approve & email"}</button></td>
                    </tr>
                  )) : <tr><td colSpan="6">No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {tab === "Bookings" && (
            renderBookingCards(newBookings, "No new booking requests found.")
          )}

          {tab === "Ongoing" && (
            renderBookingCards(ongoingBookings, "No ongoing orders yet.")
          )}

          {tab === "Cancelled Orders" && (
            renderBookingCards(cancelledBookings, "No cancelled orders yet.", true)
          )}

          {tab === "Bills" && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Invoice</th><th>Company</th><th>Amount</th><th>Status</th><th>Due Date</th></tr></thead>
                <tbody>
                  {bills.length ? bills.map((bill) => (
                    <tr key={bill._id}><td>{bill.invoice}</td><td>{bill.company}</td><td>{bill.currency} {bill.amount}</td><td>{bill.status}</td><td>{formatDate(bill.dueDate)}</td></tr>
                  )) : <tr><td colSpan="5">No bills found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {tab === "Settings" && <SettingsPanel />}
        </div>
      </section>
    </>
  );
}
