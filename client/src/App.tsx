import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppLayout } from './components/layout/AppLayout';
import { AnalysisPage } from './pages/AnalysisPage';
import { AnalysisReportPage } from './pages/AnalysisReportPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingsPage } from './pages/SettingsPage';
import { LogsPage } from './pages/LogsPage';
import { PAGES } from './config/routesConfig';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path={PAGES.NEW_LOG} element={<AnalysisPage />} />
          <Route path={PAGES.NEW_ANALYSIS} element={<AnalysisReportPage />} />
          <Route path={PAGES.ANALYSIS_REPORT} element={<AnalysisReportPage />} />
          <Route path={PAGES.LOGS_LIST} element={<LogsPage />} />
          <Route path={PAGES.SETTINGS} element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
