import { useEffect, useState } from "react";
import { blogPosts, caseStudies, company, faqs, industries, packages, services, teamProfiles } from "../data/siteData";
import { Button } from "../components/Button";
import { Card, CTA, PageHero, SectionHeader } from "../components/Sections";
import { Icon } from "../components/icons";
import { SEO } from "../components/SEO";
import { navigate } from "../utils/router";
import { useAuth } from "../context/useAuth";
import { bookingApi, contactApi, dashboardApi } from "../services/api";

const workflowSteps = ["Customer Calls", "ZMH Answers", "Appointment Scheduled", "Technician Dispatched", "Job Completed", "Invoice Sent", "Customer Follow-up"];
const aboutServices = ["Live customer call handling", "Appointment scheduling", "Dispatch coordination", "CRM management", "Customer follow-ups", "Lead qualification", "Administrative support", "Job tracking", "Reporting and workflow management"];
const coreValues = [
  ["Ownership", "We treat every client's business as if it were our own. Every call, appointment, and customer interaction matters."],
  ["Reliability", "Consistency builds trust. We follow standardized processes to ensure dependable service every day."],
  ["Transparency", "Clear communication, measurable performance, and honest reporting are fundamental to every client relationship."],
  ["Continuous Improvement", "Operational excellence comes from constant refinement. We monitor performance, analyze workflows, and improve our processes continuously."],
  ["Partnership", "We become an extension of your team, working toward the same goals and sharing in your success."]
];
const chooseZmh = ["Never miss valuable customer calls", "Improve scheduling efficiency", "Reduce administrative workload", "Increase technician productivity", "Enhance customer satisfaction", "Scale operations without significantly increasing overhead"];

export function ServicesPage() {
  return <><SEO title="Services" /><PageHero eyebrow="Services" title="Remote operations services for every customer touchpoint" text="Choose focused support or combine services into a complete remote operations department." secondary={{ label: "View Pricing", to: "/pricing" }} /><section><div className="grid three">{services.map((item) => <Card key={item.slug} icon={item.icon} title={item.name} text={item.summary}><button className="learn" onClick={() => navigate("/services/" + item.slug)}>Open service</button></Card>)}</div></section><CTA /></>;
}

export function ServiceDetail({ service }) {
  return <><SEO title={service.name} /><PageHero eyebrow="Service" title={service.name + " for home service operators"} text={service.summary} secondary={{ label: "All Services", to: "/services" }} /><section className="split"><div><SectionHeader eyebrow="Benefits" title="Operational outcomes" /><div className="check-list">{service.benefits.map((item) => <span key={item}>{item}</span>)}</div></div><div><SectionHeader eyebrow="Features" title="What is included" /><div className="check-list">{service.features.map((item) => <span key={item}>{item}</span>)}</div></div></section><section><SectionHeader eyebrow="Workflow" title="From intake to clean handoff" /><ol className="timeline"><li>Define scripts and SOPs</li><li>Answer or process the request</li><li>Document in CRM</li><li>Escalate if needed</li><li>Report outcomes</li></ol></section><section><SectionHeader eyebrow="FAQ" title={"Questions about " + service.name} /><div className="accordion">{faqs.slice(0, 4).map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section><CTA /></>;
}

export function IndustriesPage() {
  return <><SEO title="Industries" /><PageHero eyebrow="Industries" title="Remote support for field-service teams with real operational pressure" text="Every industry page includes problems, solutions, benefits, services, and a practical case-study model." /><section><div className="grid three">{industries.map((item) => <Card key={item.slug} title={item.name} text={item.problems[0]}><button className="learn" onClick={() => navigate("/industries/" + item.slug)}>View industry</button></Card>)}</div></section><CTA /></>;
}

export function IndustryDetail({ industry }) {
  return <><SEO title={industry.name} /><PageHero eyebrow="Industry" title={industry.name + " operations support"} text={"ZMH helps " + industry.name + " teams protect missed revenue, speed up communication, and keep jobs moving."} secondary={{ label: "All Industries", to: "/industries" }} /><section className="split"><div><SectionHeader eyebrow="Problems" title="Where teams lose time" /><div className="check-list warn">{industry.problems.map((item) => <span key={item}>{item}</span>)}</div></div><div><SectionHeader eyebrow="How ZMH Solves It" title="Structured remote support" /><div className="check-list">{industry.solutions.map((item) => <span key={item}>{item}</span>)}</div></div></section><section><SectionHeader eyebrow="Benefits" title="What improves" /><div className="grid four">{industry.benefits.map((item) => <Card key={item} title={item} text="Designed for measurable operational lift." />)}</div></section><section><SectionHeader eyebrow="Case Study" title={industry.name + " operations example"} /><div className="premium-panel"><h3>Remote operations pilot</h3><p>ZMH documents call types, routes urgent requests, keeps job records clean, and creates reporting that leadership can act on.</p></div></section><CTA /></>;
}

export function PricingPage() {
  return <><SEO title="Pricing" /><PageHero eyebrow="Packages" title="Flexible operations support packages" text="Choose the package that matches your call volume, scheduling complexity, and operational support needs." /><section><div className="grid four">{packages.map((item) => <Card key={item.slug} title={item.name} text={item.bestFor}><strong className="price">{item.price}</strong><ul>{item.features.map((f) => <li key={f}>{f}</li>)}</ul><button className="learn" onClick={() => navigate("/pricing/" + item.slug)}>Package details</button></Card>)}</div></section><CTA /></>;
}

export function PackageDetail({ plan }) {
  return <><SEO title={plan.name + " Package"} /><PageHero eyebrow="Package" title={plan.name + " operations package"} text={plan.bestFor} secondary={{ label: "Compare Packages", to: "/pricing" }} /><section className="split"><div><SectionHeader eyebrow="Included" title="Core features" /><div className="check-list">{plan.features.map((item) => <span key={item}>{item}</span>)}</div></div><div className="premium-panel"><h3>Monthly pricing</h3><strong className="price">{plan.price}</strong><p>Connect backend quoting later for dynamic prices, add-ons, and contract terms.</p></div></section><section><SectionHeader eyebrow="Add-ons" title="Expand when ready" /><div className="pills">{["After-hours", "Dedicated supervisor", "Advanced reports", "CRM integration", "SOP buildout"].map((item) => <span key={item}>{item}</span>)}</div></section><CTA /></>;
}

export function HowItWorks() {
  return <><SEO title="How It Works" /><PageHero eyebrow="Workflow" title="A clean operating rhythm from first call to follow-up" text="The ZMH model turns scattered requests into documented, trackable work." /><section><ol className="timeline large">{workflowSteps.map((item, index) => <li key={item}>{item}{index < workflowSteps.length - 1 && <span>Next</span>}</li>)}</ol></section><CTA /></>;
}

export function About() {
  return <><SEO title="About ZMH USA Corp." description="About ZMH USA Corp., a remote operations partner for home service businesses." /><PageHero eyebrow="About ZMH USA Corp." title="We do not just answer calls. We keep businesses running." text="Every growing home service business deserves a world-class operations team without the cost and complexity of building one in-house." /><section className="split"><div><SectionHeader eyebrow="Our Story" title="Built for service businesses that are ready to grow" /><p className="lead">ZMH USA Corp. was founded with a simple observation: contractors, property managers, and field service companies excel at their trade, but many struggle with the day-to-day operational demands that come with growth.</p><p>Missed calls, delayed scheduling, unorganized dispatching, inconsistent customer communication, and administrative overload can limit a company's ability to scale. That is where we come in.</p><p>ZMH USA Corp. serves as a dedicated Remote Operations Partner for home service businesses across the United States. We combine a trusted U.S. business presence with a highly trained operations team in Bangladesh to deliver efficient, responsive, and cost-effective operational support.</p></div><div className="premium-panel"><h3>The team behind your team</h3><p>Our clients stay focused on what they do best - serving customers in the field - while we manage the operational backbone that keeps their business moving.</p></div></section><section><SectionHeader eyebrow="What We Do" title="Operational support that becomes an extension of your company" text="We do not replace your technicians. We empower them by ensuring every customer interaction is managed professionally and every opportunity is followed through." /><div className="check-list columns">{aboutServices.map((item) => <span key={item}>{item}</span>)}</div></section><section className="split"><div><SectionHeader eyebrow="Hybrid Operating Model" title="The best of local oversight and global execution" /><p>Our strength lies in combining the best of two worlds: U.S. client oversight with a disciplined Bangladesh operations center.</p></div><div className="grid two"><Card title="United States Presence" text="Our U.S. representative provides local business oversight, client relationships, and strategic support, ensuring accountability and clear communication for every client." /><Card title="Bangladesh Operations Center" text="Our Bangladesh operations team manages daily workflows, customer interactions, scheduling, dispatch coordination, CRM updates, and administrative processes using standardized operating procedures and modern cloud-based systems." /></div></section><TeamSection /><section className="grid two"><div className="premium-panel"><span className="eyebrow">Our Mission</span><h2>Reliable, scalable operations support</h2><p>To become the most trusted remote operations partner for home service businesses by helping contractors and service companies grow through reliable, scalable, and process-driven operational support.</p></div><div className="premium-panel"><span className="eyebrow">Our Vision</span><h2>Infrastructure for stronger service companies</h2><p>To build the operational infrastructure that powers thousands of small and medium-sized service businesses across North America, allowing business owners to spend less time managing paperwork and more time growing their companies.</p></div></section><section><SectionHeader eyebrow="Our Core Values" title="How we show up for every client" /><div className="grid three">{coreValues.map(([title, text]) => <Card key={title} title={title} text={text} />)}</div></section><section className="split"><div><SectionHeader eyebrow="Why Businesses Choose ZMH USA Corp." title="More than virtual assistants or call answering" /><p>We deliver a structured operations system that helps businesses improve communication, protect revenue opportunities, and scale without significantly increasing overhead.</p><div className="check-list">{chooseZmh.map((item) => <span key={item}>{item}</span>)}</div></div><div className="premium-panel"><h3>Built for long-term partnerships</h3><p>At ZMH USA Corp., our success is measured by the success of our clients. We aim to build long-term partnerships founded on trust, accountability, and operational excellence.</p><p>Whether you are an independent contractor or a growing multi-location service company, our goal is simple: to become the team behind your team, helping your business operate more efficiently every day.</p></div></section><CTA /></>;
}

function TeamSection() {
  return <section id="team"><SectionHeader eyebrow="Leadership & Stakeholders" title="The people structure behind ZMH USA Corp." text="Founder and stakeholder profiles show the leadership responsibilities behind client delivery and operations quality." /><div className="team-grid">{teamProfiles.map((profile) => <article className="team-card reveal" key={profile.slug}><button className="team-profile-link" type="button" onClick={() => navigate("/team/" + profile.slug)}><span className="team-avatar">{profile.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span><span><strong>{profile.name}</strong><small>{profile.role}</small></span></button><p>{profile.summary}</p><div className="team-card-actions"><button className="learn" type="button" onClick={() => navigate("/team/" + profile.slug)}>View profile</button><a className="linkedin-button" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label={"Open " + profile.name + " on LinkedIn"} title="LinkedIn"><Icon name="linkedin" size={18} /></a></div></article>)}</div></section>;
}

export function TeamPage() {
  return <><SEO title="Leadership & Stakeholders" description="Founder and stakeholder profiles for ZMH USA Corp." /><PageHero eyebrow="Team" title="Founder and stakeholder profiles" text="Meet the people structure behind ZMH USA Corp. and the operating responsibilities that support client delivery." image={false} /><TeamSection /><CTA /></>;
}

export function TeamProfile({ profile }) {
  return <><SEO title={profile.name} description={profile.summary} /><PageHero eyebrow={profile.role} title={profile.name} text={profile.summary} image={false} secondary={{ label: "Back to About", to: "/about" }} /><section className="split"><div><SectionHeader eyebrow="Profile" title="Professional background" /><p className="lead">{profile.bio}</p><p><strong>Location:</strong> {profile.location}</p><a className="profile-linkedin" href={profile.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={20} /> LinkedIn profile</a></div><div><SectionHeader eyebrow="Focus Areas" title="Where this profile contributes" /><div className="check-list">{profile.focus.map((item) => <span key={item}>{item}</span>)}</div></div></section><CTA /></>;
}

export function CaseStudies() {
  return <><SEO title="Case Studies" /><PageHero eyebrow="Proof" title="Operational outcomes by service area" text="Selected examples of how disciplined remote operations support can improve field-service workflows." /><section><div className="case-timeline">{caseStudies.map((item) => <article key={item.title}><span>{item.metric}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section></>;
}

export function FAQ() {
  return <><SEO title="FAQ" /><PageHero eyebrow="FAQ" title="Answers before your operations audit" text="Fast answers about coverage, CRMs, dispatch, security, SOPs, and scaling." image={false} /><section><div className="accordion">{faqs.map(([q, a]) => <details key={q} open={q.includes("accent")}><summary>{q}</summary><p>{a}</p></details>)}</div></section></>;
}

export function Contact() {
  return <><SEO title="Contact" /><PageHero eyebrow="Contact" title="Talk with an operations specialist" text="Use the form, email, or phone number to start your operations audit." /><section className="split"><div className="premium-panel"><h3>Business Information</h3><p>{company.phone}</p><p>{company.email}</p><p>{company.address}</p></div><ContactForm /></section></>;
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setSent(false);
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await contactApi.send(Object.fromEntries(form.entries()));
      event.currentTarget.reset();
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not send inquiry.");
    } finally {
      setLoading(false);
    }
  };
  return <form className="form-card" onSubmit={submit}><h3>Contact Form</h3>{["Name", "Company", "Email", "Phone"].map((item) => <label key={item}>{item}<input name={item.toLowerCase()} required={item !== "Phone" && item !== "Company"} type={item === "Email" ? "email" : "text"} placeholder={item} /></label>)}<label>Message<textarea name="message" required placeholder="Tell us what you need..." /></label><Button type="submit" icon="mail">{loading ? "Sending..." : "Send Inquiry"}</Button>{sent && <div className="success">Thanks. Your inquiry has been received.</div>}{error && <div className="form-error">{error}</div>}</form>;
}

export function Blog() {
  return <><SEO title="Blog" /><PageHero eyebrow="Resources" title="Operations insights for home service leaders" text="Articles, playbooks, and growth guides for better service operations." /><section><div className="grid two">{blogPosts.map((post) => <Card key={post} title={post} text="Practical guidance for improving calls, scheduling, CRM hygiene, and customer follow-up." />)}</div></section></>;
}

export function Careers() {
  return <><SEO title="Careers" /><PageHero eyebrow="Careers" title="Join a team building better remote operations" text="Explore roles focused on reliable client support and disciplined operations delivery." /><section><div className="grid three">{["Operations Specialist", "Client Success Manager", "Quality Analyst"].map((job) => <Card key={job} title={job} text="Remote-friendly role supporting home service clients with documented processes and quality standards." />)}</div></section></>;
}

export function Legal({ type }) {
  const title = type || "Privacy Policy";
  return <><SEO title={title} /><PageHero eyebrow="Legal" title={title} text="Current policy information for website visitors and client portal users." image={false} /><section className="legal"><h2>{title}</h2><p>ZMH USA Corp. uses submitted information to respond to inquiries, manage client accounts, process booking requests, and provide operational support services.</p><p>Last updated: June 30, 2026.</p></section></>;
}

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

export function BookService() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);
  const [booking, setBooking] = useState({ services: [], requestedDate: "" });
  const labels = ["Company Information", "Select Services", "Business Hours", "CRM", "Select Date", "Review"];

  const updateField = (field, value) => setBooking((current) => ({ ...current, [field]: value }));
  const toggleService = (name) => setBooking((current) => ({ ...current, services: current.services.includes(name) ? current.services.filter((item) => item !== name) : [...current.services, name] }));
  const continueFlow = async (event) => {
    event.preventDefault();
    if (step === 6) {
      setLoading(true);
      setError("");
      try {
        const data = await bookingApi.create(booking);
        setCreatedBooking(data.booking);
        setSubmitted(true);
      } catch (err) {
        setError(err.message || "Could not submit booking.");
      } finally {
        setLoading(false);
      }
      return;
    }
    setStep((value) => Math.min(6, value + 1));
  };

  return <><SEO title="Book Service" /><section className="booking"><div className="wizard"><div className="wizard-steps">{labels.map((label, index) => <button type="button" key={label} title={label} className={step === index + 1 ? "active" : ""} onClick={() => setStep(index + 1)}>{index + 1}</button>)}</div><form className="form-card" onSubmit={continueFlow}><span className="eyebrow">Step {step} of 6</span><h1>{labels[step - 1]}</h1>{step === 1 && ["Company Name", "Business Type", "Employees", "Website", "Phone", "Address"].map((item) => <label key={item}>{item}<input value={booking[item] || ""} onChange={(event) => updateField(item, event.target.value)} placeholder={item} required={item !== "Website"} /></label>)}{step === 2 && services.slice(0, 8).map((item) => <label key={item.slug} className="checkbox"><input type="checkbox" checked={booking.services.includes(item.name)} onChange={() => toggleService(item.name)} /> {item.name}</label>)}{step === 3 && <><label>Opening Hours<input value={booking.hours || ""} onChange={(event) => updateField("hours", event.target.value)} placeholder="Mon-Fri 8am-5pm" /></label><label>After Hours Needs<textarea value={booking.afterHours || ""} onChange={(event) => updateField("afterHours", event.target.value)} /></label></>}{step === 4 && <><label>Current CRM<input value={booking.crm || ""} onChange={(event) => updateField("crm", event.target.value)} placeholder="ServiceTitan, Housecall Pro, Jobber..." /></label><label>Integration Notes<textarea value={booking.integrationNotes || ""} onChange={(event) => updateField("integrationNotes", event.target.value)} /></label></>}{step === 5 && <label>Preferred Booking Date<input type="date" value={booking.requestedDate || ""} min={new Date().toISOString().slice(0, 10)} onChange={(event) => updateField("requestedDate", event.target.value)} required /></label>}{step === 6 && <div className="review-box"><p><strong>Company:</strong> {booking["Company Name"] || "Not entered"}</p><p><strong>Services:</strong> {booking.services.length ? booking.services.join(", ") : "No services selected"}</p><p><strong>Date:</strong> {booking.requestedDate || "No date selected"}</p><p><strong>Hours:</strong> {booking.hours || "Not entered"}</p><p><strong>CRM:</strong> {booking.crm || "Not entered"}</p></div>}{submitted && <div className="success">Booking submitted. Admin will review and respond in your client portal.{createdBooking?.requestedDate ? " Requested date: " + new Date(createdBooking.requestedDate).toLocaleDateString() + "." : ""}</div>}{error && <div className="form-error">{error}</div>}<div className="wizard-actions">{step > 1 && !submitted && <button type="button" className="ghost-small" onClick={() => setStep((value) => Math.max(1, value - 1))}>Back</button>}<Button type="submit" icon="arrow">{loading ? "Submitting..." : step === 6 ? "Submit Booking" : "Continue"}</Button></div></form></div></section></>;
}

export function NotFound() {
  return <><SEO title="404" /><section className="not-found"><h1>404</h1><p>This page is not available.</p><Button to="/">Return Home</Button></section></>;
}
