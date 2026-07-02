import { useState } from "react";
import { services } from "../data/siteData";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { bookingApi } from "../services/api";
import { navigate } from "../utils/router";

export function BookService() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);
  const [booking, setBooking] = useState({ services: [], requestedDate: "" });

  const updateField = (field, value) => setBooking((current) => ({ ...current, [field]: value }));
  const toggleService = (name) => setBooking((current) => ({ ...current, services: current.services.includes(name) ? current.services.filter((item) => item !== name) : [...current.services, name] }));

  const submitBooking = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await bookingApi.create(booking);
      setCreatedBooking(data.booking);
      setSubmitted(true);
      navigate("/");
    } catch (err) {
      setError(err.message || "Could not submit booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Book Service" />
      <section className="booking single-booking-page">
        <form className="form-card single-booking-form" onSubmit={submitBooking}>
          <span className="eyebrow">Book Service</span>
          <h1>Book your operations audit</h1>
          <p>Share the key details once. Our team will review your request and follow up with the right next step.</p>

          <div className="booking-form-section">
            <h3>Company Information</h3>
            <div className="form-grid compact">
              {["Company Name", "Email", "Business Type", "Employees", "Website", "Phone", "Address"].map((item) => (
                <label key={item}>{item}<input type={item === "Email" ? "email" : "text"} value={booking[item] || ""} onChange={(event) => updateField(item, event.target.value)} placeholder={item} required={!["Website"].includes(item)} /></label>
              ))}
            </div>
          </div>

          <div className="booking-form-section">
            <h3>Select Services</h3>
            <div className="single-service-grid">
              {services.slice(0, 8).map((item) => <label key={item.slug} className="checkbox"><input type="checkbox" checked={booking.services.includes(item.name)} onChange={() => toggleService(item.name)} /> <span>{item.name}</span></label>)}
            </div>
          </div>

          <div className="booking-form-section">
            <h3>Operations Details</h3>
            <div className="form-grid compact">
              <label>Opening Hours<input value={booking.hours || ""} onChange={(event) => updateField("hours", event.target.value)} placeholder="Mon-Fri 8am-5pm" /></label>
              <label>Current CRM<input value={booking.crm || ""} onChange={(event) => updateField("crm", event.target.value)} placeholder="ServiceTitan, Housecall Pro, Jobber..." /></label>
              <label>Preferred Booking Date<input type="date" value={booking.requestedDate || ""} min={new Date().toISOString().slice(0, 10)} onChange={(event) => updateField("requestedDate", event.target.value)} required /></label>
            </div>
            <div className="form-grid compact two-column">
              <label>After Hours Needs<textarea value={booking.afterHours || ""} onChange={(event) => updateField("afterHours", event.target.value)} placeholder="Tell us about evening, weekend, or emergency coverage needs." /></label>
              <label>Integration Notes<textarea value={booking.integrationNotes || ""} onChange={(event) => updateField("integrationNotes", event.target.value)} placeholder="Share CRM, phone, calendar, dispatch, or workflow notes." /></label>
            </div>
          </div>

          {submitted && <div className="success">Booking submitted. Redirecting to the home page.{createdBooking?.requestedDate ? " Requested date: " + new Date(createdBooking.requestedDate).toLocaleDateString() + "." : ""}</div>}
          {error && <div className="form-error">{error}</div>}
          <div className="wizard-actions"><Button type="submit" icon="arrow">{loading ? "Submitting..." : "Submit Booking"}</Button></div>
        </form>
      </section>
    </>
  );
}
