import { getPasswordScore } from "./authStorage";

export function PasswordStrength({ password }) {
  const score = getPasswordScore(password);
  const label = ["Weak", "Fair", "Good", "Strong"][score];

  return (
    <div className={"strength score-" + score} aria-label={"Password strength " + label}>
      <span></span>
      <span></span>
      <span></span>
      <small>{label} password</small>
    </div>
  );
}
