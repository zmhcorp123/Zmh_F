import { useState } from "react";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { authApi } from "../services/api";
import { navigate } from "../utils/router";
import { clearPendingEmail, getPendingEmail, savePendingEmail } from "./auth/authStorage";

export function OtpVerificationPage() {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pendingEmail = getPendingEmail();

  const submit = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = form.get("email");

    try {
      const data = await authApi.verifyOtp({ email, otp: form.get("otp"), purpose: "signup" });
      clearPendingEmail();
      setNotice(data.message || "Email verified. Your account is waiting for admin approval.");
      navigate("/");
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setNotice("");
    setError("");
    const email = document.querySelector("input[name='email']")?.value || pendingEmail;
    if (!email) {
      setError("Enter your email before requesting another OTP.");
      return;
    }

    try {
      await authApi.resendOtp({ email, purpose: "signup" });
      savePendingEmail(email);
      setNotice("A new OTP was sent to your email.");
    } catch (err) {
      setError(err.message || "Could not resend OTP");
    }
  };

  return (
    <>
      <SEO title="Verify OTP" />
      <section className="auth-wrap">
        <form className="auth-card" onSubmit={submit}>
          <span className="eyebrow">Email verification</span>
          <h1>Verify OTP</h1>
          <label>Email<input name="email" type="email" placeholder="you@company.com" defaultValue={pendingEmail} required /></label>
          <label>OTP Code<input name="otp" inputMode="numeric" placeholder="000000" required /></label>
          <Button type="submit" icon="lock">{loading ? "Verifying..." : "Verify OTP"}</Button>
          <button type="button" className="ghost-small wide" onClick={resendOtp}>Resend OTP</button>
          <div className="inline-note">After verification, an admin must approve your account before you can login.</div>
          {notice && <div className="success">{notice}</div>}
          {error && <div className="form-error">{error}</div>}
          <p><button type="button" className="learn" onClick={() => navigate("/login")}>Go to login</button></p>
        </form>
      </section>
    </>
  );
}
