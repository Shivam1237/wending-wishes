import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext.jsx';
import { Loading } from './components/UI.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventFormPage from './pages/EventFormPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import GuestbookPage from './pages/GuestbookPage.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading label="Opening your workspace…" full />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loading full />;
  if (user) return <Navigate to="/admin/dashboard" replace />;
  return <LoginPage />;
}

function RouteTree() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/event/:slug" element={<GuestbookPage />} />
    <Route path="/admin/login" element={<LoginRoute />} />
    <Route path="/admin" element={<Protected><AdminLayout /></Protected>}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="events" element={<EventsPage />} />
      <Route path="events/new" element={<EventFormPage />} />
      <Route path="events/:id" element={<EventDetailPage />} />
      <Route path="events/:id/edit" element={<EventFormPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

export default function App() {
  return <AuthProvider><RouteTree /></AuthProvider>;
}
