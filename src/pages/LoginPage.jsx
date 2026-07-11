import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { useAuth } from "../context/useAuth";
import { navigate } from "../utils/router";

export function LoginPage() {
  const { login, sessionMessage, clearSessionMessage } = useAuth();
  const location = useLocation();
  const routerNavigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("Checking...");

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setStatusText("Checking...");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const startupNotice = window.setTimeout(() => {
      setStatusText("Starting server...");
    }, 3500);

    try {
      const data = await login({ email: form.get("email"), password: form.get("password") });
      const from = typeof location.state?.from === "string" && location.state.from.startsWith("/") ? location.state.from : "";
      routerNavigate(from || (["admin", "employee"].includes(data.user?.role) ? "/admin-dashboard" : "/user-dashboard"), { replace: true });
    } catch (err) {
      setError(err.isTimeout ? "Starting server... Please try again in a moment." : err.message || "Login failed");
    } finally {
      window.clearTimeout(startupNotice);
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Login" />
      <section className="auth-wrap">
        <form className="auth-card" onSubmit={submit}>
          <span className="eyebrow">Secure client portal</span>
          <h1>Login</h1>
          {sessionMessage && <div className="form-error" role="alert">{sessionMessage}<button type="button" className="message-close" onClick={clearSessionMessage} aria-label="Dismiss message">x</button></div>}
          <label>Email<input name="email" type="email" placeholder="you@company.com" required /></label>
          <label>Password<input name="password" type="password" placeholder="Password" required /></label>
          <Button type="submit" icon="lock" disabled={loading}>{loading ? statusText : "Login"}</Button>
          {error && <div className="form-error">{error}</div>}
          <p className="auth-link-actions">
            <button type="button" className="learn" onClick={() => navigate("/forgot-password")}>Forgot password?</button>
            <button type="button" className="learn" onClick={() => navigate("/signup")}>Create account</button>
          </p>
        </form>
      </section>
    </>
  );
}
