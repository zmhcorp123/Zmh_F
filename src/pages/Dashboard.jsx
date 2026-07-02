import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Sections";
import { SEO } from "../components/SEO";
import { useAuth } from "../context/useAuth";
import { company } from "../data/siteData";
import { bookingApi, dashboardApi } from "../services/api";
import { navigate } from "../utils/router";

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Not selected";
}

function currency(invoice = {}) {
  return `${invoice.currency || "USD"} ${Number(invoice.amount || 0).toFixed(2)}`;
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

function fileToDataUrl(file) {
  if (!file?.size) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, dataUrl: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function StatusBadge({ value }) {
  return <span className={`status-pill ${String(value || "pending").replace(/\s+/g, "-")}`}>{value || "pending"}</span>;
}

function DashboardShell({ section, user, children, onLogout }) {
  const items = ["Dashboard", "Bookings", "My Services", "Cancelled Services", "Invoices", "Notifications", "Profile", "Settings", "Support Tickets", "Book Service", "Calendar"];
  return (
    <>
      <SEO title={section} />
      <section className="dashboard">
        <aside>{items.map((item) => <button key={item} className={item === section ? "active" : ""} onClick={() => navigate(item === "Dashboard" ? "/user-dashboard" : "/" + item.toLowerCase().replaceAll(" ", "-"))}>{item}</button>)}</aside>
        <div className="dash-main">
          <span className="eyebrow">Client portal</span>
          <h1>{section}</h1>
          <p>Signed in as {user?.name || "Guest"} from {user?.company || "Company"}.</p>
          {children}
          <button className="ghost-small" onClick={onLogout}>Logout</button>
        </div>
      </section>
    </>
  );
}

function PaymentModal({ service, invoice, onClose, onSubmit, saving }) {
  if (!service || !invoice) return null;
  return (
    <div className="settings-drawer-backdrop payment-modal-backdrop" role="presentation">
      <form className="payment-modal" role="dialog" aria-modal="true" aria-label="Mark payment as sent" onSubmit={onSubmit}>
        <div className="settings-drawer-head">
          <div><span className="eyebrow">Payment verification</span><h3>Mark Payment as Sent</h3><p>{invoice.invoice} | {currency(invoice)}</p></div>
          <button type="button" className="settings-icon-action" onClick={onClose} aria-label="Close payment modal">x</button>
        </div>
        <div className="payment-modal-body">
          <label>Payment Date<input name="paymentDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label>
          <label>Payment Method<input name="paymentMethod" required placeholder="Bank transfer, Wise, ACH..." /></label>
          <label>Transaction ID / Reference Number<input name="transactionId" required placeholder="Reference number from your payment receipt" /></label>
          <label>Optional Note<textarea name="note" placeholder="Any extra details for admin verification" /></label>
          <label>Upload Payment Screenshot<input name="screenshot" type="file" accept="image/*,.pdf" /></label>
          <input type="hidden" name="invoiceId" value={invoice._id} />
          <input type="hidden" name="orderId" value={service._id} />
        </div>
        <div className="settings-drawer-footer">
          <button type="button" className="settings-secondary-action" onClick={onClose}>Cancel</button>
          <button type="submit" className="settings-primary-action" disabled={saving}>{saving ? "Submitting..." : "Confirm Payment Sent"}</button>
        </div>
      </form>
    </div>
  );
}

function ServiceCard({ service, onDownload, onPayment }) {
  const progress = Math.max(0, Math.min(100, Number(service.progressPercent || 0)));
  const activeServices = service.activeServices?.length ? service.activeServices : service.services || [];
  const completed = (service.progressTimeline || []).filter((item) => item.status === "completed").map((item) => item.title);
  const remaining = activeServices.filter((item) => !completed.some((done) => done.toLowerCase().includes(String(item).toLowerCase())));
  const latestInvoice = service.latestInvoice;
  const pendingSubmission = service.paymentHistory?.find((item) => item.status === "submitted");
  const paymentLocked = service.paymentStatus === "payment submitted" || pendingSubmission;

  return (
    <article className="portal-row client-service-card">
      <div className="client-service-head">
        <div>
          <strong>{service.companyName}</strong>
          <span>{service.packageName || "Active ZMH service"} | {service.packagePrice || "Custom"}</span>
        </div>
        <StatusBadge value={service.paymentStatus === "payment submitted" ? "Payment Submitted" : service.status} />
      </div>
      {paymentLocked && <div className="client-payment-alert">Waiting for Admin Verification</div>}
      <div className="client-progress-wrap">
        <div><span>Current Progress</span><strong>{progress}%</strong></div>
        <div className="progress-meter"><span style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="client-service-grid">
        <span><strong>Started</strong>{formatDate(service.serviceStartDate || service.createdAt)}</span>
        <span><strong>Next Billing</strong>{formatDate(service.nextBillingDate)}</span>
        <span><strong>Payment</strong>{service.paymentStatus || "pending"}</span>
        <span><strong>Manager</strong>{service.assignedStaff || "Client Success Team"}</span>
        <span><strong>Last Update</strong>{service.latestProgress ? formatDate(service.latestProgress.happenedAt) : "No update yet"}</span>
        <span><strong>Invoice</strong>{latestInvoice?.invoice || "No invoice yet"}</span>
      </div>
      <div className="summary-columns compact">
        <div><strong>Completed Services</strong>{completed.length ? completed.slice(0, 4).map((item) => <span key={item}>{item}</span>) : <p>No completed services yet.</p>}</div>
        <div><strong>Remaining Services</strong>{remaining.length ? remaining.slice(0, 4).map((item) => <span key={item}>{item}</span>) : <p>No remaining services listed.</p>}</div>
      </div>
      <div className="client-service-actions">
        <button type="button" className="table-action" onClick={() => navigate(`/my-services/${service._id}`)}>View Details</button>
        <button type="button" className="table-action" onClick={() => onDownload(latestInvoice)} disabled={!latestInvoice}>Download Latest Invoice</button>
        <button type="button" className="table-action" onClick={() => navigate(`/my-services/${service._id}`)}>View Timeline</button>
        <button type="button" className="table-action" onClick={() => onPayment(service)} disabled={!latestInvoice || service.paymentStatus === "paid" || paymentLocked}>{paymentLocked ? "Payment Submitted" : "Mark Payment as Sent"}</button>
      </div>
    </article>
  );
}

export function Dashboard({ section = "Dashboard", serviceId = "" }) {
  const { user, updateUser, logout } = useAuth();
  const [saved, setSaved] = useState(false);

  const saveProfile = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateUser({ name: form.get("name"), company: form.get("company") });
    setSaved(true);
  };

  return (
    <DashboardShell section={section} user={user} onLogout={logout}>
      {section === "Profile" ? (
        <form className="form-card inline" onSubmit={saveProfile}>
          <label>Profile Picture<input type="file" /></label>
          <label>Personal Info<input name="name" defaultValue={user?.name || ""} /></label>
          <label>Company Info<input name="company" defaultValue={user?.company || ""} /></label>
          <label>Change Password<input type="password" /></label>
          <label className="checkbox"><input type="checkbox" /> Notification Settings</label>
          <Button type="submit">Save profile</Button>
          {saved && <div className="success">Profile saved locally for backend update.</div>}
          <button type="button" className="danger">Delete Account</button>
        </form>
      ) : <DashboardCards section={section} serviceId={serviceId} />}
    </DashboardShell>
  );
}

function DashboardCards({ section, serviceId }) {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [downloading, setDownloading] = useState("");
  const [paymentModal, setPaymentModal] = useState(null);
  const [savingPayment, setSavingPayment] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;

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

  const categorized = useMemo(() => {
    const pending = bookings.filter((booking) => !["ongoing", "cancelled"].includes(booking.status));
    const ongoing = services.filter((service) => service.status === "ongoing");
    const cancelled = [...bookings, ...services.filter((service) => !bookings.some((booking) => booking._id === service._id))].filter((item) => item.status === "cancelled");
    return { pending, ongoing, cancelled };
  }, [bookings, services]);

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();
    return categorized.ongoing.filter((service) => {
      const haystack = [service.companyName, service.packageName, service.assignedStaff, service.paymentStatus].join(" ").toLowerCase();
      const matchesSearch = !term || haystack.includes(term);
      const matchesFilter = filter === "all" || service.paymentStatus === filter;
      return matchesSearch && matchesFilter;
    });
  }, [categorized.ongoing, filter, search]);

  const pagedServices = filteredServices.slice((page - 1) * pageSize, page * pageSize);
  const selectedService = services.find((service) => service._id === serviceId);

  const downloadInvoice = async (invoice) => {
    if (!invoice?._id) {
      setError("No invoice is available for this service yet.");
      return;
    }
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

  const submitPayment = async (event) => {
    event.preventDefault();
    setSavingPayment(true);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const file = form.get("screenshot");
      const screenshot = await fileToDataUrl(file);
      await dashboardApi.submitPayment({
        invoiceId: form.get("invoiceId"),
        orderId: form.get("orderId"),
        paymentDate: form.get("paymentDate"),
        paymentMethod: form.get("paymentMethod"),
        transactionId: form.get("transactionId"),
        note: form.get("note"),
        screenshot,
      });
      setServices((current) => current.map((service) => service._id === form.get("orderId") ? { ...service, paymentStatus: "payment submitted" } : service));
      setPaymentModal(null);
      setNotice("Payment submitted. Waiting for admin verification.");
    } catch (err) {
      setError(err.message || "Could not submit payment.");
    } finally {
      setSavingPayment(false);
    }
  };

  const createTicket = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await dashboardApi.createSupportTicket({ subject: form.get("subject"), message: form.get("message") });
      setTickets((current) => [data.ticket, ...current]);
      setNotice("Support ticket created. Our team has been notified.");
      event.currentTarget.reset();
    } catch (err) {
      setError(err.message || "Could not create support ticket.");
    }
  };

  if (section === "Service Details") {
    if (!selectedService) return <div className="empty-state">Service not found or still loading.</div>;
    const completed = (selectedService.progressTimeline || []).filter((item) => item.status === "completed").map((item) => item.title);
    const activeServices = selectedService.activeServices?.length ? selectedService.activeServices : selectedService.services || [];
    const remaining = activeServices.filter((item) => !completed.some((done) => done.toLowerCase().includes(String(item).toLowerCase())));
    return (
      <div className="service-detail-workspace">
        <button type="button" className="table-action" onClick={() => navigate("/my-services")}>Back to services</button>
        <ServiceCard service={selectedService} onDownload={downloadInvoice} onPayment={setPaymentModal} />
        <div className="enterprise-order-grid">
          <div className="order-enterprise-panel"><div className="panel-body"><h3>Service Timeline</h3><div className="client-timeline">{(selectedService.progressTimeline || []).map((item) => <div key={item._id}><strong>{item.title}</strong><span>{formatDate(item.happenedAt)} | {item.status} | {item.progressPercent}%</span><p>{item.description || "No description provided."}</p></div>)}</div></div></div>
          <div className="order-enterprise-panel"><div className="panel-body"><h3>Billing History</h3>{(selectedService.invoices || []).map((invoice) => <article className="client-bill-card portal-row" key={invoice._id}><div><strong>{invoice.invoice}</strong><span>{currency(invoice)} | {formatDate(invoice.dueDate)}</span></div><StatusBadge value={invoice.status} /></article>)}</div></div>
          <div className="order-enterprise-panel"><div className="panel-body"><h3>Completed Services</h3><div className="client-service-tags">{completed.length ? completed.map((item) => <span key={item}>{item}</span>) : <p>No completed services yet.</p>}</div></div></div>
          <div className="order-enterprise-panel"><div className="panel-body"><h3>Remaining Services</h3><div className="client-service-tags">{remaining.length ? remaining.map((item) => <span key={item}>{item}</span>) : <p>No remaining services listed.</p>}</div></div></div>
          <div className="order-enterprise-panel"><div className="panel-body"><h3>Payment History</h3>{selectedService.paymentHistory?.length ? selectedService.paymentHistory.map((item) => <p key={item._id}><strong>{item.status}</strong> | {formatDate(item.paymentDate)} | {item.transactionId}</p>) : <p>No payment submissions yet.</p>}</div></div>
          <div className="order-enterprise-panel"><div className="panel-body"><h3>Support Contact</h3><p>For help with this service, contact {company.emails.support} or open a support ticket from your dashboard.</p></div></div>
        </div>
        <PaymentModal service={paymentModal} invoice={paymentModal?.latestInvoice} onClose={() => setPaymentModal(null)} onSubmit={submitPayment} saving={savingPayment} />
      </div>
    );
  }

  if (section === "Bookings" || section === "Calendar") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{categorized.pending.length ? categorized.pending.map((booking) => <article className="portal-row client-booking-card" key={booking._id}><div><strong>{booking.companyName}</strong><span>{booking.packageName || "Package pending"} | {booking.packagePrice || "Price pending"}</span><p>{booking.adminResponse || "Waiting for admin approval or service start."}</p><div className="client-service-grid"><span><strong>Booking Date</strong>{formatDate(booking.createdAt)}</span><span><strong>Estimated Start</strong>{formatDate(booking.serviceStartDate || booking.requestedDate)}</span></div></div><div className="client-bill-actions"><StatusBadge value={booking.status === "new" ? "Waiting for Admin Approval" : booking.status} /><button type="button" className="table-action">View Details</button></div></article>) : <div className="empty-state">No pending bookings. Ongoing and cancelled services are shown in their own sections.</div>}</div>;
  }

  if (section === "My Services") {
    return (
      <div className="portal-list client-service-list">
        {error && <div className="form-error">{error}</div>}
        {notice && <div className="success">{notice}</div>}
        <div className="client-toolbar"><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search services, manager, payment..." /><select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }}><option value="all">All payments</option><option value="pending">Pending</option><option value="sent">Invoice sent</option><option value="payment submitted">Payment submitted</option><option value="payment rejected">Payment rejected</option><option value="paid">Paid</option></select></div>
        {pagedServices.length ? pagedServices.map((service) => <ServiceCard key={service._id} service={service} onDownload={downloadInvoice} onPayment={setPaymentModal} />) : <div className="empty-state">No active ongoing services match this view.</div>}
        {filteredServices.length > pageSize && <div className="client-pagination"><button className="table-action" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button><span>Page {page} of {Math.ceil(filteredServices.length / pageSize)}</span><button className="table-action" disabled={page >= Math.ceil(filteredServices.length / pageSize)} onClick={() => setPage((current) => current + 1)}>Next</button></div>}
        <PaymentModal service={paymentModal} invoice={paymentModal?.latestInvoice} onClose={() => setPaymentModal(null)} onSubmit={submitPayment} saving={savingPayment} />
      </div>
    );
  }

  if (section === "Cancelled Services") {
    return <div className="portal-list cancelled-service-list">{categorized.cancelled.length ? categorized.cancelled.map((service) => <article className="portal-row client-bill-card cancelled-service-card" key={service._id}><div><strong>{service.companyName}</strong><span>{service.email || service.user?.email || "No email available"}</span></div><StatusBadge value="cancelled" /></article>) : <div className="empty-state">No cancelled services.</div>}</div>;
  }

  if (section === "Invoices") {
    return <div className="portal-list client-bill-list">{error && <div className="form-error">{error}</div>}{notice && <div className="success">{notice}</div>}{invoices.length ? invoices.map((invoice) => <article className="portal-row client-bill-card" key={invoice._id}><div><strong>{invoice.invoice}</strong><span>{invoice.company} | {invoice.billingMonth || formatDate(invoice.createdAt)}</span><p>{currency(invoice)} due {formatDate(invoice.dueDate)}</p></div><div className="client-bill-actions"><StatusBadge value={invoice.paymentSubmission?.status === "submitted" ? "Payment Submitted" : invoice.status} /><button type="button" className="table-action" onClick={() => downloadInvoice(invoice)} disabled={downloading === invoice._id}>{downloading === invoice._id ? "Preparing..." : "Download PDF"}</button></div></article>) : <div className="empty-state">No monthly bills found. Bills appear here after admin generates them.</div>}</div>;
  }

  if (section === "Notifications") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{notifications.length ? notifications.map((item) => <article className="portal-row" key={item._id}><div><strong>{item.title}</strong><p>{item.body}</p></div><StatusBadge value={item.type} /></article>) : <div className="empty-state">No notifications yet.</div>}</div>;
  }

  if (section === "Support Tickets") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{notice && <div className="success">{notice}</div>}<form className="form-card inline" onSubmit={createTicket}><h3>Create support ticket</h3><label>Subject<input name="subject" required placeholder="What do you need help with?" /></label><label>Message<textarea name="message" required placeholder="Describe the issue or request" /></label><Button type="submit">Create ticket</Button></form>{tickets.length ? tickets.map((ticket) => <article className="portal-row" key={ticket._id}><div><strong>{ticket.subject}</strong><span>{formatDate(ticket.createdAt)}</span><p>{ticket.adminResponse || ticket.message}</p></div><StatusBadge value={ticket.status} /></article>) : <div className="empty-state">No support tickets yet.</div>}</div>;
  }

  const stats = profile?.stats || {};
  return <div className="grid three dash-cards">{[
    ["Bookings", categorized.pending.length],
    ["Ongoing services", categorized.ongoing.length],
    ["Cancelled services", categorized.cancelled.length],
    ["Invoices", stats.invoices || invoices.length || 0],
    ["Notifications", stats.notifications || notifications.length || 0],
    ["Avg progress", categorized.ongoing.length ? `${Math.round(categorized.ongoing.reduce((sum, service) => sum + Number(service.progressPercent || 0), 0) / categorized.ongoing.length)}%` : "0%"],
  ].map(([item, value]) => <Card key={item} title={item} text={error || "Live account data from the backend."}><strong className="price">{value}</strong></Card>)}</div>;
}
