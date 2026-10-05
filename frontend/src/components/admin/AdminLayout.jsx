import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Film, Building2, MonitorPlay, CalendarDays,
  IndianRupee, BookOpen, Menu, X, LogOut, Clapperboard, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Overview',  path: '/admin',           icon: LayoutDashboard },
  { label: 'Movies',    path: '/admin/movies',     icon: Film },
  { label: 'Theatres',  path: '/admin/theatres',   icon: Building2 },
  { label: 'Screens',   path: '/admin/screens',    icon: MonitorPlay },
  { label: 'Shows',     path: '/admin/shows',      icon: CalendarDays },
  { label: 'Pricing',   path: '/admin/pricing',    icon: IndianRupee },
  { label: 'Bookings',  path: '/admin/bookings',   icon: BookOpen },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-surface border-r border-border w-64">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
        <Clapperboard className="w-6 h-6 text-primary" />
        <div>
          <div className="text-sm font-bold text-text-primary">CineVault</div>
          <div className="text-xs text-primary font-medium">Admin Panel</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
              isActive(path)
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {isActive(path) && <ChevronRight className="w-3 h-3 ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-border p-4">
        <div className="text-xs text-text-muted mb-1">Signed in as</div>
        <div className="text-sm font-medium text-text-primary truncate">{user?.name}</div>
        <div className="text-xs text-text-muted truncate mb-3">{user?.email}</div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="flex-1 text-center text-xs text-text-secondary hover:text-primary transition-colors py-1.5 px-2 rounded-md hover:bg-surface-elevated"
          >
            ← Customer View
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-text-secondary hover:text-red-400 transition-colors py-1.5 px-2 rounded-md hover:bg-surface-elevated"
          >
            <LogOut className="w-3 h-3" /> Sign out
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-canvas text-text-primary overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 h-14 bg-surface border-b border-border shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-secondary hover:text-text-primary p-1"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-sm font-bold text-text-primary">Admin Panel</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
