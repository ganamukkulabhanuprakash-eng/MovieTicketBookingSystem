import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import MoviesPage from '@/pages/MoviesPage';
import MovieDetailPage from '@/pages/MovieDetailPage';
import BookingPage from '@/pages/BookingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';

// Admin imports
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOverviewPage from '@/pages/admin/AdminOverviewPage';
import AdminMoviesPage from '@/pages/admin/AdminMoviesPage';
import AdminTheatresPage from '@/pages/admin/AdminTheatresPage';
import AdminScreensPage from '@/pages/admin/AdminScreensPage';
import AdminShowsPage from '@/pages/admin/AdminShowsPage';
import AdminPricingPage from '@/pages/admin/AdminPricingPage';
import AdminBookingsPage from '@/pages/admin/AdminBookingsPage';

function App() {
  return (
    <Routes>
      {/* ── Customer Facing Layout & Pages ── */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ── Admin Dashboard (Requires ADMIN Role) ── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="movies" element={<AdminMoviesPage />} />
        <Route path="theatres" element={<AdminTheatresPage />} />
        <Route path="screens" element={<AdminScreensPage />} />
        <Route path="shows" element={<AdminShowsPage />} />
        <Route path="pricing" element={<AdminPricingPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
