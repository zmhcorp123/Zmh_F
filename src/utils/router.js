export const normalizePath = (path) => {
  if (!path || path === "/") return "/";
  return path.replace(/\/$/, "");
};

export const navigate = (to) => {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new Event("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
};
