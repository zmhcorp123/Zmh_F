import { useState } from "react";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { authApi } from "../services/api";
import { navigate } from "../utils/router";
import { PasswordStrength } from "./auth/PasswordStrength";
import { getPendingEmail } from "./auth/authStorage";

export function ResetPasswordPage() {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const pendingEmail = getPendingEmail();

  const submit = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      await authApi.resetPassword({ email: form.get("email"), otp: form.get("otp"), password: form.get("password") });
      setNotice("Password updated. You can log in after your account is approved.");
    } catch (err) {
      setError(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Reset password" />
      <section className="auth-wrap">
        <form className="auth-card" onSubmit={submit}>
          <span className="eyebrow">Secure client portal</span>
          <h1>Reset password</h1>
          <label>Email<input name="email" type="email" placeholder="you@company.com" defaultValue={pendingEmail} required /></label>
          <label>OTP Code<input name="otp" inputMode="numeric" placeholder="000000" required /></label>
          <label>Password<input name="password" type="password" placeholder="New password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <PasswordStrength password={password} />
          <Button type="submit" icon="lock">{loading ? "Updating..." : "Reset password"}</Button>
          {notice && <div className="success">{notice}</div>}
          {error && <div className="form-error">{error}</div>}
          <p><button type="button" className="learn" onClick={() => navigate("/login")}>Back to login</button></p>
        </form>
      </section>
    </>
  );
}
