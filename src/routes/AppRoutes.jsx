import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { AdminPage } from "../pages/AdminPage";
import { industries, packages, services, teamProfiles } from "../data/siteData";
import { useAuth } from "../context/useAuth";
import { setRouterNavigate } from "../utils/router";

const lazyNamed = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

const Home = lazyNamed(() => import("../pages/Home"), "Home");
const Services = lazyNamed(() => import("../pages/Services"), "Services");
const ServiceDetail = lazyNamed(() => import("../pages/ServiceDetail"), "ServiceDetail");
const Industries = lazyNamed(() => import("../pages/Industries"), "Industries");
const IndustryDetail = lazyNamed(() => import("../pages/IndustryDetail"), "IndustryDetail");
const Pricing = lazyNamed(() => import("../pages/Pricing"), "Pricing");
const PackageDetail = lazyNamed(() => import("../pages/PackageDetail"), "PackageDetail");
const Starter = lazyNamed(() => import("../pages/pricing/Starter"), "Starter");
const Pro = lazyNamed(() => import("../pages/pricing/Pro"), "Pro");
const Enterprise = lazyNamed(() => import("../pages/pricing/Enterprise"), "Enterprise");
const About = lazyNamed(() => import("../pages/About"), "About");
const Team = lazyNamed(() => import("../pages/Team"), "Team");
const TeamProfile = lazyNamed(() => import("../pages/TeamProfile"), "TeamProfile");
const HowItWorks = lazyNamed(() => import("../pages/HowItWorks"), "HowItWorks");
const CaseStudies = lazyNamed(() => import("../pages/CaseStudies"), "CaseStudies");
const FAQ = lazyNamed(() => import("../pages/FAQ"), "FAQ");
const Contact = lazyNamed(() => import("../pages/Contact"), "Contact");
const Blog = lazyNamed(() => import("../pages/Blog"), "Blog");
const Careers = lazyNamed(() => import("../pages/Careers"), "Careers");
const Privacy = lazyNamed(() => import("../pages/Privacy"), "Privacy");
const Terms = lazyNamed(() => import("../pages/Terms"), "Terms");
const CookiePolicy = lazyNamed(() => import("../pages/CookiePolicy"), "CookiePolicy");
const LoginPage = lazyNamed(() => import("../pages/LoginPage"), "LoginPage");
const SignupPage = lazyNamed(() => import("../pages/SignupPage"), "SignupPage");
const ForgotPasswordPage = lazyNamed(() => import("../pages/ForgotPasswordPage"), "ForgotPasswordPage");
const ResetPasswordPage = lazyNamed(() => import("../pages/ResetPasswordPage"), "ResetPasswordPage");
const OtpVerificationPage = lazyNamed(() => import("../pages/OtpVerificationPage"), "OtpVerificationPage");
const Dashboard = lazyNamed(() => import("../pages/Dashboard"), "Dashboard");
const BookService = lazyNamed(() => import("../pages/BookService"), "BookService");
const BookMeeting = lazyNamed(() => import("../pages/BookMeeting"), "BookMeeting");
const NotFound = lazyNamed(() => import("../pages/NotFound"), "NotFound");

function RouterNavigateBinder() {
  const routerNavigate = useNavigate();

  useEffect(() => {
    setRouterNavigate(routerNavigate);
  }, [routerNavigate]);

  return null;
}

function ServiceRoute() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);
  return service ? <ServiceDetail service={service} /> : <NotFound />;
}

function IndustryRoute() {
  const { slug } = useParams();
  const industry = industries.find((item) => item.slug === slug);
  return industry ? <IndustryDetail industry={industry} /> : <NotFound />;
}

function PackageRoute() {
  const { slug } = useParams();
  const routeAliases = { pro: "professional" };
  const planSlug = routeAliases[slug] || slug;
  const plan = packages.find((item) => item.slug === planSlug);
  return plan ? <PackageDetail plan={plan} /> : <NotFound />;
}

function TeamProfileRoute() {
  const { slug } = useParams();
  const profile = teamProfiles.find((item) => item.slug === slug);
  return profile ? <TeamProfile profile={profile} /> : <NotFound />;
}

function AdminRoute() {
  const { authReady, user } = useAuth();
  if (!authReady) return null;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <AdminPage /> : <Navigate to="/user-dashboard" replace />;
}

function UserDashboardRoute({ section = "Dashboard" }) {
  const { authReady, user } = useAuth();
  if (!authReady) return null;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <Navigate to="/admin-dashboard" replace /> : <Dashboard section={section} />;
}

function DashboardRoute() {
  const { authReady, user } = useAuth();
  if (!authReady) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/user-dashboard"} replace />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <RouterNavigateBinder />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceRoute />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/industries/:slug" element={<IndustryRoute />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/pricing/starter" element={<Starter />} />
        <Route path="/pricing/pro" element={<Pro />} />
        <Route path="/pricing/enterprise" element={<Enterprise />} />
        <Route path="/pricing/:slug" element={<PackageRoute />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/:slug" element={<TeamProfileRoute />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/admin-dashboard" element={<AdminRoute />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/terms-conditions" element={<Terms />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/user-dashboard" element={<UserDashboardRoute section="Dashboard" />} />
        <Route path="/profile" element={<UserDashboardRoute section="Profile" />} />
        <Route path="/bookings" element={<UserDashboardRoute section="Bookings" />} />
        <Route path="/settings" element={<UserDashboardRoute section="Settings" />} />
        <Route path="/invoices" element={<UserDashboardRoute section="Invoices" />} />
        <Route path="/messages" element={<UserDashboardRoute section="Messages" />} />
        <Route path="/notifications" element={<UserDashboardRoute section="Notifications" />} />
        <Route path="/support-tickets" element={<UserDashboardRoute section="Support Tickets" />} />
        <Route path="/my-services" element={<UserDashboardRoute section="My Services" />} />
        <Route path="/calendar" element={<UserDashboardRoute section="Calendar" />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/book-meeting" element={<BookMeeting />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
