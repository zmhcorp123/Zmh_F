import { useState } from "react";
import { services } from "../data/siteData";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { bookingApi } from "../services/api";
import { navigate } from "../utils/router";

const operatingDayOptions = ["Monday-Friday", "Monday-Saturday", "Weekends only", "Every day"];
const hourOptions = ["8 AM-5 PM", "9 AM-6 PM", "10 AM-7 PM", "24/7 coverage"];
const afterHoursOptions = ["No after-hours", "Evening calls", "Weekend coverage", "Emergency calls", "Overflow support"];

export function BookService() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);
  const [booking, setBooking] = useState({ services: [], requestedDate: "" });

  const updateField = (field, value) => setBooking((current) => ({ ...current, [field]: value }));
  const toggleService = (name) => setBooking((current) => ({ ...current, services: current.services.includes(name) ? current.services.filter((item) => item !== name) : [...current.services, name] }));
  const selectOption = (field, value) => setBooking((current) => ({ ...current, [field]: value }));

  const submitBooking = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setLoading(true);
    setError("");
    if (!booking.operatingDays || !booking.hours || !booking.afterHours) {
      setError("Select operating days, opening hours, and after-hours needs.");
      setLoading(false);
      return;
    }
    try {
      const data = await bookingApi.create(booking);
      setCreatedBooking(data.booking);
      setSubmitted(true);
      form.reset();
      setBooking({ services: [], requestedDate: "" });
      navigate("/request-success?type=booking");
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
              {["Company Name", "Email", "Business Type", "Website", "Phone", "Address"].map((item) => (
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
              <label>Current CRM<input value={booking.crm || ""} onChange={(event) => updateField("crm", event.target.value)} placeholder="ServiceTitan, Housecall Pro, Jobber..." /></label>
              <label>Preferred Booking Date<input type="date" value={booking.requestedDate || ""} min={new Date().toISOString().slice(0, 10)} onChange={(event) => updateField("requestedDate", event.target.value)} required /></label>
            </div>
            <div className="tap-field-grid">
              <div className="tap-field">
                <span>Operating Days</span>
                <div className="tap-options">{operatingDayOptions.map((option) => <button type="button" key={option} className={booking.operatingDays === option ? "selected" : ""} onClick={() => selectOption("operatingDays", option)}>{option}</button>)}</div>
              </div>
              <div className="tap-field">
                <span>Opening Hours</span>
                <div className="tap-options">{hourOptions.map((option) => <button type="button" key={option} className={booking.hours === option ? "selected" : ""} onClick={() => selectOption("hours", option)}>{option}</button>)}</div>
              </div>
              <div className="tap-field">
                <span>After Hours Needs</span>
                <div className="tap-options">{afterHoursOptions.map((option) => <button type="button" key={option} className={booking.afterHours === option ? "selected" : ""} onClick={() => selectOption("afterHours", option)}>{option}</button>)}</div>
              </div>
            </div>
            <div className="form-grid compact two-column">
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
