import { useState } from "react";
import { services } from "../data/siteData";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { bookingApi } from "../services/api";

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
