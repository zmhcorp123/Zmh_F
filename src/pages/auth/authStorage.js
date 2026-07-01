export const PENDING_EMAIL_KEY = "zmh_pending_email";

export function getPendingEmail() {
  return localStorage.getItem(PENDING_EMAIL_KEY) || "";
}

export function savePendingEmail(email) {
  if (email) localStorage.setItem(PENDING_EMAIL_KEY, email);
}

export function clearPendingEmail() {
  localStorage.removeItem(PENDING_EMAIL_KEY);
}

export function getPasswordScore(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}
