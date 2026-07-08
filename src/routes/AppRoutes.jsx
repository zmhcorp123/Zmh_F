import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ProtectedRoute, GuestRoute } from "./RouteGuards";
import { setRouterNavigate } from "../utils/router";

const lazyNamed = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

const Home = lazyNamed(() => import("../pages/Home"), "Home");
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

function SkeletonLine({ className = "" }) {
  return <span className={"skeleton-line " + className} />;
}

function HomeRouteFallback() {
  return (
    <section className="saas-hero home-hero route-home-skeleton" aria-label="Loading home page">
      <div className="mesh-bg" aria-hidden="true" />
      <div className="hero-copy route-home-copy-skeleton">
        <SkeletonLine className="badge" />
        <SkeletonLine className="title" />
        <SkeletonLine className="title short" />
        <SkeletonLine className="text" />
        <SkeletonLine className="text mid" />
        <div className="hero-actions route-action-skeleton"><SkeletonLine /><SkeletonLine /></div>
        <div className="trust-strip route-trust-skeleton">
          {Array.from({ length: 4 }).map((_, index) => <div key={index}><SkeletonLine className="icon" /><SkeletonLine /><SkeletonLine className="small" /></div>)}
        </div>
      </div>
      <div className="saas-dashboard simple-dashboard route-dashboard-skeleton">
        <div className="dash-topline"><SkeletonLine className="dot" /><div><SkeletonLine /><SkeletonLine className="small" /></div><SkeletonLine className="button" /></div>
        <div className="ops-metrics">{Array.from({ length: 4 }).map((_, index) => <div key={index}><SkeletonLine /><SkeletonLine className="metric" /><SkeletonLine className="small" /></div>)}</div>
        <div className="dash-bottom">
          <div className="performance-card"><SkeletonLine /><div className="line-graph">{Array.from({ length: 12 }).map((_, index) => <span key={index} />)}</div></div>
          <div className="activity-card">{Array.from({ length: 4 }).map((_, index) => <p key={index}><SkeletonLine className="dot" /><SkeletonLine /><SkeletonLine className="small" /></p>)}</div>
        </div>
      </div>
    </section>
  );
}

function PageRouteFallback() {
  return (
    <section className="page-hero route-page-skeleton" aria-label="Loading page">
      <div className="hero-copy">
        <SkeletonLine className="badge" />
        <SkeletonLine className="title" />
        <SkeletonLine className="title short" />
        <SkeletonLine className="text" />
        <SkeletonLine className="text mid" />
        <div className="hero-actions route-action-skeleton"><SkeletonLine /><SkeletonLine /></div>
      </div>
      <div className="hero-visual page-hero-dashboard">
        <SkeletonLine className="panel" />
        <div className="route-panel-grid">{Array.from({ length: 6 }).map((_, index) => <SkeletonLine key={index} />)}</div>
      </div>
    </section>
  );
}

function RouteFallback() {
  const location = useLocation();
  return location.pathname === "/" ? <HomeRouteFallback /> : <PageRouteFallback />;
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
  return (
    <Suspense fallback={<RouteFallback />}>
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
        <Route path="/calendar" element={<UserDashboardRoute section="Calendar" />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/book-meeting" element={<BookMeeting />} />
        <Route path="/request-success" element={<RequestSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
