import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Layout } from "./components/Layout";
import { industries, packages, services, teamProfiles } from "./data/siteData";
import { AdminPage } from "./pages/AdminPage";
import { Blog, Careers } from "./pages/CorePages";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { Home } from "./pages/Home";
import { LoginPage } from "./pages/LoginPage";
import { OtpVerificationPage } from "./pages/OtpVerificationPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SignupPage } from "./pages/SignupPage";
import { About, BookService, CaseStudies, Contact, Dashboard, FAQ, HowItWorks, IndustriesPage, IndustryDetail, Legal, NotFound, PackageDetail, PricingPage, ServiceDetail, ServicesPage, TeamPage, TeamProfile } from "./pages/CorePages";
import { useAuth } from "./context/useAuth";
import { setRouterNavigate } from "./utils/router";

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
  const plan = packages.find((item) => item.slug === slug);
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

export default function App() {
  const routerNavigate = useNavigate();

  useEffect(() => {
    setRouterNavigate(routerNavigate);
  }, [routerNavigate]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceRoute />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/industries/:slug" element={<IndustryRoute />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/pricing/:slug" element={<PackageRoute />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/team/:slug" element={<TeamProfileRoute />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/admin-dashboard" element={<AdminRoute />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy-policy" element={<Legal type="Privacy Policy" />} />
        <Route path="/terms-conditions" element={<Legal type="Terms & Conditions" />} />
        <Route path="/cookie-policy" element={<Legal type="Cookie Policy" />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
