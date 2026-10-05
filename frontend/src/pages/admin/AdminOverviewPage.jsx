import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Film, Building2, MonitorPlay, CalendarDays, IndianRupee,
  BookOpen, PlusCircle, ArrowUpRight, TrendingUp, AlertCircle
} from 'lucide-react';
import { adminApi } from '@/services/api';
import { StatCard, AdminError } from '@/components/admin/AdminUI';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <AdminError message={error} onRetry={fetchStats} />;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-surface to-surface-elevated border border-border p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary">
            Admin Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time management for movies, theatres, screens, shows, and ticketing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/movies"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-md transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Manage Movies
          </Link>
          <Link
            to="/admin/shows"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-elevated hover:bg-border text-text-primary border border-border text-xs font-semibold transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Schedule Shows
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Movies"
          value={stats?.totalMovies ?? 0}
          subtitle={`${stats?.activeMovies ?? 0} active now`}
          icon={Film}
          color="text-primary"
        />
        <StatCard
          label="Theatres in Hyderabad"
          value={stats?.totalTheatres ?? 0}
          subtitle={`${stats?.activeTheatres ?? 0} active locations`}
          icon={Building2}
          color="text-sky-400"
        />
        <StatCard
          label="Total Screens"
          value={stats?.totalScreens ?? 0}
          subtitle="Across all multiplexes"
          icon={MonitorPlay}
          color="text-amber-400"
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats?.totalRevenue)}
          subtitle={`${stats?.totalBookings ?? 0} total bookings`}
          icon={IndianRupee}
          color="text-emerald-400"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider font-medium">Scheduled Shows</span>
            <div className="text-2xl font-bold text-text-primary mt-1">{stats?.totalShows ?? 0}</div>
            <div className="text-xs text-text-secondary mt-0.5">{stats?.activeShows ?? 0} active screenings</div>
          </div>
          <CalendarDays className="w-8 h-8 text-indigo-400 opacity-80" />
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider font-medium">Customer Bookings</span>
            <div className="text-2xl font-bold text-text-primary mt-1">{stats?.totalBookings ?? 0}</div>
            <div className="text-xs text-emerald-400 mt-0.5">Recorded in database</div>
          </div>
          <BookOpen className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider font-medium">Target Location</span>
            <div className="text-2xl font-bold text-text-primary mt-1">Hyderabad</div>
            <div className="text-xs text-text-secondary mt-0.5">Telangana, India</div>
          </div>
          <Building2 className="w-8 h-8 text-purple-400 opacity-80" />
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-4">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/movies"
            className="group bg-surface hover:bg-surface-elevated border border-border hover:border-primary/50 p-5 rounded-xl transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Film className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                  Movies Management
                </h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <p className="text-xs text-text-secondary">
              Add new films, configure posters, durations, certifications, genres, and toggle active status.
            </p>
          </Link>

          <Link
            to="/admin/theatres"
            className="group bg-surface hover:bg-surface-elevated border border-border hover:border-primary/50 p-5 rounded-xl transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-text-primary group-hover:text-sky-400 transition-colors">
                  Theatres Management
                </h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-sky-400 transition-colors" />
            </div>
            <p className="text-xs text-text-secondary">
              Manage cinema halls across Hyderabad locations, addresses, facilities, and active chains.
            </p>
          </Link>

          <Link
            to="/admin/screens"
            className="group bg-surface hover:bg-surface-elevated border border-border hover:border-primary/50 p-5 rounded-xl transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <MonitorPlay className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-text-primary group-hover:text-amber-400 transition-colors">
                  Screens & Auditoriums
                </h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-amber-400 transition-colors" />
            </div>
            <p className="text-xs text-text-secondary">
              View auditoriums by theatre, configure screen types (IMAX, Dolby Atmos, 4DX), and seat counts.
            </p>
          </Link>

          <Link
            to="/admin/shows"
            className="group bg-surface hover:bg-surface-elevated border border-border hover:border-primary/50 p-5 rounded-xl transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-text-primary group-hover:text-indigo-400 transition-colors">
                  Shows & Schedules
                </h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-xs text-text-secondary">
              Assign movies to screens with dates, showtimes, and validate non-overlapping schedules.
            </p>
          </Link>

          <Link
            to="/admin/pricing"
            className="group bg-surface hover:bg-surface-elevated border border-border hover:border-primary/50 p-5 rounded-xl transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-text-primary group-hover:text-emerald-400 transition-colors">
                  Pricing Configuration
                </h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-emerald-400 transition-colors" />
            </div>
            <p className="text-xs text-text-secondary">
              View category pricing (Regular, Premium, Recliner multipliers) and update show base prices.
            </p>
          </Link>

          <Link
            to="/admin/bookings"
            className="group bg-surface hover:bg-surface-elevated border border-border hover:border-primary/50 p-5 rounded-xl transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-text-primary group-hover:text-purple-400 transition-colors">
                  Bookings Log (Read Only)
                </h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-purple-400 transition-colors" />
            </div>
            <p className="text-xs text-text-secondary">
              Inspect confirmed customer reservations, booked seats, payment statuses, and audit trails.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
