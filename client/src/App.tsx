import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppLayout } from './components/layout/AppLayout';
import { AnalysisPage } from './pages/AnalysisPage';
import { AnalysisReportPage } from './pages/AnalysisReportPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingsPage } from './pages/SettingsPage';
import { LogsPage } from './pages/LogsPage';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { routeConfiguration } from './config/routeConfiguration';
import { PAGES } from './config/routesConfig';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PAGES.LOGIN} element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route element={<AppLayout />}>
          {routeConfiguration.map((routeConfig) => (
            <Route
              key={routeConfig.path}
              path={routeConfig.path}
              element={<ProtectedRoute component={routeConfig.component} allowedRoles={routeConfig.allowedRoles} />}
            />
          ))}
          <Route index element={<HomePage />} />
          <Route path={PAGES.NEW_LOG} element={<AnalysisPage />} />
          <Route path={PAGES.NEW_ANALYSIS} element={<AnalysisReportPage />} />
          <Route path={PAGES.ANALYSIS_REPORT} element={<AnalysisReportPage />} />
          <Route path={PAGES.LOGS_LIST} element={<LogsPage />} />
          <Route path={PAGES.SETTINGS} element={<SettingsPage />} />
          <Route path={PAGES.SUPER_ADMIN_INVITE} element={<SuperAdminDashboard />} />
          <Route path={PAGES.ADMIN_DASHBOARD} element={<div className="p-8"><h1 className="text-2xl font-bold">Admin Dashboard</h1></div>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
