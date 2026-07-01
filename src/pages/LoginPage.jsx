import { useState } from "react";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { useAuth } from "../context/useAuth";
import { navigate } from "../utils/router";

export function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const data = await login({ email: form.get("email"), password: form.get("password") });
      navigate(data.user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
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
          <label>Email<input name="email" type="email" placeholder="you@company.com" required /></label>
          <label>Password<input name="password" type="password" placeholder="Password" required /></label>
          <Button type="submit" icon="lock">{loading ? "Checking..." : "Login"}</Button>
          {error && <div className="form-error">{error}</div>}
          <p>
            <button type="button" className="learn" onClick={() => navigate("/forgot-password")}>Forgot password?</button>
            {" "}
            <button type="button" className="learn" onClick={() => navigate("/signup")}>Create account</button>
          </p>
        </form>
      </section>
    </>
  );
}
