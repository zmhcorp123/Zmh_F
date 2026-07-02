import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { AdminPage } from "../pages/AdminPage";
import { AdminOrderDetails } from "../pages/AdminOrderDetails";
import { ServiceDetail } from "../pages/ServiceDetail";
import { Services } from "../pages/Services";
import { industries, packages, services, teamProfiles } from "../data/siteData";
import { useAuth } from "../context/useAuth";
import { ProtectedRoute, GuestRoute } from "./RouteGuards";
import { setRouterNavigate } from "../utils/router";

const lazyNamed = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

const Home = lazyNamed(() => import("../pages/Home"), "Home");
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

function UserDashboardRoute({ section = "Dashboard", serviceId = "" }) {
  return <ProtectedRoute><UserDashboardContent section={section} serviceId={serviceId} /></ProtectedRoute>;
}

function UserDashboardContent({ section, serviceId }) {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
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
  return <Navigate to={user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard"} replace />;
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
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
        <Route path="/admin/orders/:orderId" element={<ProtectedRoute role="admin"><AdminOrderDetails /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
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
        <Route path="/notifications" element={<UserDashboardRoute section="Notifications" />} />
        <Route path="/support-tickets" element={<UserDashboardRoute section="Support Tickets" />} />
        <Route path="/my-services" element={<UserDashboardRoute section="My Services" />} />
        <Route path="/my-services/:serviceId" element={<UserServiceDetailsRoute />} />
        <Route path="/cancelled-services" element={<UserDashboardRoute section="Cancelled Services" />} />
        <Route path="/calendar" element={<UserDashboardRoute section="Calendar" />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/book-meeting" element={<BookMeeting />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
