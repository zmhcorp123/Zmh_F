import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Sections";
import { SEO } from "../components/SEO";
import { useAuth } from "../context/useAuth";
import { bookingApi, dashboardApi } from "../services/api";
import { navigate } from "../utils/router";

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Not selected";
}

function downloadBase64Pdf(filename, base64) {
  const bytes = atob(base64);
  const buffer = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index += 1) buffer[index] = bytes.charCodeAt(index);
  const url = URL.createObjectURL(new Blob([buffer], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function Dashboard({ section = "Dashboard" }) {
  const { user, updateUser, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const items = ["Dashboard", "Bookings", "Invoices", "Notifications", "Profile", "Settings", "Support Tickets", "Book Service", "My Services", "Calendar"];

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
  const [services, setServices] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [downloading, setDownloading] = useState("");

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      setError("");
      try {
        const [profileData, bookingData, invoiceData, serviceData, notificationData, ticketData] = await Promise.all([
          dashboardApi.profile(),
          bookingApi.list(),
          dashboardApi.invoices(),
          dashboardApi.services(),
          dashboardApi.notifications(),
          dashboardApi.supportTickets(),
        ]);
        if (!active) return;
        setProfile(profileData);
        setBookings(bookingData.bookings || []);
        setInvoices(invoiceData.invoices || []);
        setServices(serviceData.services || []);
        setNotifications(notificationData.notifications || []);
        setTickets(ticketData.tickets || []);
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

  const downloadInvoice = async (invoice) => {
    setDownloading(invoice._id);
    setError("");
    setNotice("");
    try {
      const data = await dashboardApi.invoicePdf(invoice._id);
      downloadBase64Pdf(data.filename || `${invoice.invoice}.pdf`, data.pdfBase64);
      setNotice(`${invoice.invoice} PDF downloaded.`);
    } catch (err) {
      setError(err.message || "Could not download bill PDF.");
    } finally {
      setDownloading("");
    }
  };

  const createTicket = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await dashboardApi.createSupportTicket({
        subject: form.get("subject"),
        message: form.get("message"),
      });
      setTickets((current) => [data.ticket, ...current]);
      setNotice("Support ticket created. Our team has been notified.");
      event.currentTarget.reset();
    } catch (err) {
      setError(err.message || "Could not create support ticket.");
    }
  };

  if (section === "My Services") {
    return (
      <div className="portal-list client-service-list">
        {error && <div className="form-error">{error}</div>}
        {services.length ? services.map((service) => {
          const progress = Math.max(0, Math.min(100, Number(service.progressPercent || 0)));
          const activeServices = service.activeServices?.length ? service.activeServices : service.services || [];
          return (
            <article className="portal-row client-service-card" key={service._id}>
              <div className="client-service-head">
                <div>
                  <strong>{service.companyName}</strong>
                  <span>{service.packageName || "Active ZMH service"} | {service.assignedStaff || "Client Success Team"}</span>
                </div>
                <span className="status-pill">{service.status}</span>
              </div>
              <div className="client-progress-wrap">
                <div><span>Ongoing service progress</span><strong>{progress}%</strong></div>
                <div className="progress-meter"><span style={{ width: `${progress}%` }} /></div>
              </div>
              <div className="client-service-grid">
                <span><strong>Started</strong>{formatDate(service.serviceStartDate || service.createdAt)}</span>
                <span><strong>Next billing</strong>{formatDate(service.nextBillingDate)}</span>
                <span><strong>Payment</strong>{service.paymentStatus || "pending"}</span>
              </div>
              {activeServices.length ? <div className="client-service-tags">{activeServices.map((item) => <span key={item}>{item}</span>)}</div> : null}
              <div className="client-timeline">
                {(service.progressTimeline || []).slice(0, 3).map((item) => (
                  <div key={item._id}>
                    <strong>{item.title}</strong>
                    <span>{formatDate(item.happenedAt)} | {item.status} | {Number(item.progressPercent || 0)}%</span>
                    {item.description && <p>{item.description}</p>}
                  </div>
                ))}
                {!service.progressTimeline?.length && <p>Progress updates will appear here after admin updates your order.</p>}
              </div>
            </article>
          );
        }) : <div className="empty-state">No ongoing services yet. When admin activates your order, progress will appear here.</div>}
      </div>
    );
  }

  if (section === "Bookings" || section === "Calendar") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{bookingRows.length ? bookingRows.map((booking) => <article className="portal-row" key={booking.id}><div><strong>{booking.title}</strong><span>{booking.date}</span><p>{booking.response}</p></div><span className="status-pill">{booking.status}</span></article>) : <div className="empty-state">No bookings yet. Submit a booking request to see it here.</div>}</div>;
  }

  if (section === "Invoices") {
    return (
      <div className="portal-list client-bill-list">
        {error && <div className="form-error">{error}</div>}
        {notice && <div className="success">{notice}</div>}
        {invoices.length ? invoices.map((invoice) => (
          <article className="portal-row client-bill-card" key={invoice._id}>
            <div>
              <strong>{invoice.invoice}</strong>
              <span>{invoice.company} | {invoice.billingMonth || formatDate(invoice.createdAt)}</span>
              <p>{invoice.currency} {Number(invoice.amount || 0).toFixed(2)} due {formatDate(invoice.dueDate)}</p>
            </div>
            <div className="client-bill-actions">
              <span className="status-pill">{invoice.status}</span>
              <button type="button" className="table-action" onClick={() => downloadInvoice(invoice)} disabled={downloading === invoice._id}>{downloading === invoice._id ? "Preparing..." : "Download PDF"}</button>
            </div>
          </article>
        )) : <div className="empty-state">No monthly bills found. Bills appear here after admin generates them.</div>}
      </div>
    );
  }

  if (section === "Notifications") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{notifications.length ? notifications.map((item) => <article className="portal-row" key={item._id}><div><strong>{item.title}</strong><p>{item.body}</p></div><span className="status-pill">{item.type}</span></article>) : <div className="empty-state">No notifications yet.</div>}</div>;
  }

  if (section === "Support Tickets") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{notice && <div className="success">{notice}</div>}<form className="form-card inline" onSubmit={createTicket}><h3>Create support ticket</h3><label>Subject<input name="subject" required placeholder="What do you need help with?" /></label><label>Message<textarea name="message" required placeholder="Describe the issue or request" /></label><Button type="submit">Create ticket</Button></form>{tickets.length ? tickets.map((ticket) => <article className="portal-row" key={ticket._id}><div><strong>{ticket.subject}</strong><span>{new Date(ticket.createdAt).toLocaleDateString()}</span><p>{ticket.adminResponse || ticket.message}</p></div><span className="status-pill">{ticket.status}</span></article>) : <div className="empty-state">No support tickets yet.</div>}</div>;
  }

  const stats = profile?.stats || {};
  return <div className="grid three dash-cards">{[
    ["Bookings", stats.bookings || bookings.length || 0],
    ["Invoices", stats.invoices || invoices.length || 0],
    ["Ongoing services", services.filter((service) => service.status === "ongoing").length],
    ["Notifications", stats.notifications || notifications.length || 0],
    ["Support tickets", stats.tickets || tickets.length || 0],
    ["Admin responses", bookings.filter((booking) => booking.adminResponse).length],
    ["Avg progress", services.length ? `${Math.round(services.reduce((sum, service) => sum + Number(service.progressPercent || 0), 0) / services.length)}%` : "0%"],
    ["Calendar events", bookings.filter((booking) => booking.requestedDate).length],
  ].map(([item, value]) => <Card key={item} title={item} text={error || "Live account data from the backend."}><strong className="price">{value}</strong></Card>)}</div>;
}
