import { useState } from "react";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { authApi } from "../services/api";
import { navigate } from "../utils/router";
import { countries, countryByCode } from "../data/countries";
import { PasswordStrength } from "./auth/PasswordStrength";
import { savePendingEmail } from "./auth/authStorage";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const selectedCountry = countryByCode(countryCode);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    const phoneLocal = String(form.get("phone") || "").trim().replace(new RegExp("^\\s*" + escapeRegex(selectedCountry.dialCode) + "\\s*"), "");
    const phone = `${selectedCountry.dialCode} ${phoneLocal}`.trim();

    try {
      await authApi.signup({
        name: form.get("name"),
        company: form.get("company"),
        email,
        country: selectedCountry.name,
        countryCode: selectedCountry.code,
        phoneCode: selectedCountry.dialCode,
        phone,
        password: form.get("password"),
      });
      savePendingEmail(email);
      navigate("/otp-verification");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Signup" />
      <section className="auth-wrap">
        <form className="auth-card" onSubmit={submit}>
          <span className="eyebrow">Secure client portal</span>
          <h1>Signup</h1>
          <label>Name<input name="name" placeholder="Full name" required /></label>
          <label>Company<input name="company" placeholder="Company name" /></label>
          <label>Email<input name="email" type="email" placeholder="you@company.com" required /></label>
          <label>Country<select name="countryCode" value={countryCode} onChange={(event) => setCountryCode(event.target.value)} required>
            {countries.map((country) => <option key={country.code} value={country.code}>{country.name} ({country.dialCode})</option>)}
          </select></label>
          <label>Phone Number<div className="phone-field"><span>{selectedCountry.dialCode}</span><input name="phone" type="tel" inputMode="tel" placeholder="Phone number" required /></div></label>
          <p className="form-helper">Important: company name, email address, and phone number cannot be changed after you create your account. Please check them carefully.</p>
          <label>Password<input name="password" type="password" placeholder="Password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <PasswordStrength password={password} />
          <Button type="submit" icon="lock">{loading ? "Creating..." : "Create account"}</Button>
          <div className="inline-note">After signup, enter the OTP sent to your email. Then your account waits for admin approval before login.</div>
          {error && <div className="form-error">{error}</div>}
          <p><button type="button" className="learn" onClick={() => navigate("/login")}>Already have an account?</button></p>
        </form>
      </section>
    </>
  );
}
