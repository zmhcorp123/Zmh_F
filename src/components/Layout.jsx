import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { company, services, industries } from "../data/siteData";
import { navigate } from "../utils/router";
import { Button } from "./Button";
import { Icon } from "./icons";
import { useAuth } from "../context/useAuth";

const Chatbot = lazy(() => import("./Chatbot").then((module) => ({ default: module.Chatbot })));

const nav = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

const socials = [
  ["Facebook", "facebook", "https://www.facebook.com/"],
  ["LinkedIn", "linkedin", "https://www.linkedin.com/"],
];

const companyLinks = [
  ["About", "/about"],
  ["Team", "/team"],
  ["How It Works", "/how-it-works"],
  ["Case Studies", "/case-studies"],
  ["FAQ", "/faq"],
  ["Privacy Policy", "/privacy"],
  ["Terms & Conditions", "/terms"],
  ["Cookie Policy", "/cookie-policy"],
];

const logoMark = "/brand/zmh-usa-corp-mark-96.png";
const logoMarkWebp = "/brand/zmh-usa-corp-mark-96.webp";
const footerLogo = "/brand/zmh-usa-corp-mark.png";

function BrandLogo({ footer = false }) {
  if (footer) {
    return <img src={footerLogo} width="96" height="96" loading="lazy" decoding="async" alt="ZMH USA Corp." />;
  }
  return <picture><source srcSet={logoMarkWebp} type="image/webp" /><img src={logoMark} width="96" height="96" alt="" decoding="async" fetchPriority="high" /></picture>;
}

function LinkButton({ to, children, onClick }) {
  return <button className="text-link" onClick={() => { navigate(to); onClick?.(); }}>{children}</button>;
}

export function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { pathname: currentPath } = useLocation();
  const appOnlyPaths = [
    "/dashboard",
    "/user-dashboard",
    "/profile",
    "/bookings",
    "/settings",
    "/invoices",
    "/payment-confirmation",
    "/notifications",
    "/support-tickets",
    "/my-services",
    "/cancelled-services",
    "/calendar",
  ];
  const isAppOnly = appOnlyPaths.some((path) => currentPath === path || currentPath.startsWith(path + "/"));

  const closeMenu = () => setOpen(false);
  useEffect(() => {
    const loadChat = () => setChatReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(loadChat, { timeout: 2200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(loadChat, 1400);
    return () => window.clearTimeout(id);
  }, []);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <div className={isAppOnly && user?.role !== "admin" ? "app dashboard-app" : "app"}>
      <header className="navbar">
        <button className="brand" onClick={() => navigate("/")} aria-label="ZMH USA Corp home">
          <span className="brand-mark"><BrandLogo /></span>
          <span><strong>{company.name}</strong><small>Remote Operations</small></span>
        </button>
        <nav className={open ? "nav open" : "nav"} aria-label="Primary navigation">
          {nav.map(([label, to]) => <button key={to} className={"text-link " + (currentPath === to || (to !== "/" && currentPath.startsWith(to)) ? "active" : "")} onClick={() => { navigate(to); closeMenu(); }}>{label}</button>)}
          <button className="text-link mobile-auth-link" onClick={() => { navigate(isAuthenticated ? (user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard") : "/login"); closeMenu(); }}>
            {isAuthenticated ? (user?.role === "admin" ? "Admin" : "Dashboard") : "Login"}
          </button>
          {isAuthenticated && <button className="text-link mobile-auth-link" onClick={handleLogout}>Logout</button>}
          <button className="text-link mobile-auth-link primary" onClick={() => { navigate("/book-meeting"); closeMenu(); }}>Book Audit</button>
        </nav>
        <div className="nav-actions">
          {isAuthenticated ? (
            <><button className="ghost-small" onClick={() => navigate(user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard")}>{user?.role === "admin" ? "Admin" : "Dashboard"}</button><button className="ghost-small logout-button" type="button" onClick={handleLogout} aria-label="Log out of your account">Logout</button></>
          ) : (
            <button className="ghost-small" onClick={() => navigate("/login")}>Login</button>
          )}
          <Button to="/book-meeting" icon="calendar">Book Audit</Button>
          <button className="icon-btn menu-btn" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"}><Icon name={open ? "close" : "menu"} /></button>
        </div>
      </header>
      <main>{children}</main>
      {!isAppOnly && <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="brand footer-brand"><span className="footer-logo"><BrandLogo footer /></span><span><strong>{company.name}</strong><small>{company.tagline}</small></span></div>
            <p>Premium remote operations support for home service companies that need disciplined call, scheduling, dispatch, CRM, and admin workflows.</p>
            <div className="socials">{socials.map(([label, icon, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}><Icon name={icon} size={18} /></a>)}</div>
            <div className="footer-email-list footer-contact-list">
              <span><strong>Sales</strong>{company.emails.sales}</span>
              <span><strong>Support</strong>{company.emails.support}</span>
              <span><strong>Phone</strong>{company.phone}</span>
            </div>
          </div>
          <div><h4>Services</h4>{services.slice(0, 6).map((item) => <LinkButton key={item.slug} to={"/services/" + item.slug}>{item.name}</LinkButton>)}</div>
          <div><h4>Industries</h4>{industries.slice(0, 6).map((item) => <LinkButton key={item.slug} to={"/industries/" + item.slug}>{item.name}</LinkButton>)}</div>
          <div><h4>Company</h4>{companyLinks.map(([label, to]) => <LinkButton key={to} to={to}>{label}</LinkButton>)}</div>
        </div>
        <div className="footer-bottom"><span>Copyright 2026 ZMH USA Corp. All rights reserved.</span></div>
      </footer>}
      {!isAppOnly && chatReady && <Suspense fallback={<div className="chatbot chat-placeholder" aria-hidden="true" />}><Chatbot /></Suspense>}
    </div>
  );
}
