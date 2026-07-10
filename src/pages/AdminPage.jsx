import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";
import { adminApi, authApi } from "../services/api";
import { packages as defaultPackages, teamProfiles as defaultTeamProfiles } from "../data/siteData";
import { navigate } from "../utils/router";
import { useAuth } from "../context/useAuth";

const adminTabs = [
  { name: "Overview", icon: "shield" },
  { name: "Approvals", icon: "users" },
  { name: "Users", icon: "users" },
  { name: "Bookings", icon: "calendar" },
  { name: "Calendar", icon: "calendar" },
  { name: "Ongoing", icon: "route" },
  { name: "Cancelled Orders", icon: "bill" },
  { name: "Bills", icon: "bill" },
  { name: "Send Bills", icon: "mail" },
  { name: "Payment Approval", icon: "bill" },
  { name: "Support Tickets", icon: "mail" },
  { name: "Archived Tickets", icon: "mail" },
  { name: "Settings", icon: "settings" },
];

const userStatuses = ["pending", "active", "suspended"];

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Not selected";
}

function eventDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calendarKey(value) {
  const date = eventDate(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

function AdminCalendarBoard({ bookings = [] }) {
  const events = bookings
    .map((item) => ({ ...item, calendarDate: eventDate(item.serviceStartDate || item.requestedDate || item.createdAt) }))
    .filter((item) => item.calendarDate)
    .sort((a, b) => a.calendarDate - b.calendarDate);
  const baseDate = events[0]?.calendarDate || new Date();
  const monthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const monthEnd = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
  const days = [];
  for (let day = 1; day <= monthEnd.getDate(); day += 1) days.push(new Date(baseDate.getFullYear(), baseDate.getMonth(), day));
  const leadingDays = Array.from({ length: monthStart.getDay() }, (_, index) => `blank-${index}`);
  const eventsByDay = events.reduce((map, item) => {
    const key = calendarKey(item.calendarDate);
    if (!map[key]) map[key] = [];
    map[key].push(item);
    return map;
  }, {});

  return (
    <div className="admin-calendar-workspace">
      <section className="admin-calendar-panel">
        <div className="admin-calendar-head">
          <div>
            <span className="eyebrow">Client Works Calendar</span>
            <h3>{baseDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h3>
          </div>
          <strong>{events.length}</strong>
        </div>
        <div className="admin-calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="admin-calendar-grid">
          {leadingDays.map((key) => <span className="admin-calendar-day blank" key={key} />)}
          {days.map((day) => {
            const key = calendarKey(day);
            const dayEvents = eventsByDay[key] || [];
            return (
              <article className={dayEvents.length ? "admin-calendar-day has-event" : "admin-calendar-day"} key={key}>
                <strong>{day.getDate()}</strong>
                {dayEvents.slice(0, 2).map((item) => <small key={item._id}>{item.companyName}</small>)}
                {dayEvents.length > 2 && <b>+{dayEvents.length - 2}</b>}
              </article>
            );
          })}
        </div>
      </section>
      <section className="admin-calendar-list">
        {events.length ? events.map((item) => (
          <article className="admin-calendar-event" key={item._id}>
            <div>
              <span>{formatDate(item.calendarDate)}</span>
              <strong>{item.companyName}</strong>
              <p>{item.email || item.user?.email || "No email"} | {item.phone || "No phone"}</p>
            </div>
            <div className="admin-calendar-meta">
              <span>{item.operatingDays || "Days not selected"}</span>
              <span>{item.hours || "Hours not selected"}</span>
              <b className="status-pill">{item.status || "new"}</b>
            </div>
          </article>
        )) : <div className="empty-state">No booking dates have been selected yet.</div>}
      </section>
    </div>
  );
}

const defaultAccountDetails = {
  beneficiaryName: "ZMH USA Corp",
  bankName: "Contact sales for bank details",
  accountNumber: "Provided on request",
  routingNumber: "",
  swiftCode: "",
  routingSwift: "Provided on request",
  branchName: "",
  bankAddress: "",
  referencePrefix: "ZMH",
  paymentInstructions: "Include the invoice or order reference with your transfer.",
};

const defaultCompanyDetails = {
  officePhone: "+1 (555) 018-2048",
  officeAddress: "Serving home service companies across the United States",
};

const defaultPackageRows = defaultPackages.map((item, index) => ({
  ...item,
  description: item.bestFor,
  displayOrder: index,
  highlightBadge: "",
  buttonText: "Package details",
  buttonLink: `/pricing/${item.slug}`,
  status: "active",
  recommended: item.slug === "professional",
}));

const defaultTeamRows = defaultTeamProfiles.map((item) => ({ ...item, focus: Array.isArray(item.focus) ? item.focus : [] }));

function featureList(features) {
  if (Array.isArray(features)) return features;
  if (typeof features === "string") return features.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  return [];
}

function slugify(value) {
  return String(value || "package").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function SettingsCard({ eyebrow, title, description, children, actions }) {
  return (
    <section className="settings-card">
      <div className="settings-section-head">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="settings-actions">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

function FormField({ label, helper, icon = "settings", children }) {
  return (
    <label className="settings-field">
      <span><Icon name={icon} size={17} /> {label}</span>
      {children}
      {helper && <small>{helper}</small>}
    </label>
  );
}

function EmployeeSetupPanel({ onComplete }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    const password = form.get("password");
    if (password !== form.get("confirmPassword")) {
      setError("New password and confirmation do not match.");
      setSaving(false);
      return;
    }
    try {
      const data = await authApi.completeEmployeeSetup({ otp: form.get("otp"), password });
      setNotice(data.message || "Employee setup completed.");
      onComplete?.(data.user);
      event.currentTarget.reset();
    } catch (err) {
      setError(err.message || "Could not complete employee setup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form-card employee-setup-card" onSubmit={submit}>
      <span className="eyebrow">Employee Setup</span>
      <h3>Verify email and set your password</h3>
      <p>Use the OTP sent to your email, then replace the temporary password with your own password.</p>
      <label>OTP Code<input name="otp" inputMode="numeric" placeholder="6-digit code" required /></label>
      <label>New Password<input name="password" type="password" minLength="8" required /></label>
      <label>Confirm New Password<input name="confirmPassword" type="password" minLength="8" required /></label>
      {error && <div className="form-error">{error}</div>}
      {notice && <div className="success">{notice}</div>}
      <button type="submit" className="settings-primary-action" disabled={saving}>{saving ? "Saving..." : "Complete Setup"}</button>
    </form>
  );
}

function BankDetailsForm({ accountDetails, onChange, onSave, onReset, onTest, saving }) {
  const update = (field) => (event) => onChange(field, event.target.value);
  return (
    <SettingsCard eyebrow="Payments" title="Bank Transfer Details" description="Used on invoice summaries and client payment documents.">
      <form className="bank-details-form" onSubmit={onSave}>
        <div className="settings-form-grid">
          <FormField label="Beneficiary" helper="Legal receiving name." icon="user"><input value={accountDetails.beneficiaryName || ""} onChange={update("beneficiaryName")} placeholder="ZMH USA Corp" required /></FormField>
          <FormField label="Bank" helper="Receiving institution." icon="database"><input value={accountDetails.bankName || ""} onChange={update("bankName")} placeholder="Bank name" required /></FormField>
          <FormField label="Account No." helper="Primary account number." icon="bill"><input value={accountDetails.accountNumber || ""} onChange={update("accountNumber")} placeholder="Account number" required /></FormField>
          <FormField label="Routing No." helper="ACH or domestic routing." icon="route"><input value={accountDetails.routingNumber || ""} onChange={update("routingNumber")} placeholder="Routing number" /></FormField>
          <FormField label="SWIFT" helper="International transfer code." icon="server"><input value={accountDetails.swiftCode || ""} onChange={update("swiftCode")} placeholder="SWIFT / BIC" /></FormField>
          <FormField label="Branch" helper="Optional branch name." icon="briefcase"><input value={accountDetails.branchName || ""} onChange={update("branchName")} placeholder="Branch name" /></FormField>
          <FormField label="Bank Address" helper="Street, city, country." icon="map"><input value={accountDetails.bankAddress || ""} onChange={update("bankAddress")} placeholder="Bank address" /></FormField>
          <FormField label="Reference" helper="Prefix before order ID." icon="receipt"><input value={accountDetails.referencePrefix || ""} onChange={update("referencePrefix")} placeholder="ZMH" /></FormField>
        </div>
        <FormField label="Instructions" helper="Shown below transfer details." icon="mail"><textarea value={accountDetails.paymentInstructions || ""} onChange={update("paymentInstructions")} placeholder="Include the invoice reference with your transfer." /></FormField>
        <div className="settings-footer-actions">
          <button type="submit" className="settings-primary-action" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          <button type="button" className="settings-secondary-action" onClick={onReset}>Reset</button>
          <button type="button" className="settings-secondary-action" onClick={onTest}>Test Transfer Details</button>
        </div>
      </form>
    </SettingsCard>
  );
}

function CompanyDetailsForm({ companyDetails, onChange, onSave, onReset, saving }) {
  const update = (field) => (event) => onChange(field, event.target.value);
  return (
    <form className="company-details-form" onSubmit={onSave}>
      <div className="settings-form-grid">
        <FormField label="Office Number" helper="Shown on public contact areas." icon="phone"><input value={companyDetails.officePhone || ""} onChange={update("officePhone")} placeholder="+1 (555) 018-2048" /></FormField>
        <FormField label="Office Address" helper="Shown on the contact page." icon="map"><input value={companyDetails.officeAddress || ""} onChange={update("officeAddress")} placeholder="Office address" /></FormField>
      </div>
      <div className="settings-footer-actions">
        <button type="submit" className="settings-primary-action" disabled={saving}>{saving ? "Saving..." : "Save Office Details"}</button>
        <button type="button" className="settings-secondary-action" onClick={onReset}>Reset</button>
      </div>
    </form>
  );
}

function PricingCard({ item, onEdit, onDuplicate, onDelete }) {
  const features = featureList(item.features);
  return (
    <article className="pricing-management-card">
      <div className="pricing-card-top">
        <div>
          <span className="eyebrow">{item.status || "active"}</span>
          <h4>{item.name || "Package"}</h4>
          <p>{item.description || item.bestFor || "No package description yet."}</p>
        </div>
        {item.recommended && <span className="recommended-badge">Recommended</span>}
      </div>
      <div className="pricing-card-price">{item.price || "Custom"}</div>
      <div className="pricing-card-facts">
        <span><strong>Badge</strong>{item.highlightBadge || "None"}</span>
        <span><strong>Order</strong>{item.displayOrder ?? 0}</span>
        <span><strong>Features</strong>{features.length}</span>
      </div>
      <div className="pricing-card-actions">
        <button type="button" className="table-action" onClick={onEdit}>Edit</button>
        <button type="button" className="table-action" onClick={onDuplicate}>Duplicate</button>
        <button type="button" className="table-action danger-link" onClick={onDelete}>Delete</button>
      </div>
    </article>
  );
}

function FeatureList({ features, onChange, onAdd, onDelete, onMove }) {
  return (
    <div className="feature-editor-list">
      <div className="settings-section-head compact">
        <div><h4>Feature Manager</h4><p>Add unlimited included features and reorder them by dragging or controls.</p></div>
        <button type="button" className="settings-secondary-action" onClick={onAdd}>Add Feature</button>
      </div>
      {features.length ? features.map((feature, index) => (
        <div className="feature-editor-row" key={`${feature}-${index}`} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onMove(Number(event.dataTransfer.getData("text/plain")), index)}>
          <span className="drag-handle" aria-label="Drag feature">::</span>
          <input aria-label={`Feature ${index + 1}`} value={feature} onChange={(event) => onChange(index, event.target.value)} placeholder="Included feature" />
          <button type="button" className="table-action" onClick={() => onMove(index, index - 1)} disabled={index === 0}>Up</button>
          <button type="button" className="table-action" onClick={() => onMove(index, index + 1)} disabled={index === features.length - 1}>Down</button>
          <button type="button" className="table-action danger-link" onClick={() => onDelete(index)}>Delete</button>
        </div>
      )) : <div className="empty-state">No features yet. Add the first included feature.</div>}
    </div>
  );
}

function PackageEditor({ packageDraft, onChange, onFeatureChange, onFeatureAdd, onFeatureDelete, onFeatureMove, onSave, onCancel, saving }) {
  if (!packageDraft) return null;
  const update = (field) => (event) => onChange(field, event.target.type === "checkbox" ? event.target.checked : event.target.value);
  return (
    <div className="settings-drawer-backdrop" role="presentation">
      <aside className="settings-drawer" role="dialog" aria-modal="true" aria-labelledby="package-editor-title">
        <div className="settings-drawer-head">
          <div><span className="eyebrow">Pricing Management</span><h3 id="package-editor-title">Edit {packageDraft.name || "Package"}</h3><p>Changes are saved through the existing pricing API.</p></div>
          <button type="button" className="settings-icon-action" aria-label="Close package editor" onClick={onCancel}>x</button>
        </div>
        <div className="package-editor-body">
          <div className="settings-form-grid">
            <FormField label="Package Name" helper="Visible card title." icon="briefcase"><input value={packageDraft.name || ""} onChange={update("name")} placeholder="Starter" required /></FormField>
            <FormField label="Slug" helper="Used for package URL and database key." icon="route"><input value={packageDraft.slug || ""} onChange={update("slug")} placeholder="starter" required /></FormField>
            <FormField label="Price" helper="Shown on website pricing cards." icon="bill"><input value={packageDraft.price || ""} onChange={update("price")} placeholder="Custom" /></FormField>
            <FormField label="Badge" helper="Optional marketing label." icon="target"><input value={packageDraft.highlightBadge || ""} onChange={update("highlightBadge")} placeholder="Most popular" /></FormField>
            <FormField label="Button Text" helper="Pricing card CTA copy." icon="arrow"><input value={packageDraft.buttonText || ""} onChange={update("buttonText")} placeholder="Package details" /></FormField>
            <FormField label="Button Link" helper="Destination for the CTA." icon="map"><input value={packageDraft.buttonLink || ""} onChange={update("buttonLink")} placeholder="/pricing/starter" /></FormField>
            <FormField label="Display Order" helper="Lower numbers appear first." icon="chart"><input type="number" value={packageDraft.displayOrder ?? 0} onChange={update("displayOrder")} /></FormField>
            <FormField label="Status" helper="Inactive packages are hidden publicly." icon="settings"><select value={packageDraft.status || "active"} onChange={update("status")}><option value="active">Active</option><option value="inactive">Inactive</option></select></FormField>
          </div>
          <label className="settings-check-row"><input type="checkbox" checked={Boolean(packageDraft.recommended)} onChange={update("recommended")} /><span>Recommended Package</span></label>
          <FormField label="Description" helper="Short positioning copy for this package." icon="mail"><textarea value={packageDraft.description || packageDraft.bestFor || ""} onChange={update("description")} placeholder="Who this package is best for..." /></FormField>
          <FeatureList features={featureList(packageDraft.features)} onChange={onFeatureChange} onAdd={onFeatureAdd} onDelete={onFeatureDelete} onMove={onFeatureMove} />
        </div>
        <div className="settings-drawer-footer">
          <button type="button" className="settings-secondary-action" onClick={onCancel}>Cancel</button>
          <button type="button" className="settings-primary-action" onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save Package"}</button>
        </div>
      </aside>
    </div>
  );
}

function SettingsPanel() {
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [accountDetails, setAccountDetails] = useState(defaultAccountDetails);
  const [companyDetails, setCompanyDetails] = useState(defaultCompanyDetails);
  const [packageRows, setPackageRows] = useState(defaultPackageRows);
  const [teamRows, setTeamRows] = useState(defaultTeamRows);
  const [editingIndex, setEditingIndex] = useState(null);
  const [packageDraft, setPackageDraft] = useState(null);
  const [savingBank, setSavingBank] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingPackage, setSavingPackage] = useState(false);
  const [savingTeam, setSavingTeam] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      setLoading(true);
      try {
        const [pricingData, settingsData] = await Promise.all([adminApi.pricing(), adminApi.getSettings()]);
        if (!active) return;
        if (Array.isArray(pricingData.packages) && pricingData.packages.length) setPackageRows(pricingData.packages);
        const accountSetting = (settingsData.settings || []).find((item) => item.key === "accountDetails");
        const companySetting = (settingsData.settings || []).find((item) => item.key === "companyDetails");
        const teamSetting = (settingsData.settings || []).find((item) => item.key === "teamProfiles");
        if (accountSetting?.value) setAccountDetails((current) => ({ ...current, ...accountSetting.value }));
        if (companySetting?.value) setCompanyDetails((current) => ({ ...current, ...companySetting.value }));
        if (Array.isArray(teamSetting?.value) && teamSetting.value.length) {
          setTeamRows(teamSetting.value.map((profile) => {
            const defaultProfile = defaultTeamRows.find((item) => item.slug === profile.slug);
            return defaultProfile ? { ...defaultProfile, ...profile, image: profile.image || defaultProfile.image, imagePosition: profile.imagePosition || defaultProfile.imagePosition } : profile;
          }));
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setError(err.message || "Could not load settings.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSettings();
    return () => { active = false; };
  }, []);

  const updateAccount = (field, value) => {
    setAccountDetails((current) => ({ ...current, [field]: value }));
  };

  const updateCompany = (field, value) => {
    setCompanyDetails((current) => ({ ...current, [field]: value }));
  };

  const updateTeamRow = (index, field, value) => {
    setTeamRows((current) => current.map((item, itemIndex) => itemIndex === index ? {
      ...item,
      [field]: field === "focus" ? String(value).split(/\r?\n|,/).map((entry) => entry.trim()).filter(Boolean) : value,
      slug: field === "name" ? slugify(value) : item.slug,
    } : item));
  };

  const addTeamProfile = () => {
    setTeamRows((current) => [
      ...current,
      { name: "", slug: "", role: "", location: "", linkedin: "", summary: "", bio: "", focus: [] },
    ]);
  };

  const removeTeamProfile = (index) => {
    setTeamRows((current) => current.length > 1 ? current.filter((_, itemIndex) => itemIndex !== index) : current);
  };

  const saveTeamProfiles = async (event) => {
    event.preventDefault();
    setSaved("");
    setError("");
    setSavingTeam(true);
    try {
      const payload = teamRows.map((item) => ({
        name: String(item.name || "").trim(),
        slug: slugify(item.slug || item.name),
        role: String(item.role || "").trim(),
        location: String(item.location || "").trim(),
        linkedin: String(item.linkedin || "").trim(),
        summary: String(item.summary || "").trim(),
        bio: String(item.bio || "").trim(),
        focus: featureList(item.focus),
        image: String(item.image || "").trim(),
        imagePosition: String(item.imagePosition || "").trim(),
      })).filter((item) => item.name && item.role);
      if (!payload.length) throw new Error("At least one team profile is required.");
      await adminApi.settings({ teamProfiles: payload });
      setTeamRows(payload);
      setSaved("Team profiles saved.");
    } catch (err) {
      setError(err.message || "Could not save team profiles.");
    } finally {
      setSavingTeam(false);
    }
  };

  const saveCompanyDetails = async (event) => {
    event.preventDefault();
    setSaved("");
    setError("");
    setSavingCompany(true);
    try {
      await adminApi.settings({ companyDetails });
      setSaved("Office details saved.");
    } catch (err) {
      setError(err.message || "Could not save office details.");
    } finally {
      setSavingCompany(false);
    }
  };

  const savePricingRows = async (rows, message = "Package pricing saved.") => {
    setSaved("");
    setError("");
    setSavingPackage(true);
    try {
      const payload = rows.map((item, index) => ({
        ...item,
        slug: slugify(item.slug || item.name),
        displayOrder: Number(item.displayOrder ?? index),
        features: featureList(item.features).filter(Boolean),
      }));
      const data = await adminApi.savePricing(payload);
      const nextRows = data.packages || payload;
      setPackageRows(nextRows);
      setSaved(message);
      return nextRows;
    } catch (err) {
      setError(err.message || "Could not save pricing.");
      return null;
    } finally {
      setSavingPackage(false);
    }
  };

  const saveAccountDetails = async (event) => {
    event.preventDefault();
    setSaved("");
    setError("");
    setSavingBank(true);
    try {
      const merged = {
        ...accountDetails,
        routingSwift: [accountDetails.routingNumber, accountDetails.swiftCode].filter(Boolean).join(" / ") || accountDetails.routingSwift,
      };
      await adminApi.settings({ accountDetails: merged });
      setAccountDetails(merged);
      setSaved("Account details saved.");
    } catch (err) {
      setError(err.message || "Could not save account details.");
    } finally {
      setSavingBank(false);
    }
  };

  const testTransferDetails = () => {
    const missing = ["beneficiaryName", "bankName", "accountNumber"].filter((field) => !String(accountDetails[field] || "").trim());
    setError(missing.length ? "Beneficiary name, bank name, and account number are required before sending transfer details." : "");
    setSaved(missing.length ? "" : "Transfer details look ready for invoice summaries.");
  };

  const openEditor = (index) => {
    setEditingIndex(index);
    setPackageDraft({ ...packageRows[index], features: featureList(packageRows[index].features) });
    setSaved("");
    setError("");
  };

  const updateDraft = (field, value) => {
    setPackageDraft((current) => {
      const next = { ...current, [field]: value };
      if (field === "name" && !current.slug) next.slug = slugify(value);
      return next;
    });
  };

  const updateDraftFeature = (index, value) => {
    setPackageDraft((current) => {
      const features = featureList(current.features);
      features[index] = value;
      return { ...current, features };
    });
  };

  const addDraftFeature = () => {
    setPackageDraft((current) => ({ ...current, features: [...featureList(current.features), "New included feature"] }));
  };

  const deleteDraftFeature = (index) => {
    setPackageDraft((current) => ({ ...current, features: featureList(current.features).filter((_, itemIndex) => itemIndex !== index) }));
  };

  const moveDraftFeature = (from, to) => {
    setPackageDraft((current) => {
      const features = featureList(current.features);
      if (from === to || to < 0 || to >= features.length) return current;
      const [feature] = features.splice(from, 1);
      features.splice(to, 0, feature);
      return { ...current, features };
    });
  };

  const saveDraftPackage = async () => {
    const name = String(packageDraft?.name || "").trim();
    if (!name) {
      setError("Package name is required.");
      return;
    }
    const nextRows = packageRows.map((item, index) => index === editingIndex ? {
      ...packageDraft,
      name,
      slug: slugify(packageDraft.slug || name),
      features: featureList(packageDraft.features).filter(Boolean),
    } : item);
    const savedRows = await savePricingRows(nextRows, `${name} package saved.`);
    if (savedRows) {
      setPackageDraft(null);
      setEditingIndex(null);
    }
  };

  const duplicatePackage = async (index) => {
    const source = packageRows[index];
    if (!source) return;
    const copyName = `${source.name || "Package"} Copy`;
    const copy = {
      ...source,
      _id: undefined,
      name: copyName,
      slug: `${slugify(source.slug || source.name)}-copy-${Date.now().toString().slice(-4)}`,
      displayOrder: packageRows.length,
      recommended: false,
      status: "inactive",
      features: featureList(source.features),
    };
    await savePricingRows([...packageRows, copy], `${copyName} duplicated as inactive.`);
  };

  const deletePackage = async (index) => {
    const item = packageRows[index];
    if (!item || !window.confirm(`Mark ${item.name || "this package"} inactive?`)) return;
    const nextRows = packageRows.map((row, rowIndex) => rowIndex === index ? { ...row, status: "inactive", recommended: false } : row);
    await savePricingRows(nextRows, `${item.name || "Package"} marked inactive.`);
  };

  const activeCount = packageRows.filter((item) => item.status !== "inactive").length;
  const totalFeatureCount = packageRows.reduce((sum, item) => sum + featureList(item.features).length, 0);

  return (
    <div className="settings-workspace">
      {saved && <div className="success admin-save">{saved}</div>}
      {error && <div className="form-error admin-save">{error}</div>}
      <div className="settings-overview">
        <div>
          <span className="eyebrow">Enterprise settings</span>
          <h3>Configure payment details and public pricing</h3>
          <p>Manage the client-facing transfer details and database-backed pricing packages from one polished admin workspace.</p>
        </div>
        <div className="settings-stat-row">
          <span><strong>{packageRows.length}</strong>Packages</span>
          <span><strong>{activeCount}</strong>Active</span>
          <span><strong>{totalFeatureCount}</strong>Features</span>
        </div>
      </div>
      {loading ? (
        <div className="settings-grid-shell">
          <div className="settings-skeleton" />
          <div className="settings-skeleton large" />
        </div>
      ) : (
        <div className="settings-grid-shell">
          <div className="settings-left-column">
            <SettingsCard eyebrow="Company" title="Company Settings" description="Core company identity used throughout the admin experience.">
              <div className="company-settings-summary">
                <div className="brand-mark"><img src="/brand/zmh-usa-corp-mark.png" width="96" height="96" loading="lazy" decoding="async" alt="" /></div>
                <div><strong>ZMH USA Corp.</strong><span>Remote operations support for home service companies.</span></div>
              </div>
              <CompanyDetailsForm companyDetails={companyDetails} onChange={updateCompany} onSave={saveCompanyDetails} onReset={() => setCompanyDetails(defaultCompanyDetails)} saving={savingCompany} />
            </SettingsCard>
            <BankDetailsForm accountDetails={accountDetails} onChange={updateAccount} onSave={saveAccountDetails} onReset={() => setAccountDetails(defaultAccountDetails)} onTest={testTransferDetails} saving={savingBank} />
          </div>
          <div className="settings-right-column">
            <SettingsCard
              eyebrow="Pricing"
              title="Package Pricing"
              description="Packages are shown as clean management cards. Open a package to edit details and feature lists."
              actions={<button type="button" className="settings-secondary-action" onClick={() => duplicatePackage(Math.max(packageRows.length - 1, 0))} disabled={!packageRows.length || savingPackage}>Duplicate Last</button>}
            >
              <div className="pricing-management-grid">
                {packageRows.map((item, index) => (
                  <PricingCard key={item.slug || index} item={item} onEdit={() => openEditor(index)} onDuplicate={() => duplicatePackage(index)} onDelete={() => deletePackage(index)} />
                ))}
              </div>
            </SettingsCard>
            <SettingsCard eyebrow="Management" title="Pricing Management" description="Edit package data in the drawer. Save publishes changes through the existing admin pricing API.">
              <div className="pricing-management-note">
                <Icon name="shield" size={22} />
                <div><strong>Single source of truth</strong><p>Pricing cards on the website load from these database-backed package records.</p></div>
              </div>
            </SettingsCard>
          </div>
          <div className="settings-full-row">
            <SettingsCard eyebrow="Team" title="Founder & Stakeholder Profiles" description="These profiles appear on the public Team page and individual profile pages.">
              <form className="team-profile-admin-form" onSubmit={saveTeamProfiles}>
                {teamRows.map((profile, index) => (
                  <div className="team-profile-admin-card" key={`team-profile-${index}`}>
                    <div className="team-profile-card-head">
                      <div className="team-profile-mini-avatar">{profile.image ? <img src={profile.image} alt="" loading="lazy" decoding="async" /> : String(profile.name || "TP").split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()}</div>
                      <div>
                        <h4>{profile.name || "Team profile"}</h4>
                        <p>{profile.role || "Role not set"}</p>
                      </div>
                      <button type="button" className="table-action danger-link" onClick={() => removeTeamProfile(index)} disabled={teamRows.length <= 1}>Remove</button>
                    </div>
                    <div className="settings-form-grid team-profile-core-grid">
                      <FormField label="Name" icon="user"><input value={profile.name || ""} onChange={(event) => updateTeamRow(index, "name", event.target.value)} required /></FormField>
                      <FormField label="Role" icon="briefcase"><input value={profile.role || ""} onChange={(event) => updateTeamRow(index, "role", event.target.value)} required /></FormField>
                      <FormField label="Location" icon="map"><input value={profile.location || ""} onChange={(event) => updateTeamRow(index, "location", event.target.value)} /></FormField>
                      <FormField label="LinkedIn" icon="linkedin"><input value={profile.linkedin || ""} onChange={(event) => updateTeamRow(index, "linkedin", event.target.value)} placeholder="https://www.linkedin.com/" /></FormField>
                      <FormField label="Photo Path" icon="image"><input value={profile.image || ""} onChange={(event) => updateTeamRow(index, "image", event.target.value)} placeholder="/team/name.png" /></FormField>
                      <FormField label="Photo Position" icon="settings"><input value={profile.imagePosition || ""} onChange={(event) => updateTeamRow(index, "imagePosition", event.target.value)} placeholder="50% 28%" /></FormField>
                    </div>
                    <div className="team-profile-text-grid">
                      <FormField label="Summary" icon="mail"><textarea value={profile.summary || ""} onChange={(event) => updateTeamRow(index, "summary", event.target.value)} /></FormField>
                      <FormField label="Bio" icon="database"><textarea value={profile.bio || ""} onChange={(event) => updateTeamRow(index, "bio", event.target.value)} /></FormField>
                      <FormField label="Focus Areas" helper="Use one per line or comma separated." icon="target"><textarea value={featureList(profile.focus).join("\n")} onChange={(event) => updateTeamRow(index, "focus", event.target.value)} /></FormField>
                    </div>
                  </div>
                ))}
                <div className="settings-footer-actions team-profile-actions">
                  <button type="button" className="settings-secondary-action" onClick={addTeamProfile}>Add Profile</button>
                  <button type="submit" className="settings-primary-action" disabled={savingTeam}>{savingTeam ? "Saving..." : "Save Team Profiles"}</button>
                  <button type="button" className="settings-secondary-action" onClick={() => setTeamRows(defaultTeamRows)}>Reset Defaults</button>
                </div>
              </form>
            </SettingsCard>
          </div>
        </div>
      )}
      <PackageEditor
        packageDraft={packageDraft}
        onChange={updateDraft}
        onFeatureChange={updateDraftFeature}
        onFeatureAdd={addDraftFeature}
        onFeatureDelete={deleteDraftFeature}
        onFeatureMove={moveDraftFeature}
        onSave={saveDraftPackage}
        onCancel={() => { setPackageDraft(null); setEditingIndex(null); }}
        saving={savingPackage}
      />
    </div>
  );
}

export function AdminPage() {
  const { logout, user, updateUser: updateAuthUser } = useAuth();
  const isEmployee = user?.role === "employee";
  const employeeNeedsSetup = isEmployee && (user?.mustChangePassword || !user?.isEmailVerified);
  const visibleTabs = isEmployee ? [{ name: "Ongoing", icon: "route" }] : adminTabs;
  const [tab, setTab] = useState(isEmployee ? "Ongoing" : "Overview");
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [archivedTickets, setArchivedTickets] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderSort, setOrderSort] = useState("newest");
  const [orderFilter, setOrderFilter] = useState("all");
  const [billScope, setBillScope] = useState("individual");
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    let active = true;
    async function loadAdminData() {
      if (employeeNeedsSetup) return;
      try {
        const data = await adminApi.summary();
        if (!active) return;
        setUsers(data.users || []);
        setBookings(data.bookings || []);
        setBills(data.bills || []);
        setPayments(data.payments || []);
        setTickets(data.tickets || []);
        setArchivedTickets(data.archivedTickets || []);
        setError("");
      } catch (err) {
        if (active) setError(err.message || "Could not load admin data.");
      }
    }
    loadAdminData();
    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadAdminData();
    }, 15000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [employeeNeedsSetup]);

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
    ["Payments to review", payments.filter((payment) => payment.status === "submitted").length, "bill"],
    ["Open tickets", openTickets.length, "mail"],
  ], [users, pendingUsers, bookings, ongoingBookings, payments, openTickets]);

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

  const updateUserAccount = async (id, payload) => {
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

  const createEmployee = async (event) => {
    event.preventDefault();
    setSavingId("create-employee");
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await adminApi.createEmployee({
        name: form.get("name"),
        email: form.get("email"),
        temporaryPassword: form.get("temporaryPassword"),
      });
      setUsers((current) => [data.user, ...current]);
      setNotice(data.message || "Employee created.");
      event.currentTarget.reset();
    } catch (err) {
      setError(err.message || "Could not create employee.");
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
      if (data.ticket.status === "resolved") {
        setTickets((current) => current.filter((item) => item._id !== ticket._id));
        setArchivedTickets((current) => [data.ticket, ...current.filter((item) => item._id !== ticket._id)]);
        setNotice("Support ticket resolved and moved to archived tickets.");
      } else {
        setTickets((current) => current.map((item) => item._id === ticket._id ? data.ticket : item));
        setNotice("Support ticket updated.");
      }
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
      setBillScope("individual");
    } catch (err) {
      setError(err.message || "Could not send bills.");
    } finally {
      setSavingId("");
    }
  };

  const approvePayment = async (payment) => {
    setSavingId(payment._id);
    setError("");
    setNotice("");
    try {
      const data = await adminApi.approvePayment(payment._id);
      setPayments((current) => current.map((item) => item._id === payment._id ? data.payment : item));
      setBills((current) => current.map((bill) => bill._id === data.invoice?._id ? data.invoice : bill));
      if (data.order?._id) setBookings((current) => current.map((booking) => booking._id === data.order._id ? data.order : booking));
      setNotice(data.emailSent ? "Payment approved and confirmation email sent." : "Payment approved. Email provider skipped or failed.");
    } catch (err) {
      setError(err.message || "Could not approve payment.");
    } finally {
      setSavingId("");
    }
  };

  const rejectPayment = async (event, payment) => {
    event.preventDefault();
    setSavingId(payment._id);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await adminApi.rejectPayment(payment._id, { reason: form.get("reason") });
      setPayments((current) => current.map((item) => item._id === payment._id ? data.payment : item));
      if (data.order?._id) setBookings((current) => current.map((booking) => booking._id === data.order._id ? data.order : booking));
      setNotice(data.emailSent ? "Payment rejected and client email sent." : "Payment rejected. Email provider skipped or failed.");
    } catch (err) {
      setError(err.message || "Could not reject payment.");
    } finally {
      setSavingId("");
    }
  };

  const renderBookingCards = (items, emptyText, readOnly = false) => (
    <div className="booking-admin-list">
      {items.length ? items.map((booking) => (
        <form className={readOnly ? "booking-admin-card cancelled-admin-card" : "booking-admin-card"} key={booking._id} onSubmit={(event) => updateBooking(event, booking)}>
          <div>
            <span className="eyebrow">{booking.email || booking.user?.email || "Public request"}</span>
            <h3>{booking.companyName}</h3>
            {!readOnly && <p>{booking.services?.join(", ") || "No services selected"}</p>}
          </div>
          {!readOnly && <>
            <label>Requested Date<input name="requestedDate" type="date" defaultValue={booking.requestedDate ? booking.requestedDate.slice(0, 10) : ""} /></label>
            <label>Admin Response<textarea name="adminResponse" defaultValue={booking.adminResponse || ""} placeholder="Write the response the user will see..." /></label>
            <label>Internal Notes<textarea name="notes" defaultValue={booking.notes || ""} placeholder="Private admin notes" /></label>
          </>}
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

  const renderOrderTable = (items) => (
    <div className="order-management">
      <div className="order-toolbar">
        <label>Search<input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Company, email, phone, package..." /></label>
        <label>Filter<select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)}><option value="all">All ongoing</option><option value="pending">Payment pending</option><option value="sent">Invoice sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option></select></label>
        <label>Sort<select value={orderSort} onChange={(event) => setOrderSort(event.target.value)}><option value="newest">Newest</option><option value="company">Company</option><option value="progress">Progress</option></select></label>
      </div>
      <div className="ongoing-order-grid">
        {items.length ? items.map((booking) => (
          <article className="ongoing-order-card" key={booking._id}>
            <div>
              <span className="eyebrow">Ordered {formatDate(booking.createdAt)}</span>
              <h3>{booking.companyName}</h3>
              <p>{booking.contactPerson || booking.user?.name || "Public booking"} | {booking.email || booking.user?.email || "No email"} | {booking.phone || "No phone"}</p>
            </div>
            <div className="ongoing-order-facts">
              <span><strong>Package</strong>{booking.packageName || "Custom support"}<small>{booking.packagePrice || "Custom"}</small></span>
              <span><strong>Billing</strong><b className="status-pill">{booking.paymentStatus || "pending"}</b><small>Next {formatDate(booking.nextBillingDate)}</small></span>
              <span><strong>Assigned</strong>{booking.assignedStaff || "Unassigned"}</span>
            </div>
            <div className="ongoing-order-progress">
              <div><strong>{Number(booking.progressPercent || 0)}%</strong><span>Progress</span></div>
              <div className="progress-meter"><span style={{ width: `${Number(booking.progressPercent || 0)}%` }} /></div>
            </div>
            <button type="button" className="table-action" onClick={() => navigate(`/admin/orders/${booking._id}`)}>Open details</button>
          </article>
        )) : <div className="empty-state">No ongoing orders match this view.</div>}
      </div>
    </div>
  );

  return (
    <>
      <SEO title="Admin Panel" description="Manage real MongoDB users, bookings, bills, and admin responses." />
      <section className="admin-page">
        <aside className="admin-sidebar">
          <span className="eyebrow">{isEmployee ? "Employee" : "Admin"}</span>
          <h1>{isEmployee ? "Work Center" : "Control Center"}</h1>
          {visibleTabs.map((item) => (
            <button key={item.name} className={tab === item.name ? "active" : ""} onClick={() => setTab(item.name)}>
              <Icon name={item.icon} size={18} /> {item.name}
            </button>
          ))}
        </aside>
        <div className="admin-main">
          <div className="admin-hero">
            <div>
              <h2>{tab === "Overview" ? "Manage users, orders, bills, and support" : tab}</h2>
              <p>{isEmployee ? "Open ongoing orders and update order progress." : "Review bookings, manage ongoing order profiles, resolve support tickets, and send client bills."}</p>
            </div>
            <div className="admin-hero-actions">
              {!isEmployee && <Button to="/user-dashboard" variant="secondary" icon="user">User Dashboard</Button>}
              <button type="button" className="ghost-small admin-logout-button" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}
          {notice && <div className="success">{notice}</div>}
          {employeeNeedsSetup && <EmployeeSetupPanel onComplete={updateAuthUser} />}

          {!isEmployee && tab === "Overview" && (
            <>
              <div className="grid four admin-metrics">
                {metrics.map(([label, value, icon]) => (
                  <article className="card" key={label}><div className="card-icon"><Icon name={icon} /></div><strong className="price">{value}</strong><p>{label}</p></article>
                ))}
              </div>
            </>
          )}

          {!isEmployee && tab === "Approvals" && (
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

          {!isEmployee && tab === "Users" && (
            <div className="users-admin-workspace">
              <form className="form-card employee-create-form" onSubmit={createEmployee}>
                <span className="eyebrow">Employee</span>
                <h3>Create employee account</h3>
                <div className="settings-form-grid">
                  <label>Name<input name="name" required placeholder="Employee name" /></label>
                  <label>Email<input name="email" type="email" required placeholder="employee@company.com" /></label>
                  <label>Temporary Password<input name="temporaryPassword" type="text" minLength="8" required placeholder="Minimum 8 characters" /></label>
                </div>
                <button type="submit" className="settings-primary-action" disabled={savingId === "create-employee"}>{savingId === "create-employee" ? "Creating..." : "Create Employee"}</button>
              </form>
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
                        <td data-label="Status"><select defaultValue={user.status} onChange={(event) => updateUserAccount(user._id, { status: event.target.value })}>{userStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                        <td data-label="Action"><button type="button" className="table-action" disabled={savingId === user._id || user.status === "active"} onClick={() => approveUser(user._id)}>{savingId === user._id ? "Saving" : user.status === "active" ? "Approved" : "Approve & email"}</button></td>
                      </tr>
                    )) : <tr><td colSpan="6">No users found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!isEmployee && tab === "Bookings" && (
            renderBookingCards(newBookings, "No new booking requests found.")
          )}

          {!isEmployee && tab === "Calendar" && (
            <AdminCalendarBoard bookings={bookings} />
          )}

          {!employeeNeedsSetup && tab === "Ongoing" && (
            renderOrderTable(visibleOngoingBookings)
          )}

          {!isEmployee && tab === "Cancelled Orders" && (
            renderBookingCards(cancelledBookings, "No cancelled orders yet.", true)
          )}

          {!isEmployee && tab === "Bills" && (
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

          {!isEmployee && tab === "Send Bills" && (
            <form className="form-card send-bills-form" onSubmit={sendBills}>
              <div className="send-bill-header">
                <div>
                  <span className="eyebrow">Monthly billing</span>
                  <h3>Send client bill</h3>
                  <p>Create a monthly bill and email it to one client, selected clients, or all active users.</p>
                </div>
                <span>{users.filter((user) => user.role !== "admin").length} billable users</span>
              </div>
              <div className="send-bill-section">
                <h4>Recipients</h4>
                <div className="form-grid compact send-bill-recipient-grid">
                  <label>Send to<select name="scope" value={billScope} onChange={(event) => setBillScope(event.target.value)}><option value="individual">Individual user</option><option value="custom">Custom selected users</option><option value="all">All active users</option></select></label>
                  {billScope === "individual" && <label>Individual user<select name="userId" defaultValue="" required><option value="">Select user</option>{users.filter((user) => user.role !== "admin").map((user) => <option key={user._id} value={user._id}>{user.name} - {user.email}</option>)}</select></label>}
                  {billScope === "all" && <div className="send-bill-audience"><strong>All active users</strong><span>The bill will be sent to every active non-admin user.</span></div>}
                </div>
                {billScope === "custom" && <div className="custom-user-box send-bill-user-list">
                  {users.filter((user) => user.role !== "admin").map((user) => <label className="checkbox" key={user._id}><input type="checkbox" name="userIds" value={user._id} /> <span><strong>{user.name}</strong><small>{user.email}</small></span></label>)}
                </div>}
              </div>
              <div className="send-bill-section">
                <h4>Bill details</h4>
                <div className="form-grid compact">
                  <label>Amount<input name="amount" type="number" min="0" step="0.01" required /></label>
                  <label>Currency<input name="currency" defaultValue="USD" /></label>
                  <label>Due date<input name="dueDate" type="date" /></label>
                  <label>Line item<input name="label" defaultValue="Service bill" /></label>
                </div>
              </div>
              <div className="send-bill-section">
                <label>Bill message<textarea name="message" placeholder="Optional message for the bill email" /></label>
              </div>
              <div className="send-bill-footer">
                <Button type="submit" icon="mail">{savingId === "send-bills" ? "Sending..." : "Send bills"}</Button>
              </div>
            </form>
          )}

          {!isEmployee && tab === "Payment Approval" && (
            <div className="booking-admin-list payment-review-list">
              {payments.length ? payments.map((payment) => (
                <article className="support-ticket-card payment-review-card" key={payment._id}>
                  <div className="order-profile-head">
                    <div>
                      <span className="eyebrow">{payment.status}</span>
                      <h3>{payment.user?.name || "Client"} - {payment.invoice?.invoice || "Invoice"}</h3>
                      <p>{payment.order?.companyName || payment.invoice?.company || payment.user?.company || "Company"} | {payment.order?.packageName || "Package pending"}</p>
                    </div>
                    <span className="status-pill">{payment.status === "submitted" ? "Pending Admin Approval" : payment.status}</span>
                  </div>
                  <div className="profile-facts">
                    <span><strong>User</strong>{payment.user?.name || "-"}</span>
                    <span><strong>Company</strong>{payment.invoice?.company || payment.user?.company || "-"}</span>
                    <span><strong>Invoice Number</strong>{payment.invoice?.invoice || "-"}</span>
                    <span><strong>Submission Date</strong>{formatDate(payment.createdAt)}</span>
                  </div>
                  <div className="profile-facts">
                    <span><strong>Amount</strong>{payment.currency} {Number(payment.amount || payment.invoice?.amount || 0).toFixed(2)}</span>
                    <span><strong>Payment Date</strong>{formatDate(payment.paymentDate)}</span>
                    <span><strong>Invoice Details</strong>{payment.invoice?.message || payment.order?.packageName || "Monthly service bill"}</span>
                    <span><strong>Status</strong>{payment.status}</span>
                  </div>
                  <div className="profile-facts">
                    <span><strong>Method</strong>{payment.paymentMethod}</span>
                    <span><strong>Client Email</strong>{payment.user?.email || "-"}</span>
                    <span><strong>Package</strong>{payment.order?.packageName || "-"}</span>
                    <span><strong>Invoice Status</strong>{payment.invoice?.status || "-"}</span>
                  </div>
                  {payment.note && <p>{payment.note}</p>}
                  {payment.screenshot?.dataUrl && <a className="table-action" href={payment.screenshot.dataUrl} target="_blank" rel="noreferrer">Open Screenshot</a>}
                  {payment.status === "submitted" ? (
                    <div className="payment-review-actions">
                      <button type="button" className="settings-primary-action" disabled={savingId === payment._id} onClick={() => approvePayment(payment)}>{savingId === payment._id ? "Reviewing..." : "Approve Payment"}</button>
                      <form className="payment-reject-form" onSubmit={(event) => rejectPayment(event, payment)}>
                        <input name="reason" placeholder="Reason for rejection" required />
                        <button type="submit" className="settings-secondary-action danger-link" disabled={savingId === payment._id}>Reject Payment</button>
                      </form>
                    </div>
                  ) : <div className="empty-state">Reviewed {formatDate(payment.reviewedAt)}. {payment.reviewReason}</div>}
                </article>
              )) : <div className="empty-state">No payment submissions yet.</div>}
            </div>
          )}

          {!isEmployee && tab === "Support Tickets" && (
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
                  <label>Status<select name="status" defaultValue={ticket.status}><option value="open">Open</option><option value="in progress">In Progress</option><option value="resolved">Resolved</option></select></label>
                  <label>Admin response<textarea name="adminResponse" defaultValue={ticket.adminResponse || ""} placeholder="Write the resolution or update for the user" /></label>
                  <div className="booking-admin-footer"><span>{ticket.resolvedAt ? "Resolved " + formatDate(ticket.resolvedAt) : "Waiting for admin"}</span><button type="submit" className="table-action" disabled={savingId === ticket._id}>{savingId === ticket._id ? "Saving" : "Update ticket"}</button></div>
                </form>
              )) : <div className="empty-state">No support tickets yet.</div>}
            </div>
          )}

          {!isEmployee && tab === "Archived Tickets" && (
            <div className="booking-admin-list">
              {archivedTickets.length ? archivedTickets.map((ticket) => (
                <article className="support-ticket-card" key={ticket._id}>
                  <div>
                    <span className="eyebrow">{ticket.user?.email}</span>
                    <h3>{ticket.subject}</h3>
                    <p>{ticket.message}</p>
                    {ticket.adminResponse && <p><strong>Final reply:</strong> {ticket.adminResponse}</p>}
                  </div>
                  <div className="profile-facts">
                    <span><strong>User</strong>{ticket.user?.name || "-"}</span>
                    <span><strong>Company</strong>{ticket.user?.company || "-"}</span>
                    <span><strong>Status</strong>{ticket.status}</span>
                    <span><strong>Resolved</strong>{formatDate(ticket.resolvedAt)}</span>
                  </div>
                </article>
              )) : <div className="empty-state">No resolved ticket history yet.</div>}
            </div>
          )}

          {!isEmployee && tab === "Settings" && <SettingsPanel />}
        </div>
      </section>
    </>
  );
}
