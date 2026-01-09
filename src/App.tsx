import { Route, Routes } from "react-router-dom";
import RootLayout from "@/app/layout";
import DashboardLayout from "@/app/(dashboard)/layout";
import HomePage from "@/app/page";
import AboutPage from "@/app/about/page";
import PricingPage from "@/app/pricing/page";
import ContactPage from "@/app/contact/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import TeamPage from "@/app/team/page";
import LoginPage from "@/app/login/page";
import SignupPage from "@/app/signup/page";
import ForgotPasswordPage from "@/app/forgot-password/page";
import ResetPasswordPage from "@/app/reset_pass/page";
import HelpCenterPage from "@/app/help/page";
import PaymentSuccessPage from "@/app/payment/success/page";
import PaymentFailPage from "@/app/payment/fail/page";
import PaymentCancelPage from "@/app/payment/cancel/page";
import DashboardPage from "@/app/(dashboard)/dashboard/page";
import CoursesPage from "@/app/(dashboard)/courses/page";
import CourseDetailPage from "@/app/(dashboard)/courses/[courseId]/page";
import ProgressPage from "@/app/(dashboard)/progress/page";
import LiveClassesPage from "@/app/(dashboard)/live-classes/page";
import SettingsPage from "@/app/(dashboard)/settings/page";
import LessonPlayerPage from "@/app/(dashboard)/learn/[courseId]/[chapterId]/[lessonId]/page";
import ParentDashboard from "@/app/(dashboard)/parent/page";
import NotFoundPage from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset_pass" element={<ResetPasswordPage />} />
        <Route path="help" element={<HelpCenterPage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route path="payment/fail" element={<PaymentFailPage />} />
        <Route path="payment/cancel" element={<PaymentCancelPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CourseDetailPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="live-classes" element={<LiveClassesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="learn/:courseId/:chapterId/:lessonId" element={<LessonPlayerPage />} />
            <Route path="parent" element={<ParentDashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
