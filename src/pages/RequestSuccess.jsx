import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";

export function RequestSuccess() {
  const { search } = useLocation();
  const type = useMemo(() => new URLSearchParams(search).get("type"), [search]);
  const isBooking = type === "booking";

  return (
    <>
      <SEO title={isBooking ? "Booking Submitted" : "Inquiry Submitted"} />
      <section className="section">
        <div className="form-card inline">
          <span className="eyebrow">{isBooking ? "Booking" : "Inquiry"}</span>
          <h1>{isBooking ? "Booking submitted successfully" : "Inquiry submitted successfully"}</h1>
          <p>{isBooking ? "Your booking request has been received. Our team will review it and contact you with the next step." : "Your inquiry has been received. Our team will review your message and respond as soon as possible."}</p>
          <div className="wizard-actions">
            <Button to={isBooking ? "/bookings" : "/contact"} icon="arrow">{isBooking ? "View Bookings" : "Back to Contact"}</Button>
            <Button to="/" variant="secondary">Go Home</Button>
          </div>
        </div>
      </section>
    </>
  );
}
