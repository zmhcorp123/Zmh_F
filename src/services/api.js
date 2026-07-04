const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
const AUTH_TOKEN_KEY = "zmh_auth_token";
const AUTH_STORAGE_PREFIX = "zmh_";
let unauthorizedHandler = null;

const safeApiPath = (path) => {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(path)) {
    throw new Error("Invalid API path");
  }
  return path;
};

export const tokenStore = {
  get: () => localStorage.getItem(AUTH_TOKEN_KEY),
  set: (token) => {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  clear: () => localStorage.removeItem(AUTH_TOKEN_KEY),
};

export function clearAuthStorage() {
  try {
    Object.keys(localStorage).filter((key) => key.startsWith(AUTH_STORAGE_PREFIX) || key.toLowerCase().includes("auth")).forEach((key) => localStorage.removeItem(key));
  } catch {
    tokenStore.clear();
  }

  try {
    Object.keys(sessionStorage).filter((key) => key.startsWith(AUTH_STORAGE_PREFIX) || key.toLowerCase().includes("auth")).forEach((key) => sessionStorage.removeItem(key));
  } catch {
    // Session storage may be unavailable in some browser modes.
  }

  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (!name) return;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
  });
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

const request = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  const hasBody = Object.prototype.hasOwnProperty.call(options, "body");
  const isFormData = hasBody && options.body instanceof FormData;
  const token = tokenStore.get();

  if (hasBody && !isFormData) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(API_BASE_URL + safeApiPath(path), {
      method: options.method || "GET",
      credentials: "include",
      cache: "no-store",
      ...options,
      headers,
      body: hasBody && !isFormData ? JSON.stringify(options.body) : options.body,
    });
  } catch (error) {
    const networkError = new Error("Network unavailable. Please check your connection and try again.");
    networkError.cause = error;
    throw networkError;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "object" && data?.message ? data.message : "Request failed";
    const error = new Error(message);
    error.status = response.status;
    if (response.status === 401 && token) unauthorizedHandler?.(error);
    throw error;
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
  logout: () => clearAuthStorage(),
};

export const bookingApi = {
  create: (payload) => request("/bookings", { method: "POST", body: payload }),
  list: () => request("/bookings"),
};

export const settingsApi = {
  packages: () => request("/settings/packages"),
  company: () => request("/settings/company"),
  teamProfiles: () => request("/settings/team-profiles"),
};

export const contactApi = {
  send: (payload) => request("/contact", { method: "POST", body: payload }),
};

export const dashboardApi = {
  profile: () => request("/dashboard/profile"),
  updateProfile: (payload) => request("/dashboard/profile", { method: "PATCH", body: payload }),
  changePassword: (payload) => request("/dashboard/password", { method: "PATCH", body: payload }),
  invoices: () => request("/invoices"),
  invoicePdf: (id) => request("/invoices/" + id + "/pdf"),
  services: () => request("/dashboard/services"),
  submitPayment: (payload) => request("/payments/submit", { method: "POST", body: payload }),
  confirmPayment: (payload) => request("/payments/confirm", { method: "POST", body: payload }),
  notifications: () => request("/notifications"),
  supportTickets: () => request("/support-tickets"),
  createSupportTicket: (payload) => request("/support-tickets", { method: "POST", body: payload }),
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
  sendBills: (payload) => request("/admin/bills/send", { method: "POST", body: payload }),
  payments: () => request("/admin/payments"),
  approvePayment: (id, payload = {}) => request("/admin/payments/" + id + "/approve", { method: "POST", body: payload }),
  rejectPayment: (id, payload = {}) => request("/admin/payments/" + id + "/reject", { method: "POST", body: payload }),
  supportTickets: () => request("/admin/support-tickets"),
  archivedSupportTickets: () => request("/admin/support-tickets?archived=true"),
  updateSupportTicket: (id, payload) => request("/admin/support-tickets/" + id, { method: "PATCH", body: payload }),
  getSettings: () => request("/admin/settings"),
  settings: (payload) => request("/admin/settings", { method: "POST", body: payload }),
  orders: (params = {}) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")).toString();
    return request("/admin/orders" + (query ? `?${query}` : ""));
  },
  order: (id) => request("/admin/orders/" + id),
  updateOrder: (id, payload) => request("/admin/orders/" + id, { method: "PATCH", body: payload }),
  addOrderProgress: (id, payload) => request("/admin/orders/" + id + "/progress", { method: "POST", body: payload }),
  generateOrderPdf: (id) => request("/admin/orders/" + id + "/pdf", { method: "POST" }),
  sendInvoiceSummary: (id, payload = {}) => request("/admin/orders/" + id + "/send-invoice-summary", { method: "POST", body: payload }),
  pricing: () => request("/admin/pricing"),
  savePricing: (packages) => request("/admin/pricing", { method: "PUT", body: { packages } }),
};
