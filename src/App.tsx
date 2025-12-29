import { Route, Routes } from "react-router-dom";
import RootLayout from "@/app/layout";
import DashboardLayout from "@/app/(dashboard)/layout";
import HomePage from "@/app/page";
import AboutPage from "@/app/about/page";
import FeaturesPage from "@/app/features/page";
import PricingPage from "@/app/pricing/page";
import ContactPage from "@/app/contact/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import LoginPage from "@/app/login/page";
import HelpCenterPage from "@/app/help/page";
import DashboardPage from "@/app/(dashboard)/dashboard/page";
import CoursesPage from "@/app/(dashboard)/courses/page";
import CourseDetailPage from "@/app/(dashboard)/courses/[courseId]/page";
import ProgressPage from "@/app/(dashboard)/progress/page";
import LiveClassesPage from "@/app/(dashboard)/live-classes/page";
import SettingsPage from "@/app/(dashboard)/settings/page";
import AdminDashboard from "@/app/(dashboard)/admin/page";
import LessonPlayerPage from "@/app/(dashboard)/learn/[courseId]/[chapterId]/[lessonId]/page";
import ParentDashboard from "@/app/(dashboard)/parent/page";
import NotFoundPage from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="help" element={<HelpCenterPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:courseId" element={<CourseDetailPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="live-classes" element={<LiveClassesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="learn/:courseId/:chapterId/:lessonId" element={<LessonPlayerPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="parent" element={<ParentDashboard />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
