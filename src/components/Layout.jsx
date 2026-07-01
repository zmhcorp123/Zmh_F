import { useState } from "react";
import { company, services, industries } from "../data/siteData";
import { navigate } from "../utils/router";
import { Button } from "./Button";
import { Icon } from "./icons";
import { Chatbot } from "./Chatbot";
import { useAuth } from "../context/useAuth";

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
  ["Blog", "/blog"],
  ["Careers", "/careers"],
  ["Privacy Policy", "/privacy"],
  ["Terms & Conditions", "/terms"],
  ["Cookie Policy", "/cookie-policy"],
];

function LinkButton({ to, children, onClick }) {
  return <button className="text-link" onClick={() => { navigate(to); onClick?.(); }}>{children}</button>;
}

export function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [newsletterSaved, setNewsletterSaved] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const closeMenu = () => setOpen(false);

  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="navbar">
        <button className="brand" onClick={() => navigate("/")} aria-label="ZMH USA Corp home">
          <span className="brand-mark">Z</span>
          <span><strong>{company.name}</strong><small>Remote Operations</small></span>
        </button>
        <nav className={open ? "nav open" : "nav"} aria-label="Primary navigation">
          {nav.map(([label, to]) => <LinkButton key={to} to={to} onClick={closeMenu}>{label}</LinkButton>)}
          <button className="text-link mobile-auth-link" onClick={() => { navigate(isAuthenticated ? (user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard") : "/login"); closeMenu(); }}>
            {isAuthenticated ? (user?.role === "admin" ? "Admin" : "Dashboard") : "Login"}
          </button>
          <button className="text-link mobile-auth-link primary" onClick={() => { navigate("/book-meeting"); closeMenu(); }}>Book Audit</button>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn theme-toggle" title={dark ? "Switch to day mode" : "Switch to night mode"} aria-label={dark ? "Switch to day mode" : "Switch to night mode"} onClick={() => setDark((value) => !value)}>
            <Icon name={dark ? "sun" : "moon"} />
          </button>
          {isAuthenticated ? (
            <button className="ghost-small" onClick={() => navigate(user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard")}>{user?.role === "admin" ? "Admin" : "Dashboard"}</button>
          ) : (
            <button className="ghost-small" onClick={() => navigate("/login")}>Login</button>
          )}
          <Button to="/book-meeting" icon="calendar">Book Audit</Button>
          <button className="icon-btn menu-btn" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"}><Icon name={open ? "close" : "menu"} /></button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="brand footer-brand"><span className="brand-mark">Z</span><span><strong>{company.name}</strong><small>{company.tagline}</small></span></div>
            <p>Premium remote operations support for home service companies that need disciplined call, scheduling, dispatch, CRM, and admin workflows.</p>
            <div className="socials">{socials.map(([label, icon, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}><Icon name={icon} size={18} /></a>)}</div>
          </div>
          <div><h4>Services</h4>{services.slice(0, 6).map((item) => <LinkButton key={item.slug} to={"/services/" + item.slug}>{item.name}</LinkButton>)}</div>
          <div><h4>Industries</h4>{industries.slice(0, 6).map((item) => <LinkButton key={item.slug} to={"/industries/" + item.slug}>{item.name}</LinkButton>)}</div>
          <div><h4>Company</h4>{companyLinks.map(([label, to]) => <LinkButton key={to} to={to}>{label}</LinkButton>)}</div>
          <div>
            <h4>Newsletter</h4>
            <p>Operations ideas for service companies.</p>
            <form className="newsletter" onSubmit={(event) => { event.preventDefault(); setNewsletterSaved(true); }}>
              <input type="email" required placeholder="Email address" aria-label="Email address" />
              <button type="submit">Join</button>
            </form>
            {newsletterSaved && <small className="inline-note">Saved for backend subscription.</small>}
          </div>
        </div>
        <div className="footer-bottom"><span>Copyright 2026 ZMH USA Corp. All rights reserved.</span><span>{company.email} | {company.phone}</span></div>
      </footer>
      <Chatbot />
    </div>
  );
}
