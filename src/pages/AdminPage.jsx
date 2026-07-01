import { useState } from "react";
import { Button } from "../components/Button";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";

const adminTabs = [
  { name: "Overview", icon: "shield" },
  { name: "Users", icon: "users" },
  { name: "Bookings", icon: "calendar" },
  { name: "Bills", icon: "bill" },
  { name: "Settings", icon: "settings" },
];

const users = [
  { name: "Sarah Mitchell", company: "Apex HVAC", role: "Client Admin", status: "Active" },
  { name: "Daniel Brooks", company: "BluePipe Plumbing", role: "Manager", status: "Pending OTP" },
  { name: "Nadia Rahman", company: "ZMH Operations", role: "Support Agent", status: "Active" },
];

const bookings = [
  { company: "Apex HVAC", service: "Dispatch + Scheduling", date: "2026-07-02", status: "Needs review" },
  { company: "RoofLine Pros", service: "Call Answering", date: "2026-07-04", status: "Confirmed" },
  { company: "CleanPro", service: "CRM Management", date: "2026-07-08", status: "New" },
];

const bills = [
  { invoice: "INV-1007", company: "Apex HVAC", amount: "$1,850", status: "Draft" },
  { invoice: "INV-1008", company: "BluePipe Plumbing", amount: "$2,400", status: "Sent" },
  { invoice: "INV-1009", company: "RoofLine Pros", amount: "$980", status: "Paid" },
];

function DataTable({ columns, rows }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}<th>Action</th></tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.invoice || row.name || row.company + index}>
              {columns.map((column) => <td key={column} data-label={column}>{row[column.toLowerCase()]}</td>)}
              <td data-label="Action"><button type="button" className="table-action">Manage</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SettingsPanel() {
  const [saved, setSaved] = useState("");
  const save = (event, label) => {
    event.preventDefault();
    setSaved(label + " settings saved for backend connection.");
  };

  return (
    <div className="admin-settings">
      <form className="form-card" onSubmit={(event) => save(event, "MongoDB")}>
        <h3>Backend Preparation</h3>
        <label>MongoDB Connection Name<input placeholder="MONGODB_URI" /></label>
        <label>Database Name<input placeholder="zmh_operations" /></label>
        <label>Default User Role<select defaultValue="client"><option value="client">Client</option><option value="admin">Admin</option><option value="agent">Agent</option></select></label>
        <label>Booking Approval Mode<select defaultValue="manual"><option value="manual">Manual approval</option><option value="auto">Auto confirm after payment</option></select></label>
        <Button type="submit" icon="server">Save MongoDB Settings</Button>
      </form>
      <form className="form-card" onSubmit={(event) => save(event, "OTP")}>
        <h3>Resend OTP</h3>
        <p>Prepared for Resend email OTP delivery when your backend is connected.</p>
        <label>Resend API Key Env<input placeholder="RESEND_API_KEY" /></label>
        <label>OTP From Email<input placeholder="verify@zmhusacorp.com" /></label>
        <label>OTP Expiry Minutes<input type="number" min="1" defaultValue="10" /></label>
        <label className="checkbox"><input type="checkbox" defaultChecked /> Allow resend OTP after 60 seconds</label>
        <Button type="submit" icon="mail">Save OTP Settings</Button>
      </form>
      {saved && <div className="success admin-save">{saved}</div>}
    </div>
  );
}

export function AdminPage() {
  const [tab, setTab] = useState("Overview");

  return (
    <>
      <SEO title="Admin Panel" description="Admin panel prepared for MongoDB users, bookings, bills, and Resend OTP settings." />
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
              <span className="eyebrow">MongoDB ready</span>
              <h2>{tab === "Overview" ? "Manage users, bookings, bills, and system options" : tab}</h2>
              <p>Frontend-only admin workflows are prepared for your future Node/MongoDB backend, role-based access, billing records, and Resend OTP verification.</p>
            </div>
            <Button to="/dashboard" variant="secondary" icon="user">Client Portal</Button>
          </div>

          {tab === "Overview" && (
            <>
              <div className="grid four admin-metrics">
                {[
                  ["Users", "128", "users"],
                  ["Bookings", "34", "calendar"],
                  ["Bills", "$18.4K", "bill"],
                  ["OTP Queue", "7", "mail"],
                ].map(([label, value, icon]) => (
                  <article className="card" key={label}><div className="card-icon"><Icon name={icon} /></div><strong className="price">{value}</strong><p>{label} ready for MongoDB collection data.</p></article>
                ))}
              </div>
              <SettingsPanel />
            </>
          )}
          {tab === "Users" && <DataTable columns={["Name", "Company", "Role", "Status"]} rows={users} />}
          {tab === "Bookings" && <DataTable columns={["Company", "Service", "Date", "Status"]} rows={bookings} />}
          {tab === "Bills" && <DataTable columns={["Invoice", "Company", "Amount", "Status"]} rows={bills} />}
          {tab === "Settings" && <SettingsPanel />}
        </div>
      </section>
    </>
  );
}
