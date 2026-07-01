import { useState } from "react";
import { company } from "../data/siteData";
import { Button } from "../components/Button";
import { PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";
import { contactApi } from "../services/api";

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
