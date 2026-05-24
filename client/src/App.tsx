import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AppLayout } from './components/layout/AppLayout';
import { NotFoundPage } from './pages/NotFoundPage';
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
          <Route path="/" element={<Navigate to={PAGES.HOME} replace />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
