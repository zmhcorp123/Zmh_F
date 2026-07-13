import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  CreditCard,
  FileText,
  Headphones,
  Home,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  LogOut,
  Menu,
  PlayCircle,
  ReceiptText,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "../components/Button";
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
  const label = value === "in progress" ? "In Progress" : value === "open" ? "Open" : value === "resolved" ? "Resolved" : value || "pending";
  return <span className={`status-pill ${String(value || "pending").replace(/\s+/g, "-")}`}>{label}</span>;
}

function fieldValue(value) {
  return value ? String(value) : "Not Provided";
}

function relativeTime(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  const match = units.find(([, size]) => seconds >= size);
  if (!match) return "Just now";
  const [label, size] = match;
  const count = Math.floor(seconds / size);
  return `${count} ${label}${count > 1 ? "s" : ""} ago`;
}

function activityMeta(type = "", title = "") {
  const text = `${type} ${title}`.toLowerCase();
  if (text.includes("invoice") || text.includes("billing") || text.includes("payment")) return { icon: ReceiptText, tone: "amber", route: "/invoices" };
  if (text.includes("booking")) return { icon: CalendarCheck, tone: "blue", route: "/bookings" };
  if (text.includes("support") || text.includes("ticket")) return { icon: Headphones, tone: "purple", route: "/support-tickets" };
  if (text.includes("service") || text.includes("progress") || text.includes("order")) return { icon: PlayCircle, tone: "green", route: "/my-services" };
  return { icon: UserRound, tone: "purple", route: "/notifications" };
}

const navIcons = {
  Dashboard: LayoutDashboard,
  Bookings: CalendarCheck,
  "My Services": BriefcaseBusiness,
  "Ongoing Services": PlayCircle,
  "Cancelled Services": XCircle,
  Invoices: ReceiptText,
  "Payment Confirmation": CreditCard,
  Notifications: Bell,
  Profile: UserRound,
  Settings,
  "Support Tickets": LifeBuoy,
  "Book Service": FileText,
};

function routeForNav(item) {
  if (item === "Dashboard") return "/user-dashboard";
  if (item === "Ongoing Services") return "/my-services";
  return "/" + item.toLowerCase().replaceAll(" ", "-");
}

function getInitials(name = "") {
  const parts = String(name || "ZHM Client").trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]).join("").toUpperCase() || "ZC";
}

function DashboardShell({ section, user, children, onLogout, notificationCount = 0, onNotificationsSeen }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const items = ["Dashboard", "Bookings", "My Services", "Ongoing Services", "Cancelled Services", "Invoices", "Payment Confirmation", "Notifications", "Profile", "Settings", "Support Tickets", "Book Service"];
  const activeSection = section === "Service Details" ? "My Services" : section;
  const displayName = user?.name || "Client";
  const unreadNotifications = Math.max(0, Number(notificationCount || 0));
  const showNotificationBadge = unreadNotifications > 0 && activeSection !== "Notifications";

  useEffect(() => {
    if (activeSection !== "Notifications") return;
    const frame = window.requestAnimationFrame(() => onNotificationsSeen?.());
    return () => window.cancelAnimationFrame(frame);
  }, [activeSection, onNotificationsSeen]);

  const go = (path) => {
    setSidebarOpen(false);
    if (path === "/notifications") onNotificationsSeen?.();
    navigate(path);
  };
  return (
    <>
      <SEO title={section} />
      <section className={sidebarOpen ? "dashboard client-dashboard-shell sidebar-open" : "dashboard client-dashboard-shell"}>
        <button
          type="button"
          className="client-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
        <aside className="client-sidebar" id="client-dashboard-menu">
          <div className="client-sidebar-brand">
            <span className="client-logo-mark"><Sparkles size={24} /></span>
            <strong>ZHM</strong>
          </div>
          <nav className="client-sidebar-nav" aria-label="Client dashboard navigation">
            {items.map((item) => {
              const Icon = navIcons[item] || Home;
              return (
                <button key={item} className={item === activeSection ? "active" : ""} onClick={() => go(routeForNav(item))}>
                  <Icon size={20} />
                  <span>{item}</span>
                  {item === "Notifications" && showNotificationBadge && <b>{unreadNotifications}</b>}
                </button>
              );
            })}
          </nav>
          <div className="client-sidebar-profile">
            <div className="client-avatar">{getInitials(displayName)}<span /></div>
            <div>
              <strong>{displayName}</strong>
              <small>Client ID: ZHM-1256</small>
            </div>
            <button type="button" className="client-logout-button" onClick={() => { onLogout?.(); navigate("/login"); }} aria-label="Sign out"><LogOut size={16} /><span>Logout</span></button>
          </div>
        </aside>
        <div className="dash-main client-dashboard-main">
          <header className="client-dashboard-header">
            <button
              className="client-mobile-menu"
              type="button"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              aria-controls="client-dashboard-menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((value) => !value)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1>{section === "Dashboard" ? `Welcome back, ${displayName}` : section}<span aria-hidden="true"> 👋</span></h1>
              <p>{section === "Dashboard" ? "Here's what's happening with your services today." : `Manage your ${section.toLowerCase()} from one clean client portal.`}</p>
            </div>
            <div className="client-header-actions">
              <button type="button" className="client-icon-button" aria-label="Notifications" onClick={() => go("/notifications")}><Bell size={20} />{showNotificationBadge && <span>{unreadNotifications}</span>}</button>
              <button type="button" className="client-profile-button" aria-label="Open profile" onClick={() => go("/profile")}><CircleUserRound size={20} /><ChevronDown size={16} /></button>
            </div>
          </header>
          {children}
        </div>
      </section>
    </>
  );
}

function SkeletonLine({ className = "" }) {
  return <span className={"skeleton-line " + className} />;
}

function DashboardContentSkeleton({ variant = "dashboard" }) {
  if (variant === "profile") {
    return (
      <div className="profile-workspace dashboard-loading-skeleton">
        <div className="profile-settings-hero">
          <div className="profile-overview-card"><SkeletonLine className="avatar" /><div><SkeletonLine className="badge" /><SkeletonLine className="title short" /><SkeletonLine className="text mid" /></div></div>
          <div className="profile-status-panel"><SkeletonLine className="button" /><SkeletonLine className="title short" /><SkeletonLine className="text" /></div>
        </div>
        <div className="profile-settings-layout">
          <aside className="profile-settings-summary">{Array.from({ length: 8 }).map((_, index) => <SkeletonLine key={index} />)}</aside>
          <div className="profile-settings-forms">
            <div className="form-card inline profile-edit-form">{Array.from({ length: 6 }).map((_, index) => <SkeletonLine key={index} />)}</div>
            <div className="form-card inline profile-edit-form profile-security-form">{Array.from({ length: 5 }).map((_, index) => <SkeletonLine key={index} />)}</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant !== "dashboard") {
    return (
      <div className="portal-list dashboard-loading-skeleton">
        {Array.from({ length: 3 }).map((_, index) => (
          <article className="portal-row client-service-card" key={index}>
            <div><SkeletonLine className="title short" /><SkeletonLine className="text mid" /><SkeletonLine className="text" /></div>
            <SkeletonLine className="button" />
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-loading-skeleton">
      <div className="client-dashboard-overview">
        <div className="client-stat-grid">
          {Array.from({ length: 4 }).map((_, index) => <article className="client-stat-card" key={index}><SkeletonLine className="icon" /><div className="client-stat-copy"><SkeletonLine /><SkeletonLine className="metric" /><SkeletonLine className="small" /></div><SkeletonLine className="spark" /></article>)}
        </div>
      </div>
      <div className="client-dashboard-middle">
        <article className="client-premium-card client-service-overview"><SkeletonLine className="title" /><div className="client-overview-body"><SkeletonLine className="donut" /><div>{Array.from({ length: 4 }).map((_, index) => <SkeletonLine key={index} />)}</div></div></article>
        <article className="client-premium-card client-activity-card">{Array.from({ length: 5 }).map((_, index) => <SkeletonLine key={index} />)}</article>
      </div>
      <div className="client-dashboard-bottom">
        <article className="client-premium-card client-appointment-card">{Array.from({ length: 4 }).map((_, index) => <SkeletonLine key={index} />)}</article>
        <article className="client-premium-card client-quick-actions">{Array.from({ length: 6 }).map((_, index) => <SkeletonLine key={index} />)}</article>
      </div>
      <article className="client-support-banner"><SkeletonLine className="icon" /><div><SkeletonLine className="title short" /><SkeletonLine className="text" /></div><SkeletonLine className="button" /></article>
    </div>
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

function ServiceCard({ service, onDownload, onPayment, detail = false }) {
  const progress = Math.max(0, Math.min(100, Number(service.progressPercent || 0)));
  const activeServices = service.activeServices?.length ? service.activeServices : service.services || [];
  const completed = (service.progressTimeline || []).filter((item) => item.status === "completed").map((item) => item.title);
  const remaining = activeServices.filter((item) => !completed.some((done) => done.toLowerCase().includes(String(item).toLowerCase())));
  const latestInvoice = service.latestInvoice;
  const pendingSubmission = service.paymentHistory?.find((item) => item.status === "submitted");
  const paymentLocked = service.paymentStatus === "payment submitted" || pendingSubmission;

  return (
    <article className={detail ? "portal-row client-service-card service-detail-hero" : "portal-row client-service-card"}>
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
        <button type="button" className="table-action" onClick={() => onPayment(service)} disabled={!latestInvoice || service.paymentStatus === "Paid" || paymentLocked}>{paymentLocked ? "Payment Submitted" : "Mark Payment as Sent"}</button>
      </div>
    </article>
  );
}

function ProfilePanel() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const data = await dashboardApi.profile();
        if (!active) return;
        setProfile(data.user);
      } catch (err) {
        if (active) setError(err.message || "Could not load profile.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProfile();
    return () => { active = false; };
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || "").trim(),
      username: String(form.get("username") || "").trim(),
      company: String(form.get("company") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
    };

    if (!payload.name) {
      setError("Full name is required.");
      setSaving(false);
      return;
    }
    if (payload.username && !/^[a-zA-Z0-9_.-]{3,32}$/.test(payload.username)) {
      setError("Username must be 3-32 characters and use only letters, numbers, dots, dashes, or underscores.");
      setSaving(false);
      return;
    }
    if (payload.phone && !/^[+()\-\s\d.]{7,24}$/.test(payload.phone)) {
      setError("Enter a valid phone number.");
      setSaving(false);
      return;
    }
    try {
      const data = await dashboardApi.updateProfile(payload);
      setProfile(data.user);
      updateUser(data.user);
      setNotice("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setNotice("");
    setError("");
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("newPassword") || "");
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      setSavingPassword(false);
      return;
    }
    if (newPassword !== form.get("confirmPassword")) {
      setError("New password and confirmation do not match.");
      setSavingPassword(false);
      return;
    }
    try {
      const data = await dashboardApi.changePassword({
        currentPassword: form.get("currentPassword"),
        newPassword,
      });
      setNotice(data.message || "Password updated successfully.");
      event.currentTarget.reset();
    } catch (err) {
      setError(err.message || "Could not update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <DashboardContentSkeleton variant="profile" />;

  return (
    <div className="profile-workspace">
      {error && <div className="form-error">{error}</div>}
      {notice && <div className="success">{notice}</div>}
      <div className="profile-settings-hero">
        <div className="profile-overview-card">
          <div className="profile-avatar"><span>{fieldValue(profile?.name).slice(0, 2).toUpperCase()}</span></div>
          <div>
            <span className="eyebrow">Account profile</span>
            <h3>{fieldValue(profile?.name)}</h3>
            <p>{fieldValue(profile?.company)}</p>
          </div>
        </div>
        <div className="profile-status-panel">
          <span className="status-pill">{fieldValue(profile?.status)}</span>
          <strong>{fieldValue(profile?.role)}</strong>
          <small>Created {profile?.createdAt ? formatDate(profile.createdAt) : "Not Provided"}</small>
        </div>
      </div>
      <div className="profile-settings-layout">
        <aside className="profile-settings-summary" aria-label="Account summary">
          <h3>Account Details</h3>
          <div className="profile-facts user-profile-facts">
            <span><strong>Full Name</strong>{fieldValue(profile?.name)}</span>
            <span><strong>Company Name</strong>{fieldValue(profile?.company)}</span>
            <span><strong>Username</strong>{fieldValue(profile?.username)}</span>
            <span><strong>Email Address</strong>{fieldValue(profile?.email)}</span>
            <span><strong>Phone Number</strong>{fieldValue(profile?.phone)}</span>
            <span><strong>User Role</strong>{fieldValue(profile?.role)}</span>
            <span><strong>Account Status</strong>{fieldValue(profile?.status)}</span>
            <span><strong>Account Creation Date</strong>{profile?.createdAt ? formatDate(profile.createdAt) : "Not Provided"}</span>
          </div>
        </aside>
        <div className="profile-settings-forms">
          <form className="form-card inline profile-edit-form" onSubmit={saveProfile}>
            <h3>Edit profile</h3>
            <label>Full Name<input name="name" defaultValue={profile?.name || ""} required /></label>
            <label>Username<input name="username" defaultValue={profile?.username || ""} placeholder="username" /></label>
            <label>Company Name<input value={fieldValue(profile?.company)} readOnly /></label>
            <label>Phone Number<input value={fieldValue(profile?.phone)} readOnly /></label>
            <p className="form-helper">Company name, email address, and phone number are locked after account creation. Contact support if a correction is needed.</p>
            <div className="read-only-grid">
              <label>Email Address<input value={fieldValue(profile?.email)} readOnly /></label>
              <label>User Role<input value={fieldValue(profile?.role)} readOnly /></label>
              <label>Account Status<input value={fieldValue(profile?.status)} readOnly /></label>
              <label>Created<input value={profile?.createdAt ? formatDate(profile.createdAt) : "Not Provided"} readOnly /></label>
            </div>
            <Button type="submit">{saving ? "Saving..." : "Save profile"}</Button>
          </form>
          <form className="form-card inline profile-edit-form profile-security-form" onSubmit={changePassword}>
            <h3>Security</h3>
            <label>Current Password<input name="currentPassword" type="password" required /></label>
            <label>New Password<input name="newPassword" type="password" minLength="8" required /></label>
            <label>Confirm New Password<input name="confirmPassword" type="password" minLength="8" required /></label>
            <Button type="submit">{savingPassword ? "Updating..." : "Update password"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ section = "Dashboard", serviceId = "" }) {
  const { user, logout } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const clearNotificationCount = useCallback(() => setNotificationCount(0), []);

  return (
    <DashboardShell section={section} user={user} onLogout={logout} notificationCount={notificationCount} onNotificationsSeen={clearNotificationCount}>
      {section === "Profile" || section === "Settings" ? <ProfilePanel /> : <DashboardCards section={section} serviceId={serviceId} onNotificationCountChange={setNotificationCount} />}
    </DashboardShell>
  );
}

function DashboardCards({ section, serviceId, onNotificationCountChange }) {
  const [, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [downloading, setDownloading] = useState("");
  const [paymentModal, setPaymentModal] = useState(null);
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingConfirmation, setSavingConfirmation] = useState(false);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [selectedTimelineService, setSelectedTimelineService] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const profileLoadedRef = useRef(false);
  const pageSize = 6;

  useEffect(() => {
    let active = true;
    async function loadDashboard(showLoading = false) {
      if (showLoading) setLoading(true);
      if (section === "Dashboard") {
        try {
          const data = await dashboardApi.summary();
          if (!active) return;
          setProfile({ user: data.user, stats: data.stats });
          onNotificationCountChange?.(Number(data.stats?.notifications || 0));
          profileLoadedRef.current = true;
          setBookings(data.bookings || []);
          setInvoices(data.invoices || []);
          setServices(data.services || []);
          setNotifications(data.notifications || []);
          setError("");
        } catch (err) {
          if (active) {
            console.error(err);
            setError(err.message || "Could not load dashboard data.");
          }
        } finally {
          if (active && showLoading) setLoading(false);
        }
        return;
      }
      const needsBookings = ["Dashboard", "Bookings", "Calendar", "Cancelled Services"].includes(section);
      const needsServices = ["Dashboard", "My Services", "Ongoing Services", "Cancelled Services", "Service Details"].includes(section);
      const needsInvoices = ["Dashboard", "Invoices", "Payment Confirmation", "Calendar"].includes(section);
      const needsNotifications = ["Dashboard", "Notifications", "Payment Confirmation"].includes(section);
      const needsTickets = section === "Support Tickets";
      const requests = [
        ["profile", dashboardApi.profile()],
        ...(needsBookings ? [["bookings", bookingApi.list()]] : []),
        ...(needsServices ? [["services", dashboardApi.services()]] : []),
        ...(needsInvoices ? [["invoices", dashboardApi.invoices()]] : []),
        ...(needsNotifications ? [["notifications", dashboardApi.notifications()]] : []),
        ...(needsTickets ? [["tickets", dashboardApi.supportTickets()]] : []),
      ];
      try {
        const settled = await Promise.allSettled(requests.map(([, request]) => request));
        if (!active) return;
        let nextError = "";
        settled.forEach((result, index) => {
          const key = requests[index][0];
          if (result.status !== "fulfilled") {
            nextError = result.reason?.message || "Some dashboard data could not load.";
            return;
          }
          const data = result.value || {};
          if (key === "profile") {
            setProfile(data);
            onNotificationCountChange?.(Number(data.stats?.notifications || 0));
            profileLoadedRef.current = true;
          }
          if (key === "bookings") setBookings(data.bookings || []);
          if (key === "invoices") setInvoices(data.invoices || []);
          if (key === "services") setServices(data.services || []);
          if (key === "notifications") {
            setNotifications(data.notifications || []);
            if (section === "Notifications") onNotificationCountChange?.(0);
          }
          if (key === "tickets") setTickets(data.tickets || []);
        });
        setError(nextError);
      } catch (err) {
        if (active) {
          console.error(err);
          setError(err.message || "Could not load dashboard data.");
        }
      } finally {
        if (active && showLoading) setLoading(false);
      }
    }
    loadDashboard(true);
    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadDashboard(false);
    }, 120000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") loadDashboard(false);
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.clearInterval(refreshTimer);
    };
  }, [section, onNotificationCountChange]);

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
      const invoiceData = await dashboardApi.invoices();
      setInvoices(invoiceData.invoices || []);
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
    const ticketForm = event.currentTarget;
    setTicketSubmitting(true);
    setError("");
    setNotice("");
    const form = new FormData(ticketForm);
    try {
      const data = await dashboardApi.createSupportTicket({ subject: form.get("subject"), message: form.get("message") });
      const refreshed = await dashboardApi.supportTickets();
      setTickets(refreshed.tickets?.length ? refreshed.tickets : [data.ticket, ...tickets]);
      setNotice(data.message || "Support ticket created successfully. Our support team will review your request and respond as soon as possible.");
      ticketForm.reset();
    } catch (err) {
      setError(err.message || "Could not create support ticket.");
    } finally {
      setTicketSubmitting(false);
    }
  };

  const submitPaymentConfirmation = async (event) => {
    event.preventDefault();
    const paymentForm = event.currentTarget;
    setSavingConfirmation(true);
    setError("");
    setNotice("");
    const form = new FormData(paymentForm);
    const invoiceId = String(form.get("invoiceId") || "").trim();
    const invoiceNumber = String(form.get("invoiceNumber") || "").trim();
    try {
      const data = await dashboardApi.confirmPayment({ invoiceId, invoiceNumber });
      const [invoiceData, notificationData] = await Promise.all([dashboardApi.invoices(), dashboardApi.notifications()]);
      setInvoices(invoiceData.invoices || []);
      setNotifications(notificationData.notifications || []);
      setNotice(data.message || "Payment confirmation submitted successfully. Please wait for admin approval.");
      paymentForm.reset();
    } catch (err) {
      setError(err.message || "Could not submit payment confirmation.");
    } finally {
      setSavingConfirmation(false);
    }
  };

  if (loading) return <DashboardContentSkeleton variant={section === "Dashboard" ? "dashboard" : "list"} />;

  if (section === "Service Details") {
    if (!selectedService) return <div className="empty-state">Service not found or still loading.</div>;
    const completedUpdates = (selectedService.progressTimeline || []).filter((item) => item.status === "completed");
    const completed = completedUpdates.map((item) => item.title);
    const activeServices = selectedService.activeServices?.length ? selectedService.activeServices : selectedService.services || [];
    const remaining = activeServices.filter((item) => !completed.some((done) => done.toLowerCase().includes(String(item).toLowerCase())));
    const visibleTimeline = (selectedService.progressTimeline || []).filter((item) => !selectedTimelineService || String(item.title || "").toLowerCase().includes(selectedTimelineService.toLowerCase()));
    return (
      <div className="service-detail-workspace">
        <button type="button" className="table-action service-detail-back" onClick={() => navigate("/my-services")}>← Back to services</button>
        <ServiceCard service={selectedService} onDownload={downloadInvoice} onPayment={setPaymentModal} detail />
        <div className="client-service-actions service-detail-filters" aria-label="Filter timeline by service"><button type="button" className="table-action" onClick={() => setSelectedTimelineService("")}>All services</button>{activeServices.map((service) => <button type="button" className="table-action" key={service} onClick={() => setSelectedTimelineService(service)}>{service}</button>)}</div>
          <div className="enterprise-order-grid service-detail-grid">
            <div className="enterprise-order-main">
              <details className="order-enterprise-panel minimizable-panel" open><summary><span><strong>{selectedTimelineService ? `${selectedTimelineService} Timeline` : "Call Logs & Service Timeline"}</strong></span><small className="minimize-label" /></summary><div className="panel-body"><div className="client-timeline">{visibleTimeline.length ? visibleTimeline.map((item) => <article key={item._id}><strong>{item.title}</strong><span>{formatDate(item.happenedAt)} | {item.status} | {item.progressPercent}%</span>{(item.customerName || item.customerEmail || item.customerPhone || item.customerAddress) && <div className="progress-customer-facts">{item.customerName && <span><strong>Customer</strong>{item.customerName}</span>}{item.customerEmail && <span><strong>Email</strong>{item.customerEmail}</span>}{item.customerPhone && <span><strong>Phone</strong>{item.customerPhone}</span>}{item.customerAddress && <span><strong>Address</strong>{item.customerAddress}</span>}</div>}<p>{item.description || "No description provided."}</p>{item.status === "inquiry" && item.callLog && <p><strong>Call log:</strong> {item.callLog}</p>}</article>) : <p>No timeline updates for this service yet.</p>}</div></div></details>
              <details className="order-enterprise-panel minimizable-panel" open><summary><span><strong>Completed Services</strong></span><small className="minimize-label" /></summary><div className="panel-body"><div className="completed-service-list">{completedUpdates.length ? completedUpdates.map((item) => <article className="completed-service-card" key={item._id}><strong>{item.title}</strong><span>{formatDate(item.happenedAt)} | {item.progressPercent}% complete</span><div className="progress-customer-facts"><span><strong>Customer</strong>{item.customerName || selectedService.contactPerson || selectedService.companyName || "Not provided"}</span><span><strong>Email</strong>{item.customerEmail || selectedService.email || "Not provided"}</span><span><strong>Phone</strong>{item.customerPhone || selectedService.phone || "Not provided"}</span><span><strong>Address</strong>{item.customerAddress || selectedService.address || "Not provided"}</span></div>{item.description && <p>{item.description}</p>}</article>) : <p>No completed services yet.</p>}</div></div></details>
              <div className="order-enterprise-panel"><div className="panel-body"><h3>Payment History</h3>{selectedService.paymentHistory?.length ? selectedService.paymentHistory.map((item) => <p key={item._id}><strong>{item.status}</strong> | {formatDate(item.paymentDate)} | {item.transactionId}</p>) : <p>No payment submissions yet.</p>}</div></div>
            </div>
            <aside className="enterprise-order-side">
              <div className="order-enterprise-panel"><div className="panel-body"><h3>Billing History</h3>{(selectedService.invoices || []).map((invoice) => <article className="client-bill-card portal-row" key={invoice._id}><div><strong>{invoice.invoice}</strong><span>{currency(invoice)} | {formatDate(invoice.dueDate)}</span></div><StatusBadge value={invoice.status} /></article>)}</div></div>
              <div className="order-enterprise-panel"><div className="panel-body"><h3>Remaining Services</h3><div className="client-service-tags">{remaining.length ? remaining.map((item) => <span key={item}>{item}</span>) : <p>No remaining services listed.</p>}</div></div></div>
              <div className="order-enterprise-panel"><div className="panel-body"><h3>Support Contact</h3><p>For help with this service, contact {company.emails.support} or open a support ticket from your dashboard.</p></div></div>
            </aside>
        </div>
        <PaymentModal service={paymentModal} invoice={paymentModal?.latestInvoice} onClose={() => setPaymentModal(null)} onSubmit={submitPayment} saving={savingPayment} />
      </div>
    );
  }

  if (section === "Bookings") {
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

  if (section === "Payment Confirmation") {
    const payableInvoices = invoices.filter((invoice) => invoice.status !== "paid" && !["submitted", "approved"].includes(invoice.paymentSubmission?.status));
    return (
      <div className="portal-list client-bill-list">
        {error && <div className="form-error">{error}</div>}
        {notice && <div className="success">{notice}</div>}
        <form className="form-card inline payment-confirmation-card" onSubmit={submitPaymentConfirmation}>
          <h3>Payment Confirmation</h3>
          {payableInvoices.length ? (
            <>
              <label>
                Select Invoice
                <select name="invoiceId" defaultValue="">
                  <option value="">Use invoice number instead</option>
                  {payableInvoices.map((invoice) => <option key={invoice._id} value={invoice._id}>{invoice.invoice} - {currency(invoice)} - {invoice.status}</option>)}
                </select>
              </label>
              <div className="payment-confirmation-list">
                {payableInvoices.map((invoice) => (
                  <article key={invoice._id}>
                    <strong>{invoice.invoice}</strong>
                    <span>{invoice.company} | {currency(invoice)} due {formatDate(invoice.dueDate)}</span>
                    <StatusBadge value={invoice.status} />
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">If your invoice is not listed, enter the invoice number from your bill and submit it for admin approval.</div>
          )}
          <label>
            Invoice Number
            <input name="invoiceNumber" placeholder="Example: INV-2026-001" />
          </label>
          <Button type="submit">{savingConfirmation ? "Submitting..." : "Submit Confirmation"}</Button>
        </form>
      </div>
    );
  }

  if (section === "Invoices") {
    return <div className="portal-list client-bill-list">{error && <div className="form-error">{error}</div>}{notice && <div className="success">{notice}</div>}{invoices.length ? invoices.map((invoice) => <article className="portal-row client-bill-card" key={invoice._id}><div><strong>{invoice.invoice}</strong><span>{invoice.company} | {invoice.billingMonth || formatDate(invoice.createdAt)}</span><p>{currency(invoice)} due {formatDate(invoice.dueDate)}</p><p>{invoice.message || "Invoice details available in the PDF."}</p></div><div className="client-bill-actions"><StatusBadge value={invoice.paymentSubmission?.status === "submitted" ? "Pending Admin Approval" : invoice.paymentSubmission?.status || invoice.status} /><button type="button" className="table-action" onClick={() => downloadInvoice(invoice)} disabled={downloading === invoice._id}>{downloading === invoice._id ? "Preparing..." : "Download PDF"}</button></div></article>) : <div className="empty-state">No monthly bills found. Bills appear here after admin generates them.</div>}</div>;
  }

  if (section === "Notifications") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{notifications.length ? notifications.map((item) => <article className="portal-row" key={item._id}><div><strong>{item.title}</strong><p>{item.body}</p></div><StatusBadge value={item.type} /></article>) : <div className="empty-state">No notifications yet.</div>}</div>;
  }

  if (section === "Support Tickets") {
    return <div className="portal-list">{error && <div className="form-error">{error}</div>}{notice && <div className="success">{notice}</div>}<form className="form-card inline" onSubmit={createTicket}><h3>Create support ticket</h3><label>Subject<input name="subject" required placeholder="What do you need help with?" /></label><label>Message<textarea name="message" required placeholder="Describe the issue or request" /></label><Button type="submit">{ticketSubmitting ? "Creating..." : "Create ticket"}</Button></form>{tickets.length ? tickets.map((ticket) => <article className="portal-row" key={ticket._id}><div><strong>{ticket.subject}</strong><span>{formatDate(ticket.createdAt)}</span><p>{ticket.message}</p>{ticket.adminResponse && <p><strong>Latest admin reply:</strong> {ticket.adminResponse}</p>}{ticket.resolvedAt && <p>Resolved {formatDate(ticket.resolvedAt)}</p>}</div><StatusBadge value={ticket.status} /></article>) : <div className="empty-state">No support tickets yet.</div>}</div>;
  }

  const completionRate = categorized.ongoing.length ? Math.round(categorized.ongoing.reduce((sum, service) => sum + Number(service.progressPercent || 0), 0) / categorized.ongoing.length) : 100;
  const statCards = [
    { title: "Total Bookings", value: bookings.length, text: "All time bookings", icon: CalendarCheck, tone: "blue", route: "/bookings", spark: "M3 36 C10 28 16 34 23 27 S35 20 42 28 S53 36 60 18 S72 29 78 25" },
    { title: "Ongoing Services", value: categorized.ongoing.length, text: "Currently active", icon: BriefcaseBusiness, tone: "green", route: "/my-services", spark: "M3 32 C11 24 17 31 24 25 S36 14 43 30 S55 33 61 17 S70 25 78 9" },
    { title: "Cancelled Services", value: categorized.cancelled.length, text: "Total cancelled", icon: XCircle, tone: "purple", route: "/cancelled-services", spark: "M3 31 C12 28 18 35 25 29 S35 26 42 30 S51 34 57 15 S67 34 78 24" },
    { title: "Avg Progress", value: `${completionRate}%`, text: "Service completion rate", icon: CheckCircle2, tone: "amber", route: "/my-services", spark: "M3 34 C12 28 19 33 27 31 S38 29 45 18 S55 36 64 24 S70 12 78 16" },
  ];
  const overview = [
    { label: "Ongoing Services", value: categorized.ongoing.length, percent: categorized.ongoing.length ? 100 : 0, color: "#22c55e" },
    { label: "Completed Services", value: Math.max(0, bookings.length - categorized.pending.length - categorized.cancelled.length), percent: bookings.length ? Math.round(((bookings.length - categorized.pending.length - categorized.cancelled.length) / bookings.length) * 100) : 0, color: "#3b82f6" },
    { label: "Cancelled Services", value: categorized.cancelled.length, percent: bookings.length ? Math.round((categorized.cancelled.length / bookings.length) * 100) : 0, color: "#7c3aed" },
  ];
  const upcoming = categorized.ongoing[0] || bookings[0] || {};
  const recentItems = [
    ...notifications.map((item) => {
      const meta = activityMeta(item.type, item.title);
      return { title: item.title, body: item.body || "Notification update", time: relativeTime(item.createdAt), sortAt: item.createdAt, ...meta };
    }),
  ]
    .sort((a, b) => new Date(b.sortAt || 0) - new Date(a.sortAt || 0))
    .slice(0, 4);

  return (
    <div className="client-dashboard-overview">
      {error && <div className="form-error">{error}</div>}
      <div className="client-stat-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button type="button" className={`client-stat-card ${card.tone}`} key={card.title} onClick={() => navigate(card.route)}>
              <div className="client-stat-icon"><Icon size={28} /></div>
              <div className="client-stat-copy">
                <span>{card.title}</span>
                <strong>{card.value}</strong>
                <small>{card.text}</small>
              </div>
              <svg className="client-sparkline" viewBox="0 0 82 42" aria-hidden="true"><path d={card.spark} /></svg>
            </button>
          );
        })}
      </div>
      <div className="client-dashboard-middle">
        <article className="client-premium-card client-service-overview">
          <div className="client-card-title"><ListChecks size={20} /><h3>Service Overview</h3></div>
          <div className="client-overview-body">
            <div className="client-donut" style={{ "--ongoing": `${overview[0].percent * 3.6}deg`, "--completed": `${(overview[0].percent + overview[1].percent) * 3.6}deg` }}>
              <span>{completionRate}%</span>
            </div>
            <div className="client-legend">
              {overview.map((item) => (
                <div key={item.label}>
                  <span style={{ "--dot": item.color }} />
                  <strong>{item.label}</strong>
                  <b>{item.value}</b>
                  <small>{item.percent}%</small>
                </div>
              ))}
            </div>
          </div>
        </article>
        <article className="client-premium-card client-activity-card">
          <div className="client-card-title with-action"><div><ClipboardCheck size={20} /><h3>Recent Activity</h3></div><button type="button" onClick={() => navigate("/notifications")}>View All</button></div>
          <div className="client-activity-list">
            {recentItems.length ? recentItems.map((item) => {
              const Icon = item.icon;
              return (
                <button type="button" key={item.title} className={`client-activity-item ${item.tone}`} onClick={() => navigate(item.route)}>
                  <span><Icon size={22} /></span>
                  <div><strong>{item.title}</strong><small>{item.body}</small></div>
                  <time>{item.time}</time>
                  <ChevronRight size={18} />
                </button>
              );
            }) : <div className="empty-state">No recent activity yet.</div>}
          </div>
        </article>
      </div>
      <div className="client-dashboard-bottom">
        <article className="client-premium-card client-appointment-card">
          <div className="client-card-title"><CalendarDays size={20} /><h3>Upcoming Appointment</h3></div>
          {upcoming._id ? (
            <div className="client-appointment-details">
              <span className="client-appointment-icon"><CalendarCheck size={24} /></span>
              <div>
                <strong>{upcoming.packageName || upcoming.companyName}</strong>
                {upcoming.assignedStaff && <small>Technician: {upcoming.assignedStaff}</small>}
                <small>{formatDate(upcoming.serviceStartDate || upcoming.requestedDate || upcoming.createdAt)}</small>
                {upcoming.address && <small>{upcoming.address}</small>}
              </div>
              <b>Confirmed</b>
            </div>
          ) : <div className="empty-state">No upcoming appointment yet.</div>}
        </article>
        <article className="client-premium-card client-quick-actions">
          <div className="client-card-title"><Sparkles size={20} /><h3>Quick Actions</h3></div>
          <div className="client-action-grid">
            {[
              ["Book Service", FileText, "/book-service", "blue"],
              ["My Services", BriefcaseBusiness, "/my-services", "green"],
              ["Invoices", ReceiptText, "/invoices", "purple"],
              ["Support", Headphones, "/support-tickets", "amber"],
            ].map(([label, Icon, path, tone]) => (
              <button type="button" className={tone} key={label} onClick={() => navigate(path)}>
                <Icon size={30} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </article>
      </div>
      <article className="client-support-banner">
        <span><ShieldCheck size={30} /></span>
        <div>
          <h3>Need Help?</h3>
          <p>Our support team is here to help you with any questions or service issues.</p>
        </div>
        <button type="button" onClick={() => navigate("/support-tickets")}><Headphones size={18} />Create Support Ticket</button>
      </article>
    </div>
  );
}
