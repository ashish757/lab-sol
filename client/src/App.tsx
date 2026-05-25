import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { Role } from './types/auth';
import './App.css';
import { AppLayout } from './components/layout/AppLayout';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { SetupAccount } from './pages/auth/SetupAccount';
import { UserSetupPage } from './pages/auth/UserSetupPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { routeConfiguration } from './config/routeConfiguration';
import { PAGES } from './config/routesConfig';

const IndexRedirect = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const userRole = authState.user?.role;
  
  if (!authState.isAuthenticated || !userRole) {
    return <Navigate to={PAGES.LOGIN} replace />;
  }

  switch (userRole) {
    case Role.SUPER_ADMIN:
      return <Navigate to={PAGES.ADMIN_DASHBOARD} replace />;
    case Role.ORG_ADMIN:
    case Role.ORG_STAFF:
      return <Navigate to={PAGES.ORG_DASHBOARD} replace />;
    case Role.UNIT_OPERATOR:
      return <Navigate to={PAGES.UNIT_DASHBOARD} replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PAGES.LOGIN} element={<LoginPage />} />
        <Route path={PAGES.SETUP_ORG} element={<SetupAccount />} />
        <Route path={PAGES.SETUP_USER} element={<UserSetupPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route element={<AppLayout />}>
          {routeConfiguration.map((routeConfig) => (
            <Route
              key={routeConfig.path}
              path={routeConfig.path}
              element={<ProtectedRoute component={routeConfig.component} allowedRoles={routeConfig.allowedRoles} />}
            />
          ))}
          <Route path="/" element={<IndexRedirect />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
