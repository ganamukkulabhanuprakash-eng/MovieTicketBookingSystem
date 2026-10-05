import React, { useState, useEffect } from 'react';
import {
  BookOpen, Search, User, Film, Building2, Calendar,
  CreditCard, IndianRupee, Layers, CheckCircle2, Clock, XCircle
} from 'lucide-react';
import { adminApi } from '@/services/api';
import { AdminError, PageHeader } from '@/components/admin/AdminUI';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings', err);
      setError(err.message || 'Failed to load bookings log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const filteredBookings = bookings.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.bookingNumber?.toLowerCase().includes(q) ||
      b.userName?.toLowerCase().includes(q) ||
      b.userEmail?.toLowerCase().includes(q) ||
      b.movieTitle?.toLowerCase().includes(q) ||
      b.theatreName?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-surface-elevated text-text-secondary border border-border">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'PAID':
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Paid
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs text-text-muted bg-surface-elevated border border-border">
            {status || 'N/A'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Bookings Log (Read Only)"
        subtitle="Historical audit log of customer ticket reservations, booked seats, and transactions."
      />

      {/* Search Toolbar */}
      <div className="bg-surface border border-border p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking #, user email, or movie..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="text-xs text-text-secondary w-full sm:w-auto text-right">
          Total: <span className="font-semibold text-text-primary">{filteredBookings.length}</span> Bookings
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <AdminError message={error} onRetry={fetchBookings} />
      ) : filteredBookings.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-text-primary">No bookings found</h3>
          <p className="text-sm text-text-secondary mt-1">
            {search ? 'No results matched your search keyword.' : 'Customer ticket purchases will appear here in real time.'}
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated border-b border-border text-xs text-text-muted uppercase">
                <tr>
                  <th className="px-4 py-3.5">Booking #</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Movie</th>
                  <th className="px-4 py-3.5">Venue & Screen</th>
                  <th className="px-4 py-3.5">Show Date/Time</th>
                  <th className="px-4 py-3.5">Seats</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-elevated/50 transition-colors">
                    {/* Booking Number */}
                    <td className="px-4 py-3.5 font-mono font-bold text-xs text-primary">
                      {b.bookingNumber}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-text-primary">{b.userName}</div>
                      <div className="text-xs text-text-muted">{b.userEmail}</div>
                    </td>

                    {/* Movie */}
                    <td className="px-4 py-3.5 font-medium text-text-primary">
                      {b.movieTitle}
                    </td>

                    {/* Venue & Screen */}
                    <td className="px-4 py-3.5 text-xs text-text-secondary">
                      <div>{b.theatreName}</div>
                      <div className="text-text-muted">{b.screenName}</div>
                    </td>

                    {/* Date / Time */}
                    <td className="px-4 py-3.5 text-xs">
                      <div className="text-text-primary">{b.showDate}</div>
                      <div className="text-text-muted">{b.showTime}</div>
                    </td>

                    {/* Seats */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {Array.isArray(b.seatLabels) && b.seatLabels.map((seat, i) => (
                          <span
                            key={i}
                            className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface-elevated text-text-primary border border-border"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-text-muted block mt-0.5">
                        {b.seatCount} {b.seatCount === 1 ? 'seat' : 'seats'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 font-semibold text-emerald-400">
                      {formatCurrency(b.totalAmount)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      {getStatusBadge(b.status)}
                    </td>

                    {/* Payment */}
                    <td className="px-4 py-3.5">
                      {getPaymentBadge(b.paymentStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
