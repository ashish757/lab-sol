import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppLayout } from './components/layout/AppLayout';
import { AnalysisPage } from './pages/AnalysisPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/analysis/new" element={<AnalysisPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
