import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";
import { adminApi } from "../services/api";
import { packages as defaultPackages } from "../data/siteData";
import { navigate } from "../utils/router";

const adminTabs = [
  { name: "Overview", icon: "shield" },
  { name: "Approvals", icon: "users" },
  { name: "Users", icon: "users" },
  { name: "Bookings", icon: "calendar" },
  { name: "Ongoing", icon: "route" },
  { name: "Cancelled Orders", icon: "bill" },
  { name: "Bills", icon: "bill" },
  { name: "Send Bills", icon: "mail" },
  { name: "Support Tickets", icon: "mail" },
  { name: "Settings", icon: "settings" },
];

const userStatuses = ["pending", "active", "suspended"];

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Not selected";
}

function SettingsPanel() {
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [accountSaved, setAccountSaved] = useState("");
  const [accountDetails, setAccountDetails] = useState({
    beneficiaryName: "ZMH USA Corp",
    bankName: "Contact sales for bank details",
    accountNumber: "Provided on request",
    routingSwift: "Provided on request",
    referencePrefix: "ZMH",
    paymentInstructions: "Include the invoice or order reference with your transfer.",
  });
  const [packageRows, setPackageRows] = useState(defaultPackages.map((item, index) => ({
    ...item,
    description: item.bestFor,
    displayOrder: index,
    highlightBadge: "",
    buttonText: "Package details",
    buttonLink: `/pricing/${item.slug}`,
    status: "active",
    recommended: item.slug === "professional",
  })));

  useEffect(() => {
    let active = true;
    Promise.all([adminApi.pricing(), adminApi.getSettings()]).then(([pricingData, settingsData]) => {
      if (!active) return;
      if (Array.isArray(pricingData.packages) && pricingData.packages.length) setPackageRows(pricingData.packages);
      const accountSetting = (settingsData.settings || []).find((item) => item.key === "accountDetails");
      if (accountSetting?.value) setAccountDetails((current) => ({ ...current, ...accountSetting.value }));
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const updatePackage = (index, field, value) => {
    setPackageRows((current) => current.map((item, rowIndex) => rowIndex === index ? { ...item, [field]: value } : item));
  };

  const updateFeature = (packageIndex, featureIndex, value) => {
    setPackageRows((current) => current.map((item, rowIndex) => {
      if (rowIndex !== packageIndex) return item;
      const features = [...(item.features || [])];
      features[featureIndex] = value;
      return { ...item, features };
    }));
  };

  const addFeature = (packageIndex) => {
    setPackageRows((current) => current.map((item, rowIndex) => rowIndex === packageIndex ? { ...item, features: [...(item.features || []), "New included feature"] } : item));
  };

  const removeFeature = (packageIndex, featureIndex) => {
    setPackageRows((current) => current.map((item, rowIndex) => {
      if (rowIndex !== packageIndex) return item;
      return { ...item, features: (item.features || []).filter((_, index) => index !== featureIndex) };
    }));
  };

  const moveFeature = (packageIndex, from, to) => {
    if (from === to || to < 0) return;
    setPackageRows((current) => current.map((item, rowIndex) => {
      if (rowIndex !== packageIndex) return item;
      const features = [...(item.features || [])];
      if (to >= features.length) return item;
      const [feature] = features.splice(from, 1);
      features.splice(to, 0, feature);
      return { ...item, features };
    }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaved("");
    setError("");
    try {
      const payload = packageRows.map((item, index) => ({ ...item, displayOrder: Number(item.displayOrder ?? index), features: item.features || [] }));
      const data = await adminApi.savePricing(payload);
      setPackageRows(data.packages || payload);
      setSaved("Package pricing saved.");
    } catch (err) {
      setError(err.message || "Could not save settings.");
    }
  };

  const updateAccount = (field, value) => {
    setAccountDetails((current) => ({ ...current, [field]: value }));
  };

  const saveAccountDetails = async (event) => {
    event.preventDefault();
    setAccountSaved("");
    setError("");
    try {
      await adminApi.settings({ accountDetails });
      setAccountSaved("Account details saved.");
    } catch (err) {
      setError(err.message || "Could not save account details.");
    }
  };

  return (
    <div className="admin-settings">
      <form className="form-card account-settings-form" onSubmit={saveAccountDetails}>
        <h3>Account / Bank Transfer Details</h3>
        <div className="form-grid compact">
          <label>Beneficiary Name<input value={accountDetails.beneficiaryName} onChange={(event) => updateAccount("beneficiaryName", event.target.value)} /></label>
          <label>Bank Name<input value={accountDetails.bankName} onChange={(event) => updateAccount("bankName", event.target.value)} /></label>
          <label>Account Number<input value={accountDetails.accountNumber} onChange={(event) => updateAccount("accountNumber", event.target.value)} /></label>
          <label>Routing Number / SWIFT<input value={accountDetails.routingSwift} onChange={(event) => updateAccount("routingSwift", event.target.value)} /></label>
          <label>Reference Prefix<input value={accountDetails.referencePrefix} onChange={(event) => updateAccount("referencePrefix", event.target.value)} /></label>
        </div>
        <label>Payment Instructions<textarea value={accountDetails.paymentInstructions} onChange={(event) => updateAccount("paymentInstructions", event.target.value)} /></label>
        <Button type="submit" icon="settings">Save Account Details</Button>
      </form>
      <form className="form-card package-settings-form" onSubmit={save}>
        <h3>Package Pricing</h3>
        <div className="package-settings-grid">
          {packageRows.map((item, packageIndex) => (
          <div className="package-setting-card" key={item.slug || packageIndex}>
            <div className="settings-card-head">
              <h4>{item.name || "Package"}</h4>
              <label className="checkbox"><input type="checkbox" checked={Boolean(item.recommended)} onChange={(event) => updatePackage(packageIndex, "recommended", event.target.checked)} /> Recommended</label>
            </div>
            <div className="form-grid compact">
              <label>Name<input value={item.name || ""} onChange={(event) => updatePackage(packageIndex, "name", event.target.value)} /></label>
              <label>Slug<input value={item.slug || ""} onChange={(event) => updatePackage(packageIndex, "slug", event.target.value)} /></label>
              <label>Price<input value={item.price || ""} onChange={(event) => updatePackage(packageIndex, "price", event.target.value)} placeholder="Custom" /></label>
              <label>Display Order<input type="number" value={item.displayOrder ?? packageIndex} onChange={(event) => updatePackage(packageIndex, "displayOrder", event.target.value)} /></label>
              <label>Badge<input value={item.highlightBadge || ""} onChange={(event) => updatePackage(packageIndex, "highlightBadge", event.target.value)} placeholder="Most popular" /></label>
              <label>Status<select value={item.status || "active"} onChange={(event) => updatePackage(packageIndex, "status", event.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
              <label>Button Text<input value={item.buttonText || ""} onChange={(event) => updatePackage(packageIndex, "buttonText", event.target.value)} /></label>
              <label>Button Link<input value={item.buttonLink || ""} onChange={(event) => updatePackage(packageIndex, "buttonLink", event.target.value)} /></label>
            </div>
            <label>Description<textarea value={item.description || item.bestFor || ""} onChange={(event) => updatePackage(packageIndex, "description", event.target.value)} /></label>
            <div className="feature-manager">
              <div className="settings-card-head">
                <strong>Included Features</strong>
                <button type="button" className="table-action" onClick={() => addFeature(packageIndex)}>Add feature</button>
              </div>
              {(item.features || []).map((feature, featureIndex) => (
                <div
                  className="feature-row"
                  key={`${item.slug}-${featureIndex}`}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData("text/plain", String(featureIndex))}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => moveFeature(packageIndex, Number(event.dataTransfer.getData("text/plain")), featureIndex)}
                >
                  <span className="drag-handle">::</span>
                  <input value={feature} onChange={(event) => updateFeature(packageIndex, featureIndex, event.target.value)} />
                  <button type="button" className="table-action" onClick={() => moveFeature(packageIndex, featureIndex, featureIndex - 1)}>Up</button>
                  <button type="button" className="table-action" onClick={() => moveFeature(packageIndex, featureIndex, featureIndex + 1)}>Down</button>
                  <button type="button" className="table-action danger-link" onClick={() => removeFeature(packageIndex, featureIndex)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
          ))}
        </div>
        <Button type="submit" icon="settings">Save Package Settings</Button>
      </form>
      {saved && <div className="success admin-save">{saved}</div>}
      {accountSaved && <div className="success admin-save">{accountSaved}</div>}
      {error && <div className="form-error admin-save">{error}</div>}
    </div>
  );
}

export function AdminPage() {
  const [tab, setTab] = useState("Overview");
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bills, setBills] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderSort, setOrderSort] = useState("newest");
  const [orderFilter, setOrderFilter] = useState("all");

  useEffect(() => {
    let active = true;
    Promise.all([
      adminApi.users(),
      adminApi.bookings(),
      adminApi.bills(),
      adminApi.supportTickets(),
    ]).then(([userData, bookingData, billData, ticketData]) => {
      if (!active) return;
      setUsers(userData.users || []);
      setBookings(bookingData.bookings || []);
      setBills(billData.bills || []);
      setTickets(ticketData.tickets || []);
    }).catch((err) => {
      if (active) setError(err.message || "Could not load admin data.");
    });
    return () => { active = false; };
  }, []);

  const pendingUsers = useMemo(() => users.filter((user) => user.status === "pending"), [users]);
  const verifiedPendingUsers = useMemo(() => pendingUsers.filter((user) => user.isEmailVerified), [pendingUsers]);
  const newBookings = useMemo(() => bookings.filter((booking) => !["ongoing", "cancelled"].includes(booking.status)), [bookings]);
  const ongoingBookings = useMemo(() => bookings.filter((booking) => booking.status === "ongoing"), [bookings]);
  const visibleOngoingBookings = useMemo(() => {
    const term = orderSearch.trim().toLowerCase();
    const filtered = ongoingBookings.filter((booking) => {
      const haystack = [booking.companyName, booking.email, booking.user?.email, booking.phone, booking.packageName, booking.assignedStaff].join(" ").toLowerCase();
      const matchesSearch = !term || haystack.includes(term);
      const matchesFilter = orderFilter === "all" || booking.paymentStatus === orderFilter;
      return matchesSearch && matchesFilter;
    });
    return [...filtered].sort((a, b) => {
      if (orderSort === "company") return String(a.companyName || "").localeCompare(String(b.companyName || ""));
      if (orderSort === "progress") return Number(b.progressPercent || 0) - Number(a.progressPercent || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [ongoingBookings, orderSearch, orderSort, orderFilter]);
  const cancelledBookings = useMemo(() => bookings.filter((booking) => booking.status === "cancelled"), [bookings]);
  const openTickets = useMemo(() => tickets.filter((ticket) => ticket.status !== "resolved"), [tickets]);

  const metrics = useMemo(() => [
    ["Pending approvals", pendingUsers.length, "users"],
    ["Users", users.length, "users"],
    ["Bookings", bookings.length, "calendar"],
    ["Ongoing", ongoingBookings.length, "route"],
    ["Open tickets", openTickets.length, "mail"],
  ], [users, pendingUsers, bookings, ongoingBookings, openTickets]);

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
    const action = event.nativeEvent.submitter?.value || "needs discussion";
    setSavingId(booking._id);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await adminApi.updateBooking(booking._id, {
        status: action,
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

  const updateOrderProfile = async (event, booking) => {
    event.preventDefault();
    setSavingId(booking._id);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await adminApi.updateBooking(booking._id, {
        activeServices: String(form.get("activeServices") || "").split("\n").map((item) => item.trim()).filter(Boolean),
        serviceUpdates: form.get("serviceUpdates"),
        notes: form.get("notes"),
      });
      setBookings((current) => current.map((item) => item._id === booking._id ? data.booking : item));
      setNotice("Order profile updated.");
    } catch (err) {
      setError(err.message || "Could not update order profile.");
    } finally {
      setSavingId("");
    }
  };

  const resolveTicket = async (event, ticket) => {
    event.preventDefault();
    setSavingId(ticket._id);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await adminApi.updateSupportTicket(ticket._id, {
        status: form.get("status"),
        adminResponse: form.get("adminResponse"),
      });
      setTickets((current) => current.map((item) => item._id === ticket._id ? data.ticket : item));
      setNotice("Support ticket updated.");
    } catch (err) {
      setError(err.message || "Could not update support ticket.");
    } finally {
      setSavingId("");
    }
  };

  const sendBills = async (event) => {
    event.preventDefault();
    setSavingId("send-bills");
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await adminApi.sendBills({
        scope: form.get("scope"),
        userId: form.get("userId"),
        userIds: form.getAll("userIds"),
        amount: form.get("amount"),
        currency: form.get("currency"),
        dueDate: form.get("dueDate"),
        message: form.get("message"),
        lineItems: [{ label: form.get("label") || "Service bill", amount: Number(form.get("amount")) || 0 }],
      });
      setBills((current) => [...(data.bills || []), ...current]);
      setNotice(`Bills sent to ${data.bills?.length || 0} user(s). Emails sent: ${data.emailsSent || 0}.`);
      event.currentTarget.reset();
    } catch (err) {
      setError(err.message || "Could not send bills.");
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
          <label>Requested Date<input name="requestedDate" type="date" defaultValue={booking.requestedDate ? booking.requestedDate.slice(0, 10) : ""} disabled={readOnly} /></label>
          <label>Admin Response<textarea name="adminResponse" defaultValue={booking.adminResponse || ""} placeholder="Write the response the user will see..." disabled={readOnly} /></label>
          <label>Internal Notes<textarea name="notes" defaultValue={booking.notes || ""} placeholder="Private admin notes" disabled={readOnly} /></label>
          <div className="booking-admin-footer">
            <span>Created {formatDate(booking.createdAt)}</span>
            {readOnly ? <span className="status-pill">{booking.status}</span> : <div className="decision-actions">
              <button type="submit" name="action" value="accepted" className="table-action" disabled={savingId === booking._id}>Accept</button>
              <button type="submit" name="action" value="needs discussion" className="table-action" disabled={savingId === booking._id}>Need discussion</button>
              <button type="submit" name="action" value="cancelled" className="table-action danger-link" disabled={savingId === booking._id}>Cancel order</button>
            </div>}
          </div>
        </form>
      )) : <div className="empty-state">{emptyText}</div>}
    </div>
  );

  const renderOrderProfiles = (items) => (
    <div className="booking-admin-list">
      {items.length ? items.map((booking) => (
        <form className="order-profile-card" key={booking._id} onSubmit={(event) => updateOrderProfile(event, booking)}>
          <div className="order-profile-head">
            <div>
              <span className="eyebrow">Order profile</span>
              <h3>{booking.companyName}</h3>
              <p>{booking.user?.name || "Public booking"} • {booking.phone || "No phone"} • {booking.email || booking.user?.email || "No email"}</p>
            </div>
            <span className="status-pill">Purchased {formatDate(booking.createdAt)}</span>
          </div>
          <div className="profile-facts">
            <span><strong>Company</strong>{booking.companyName}</span>
            <span><strong>Number</strong>{booking.phone || "-"}</span>
            <span><strong>Requested</strong>{formatDate(booking.requestedDate)}</span>
            <span><strong>Status</strong>{booking.status}</span>
          </div>
          <label>Services they are receiving<textarea name="activeServices" defaultValue={(booking.activeServices?.length ? booking.activeServices : booking.services || []).join("\n")} placeholder="One service per line" /></label>
          <label>Service updates<textarea name="serviceUpdates" defaultValue={booking.serviceUpdates || ""} placeholder="Update what ZMH is providing for this order..." /></label>
          <label>Admin notes<textarea name="notes" defaultValue={booking.notes || ""} placeholder="Private admin notes" /></label>
          <div className="booking-admin-footer"><span>Last updated {formatDate(booking.updatedAt)}</span><button type="submit" className="table-action" disabled={savingId === booking._id}>{savingId === booking._id ? "Saving" : "Update profile"}</button></div>
        </form>
      )) : <div className="empty-state">No ongoing order profiles yet.</div>}
    </div>
  );

  const renderOrderTable = (items) => (
    <div className="order-management">
      <div className="order-toolbar">
        <label>Search<input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Company, email, phone, package..." /></label>
        <label>Filter<select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)}><option value="all">All ongoing</option><option value="pending">Payment pending</option><option value="sent">Invoice sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option></select></label>
        <label>Sort<select value={orderSort} onChange={(event) => setOrderSort(event.target.value)}><option value="newest">Newest</option><option value="company">Company</option><option value="progress">Progress</option></select></label>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table order-table">
          <thead><tr><th>Order</th><th>Contact</th><th>Package</th><th>Progress</th><th>Billing</th><th>Assigned</th><th>Action</th></tr></thead>
          <tbody>
            {items.length ? items.map((booking) => (
              <tr key={booking._id}>
                <td data-label="Order"><strong>{booking.companyName}</strong><span>Ordered {formatDate(booking.createdAt)}</span></td>
                <td data-label="Contact">{booking.contactPerson || booking.user?.name || "Public booking"}<span>{booking.email || booking.user?.email || "No email"}<br />{booking.phone || "No phone"}</span></td>
                <td data-label="Package">{booking.packageName || "Custom support"}<span>{booking.packagePrice || "Custom"}</span></td>
                <td data-label="Progress"><div className="progress-meter"><span style={{ width: `${Number(booking.progressPercent || 0)}%` }} /></div><small>{Number(booking.progressPercent || 0)}%</small></td>
                <td data-label="Billing"><span className="status-pill">{booking.paymentStatus || "pending"}</span><small>Next {formatDate(booking.nextBillingDate)}</small></td>
                <td data-label="Assigned">{booking.assignedStaff || "Unassigned"}</td>
                <td data-label="Action"><button type="button" className="table-action" onClick={() => navigate(`/admin/orders/${booking._id}`)}>Open details</button></td>
              </tr>
            )) : <tr><td colSpan="7">No ongoing orders match this view.</td></tr>}
          </tbody>
        </table>
      </div>
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
              <h2>{tab === "Overview" ? "Manage users, orders, bills, and support" : tab}</h2>
              <p>Review bookings, manage ongoing order profiles, resolve support tickets, and send client bills.</p>
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
            renderOrderTable(visibleOngoingBookings)
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

          {tab === "Send Bills" && (
            <form className="form-card send-bills-form" onSubmit={sendBills}>
              <div className="form-grid compact">
                <label>Send to<select name="scope" defaultValue="individual"><option value="individual">Individual user</option><option value="custom">Custom selected users</option><option value="all">All active users</option></select></label>
                <label>Individual user<select name="userId" defaultValue=""><option value="">Select user</option>{users.filter((user) => user.role !== "admin").map((user) => <option key={user._id} value={user._id}>{user.name} - {user.email}</option>)}</select></label>
                <label>Amount<input name="amount" type="number" min="0" step="0.01" required /></label>
                <label>Currency<input name="currency" defaultValue="USD" /></label>
                <label>Due date<input name="dueDate" type="date" /></label>
                <label>Line item<input name="label" defaultValue="Service bill" /></label>
              </div>
              <div className="custom-user-box">
                {users.filter((user) => user.role !== "admin").map((user) => <label className="checkbox" key={user._id}><input type="checkbox" name="userIds" value={user._id} /> {user.name} ({user.email})</label>)}
              </div>
              <label>Bill message<textarea name="message" placeholder="Optional message for the bill email" /></label>
              <Button type="submit" icon="mail">{savingId === "send-bills" ? "Sending..." : "Send bills"}</Button>
            </form>
          )}

          {tab === "Support Tickets" && (
            <div className="booking-admin-list">
              {tickets.length ? tickets.map((ticket) => (
                <form className="support-ticket-card" key={ticket._id} onSubmit={(event) => resolveTicket(event, ticket)}>
                  <div>
                    <span className="eyebrow">{ticket.user?.email}</span>
                    <h3>{ticket.subject}</h3>
                    <p>{ticket.message}</p>
                  </div>
                  <div className="profile-facts">
                    <span><strong>User</strong>{ticket.user?.name || "-"}</span>
                    <span><strong>Company</strong>{ticket.user?.company || "-"}</span>
                    <span><strong>Status</strong>{ticket.status}</span>
                    <span><strong>Created</strong>{formatDate(ticket.createdAt)}</span>
                  </div>
                  <label>Status<select name="status" defaultValue={ticket.status}><option value="open">Open</option><option value="in review">In review</option><option value="resolved">Resolved</option></select></label>
                  <label>Admin response<textarea name="adminResponse" defaultValue={ticket.adminResponse || ""} placeholder="Write the resolution or update for the user" /></label>
                  <div className="booking-admin-footer"><span>{ticket.resolvedAt ? "Resolved " + formatDate(ticket.resolvedAt) : "Waiting for admin"}</span><button type="submit" className="table-action" disabled={savingId === ticket._id}>{savingId === ticket._id ? "Saving" : "Update ticket"}</button></div>
                </form>
              )) : <div className="empty-state">No support tickets yet.</div>}
            </div>
          )}

          {tab === "Settings" && <SettingsPanel />}
        </div>
      </section>
    </>
  );
}
