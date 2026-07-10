import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ProtectedRoute, GuestRoute } from "./RouteGuards";
import { setRouterNavigate } from "../utils/router";
import { Home } from "../pages/Home";

const lazyNamed = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

const Services = lazyNamed(() => import("../pages/Services"), "Services");
const Industries = lazyNamed(() => import("../pages/Industries"), "Industries");
const Pricing = lazyNamed(() => import("../pages/Pricing"), "Pricing");
const Starter = lazyNamed(() => import("../pages/pricing/Starter"), "Starter");
const Pro = lazyNamed(() => import("../pages/pricing/Pro"), "Pro");
const Enterprise = lazyNamed(() => import("../pages/pricing/Enterprise"), "Enterprise");
const About = lazyNamed(() => import("../pages/About"), "About");
const Team = lazyNamed(() => import("../pages/Team"), "Team");
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
const RequestSuccess = lazyNamed(() => import("../pages/RequestSuccess"), "RequestSuccess");
const NotFound = lazyNamed(() => import("../pages/NotFound"), "NotFound");
const AdminPage = lazyNamed(() => import("../pages/AdminPage"), "AdminPage");
const AdminOrderDetails = lazyNamed(() => import("../pages/AdminOrderDetails"), "AdminOrderDetails");
const ServiceRoute = lazyNamed(() => import("./DynamicRoutes"), "ServiceRoute");
const IndustryRoute = lazyNamed(() => import("./DynamicRoutes"), "IndustryRoute");
const PackageRoute = lazyNamed(() => import("./DynamicRoutes"), "PackageRoute");
const TeamProfileRoute = lazyNamed(() => import("./DynamicRoutes"), "TeamProfileRoute");

const publicRoutePrefetchers = [
  () => import("../pages/Services"),
  () => import("../pages/Industries"),
  () => import("../pages/Pricing"),
  () => import("../pages/About"),
  () => import("../pages/Contact"),
];

function shouldPrefetchPublicRoutes() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType);
}

function prefetchPublicRoutes() {
  if (!shouldPrefetchPublicRoutes()) return;
  publicRoutePrefetchers.forEach((prefetch) => {
    prefetch().catch(() => {});
  });
}

function RouterNavigateBinder() {
  const routerNavigate = useNavigate();

  useEffect(() => {
    setRouterNavigate(routerNavigate);
  }, [routerNavigate]);

  return null;
}

function UserDashboardRoute({ section = "Dashboard", serviceId = "" }) {
  return <ProtectedRoute><UserDashboardContent section={section} serviceId={serviceId} /></ProtectedRoute>;
}

function UserDashboardContent({ section, serviceId }) {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  if (user?.role === "employee") return <Navigate to="/admin-dashboard" replace />;
  return <Dashboard section={section} serviceId={serviceId} />;
}

function UserServiceDetailsRoute() {
  const { serviceId } = useParams();
  return <UserDashboardRoute section="Service Details" serviceId={serviceId} />;
}

function DashboardRoute() {
  return <ProtectedRoute><DashboardRedirect /></ProtectedRoute>;
}

function DashboardRedirect() {
  const { user } = useAuth();
  return <Navigate to={["admin", "employee"].includes(user?.role) ? "/admin-dashboard" : "/user-dashboard"} replace />;
}

export function AppRoutes() {
  useEffect(() => {
    const schedulePrefetch = () => {
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(prefetchPublicRoutes, { timeout: 5000 });
        return () => window.cancelIdleCallback?.(id);
      }
      const id = window.setTimeout(prefetchPublicRoutes, 3500);
      return () => window.clearTimeout(id);
    };

    if (document.readyState === "complete") return schedulePrefetch();
    let cleanup = null;
    const onLoad = () => {
      cleanup = schedulePrefetch();
    };
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      cleanup?.();
    };
  }, []);

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
        <Route path="/admin" element={<ProtectedRoute role={["admin", "employee"]}><AdminPage /></ProtectedRoute>} />
        <Route path="/admin/orders/:orderId" element={<ProtectedRoute role={["admin", "employee"]}><AdminOrderDetails /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute role={["admin", "employee"]}><AdminPage /></ProtectedRoute>} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/terms-conditions" element={<Terms />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signin" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><SignupPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute allowAuthenticated><ResetPasswordPage /></GuestRoute>} />
        <Route path="/otp-verification" element={<GuestRoute><OtpVerificationPage /></GuestRoute>} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/user-dashboard" element={<UserDashboardRoute section="Dashboard" />} />
        <Route path="/profile" element={<UserDashboardRoute section="Profile" />} />
        <Route path="/bookings" element={<UserDashboardRoute section="Bookings" />} />
        <Route path="/settings" element={<UserDashboardRoute section="Settings" />} />
        <Route path="/invoices" element={<UserDashboardRoute section="Invoices" />} />
        <Route path="/payment-confirmation" element={<UserDashboardRoute section="Payment Confirmation" />} />
        <Route path="/notifications" element={<UserDashboardRoute section="Notifications" />} />
        <Route path="/support-tickets" element={<UserDashboardRoute section="Support Tickets" />} />
        <Route path="/my-services" element={<UserDashboardRoute section="My Services" />} />
        <Route path="/my-services/:serviceId" element={<UserServiceDetailsRoute />} />
        <Route path="/cancelled-services" element={<UserDashboardRoute section="Cancelled Services" />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/book-meeting" element={<BookMeeting />} />
        <Route path="/request-success" element={<RequestSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
