import React, { useState, useEffect } from 'react';
import {
  IndianRupee, Edit2, Check, AlertCircle, Sparkles, Film, Building2,
  Clock, ArrowRight, ShieldCheck, X
} from 'lucide-react';
import { adminApi } from '@/services/api';
import { AdminError, PageHeader } from '@/components/admin/AdminUI';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminPricingPage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit price modal
  const [editingShow, setEditingShow] = useState(null);
  const [newBasePrice, setNewBasePrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchShows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getShows();
      setShows(data.filter(s => s.active));
    } catch (err) {
      console.error('Failed to load shows for pricing', err);
      setError(err.message || 'Failed to load pricing table');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const openPriceEditor = (show) => {
    setEditingShow(show);
    setNewBasePrice(String(show.basePrice || '200'));
    setSaveError(null);
  };

  const handlePriceUpdate = async (e) => {
    e.preventDefault();
    const priceVal = Number(newBasePrice);
    if (!priceVal || priceVal <= 0) {
      setSaveError('Price must be greater than 0');
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      await adminApi.updateShowPrice(editingShow.id, priceVal);
      showToast(`Updated ticket price for "${editingShow.movieTitle}" to ₹${priceVal}`);
      setEditingShow(null);
      fetchShows();
    } catch (err) {
      console.error('Price update failed', err);
      setSaveError(err.message || 'Failed to update ticket price');
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (p) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(p || 0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl animate-fade-in text-sm font-medium">
          <Check className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Pricing Management"
        subtitle="Live database-backed ticket pricing configured per screening and tiered by seating category."
      />

      {/* Category Multiplier Information Card */}
      <div className="bg-gradient-to-r from-surface to-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3 text-text-primary font-bold text-base">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Seating Category Dynamic Multipliers
        </div>
        <p className="text-xs text-text-secondary mb-4 max-w-3xl">
          CineVault prices are determined by the screening's <span className="font-semibold text-text-primary">Base Price</span> and adjusted dynamically across seat tiers. All updates persist immediately to the database without rebuilding or restarting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface/80 border border-border/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-text-primary text-sm">Regular Tier</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                1.0x (Base)
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Standard cinema seating across general viewing rows (C through J).
            </p>
          </div>

          <div className="bg-surface/80 border border-border/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-text-primary text-sm">Premium Tier</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                1.5x (Multiplier)
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Prime acoustic and visual sweet-spot rows (A & B) with extra legroom.
            </p>
          </div>

          <div className="bg-surface/80 border border-border/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-text-primary text-sm">Recliner Tier</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                2.0x (Multiplier)
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Motorized plush recliners in IMAX and 4DX premium auditoriums.
            </p>
          </div>
        </div>
      </div>

      {/* Shows Pricing Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <AdminError message={error} onRetry={fetchShows} />
      ) : shows.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center text-text-secondary">
          No active shows currently available to configure prices.
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-text-primary text-sm">Active Screening Pricing Table</h3>
            <span className="text-xs text-text-secondary">{shows.length} screenings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated border-b border-border text-xs text-text-muted uppercase">
                <tr>
                  <th className="px-4 py-3.5">Movie</th>
                  <th className="px-4 py-3.5">Venue & Screen</th>
                  <th className="px-4 py-3.5">Date & Time</th>
                  <th className="px-4 py-3.5 text-center">Regular (1.0x)</th>
                  <th className="px-4 py-3.5 text-center">Premium (1.5x)</th>
                  <th className="px-4 py-3.5 text-center">Recliner (2.0x)</th>
                  <th className="px-4 py-3.5 text-right">Edit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {shows.map((s) => {
                  const base = Number(s.basePrice || 0);
                  const prem = base * 1.5;
                  const recl = base * 2.0;

                  return (
                    <tr key={s.id} className="hover:bg-surface-elevated/50 transition-colors">
                      {/* Movie */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-text-primary line-clamp-1">{s.movieTitle}</div>
                      </td>

                      {/* Venue & Screen */}
                      <td className="px-4 py-3.5 text-text-secondary text-xs">
                        <div>{s.theatreName}</div>
                        <span className="text-primary font-medium">{s.screenName} ({s.screenType})</span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3.5 text-xs">
                        <div className="text-text-primary font-medium">{s.showDate}</div>
                        <div className="text-text-muted">{s.formattedTime || s.showTime}</div>
                      </td>

                      {/* Regular Price */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-bold text-emerald-400">
                          {formatPrice(base)}
                        </span>
                      </td>

                      {/* Premium Price */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-medium text-indigo-400">
                          {formatPrice(prem)}
                        </span>
                      </td>

                      {/* Recliner Price */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-medium text-amber-400">
                          {formatPrice(recl)}
                        </span>
                      </td>

                      {/* Edit Button */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => openPriceEditor(s)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-border text-text-primary text-xs font-medium border border-border transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {editingShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !saving && setEditingShow(null)} />
          <div className="relative bg-surface border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-lg font-bold text-text-primary">Adjust Show Pricing</h3>
              <button
                onClick={() => setEditingShow(null)}
                disabled={saving}
                className="text-text-muted hover:text-text-primary p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 text-xs text-text-secondary space-y-1">
              <div><strong className="text-text-primary">Movie:</strong> {editingShow.movieTitle}</div>
              <div><strong className="text-text-primary">Venue:</strong> {editingShow.theatreName} - {editingShow.screenName}</div>
              <div><strong className="text-text-primary">Time:</strong> {editingShow.showDate} @ {editingShow.formattedTime}</div>
            </div>

            {saveError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {saveError}
              </div>
            )}

            <form onSubmit={handlePriceUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  New Base Ticket Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-text-muted">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={newBasePrice}
                    onChange={(e) => setNewBasePrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-bold"
                  />
                </div>
              </div>

              {/* Dynamic preview */}
              <div className="bg-surface-elevated p-3 rounded-lg border border-border text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Regular (1.0x):</span>
                  <span className="font-semibold text-emerald-400">₹{Number(newBasePrice || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Premium (1.5x):</span>
                  <span className="font-semibold text-indigo-400">₹{(Number(newBasePrice || 0) * 1.5).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Recliner (2.0x):</span>
                  <span className="font-semibold text-amber-400">₹{(Number(newBasePrice || 0) * 2.0).toFixed(0)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setEditingShow(null)}
                  className="px-4 py-2 text-sm rounded-lg bg-surface-elevated text-text-primary hover:bg-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm rounded-lg bg-primary hover:bg-primary-hover text-white font-medium shadow-md transition-colors"
                >
                  {saving ? 'Updating...' : 'Save Price'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
