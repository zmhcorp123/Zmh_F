import { useEffect, useState } from "react";
import { company } from "../data/siteData";
import { Button } from "../components/Button";
import { PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";
import { contactApi, settingsApi } from "../services/api";

export function Contact() {
  const [companyDetails, setCompanyDetails] = useState({ officePhone: company.phone, officeAddress: company.address });

  useEffect(() => {
    let active = true;
    settingsApi.company().then((data) => {
      if (active && data.companyDetails) setCompanyDetails((current) => ({ ...current, ...data.companyDetails }));
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const contactRows = [
    ["Phone", companyDetails.officePhone],
    ["Sales", company.emails.sales],
    ["Support", company.emails.support],
    ["Office", companyDetails.officeAddress]
  ];

  return <><SEO title="Contact" /><PageHero eyebrow="Contact" title="Talk with an operations specialist" text="Use the form, email, or phone number to start your operations audit." /><section className="split contact-page-grid"><div className="premium-panel contact-info-panel"><span className="eyebrow">Business Information</span><h3>Built for fast operational handoffs.</h3><p>Send the details once and our team will route your request to sales, support, billing, or onboarding without making you repeat context.</p><div className="contact-detail-grid">{contactRows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><Button to="/book-meeting" icon="calendar">Book Free Operations Audit</Button></div><ContactForm /></section></>;
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
