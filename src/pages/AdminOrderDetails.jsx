import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { adminApi } from "../services/api";
import { navigate } from "../utils/router";
import { useAuth } from "../context/useAuth";

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Not selected";
}

function compactDate(value) {
  return value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Not selected";
}

function dateValue(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function nextMonthlyDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  const day = date.getDate();
  const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  next.setDate(Math.min(day, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
  return dateValue(next);
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

function StatusBadge({ value }) {
  return <span className={`enterprise-status ${String(value || "pending").replace(/\s+/g, "-")}`}>{value || "pending"}</span>;
}

function MetricCard({ label, value, hint }) {
  return <article className="order-metric-card"><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</article>;
}

function CollapsiblePanel({ title, eyebrow, children, defaultOpen = true, actions }) {
  return (
    <details className="order-enterprise-panel" open={defaultOpen}>
      <summary>
        <span>{eyebrow && <small>{eyebrow}</small>}<strong>{title}</strong></span>
        {actions && <div className="panel-actions">{actions}</div>}
      </summary>
      <div className="panel-body">{children}</div>
    </details>
  );
}

export function AdminOrderDetails() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const isEmployee = user?.role === "employee";
  const [order, setOrder] = useState(null);
  const [progress, setProgress] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [progressStatus, setProgressStatus] = useState("completed");
  const [serviceStartDate, setServiceStartDate] = useState("");
  const [nextBillingDate, setNextBillingDate] = useState("");

  const servicesText = useMemo(() => (order?.activeServices?.length ? order.activeServices : order?.services || []).join("\n"), [order]);

  useEffect(() => {
    let active = true;
    async function loadOrder() {
      setLoading(true);
      try {
        const data = await adminApi.order(orderId);
        if (!active) return;
        setOrder(data.order);
        setProgress(data.progress || []);
        setInvoices(data.invoices || []);
        setSummary(data.summary || null);
        setServiceStartDate(dateValue(data.order.serviceStartDate));
        setNextBillingDate(dateValue(data.order.nextBillingDate));
        setError("");
      } catch (err) {
        if (active) {
          console.error(err);
          setError(err.message || "Could not load order.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadOrder();
    return () => { active = false; };
  }, [orderId]);

  const saveOrder = async (event) => {
    event.preventDefault();
    setSaving("order");
    setNotice("");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await adminApi.updateOrder(orderId, {
        contactPerson: form.get("contactPerson"),
        packageName: form.get("packageName"),
        packagePrice: form.get("packagePrice"),
        assignedStaff: form.get("assignedStaff"),
        serviceStartDate,
        nextBillingDate,
        paymentStatus: form.get("paymentStatus"),
        progressPercent: form.get("progressPercent"),
        activeServices: String(form.get("activeServices") || "").split("\n").map((item) => item.trim()).filter(Boolean),
        notes: form.get("notes"),
      });
      setOrder(data.order);
      setProgress(data.progress || []);
      setInvoices(data.invoices || []);
      setSummary(data.summary || null);
      setServiceStartDate(dateValue(data.order.serviceStartDate));
      setNextBillingDate(dateValue(data.order.nextBillingDate));
      setNotice("Order details saved.");
      window.alert("Order details saved successfully.");
    } catch (err) {
      setError(err.message || "Could not save order.");
    } finally {
      setSaving("");
    }
  };

  const addProgress = async (event) => {
    event.preventDefault();
    const progressForm = event.currentTarget;
    setSaving("progress");
    setNotice("");
    setError("");
    const form = new FormData(progressForm);
    try {
      const data = await adminApi.addOrderProgress(orderId, {
        title: form.get("title"),
        customerName: form.get("customerName"),
        customerEmail: form.get("customerEmail"),
        customerPhone: form.get("customerPhone"),
        customerAddress: form.get("customerAddress"),
        description: form.get("description"),
        happenedAt: form.get("happenedAt"),
        progressPercent: form.get("progressPercent"),
        status: form.get("status"),
        callLog: form.get("callLog"),
      });
      setOrder(data.order);
      setProgress(data.timeline || []);
      setSummary(data.summary || null);
      setNotice("Progress update added.");
      progressForm.reset();
    } catch (err) {
      setError(err.message || "Could not add progress update.");
    } finally {
      setSaving("");
    }
  };

  const generatePdf = async () => {
    setSaving("pdf");
    setNotice("");
    setError("");
    try {
      const data = await adminApi.generateOrderPdf(orderId);
      downloadBase64Pdf(data.filename, data.pdfBase64);
      setNotice("PDF summary generated.");
    } catch (err) {
      setError(err.message || "Could not generate PDF.");
    } finally {
      setSaving("");
    }
  };

  const sendSummary = async () => {
    if (!window.confirm("Send the invoice summary PDF to this client now?")) return;
    setSaving("email");
    setNotice("");
    setError("");
    try {
      const data = await adminApi.sendInvoiceSummary(orderId);
      setSummary(data.summary || summary);
      setNotice(data.skipped ? "Email skipped because no Resend API key is configured." : "Invoice summary email sent.");
    } catch (err) {
      setError(err.message || "Could not send invoice summary.");
    } finally {
      setSaving("");
    }
  };

  const cancelOrder = async () => {
    if (!window.confirm("Cancel this ongoing order?")) return;
    setSaving("cancel");
    setNotice("");
    setError("");
    try {
      const data = await adminApi.updateOrder(orderId, { status: "cancelled" });
      setOrder(data.order);
      setProgress(data.progress || []);
      setInvoices(data.invoices || []);
      setSummary(data.summary || null);
      setNotice("Order cancelled.");
    } catch (err) {
      setError(err.message || "Could not cancel order.");
    } finally {
      setSaving("");
    }
  };

  if (loading) return <section className="admin-page"><div className="empty-state">Loading order details...</div></section>;
  if (!order) return <section className="admin-page"><div className="empty-state">{error || "Order not found."}</div></section>;

  const progressValue = Number(order.progressPercent || summary?.currentProgress || 0);
  const completedCount = summary?.servicesCompleted?.length || 0;
  const remainingCount = summary?.servicesRemaining?.length || 0;
  const latestInvoice = invoices[0];
  const outstanding = order.paymentStatus === "paid" ? 0 : Number(latestInvoice?.amount || String(order.packagePrice || "").replace(/[^0-9.]/g, "")) || 0;

  return (
    <>
      <SEO title={`${order.companyName} Order`} description="Admin order details and service progress." />
      <section className="order-detail-page enterprise-order-page">
        <div className="enterprise-order-hero">
          <div>
            <span className="eyebrow">Order Details</span>
            <h2>{order.companyName}</h2>
            <p>{order.contactPerson || order.user?.name || "Client"} | {order.email || order.user?.email || "No email"} | {order.phone || "No phone"}</p>
            <div className="hero-badges"><StatusBadge value={order.status} /><StatusBadge value={order.paymentStatus} /><span className="enterprise-status neutral">{order.packageName || "Custom support"}</span></div>
          </div>
          <div className="order-actions">
            <Button variant="secondary" icon="arrow" onClick={() => navigate("/admin-dashboard")}>Back</Button>
            {!isEmployee && order.status === "ongoing" && <Button variant="secondary" icon="close" onClick={cancelOrder}>{saving === "cancel" ? "Cancelling..." : "Cancel Order"}</Button>}
            {!isEmployee && <Button variant="secondary" icon="bill" onClick={generatePdf}>{saving === "pdf" ? "Generating..." : "Generate PDF"}</Button>}
            {!isEmployee && <Button icon="mail" onClick={sendSummary}>{saving === "email" ? "Sending..." : "Send Invoice Summary"}</Button>}
          </div>
        </div>

        {!isEmployee && <div className="sticky-order-actions">
          <span>{order.companyName}</span>
          <div>
            <button type="button" className="settings-secondary-action" onClick={generatePdf}>Export PDF</button>
            <button type="button" className="settings-secondary-action" onClick={generatePdf}>Preview PDF</button>
            <button type="button" className="settings-secondary-action" onClick={() => window.print()}>Print</button>
            {order.status === "ongoing" && <button type="button" className="settings-secondary-action" onClick={cancelOrder}>{saving === "cancel" ? "Cancelling..." : "Cancel Order"}</button>}
            <button type="button" className="settings-primary-action" onClick={sendSummary}>Email Summary</button>
          </div>
        </div>}

        {error && <div className="form-error">{error}</div>}
        {notice && <div className="success">{notice}</div>}

        <div className="order-metric-grid">
          <MetricCard label="Progress" value={`${progressValue}%`} hint="Overall service completion" />
          <MetricCard label="Outstanding" value={`USD ${outstanding.toFixed(2)}`} hint={order.paymentStatus || "pending"} />
          <MetricCard label="Completed" value={completedCount} hint="Service milestones" />
          <MetricCard label="Remaining" value={remainingCount} hint="Open service items" />
        </div>

        <div className="enterprise-order-grid">
          <div className="enterprise-order-main">
            {!isEmployee && <CollapsiblePanel title="Executive Order Profile" eyebrow="Client & package" actions={<StatusBadge value={order.status} />}>
              <form className="enterprise-form" onSubmit={saveOrder}>
                <div className="enterprise-facts">
                  <span><strong>Company</strong>{order.companyName}</span>
                  <span><strong>Order Date</strong>{compactDate(order.createdAt)}</span>
                  <span><strong>Requested</strong>{compactDate(order.requestedDate)}</span>
                  <span><strong>Next Billing</strong>{compactDate(order.nextBillingDate)}</span>
                </div>
                <div className="settings-form-grid">
                  <label className="settings-field"><span>Contact Person</span><input name="contactPerson" defaultValue={order.contactPerson || order.user?.name || ""} /></label>
                  <label className="settings-field"><span>Package Name</span><input name="packageName" defaultValue={order.packageName || ""} /></label>
                  <label className="settings-field"><span>Package Price</span><input name="packagePrice" defaultValue={order.packagePrice || ""} /></label>
                  <label className="settings-field"><span>Assigned Staff</span><input name="assignedStaff" defaultValue={order.assignedStaff || ""} /></label>
                  <label className="settings-field"><span>Billing Date</span><input name="serviceStartDate" type="date" value={serviceStartDate} onChange={(event) => { const value = event.target.value; setServiceStartDate(value); setNextBillingDate(nextMonthlyDate(value)); }} /></label>
                  <label className="settings-field"><span>Next Billing Date (monthly)</span><input name="nextBillingDate" type="date" value={nextBillingDate} readOnly /><small>Automatically set one month after the billing date.</small></label>
                  <label className="settings-field"><span>Progress %</span><input name="progressPercent" type="number" min="0" max="100" defaultValue={order.progressPercent || 0} /></label>
                  <label className="settings-field"><span>Payment Status</span><select name="paymentStatus" defaultValue={order.paymentStatus || "pending"}><option value="pending">Pending</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="waived">Waived</option></select></label>
                </div>
                <label className="settings-field"><span>Services Included</span><textarea name="activeServices" defaultValue={servicesText} /></label>
                <label className="settings-field"><span>Admin Notes</span><textarea name="notes" defaultValue={order.notes || ""} /></label>
                <div className="settings-footer-actions"><button type="submit" className="settings-primary-action">{saving === "order" ? "Saving..." : "Save Order"}</button></div>
              </form>
            </CollapsiblePanel>}

            {isEmployee && <CollapsiblePanel title="Order Profile" eyebrow="Ongoing order" actions={<StatusBadge value={order.status} />}>
              <div className="enterprise-facts">
                <span><strong>Company</strong>{order.companyName}</span>
                <span><strong>Contact</strong>{order.contactPerson || order.user?.name || "Client"}</span>
                <span><strong>Email</strong>{order.email || order.user?.email || "No email"}</span>
                <span><strong>Phone</strong>{order.phone || order.user?.phone || "No phone"}</span>
                <span><strong>Package</strong>{order.packageName || "Custom support"}</span>
                <span><strong>Assigned</strong>{order.assignedStaff || "Unassigned"}</span>
              </div>
            </CollapsiblePanel>}

            <CollapsiblePanel title="Modern Timeline" eyebrow="Service progress">
              <div className="enterprise-timeline">
                {progress.length ? progress.map((item) => (
                  <article key={item._id}>
                    <div><StatusBadge value={item.status} /><span>{formatDate(item.happenedAt)} | {item.adminName || item.admin?.name || "Admin"}</span></div>
                    <strong>{item.title}</strong>
                    {(item.customerName || item.customerEmail || item.customerPhone || item.customerAddress) && <div className="progress-customer-facts">
                      {item.customerName && <span><strong>Customer</strong>{item.customerName}</span>}
                      {item.customerEmail && <span><strong>Email</strong>{item.customerEmail}</span>}
                      {item.customerPhone && <span><strong>Phone</strong>{item.customerPhone}</span>}
                      {item.customerAddress && <span><strong>Address</strong>{item.customerAddress}</span>}
                    </div>}
                    <p>{item.description || "No description provided."}</p>
                    {item.status === "inquiry" && item.callLog && <p><strong>Call log:</strong> {item.callLog}</p>}
                    <div className="progress-meter"><span style={{ width: `${Number(item.progressPercent || 0)}%` }} /></div>
                  </article>
                )) : <p>No progress updates yet.</p>}
              </div>
            </CollapsiblePanel>

            {!isEmployee && <CollapsiblePanel title="Invoice History" eyebrow="Billing">
              <div className="enterprise-table-wrap">
                <table className="admin-table enterprise-table">
                  <thead><tr><th>Invoice</th><th>Amount</th><th>Status</th><th>Due Date</th></tr></thead>
                  <tbody>
                    {invoices.length ? invoices.map((invoice) => (
                      <tr key={invoice._id}><td>{invoice.invoice}</td><td>{invoice.currency} {invoice.amount}</td><td><StatusBadge value={invoice.status} /></td><td>{formatDate(invoice.dueDate)}</td></tr>
                    )) : <tr><td colSpan="4">No invoice history found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </CollapsiblePanel>}
          </div>

          <aside className="enterprise-order-side">
            <CollapsiblePanel title="Update Progress" eyebrow={isEmployee ? "Employee action" : "Admin action"}>
              <form className="enterprise-form" onSubmit={addProgress}>
                <label className="settings-field"><span>Title</span><input name="title" required placeholder="Onboarding completed" /></label>
                <div className="settings-form-grid progress-customer-grid">
                  <label className="settings-field"><span>Customer Name</span><input name="customerName" required placeholder="Customer name" /></label>
                  <label className="settings-field"><span>Customer Email</span><input name="customerEmail" type="email" placeholder="customer@example.com" /></label>
                  <label className="settings-field"><span>Customer Phone</span><input name="customerPhone" type="tel" placeholder="+1 555 000 0000" /></label>
                  <label className="settings-field"><span>Date & Time</span><input name="happenedAt" type="datetime-local" /></label>
                </div>
                <label className="settings-field"><span>Address</span><input name="customerAddress" placeholder="Service address" /></label>
                <label className="settings-field"><span>Description</span><textarea name="description" required placeholder="Describe what was completed and what changed for the client." /></label>
                <label className="settings-field"><span>Progress %</span><input name="progressPercent" type="number" min="0" max="100" defaultValue={order.progressPercent || 0} /></label>
                <label className="settings-field"><span>Status</span><select name="status" value={progressStatus} onChange={(event) => setProgressStatus(event.target.value)}><option value="inquiry">Inquiry / call</option><option value="planned">Planned</option><option value="in progress">In progress</option><option value="completed">Completed</option><option value="blocked">Blocked</option></select></label>
                {progressStatus === "inquiry" && <label className="settings-field"><span>Call Log</span><textarea name="callLog" required placeholder="Record call outcome, next action, and follow-up date." /></label>}
                <button type="submit" className="settings-primary-action">{saving === "progress" ? "Adding..." : "Add Progress"}</button>
              </form>
            </CollapsiblePanel>

            {!isEmployee && <CollapsiblePanel title="Service Analytics" eyebrow="Dashboard">
              <div className="analytics-donut" style={{ "--progress": `${progressValue}%` }}><strong>{progressValue}%</strong><span>complete</span></div>
              <div className="summary-columns compact">
                <div><strong>Completed</strong>{summary?.servicesCompleted?.length ? summary.servicesCompleted.map((item) => <span key={item}>{item}</span>) : <p>No completed services yet.</p>}</div>
                <div><strong>Remaining</strong>{summary?.servicesRemaining?.length ? summary.servicesRemaining.map((item) => <span key={item}>{item}</span>) : <p>No remaining services listed.</p>}</div>
              </div>
            </CollapsiblePanel>}

            {!isEmployee && <CollapsiblePanel title="Files & Activity" eyebrow="Workspace" defaultOpen={false}>
              {(order.filesUploaded || []).length ? order.filesUploaded.map((file) => <p key={file.url || file.name}>{file.name || "File"}<br /><small>{file.url}</small></p>) : <p>No files uploaded yet.</p>}
              <div className="client-activity-list"><span>Order created {formatDate(order.createdAt)}</span><span>Last updated {formatDate(order.updatedAt)}</span><span>{invoices.length} invoice records</span><span>{progress.length} progress updates</span></div>
            </CollapsiblePanel>}
          </aside>
        </div>
      </section>
    </>
  );
}
