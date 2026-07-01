import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { adminApi } from "../services/api";
import { navigate } from "../utils/router";

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Not selected";
}

function dateValue(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
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

export function AdminOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [progress, setProgress] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const servicesText = useMemo(() => (order?.activeServices?.length ? order.activeServices : order?.services || []).join("\n"), [order]);

  const loadOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.order(orderId);
      setOrder(data.order);
      setProgress(data.progress || []);
      setInvoices(data.invoices || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError(err.message || "Could not load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
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
        serviceStartDate: form.get("serviceStartDate"),
        nextBillingDate: form.get("nextBillingDate"),
        paymentStatus: form.get("paymentStatus"),
        progressPercent: form.get("progressPercent"),
        activeServices: String(form.get("activeServices") || "").split("\n").map((item) => item.trim()).filter(Boolean),
        notes: form.get("notes"),
      });
      setOrder(data.order);
      setProgress(data.progress || []);
      setInvoices(data.invoices || []);
      setSummary(data.summary || null);
      setNotice("Order details saved.");
    } catch (err) {
      setError(err.message || "Could not save order.");
    } finally {
      setSaving("");
    }
  };

  const addProgress = async (event) => {
    event.preventDefault();
    setSaving("progress");
    setNotice("");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await adminApi.addOrderProgress(orderId, {
        title: form.get("title"),
        description: form.get("description"),
        happenedAt: form.get("happenedAt"),
        progressPercent: form.get("progressPercent"),
        status: form.get("status"),
      });
      setOrder(data.order);
      setProgress(data.timeline || []);
      setSummary(data.summary || null);
      setNotice("Progress update added.");
      event.currentTarget.reset();
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

  if (loading) return <section className="admin-page"><div className="empty-state">Loading order details...</div></section>;

  if (!order) {
    return <section className="admin-page"><div className="empty-state">{error || "Order not found."}</div></section>;
  }

  return (
    <>
      <SEO title={`${order.companyName} Order`} description="Admin order details and service progress." />
      <section className="order-detail-page">
        <div className="admin-hero">
          <div>
            <span className="eyebrow">Order Details</span>
            <h2>{order.companyName}</h2>
            <p>{order.contactPerson || order.user?.name || "Client"} | {order.email || order.user?.email || "No email"} | {order.phone || "No phone"}</p>
          </div>
          <div className="order-actions">
            <Button variant="secondary" icon="arrow" onClick={() => navigate("/admin-dashboard")}>Back</Button>
            <Button variant="secondary" icon="bill" onClick={generatePdf}>{saving === "pdf" ? "Generating..." : "Generate PDF"}</Button>
            <Button icon="mail" onClick={sendSummary}>{saving === "email" ? "Sending..." : "Send Invoice Summary"}</Button>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {notice && <div className="success">{notice}</div>}

        <div className="order-detail-grid">
          <form className="form-card order-editor" onSubmit={saveOrder}>
            <h3>Order Profile</h3>
            <div className="profile-facts">
              <span><strong>Company</strong>{order.companyName}</span>
              <span><strong>Status</strong>{order.status}</span>
              <span><strong>Order Date</strong>{formatDate(order.createdAt)}</span>
              <span><strong>Requested</strong>{formatDate(order.requestedDate)}</span>
            </div>
            <div className="form-grid compact">
              <label>Contact Person<input name="contactPerson" defaultValue={order.contactPerson || order.user?.name || ""} /></label>
              <label>Package Name<input name="packageName" defaultValue={order.packageName || ""} /></label>
              <label>Package Price<input name="packagePrice" defaultValue={order.packagePrice || ""} /></label>
              <label>Assigned Staff<input name="assignedStaff" defaultValue={order.assignedStaff || ""} /></label>
              <label>Service Start Date<input name="serviceStartDate" type="date" defaultValue={dateValue(order.serviceStartDate)} /></label>
              <label>Next Billing Date<input name="nextBillingDate" type="date" defaultValue={dateValue(order.nextBillingDate)} /></label>
              <label>Progress %<input name="progressPercent" type="number" min="0" max="100" defaultValue={order.progressPercent || 0} /></label>
              <label>Payment Status<select name="paymentStatus" defaultValue={order.paymentStatus || "pending"}><option value="pending">Pending</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="waived">Waived</option></select></label>
            </div>
            <label>Services Included<textarea name="activeServices" defaultValue={servicesText} /></label>
            <label>Admin Notes<textarea name="notes" defaultValue={order.notes || ""} /></label>
            <Button type="submit" icon="settings">{saving === "order" ? "Saving..." : "Save Order"}</Button>
          </form>

          <form className="form-card progress-form" onSubmit={addProgress}>
            <h3>Update Service Progress</h3>
            <label>Title<input name="title" required placeholder="Onboarding completed" /></label>
            <label>Description<textarea name="description" placeholder="Describe what was completed and what changed for the client." /></label>
            <div className="form-grid compact">
              <label>Date & Time<input name="happenedAt" type="datetime-local" /></label>
              <label>Progress %<input name="progressPercent" type="number" min="0" max="100" defaultValue={order.progressPercent || 0} /></label>
              <label>Status<select name="status" defaultValue="completed"><option value="planned">Planned</option><option value="in progress">In progress</option><option value="completed">Completed</option><option value="blocked">Blocked</option></select></label>
            </div>
            <Button type="submit" icon="route">{saving === "progress" ? "Adding..." : "Add Progress"}</Button>
          </form>
        </div>

        <div className="order-detail-grid">
          <div className="premium-panel">
            <h3>Service Summary</h3>
            <div className="summary-columns">
              <div><strong>Completed</strong>{summary?.servicesCompleted?.length ? summary.servicesCompleted.map((item) => <span key={item}>{item}</span>) : <p>No completed services yet.</p>}</div>
              <div><strong>Remaining</strong>{summary?.servicesRemaining?.length ? summary.servicesRemaining.map((item) => <span key={item}>{item}</span>) : <p>No remaining services listed.</p>}</div>
            </div>
          </div>
          <div className="premium-panel">
            <h3>Files Uploaded</h3>
            {(order.filesUploaded || []).length ? order.filesUploaded.map((file) => <p key={file.url || file.name}>{file.name || "File"}<br /><small>{file.url}</small></p>) : <p>No files uploaded yet.</p>}
          </div>
        </div>

        <div className="order-detail-grid">
          <div className="premium-panel">
            <h3>Modern Timeline</h3>
            <div className="service-timeline">
              {progress.length ? progress.map((item) => (
                <article key={item._id}>
                  <span>{formatDate(item.happenedAt)} | {item.progressPercent}% | {item.status}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description || "No description provided."}</p>
                  <small>{item.adminName || item.admin?.name || "Admin"}</small>
                </article>
              )) : <p>No progress updates yet.</p>}
            </div>
          </div>
          <div className="premium-panel">
            <h3>Invoice History</h3>
            <div className="invoice-list">
              {invoices.length ? invoices.map((invoice) => (
                <div key={invoice._id}>
                  <strong>{invoice.invoice}</strong>
                  <span>{invoice.currency} {invoice.amount} | {invoice.status} | Due {formatDate(invoice.dueDate)}</span>
                </div>
              )) : <p>No invoice history found.</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
