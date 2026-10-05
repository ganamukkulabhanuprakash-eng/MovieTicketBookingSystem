import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Shield, LogOut, Ticket, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import api from '@/services/api';

export default function ProfilePage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingBookings(true);
      api.getMyBookings()
        .then(data => {
          setBookings(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error("Failed to load customer bookings", err);
          setBookings([]);
        })
        .finally(() => setLoadingBookings(false));
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center min-h-[60vh] flex flex-col items-center justify-center">
        <User className="w-16 h-16 text-text-muted mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">You are not signed in</h1>
        <p className="text-sm text-text-secondary mb-6">
          Sign in to view your account details and manage ticket reservations.
        </p>
        <Link to="/login">
          <Button>Sign In to CineVault</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[70vh] space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>
        {isAdmin && (
          <Link to="/admin">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Open Admin Dashboard
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-text-primary flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Account Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-surface-elevated border border-border">
            <div className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </div>
            <div className="font-semibold text-text-primary text-base">{user?.name}</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border">
            <div className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </div>
            <div className="font-semibold text-text-primary text-base">{user?.email}</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border md:col-span-2">
            <div className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> System Role
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isAdmin
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
              }`}>
                {user?.role}
              </span>
              <span className="text-xs text-text-muted">
                {isAdmin ? 'Has administrator privileges to manage movies and bookings' : 'Standard customer account'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            My Bookings ({bookings.length})
          </h2>
          <Link to="/movies">
            <Button variant="ghost" size="sm" className="text-xs">
              Book More Tickets →
            </Button>
          </Link>
        </div>

        {loadingBookings ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-text-muted bg-surface-elevated rounded-xl border border-border border-dashed">
            <Ticket className="w-10 h-10 mx-auto text-text-muted/40 mb-3" />
            <p className="text-sm">No ticket bookings recorded on this account yet.</p>
            <Link to="/movies" className="text-xs text-primary hover:underline mt-2 inline-block">
              Browse currently showing movies →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div 
                key={b.id || b.bookingNumber} 
                className="bg-surface-elevated border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-border mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted uppercase font-mono">Booking ID:</span>
                    <span className="font-mono font-bold text-primary text-sm">{b.bookingNumber}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    b.status === 'CONFIRMED'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" /> {b.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {b.moviePoster ? (
                    <img 
                      src={b.moviePoster} 
                      alt={b.movieTitle} 
                      className="w-16 h-24 object-cover rounded-lg shrink-0 shadow hidden sm:block" 
                    />
                  ) : null}

                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-lg text-text-primary">{b.movieTitle}</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{b.theatreName} {b.screenName ? `(${b.screenName})` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{b.showDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{b.showTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Seats: <strong className="text-text-primary font-semibold">{Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <span className="text-xs text-text-muted">Total Paid</span>
                    <span className="text-xl font-bold text-primary">₹{Number(b.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
