import { useEffect, useState } from "react";
import { services } from "../data/siteData";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { bookingApi } from "../services/api";
import { navigate } from "../utils/router";
import { useAuth } from "../context/useAuth";

const operatingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const afterHoursOptions = ["No after-hours", "Evening calls", "Weekend coverage", "Emergency calls", "Overflow support"];

export function BookService() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);
  const [booking, setBooking] = useState({ services: [], requestedDate: "" });

  useEffect(() => {
    if (!user) return;
    setBooking((current) => ({ ...current, "Company Name": user.company || user.name || "", Email: user.email || "", Phone: user.phone || "" }));
  }, [user]);

  const updateField = (field, value) => setBooking((current) => ({ ...current, [field]: value }));
  const toggleService = (name) => setBooking((current) => ({ ...current, services: current.services.includes(name) ? current.services.filter((item) => item !== name) : [...current.services, name] }));
  const selectOption = (field, value) => setBooking((current) => ({ ...current, [field]: value }));
  const selectOperatingDay = (day) => setBooking((current) => {
    const [startDay, endDay] = current.operatingDayList || [];
    let nextDays;
    if (!startDay || (startDay && endDay)) nextDays = [day];
    else if (startDay === day) nextDays = [];
    else nextDays = [startDay, day];
    return {
      ...current,
      operatingDayList: nextDays,
      operatingDays: nextDays.length === 2 ? `${nextDays[0]} - ${nextDays[1]}` : nextDays[0] || "",
    };
  });
  const updateOfficeHours = (field, value) => setBooking((current) => {
    const next = { ...current, [field]: value, allDayCoverage: false };
    next.hours = next.openTime && next.closeTime ? `${next.openTime}-${next.closeTime}` : "";
    return next;
  });
  const toggleAllDayCoverage = () => setBooking((current) => ({
    ...current,
    allDayCoverage: !current.allDayCoverage,
    openTime: "",
    closeTime: "",
    hours: !current.allDayCoverage ? "24/7 coverage" : "",
  }));

  const submitBooking = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setLoading(true);
    setError("");
    if (booking.operatingDayList?.length !== 2 || !booking.hours || !booking.afterHours) {
      setError("Select a start day and an end day, office hours, and after-hours needs.");
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
                <label key={item}>{item}<input type={item === "Email" ? "email" : "text"} value={booking[item] || ""} onChange={(event) => updateField(item, event.target.value)} placeholder={item} required={!["Website"].includes(item)} readOnly={Boolean(user && ["Company Name", "Email", "Phone"].includes(item))} /></label>
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
                <small>{booking.operatingDayList?.length === 2 ? `Start: ${booking.operatingDayList[0]} · End: ${booking.operatingDayList[1]}` : booking.operatingDayList?.[0] ? `Start: ${booking.operatingDayList[0]} · Now select the end day` : "Select the start day, then the end day."}</small>
                <div className="tap-options day-options">{operatingDays.map((day) => <button type="button" key={day} className={booking.operatingDayList?.includes(day) ? "selected" : ""} onClick={() => selectOperatingDay(day)}>{day}</button>)}</div>
              </div>
              <div className="tap-field">
                <span>Office Hours</span>
                <div className="office-hours-picker">
                  <label>Open<input type="time" value={booking.openTime || ""} onChange={(event) => updateOfficeHours("openTime", event.target.value)} disabled={booking.allDayCoverage} /></label>
                  <label>Close<input type="time" value={booking.closeTime || ""} onChange={(event) => updateOfficeHours("closeTime", event.target.value)} disabled={booking.allDayCoverage} /></label>
                  <button type="button" className={booking.allDayCoverage ? "selected" : ""} onClick={toggleAllDayCoverage}>24/7 coverage</button>
                </div>
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
