import { useState } from "react";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { authApi } from "../services/api";
import { navigate } from "../utils/router";
import { getPendingEmail, savePendingEmail } from "./auth/authStorage";

export function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pendingEmail = getPendingEmail();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = form.get("email");

    try {
      await authApi.forgotPassword({ email });
      savePendingEmail(email);
      navigate("/reset-password");
    } catch (err) {
      setError(err.message || "Could not send reset OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Forgot password" />
      <section className="auth-wrap">
        <form className="auth-card" onSubmit={submit}>
          <span className="eyebrow">Secure client portal</span>
          <h1>Forgot password</h1>
          <label>Email<input name="email" type="email" placeholder="you@company.com" defaultValue={pendingEmail} required /></label>
          <Button type="submit" icon="mail">{loading ? "Sending..." : "Send reset OTP"}</Button>
          {error && <div className="form-error">{error}</div>}
          <p>
            <button type="button" className="learn" onClick={() => navigate("/login")}>Back to login</button>
            {" "}
            <button type="button" className="learn" onClick={() => navigate("/reset-password")}>I already have an OTP</button>
          </p>
        </form>
      </section>
    </>
  );
}
