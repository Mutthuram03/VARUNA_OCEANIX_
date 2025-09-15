import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HomeDashboard from './pages/home-dashboard';
import MyAlertsDashboard from './pages/my-alerts-dashboard';
import HazardReportingForm from './pages/hazard-reporting-form';
import LoginRegistration from './pages/login-registration';
import AboutHelpCenter from './pages/about-help-center';
import InteractiveRiskMap from './pages/interactive-risk-map';
import TestPage from './pages/test-page';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/my-alerts-dashboard" element={<MyAlertsDashboard />} />
        <Route path="/hazard-reporting-form" element={<HazardReportingForm />} />
        <Route path="/login-registration" element={<LoginRegistration />} />
        <Route path="/about-help-center" element={<AboutHelpCenter />} />
        <Route path="/interactive-risk-map" element={<InteractiveRiskMap />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
