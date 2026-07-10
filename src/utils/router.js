let routerNavigate;

export const normalizePath = (path) => {
  if (!path || path === "/") return "/";
  return path.replace(/\/$/, "");
};

export const setRouterNavigate = (navigate) => {
  routerNavigate = navigate;
};

export const navigate = (to, options) => {
  if (routerNavigate) {
    routerNavigate(to, options);
  } else {
    window.location.assign(to);
  }
  window.scrollTo({ top: 0, behavior: "auto" });
};
