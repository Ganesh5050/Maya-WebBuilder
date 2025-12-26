import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "@/react-app/pages/Home";
import SignInPage from "@/react-app/pages/SignIn";
import SignUpPage from "@/react-app/pages/SignUp";
import PricingPage from "@/react-app/pages/Pricing";
import FeaturesPage from "@/react-app/pages/Features";
import BlogPage from "@/react-app/pages/Blog";
import AboutPage from "@/react-app/pages/About";
import SpotlightPage from "@/react-app/pages/Spotlight";
import PrivacyPage from "@/react-app/pages/Privacy";
import TermsPage from "@/react-app/pages/Terms";
import AppsPage from "@/react-app/pages/Apps";
import RecentAppsPage from "@/react-app/pages/RecentApps";
import StarredAppsPage from "@/react-app/pages/StarredApps";
import SubscriptionPage from "@/react-app/pages/Subscription";
import CreateAppPage from "@/react-app/pages/CreateApp";
import AppBuilderPage from "@/react-app/pages/AppBuilder";
import { IndustryTestPage } from "@/react-app/pages/IndustryTestPage";
import { LiveGenerationDemo } from "@/react-app/components/LiveGenerationDemo";
import { PremiumComponentDemo } from "@/react-app/pages/PremiumComponentDemo";
import TestUniqueGeneration from "@/react-app/pages/TestUniqueGeneration";
import ProfilePage from "@/react-app/pages/Profile";
import ForgotPasswordPage from "@/react-app/pages/ForgotPassword";
import DocsPage from "@/react-app/pages/Docs";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/spotlight" element={<SpotlightPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/apps/recent" element={<RecentAppsPage />} />
          <Route path="/apps/starred" element={<StarredAppsPage />} />
          <Route path="/apps/settings/subscription" element={<SubscriptionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/apps/new" element={<CreateAppPage />} />
          <Route path="/apps/:appId" element={<AppBuilderPage />} />
          <Route path="/test-industry" element={<IndustryTestPage />} />
          <Route path="/demo-generation" element={<LiveGenerationDemo />} />
          <Route path="/premium-demo" element={<PremiumComponentDemo />} />
          <Route path="/test-unique" element={<TestUniqueGeneration />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
