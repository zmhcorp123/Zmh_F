const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
const AUTH_TOKEN_KEY = "zmh_auth_token";

export const tokenStore = {
  get: () => localStorage.getItem(AUTH_TOKEN_KEY),
  set: (token) => {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  clear: () => localStorage.removeItem(AUTH_TOKEN_KEY),
};

const request = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  const hasBody = Object.prototype.hasOwnProperty.call(options, "body");
  const isFormData = hasBody && options.body instanceof FormData;
  const token = tokenStore.get();

  if (hasBody && !isFormData) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(API_BASE_URL + path, {
    method: options.method || "GET",
    credentials: "include",
    ...options,
    headers,
    body: hasBody && !isFormData ? JSON.stringify(options.body) : options.body,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "object" && data?.message ? data.message : "Request failed";
    throw new Error(message);
  }

  if (typeof data === "object" && data?.token) tokenStore.set(data.token);
  return data;
};

export const authApi = {
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  sendOtp: (payload) => request("/auth/otp/send", { method: "POST", body: payload }),
  resendOtp: (payload) => request("/auth/otp/resend", { method: "POST", body: payload }),
  verifyOtp: (payload) => request("/auth/otp/verify", { method: "POST", body: payload }),
  forgotPassword: (payload) => request("/auth/forgot-password", { method: "POST", body: payload }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: payload }),
  logout: () => tokenStore.clear(),
};

export const bookingApi = {
  create: (payload) => request("/bookings", { method: "POST", body: payload }),
  list: () => request("/bookings"),
};

export const contactApi = {
  send: (payload) => request("/contact", { method: "POST", body: payload }),
};

export const dashboardApi = {
  profile: () => request("/dashboard/profile"),
  invoices: () => request("/invoices"),
  notifications: () => request("/notifications"),
  chatbot: (payload) => request("/chatbot/query", { method: "POST", body: payload }),
};

export const adminApi = {
  users: () => request("/admin/users?db=mongodb"),
  approvals: () => request("/admin/approvals"),
  approveUser: (id) => request("/admin/users/" + id + "/approve", { method: "POST" }),
  updateUser: (id, payload) => request("/admin/users/" + id, { method: "PATCH", body: payload }),
  bookings: () => request("/admin/bookings?db=mongodb"),
  updateBooking: (id, payload) => request("/admin/bookings/" + id, { method: "PATCH", body: payload }),
  bills: () => request("/admin/bills?db=mongodb"),
  updateBill: (id, payload) => request("/admin/bills/" + id, { method: "PATCH", body: payload }),
  settings: (payload) => request("/admin/settings", { method: "POST", body: payload }),
};
