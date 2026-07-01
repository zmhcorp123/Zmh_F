import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Sections";
import { SEO } from "../components/SEO";
import { useAuth } from "../context/useAuth";
import { bookingApi, dashboardApi } from "../services/api";
import { navigate } from "../utils/router";

export function Dashboard({ section = "Dashboard" }) {
  const { user, updateUser, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const items = ["Dashboard", "Bookings", "Invoices", "Messages", "Notifications", "Profile", "Settings", "Support Tickets", "Book Service", "My Services", "Calendar"];

  const saveProfile = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateUser({ name: form.get("name"), company: form.get("company") });
    setSaved(true);
  };

  return <><SEO title={section} /><section className="dashboard"><aside>{items.map((item) => <button key={item} className={item === section ? "active" : ""} onClick={() => navigate(item === "Dashboard" ? "/user-dashboard" : "/" + item.toLowerCase().replaceAll(" ", "-"))}>{item}</button>)}</aside><div className="dash-main"><span className="eyebrow">Client portal</span><h1>{section}</h1><p>Signed in as {user?.name || "Guest"} from {user?.company || "Company"}.</p>{section === "Profile" ? <form className="form-card inline" onSubmit={saveProfile}><label>Profile Picture<input type="file" /></label><label>Personal Info<input name="name" defaultValue={user?.name || ""} /></label><label>Company Info<input name="company" defaultValue={user?.company || ""} /></label><label>Change Password<input type="password" /></label><label className="checkbox"><input type="checkbox" /> Notification Settings</label><Button type="submit">Save profile</Button>{saved && <div className="success">Profile saved locally for backend update.</div>}<button type="button" className="danger">Delete Account</button></form> : <DashboardCards section={section} />}<button className="ghost-small" onClick={logout}>Logout</button></div></section></>;
}

function DashboardCards({ section }) {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      setError("");
      try {
        const [profileData, bookingData, invoiceData, notificationData] = await Promise.all([
          dashboardApi.profile(),
          bookingApi.list(),
          dashboardApi.invoices(),
          dashboardApi.notifications(),
        ]);
        if (!active) return;
        setProfile(profileData);
        setBookings(bookingData.bookings || []);
        setInvoices(invoiceData.invoices || []);
        setNotifications(notificationData.notifications || []);
      } catch (err) {
        if (active) setError(err.message || "Could not load dashboard data.");
      }
    }
    loadDashboard();
    return () => { active = false; };
  }, []);

  const bookingRows = bookings.map((booking) => ({
    id: booking._id,
    title: booking.companyName,
    date: booking.requestedDate ? new Date(booking.requestedDate).toLocaleDateString() : "No date",
    status: booking.status,
    response: booking.adminResponse || "Waiting for admin response",
  }));

  if (section === "Bookings" || section === "Calendar" || section === "My Services") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{bookingRows.length ? bookingRows.map((booking) => <article className="portal-row" key={booking.id}><div><strong>{booking.title}</strong><span>{booking.date}</span><p>{booking.response}</p></div><span className="status-pill">{booking.status}</span></article>) : <div className="empty-state">No bookings yet. Submit a booking request to see it here.</div>}</div>;
  }

  if (section === "Invoices") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{invoices.length ? invoices.map((invoice) => <article className="portal-row" key={invoice._id}><div><strong>{invoice.invoice}</strong><span>{invoice.company}</span></div><span className="status-pill">{invoice.status}</span></article>) : <div className="empty-state">No invoices found.</div>}</div>;
  }

  if (section === "Notifications" || section === "Messages") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{notifications.length ? notifications.map((item) => <article className="portal-row" key={item._id}><div><strong>{item.title}</strong><p>{item.body}</p></div><span className="status-pill">{item.type}</span></article>) : <div className="empty-state">No notifications yet.</div>}</div>;
  }

  const stats = profile?.stats || {};
  return <div className="grid three dash-cards">{[
    ["Bookings", stats.bookings || bookings.length || 0],
    ["Invoices", stats.invoices || invoices.length || 0],
    ["Notifications", stats.notifications || notifications.length || 0],
    ["Admin responses", bookings.filter((booking) => booking.adminResponse).length],
    ["Confirmed", bookings.filter((booking) => booking.status === "confirmed").length],
    ["Calendar events", bookings.filter((booking) => booking.requestedDate).length],
  ].map(([item, value]) => <Card key={item} title={item} text={error || "Live account data from the backend."}><strong className="price">{value}</strong></Card>)}</div>;
}
