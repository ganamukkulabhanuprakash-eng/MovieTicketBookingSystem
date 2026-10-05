import React, { useState, useEffect } from 'react';
import {
  CalendarDays, Plus, Edit2, Power, AlertCircle, Check, X,
  Clock, IndianRupee, Film, Building2, MonitorPlay, Users
} from 'lucide-react';
import { adminApi } from '@/services/api';
import { StatusBadge, ConfirmDialog, AdminError, PageHeader, FormError } from '@/components/admin/AdminUI';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const COMMON_SHOW_TIMES = [
  '10:30:00',
  '13:45:00',
  '16:30:00',
  '19:15:00',
  '22:00:00'
];

export default function AdminShowsPage() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);

  // Filters
  const [filterMovieId, setFilterMovieId] = useState('');
  const [filterTheatreId, setFilterTheatreId] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '10:30:00',
    basePrice: '200'
  });
  const [modalScreens, setModalScreens] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Confirm deactivation
  const [confirmState, setConfirmState] = useState({
    open: false,
    show: null
  });

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadDependencies = async () => {
    try {
      const [moviesData, theatresData] = await Promise.all([
        adminApi.getMovies(),
        adminApi.getTheatres()
      ]);
      setMovies(moviesData.filter(m => m.active));
      setTheatres(theatresData.filter(t => t.active));
    } catch (err) {
      console.error('Failed to load dependency data', err);
    }
  };

  const fetchShows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getShows(
        filterMovieId || null,
        filterTheatreId || null,
        filterDate || null
      );
      setShows(data);
    } catch (err) {
      console.error('Failed to load shows', err);
      setError(err.message || 'Failed to load show schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDependencies();
  }, []);

  useEffect(() => {
    fetchShows();
  }, [filterMovieId, filterTheatreId, filterDate]);

  // When modal theatre changes, load screens for that theatre
  const handleModalTheatreChange = async (theatreId) => {
    setFormData(prev => ({ ...prev, theatreId, screenId: '' }));
    if (!theatreId) {
      setModalScreens([]);
      return;
    }
    try {
      const scr = await adminApi.getScreens(theatreId);
      setModalScreens(scr.filter(s => s.active));
    } catch (err) {
      console.error('Failed to load screens for theatre', err);
    }
  };

  const openCreateModal = () => {
    setEditingShow(null);
    const defaultDate = new Date().toISOString().split('T')[0];
    const initialMovieId = movies[0]?.id ? String(movies[0].id) : '';
    const initialTheatreId = theatres[0]?.id ? String(theatres[0].id) : '';

    setFormData({
      movieId: initialMovieId,
      theatreId: initialTheatreId,
      screenId: '',
      showDate: defaultDate,
      showTime: '10:30:00',
      basePrice: '200'
    });
    setFormErrors({});

    if (initialTheatreId) {
      handleModalTheatreChange(initialTheatreId);
    } else {
      setModalScreens([]);
    }

    setIsModalOpen(true);
  };

  const openEditModal = async (show) => {
    setEditingShow(show);
    setFormData({
      movieId: String(show.movieId),
      theatreId: String(show.theatreId),
      screenId: String(show.screenId),
      showDate: show.showDate || '',
      showTime: show.showTime || '10:30:00',
      basePrice: String(show.basePrice || '200')
    });
    setFormErrors({});

    try {
      const scr = await adminApi.getScreens(show.theatreId);
      setModalScreens(scr);
    } catch (err) {
      console.error('Failed to load screens', err);
    }

    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.movieId) errors.movieId = 'Please select a movie';
    if (!formData.theatreId) errors.theatreId = 'Please select a theatre';
    if (!formData.screenId) errors.screenId = 'Please select a screen';
    if (!formData.showDate) errors.showDate = 'Show date is required';
    if (!formData.showTime) errors.showTime = 'Show time is required';
    if (!formData.basePrice || Number(formData.basePrice) <= 0) {
      errors.basePrice = 'Base price must be greater than 0';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        movieId: Number(formData.movieId),
        screenId: Number(formData.screenId),
        showDate: formData.showDate,
        showTime: formData.showTime.length === 5 ? `${formData.showTime}:00` : formData.showTime,
        basePrice: Number(formData.basePrice)
      };

      if (editingShow) {
        await adminApi.updateShow(editingShow.id, payload);
        showToast('Show schedule updated successfully.');
      } else {
        await adminApi.createShow(payload);
        showToast('Show schedule created successfully.');
      }

      setIsModalOpen(false);
      fetchShows();
    } catch (err) {
      console.error('Save show failed', err);
      setFormErrors({ submit: err.message || 'Failed to schedule show.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateConfirm = async () => {
    const { show } = confirmState;
    if (!show) return;

    try {
      await adminApi.deactivateShow(show.id);
      showToast(`Show for "${show.movieTitle}" at ${show.formattedTime} deactivated.`);
      setConfirmState({ open: false, show: null });
      fetchShows();
    } catch (err) {
      console.error('Deactivate show failed', err);
      alert(err.message || 'Failed to deactivate show.');
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
        title="Show Schedules"
        subtitle="Schedule screenings across Hyderabad cinemas, assign screens, and manage showtimes."
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule Show
          </button>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-surface border border-border p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 items-end">
        {/* Filter by Movie */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Movie</label>
          <select
            value={filterMovieId}
            onChange={(e) => setFilterMovieId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Movies ({movies.length})</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Theatre */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Theatre</label>
          <select
            value={filterTheatreId}
            onChange={(e) => setFilterTheatreId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Theatres ({theatres.length})</option>
            {theatres.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Date */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Clear Filters */}
        <div className="flex items-center gap-2">
          {(filterMovieId || filterTheatreId || filterDate) && (
            <button
              onClick={() => {
                setFilterMovieId('');
                setFilterTheatreId('');
                setFilterDate('');
              }}
              className="px-3 py-2 text-xs text-text-secondary hover:text-text-primary bg-surface-elevated border border-border rounded-lg"
            >
              Reset Filters
            </button>
          )}
          <span className="text-xs text-text-secondary ml-auto">
            {shows.length} shows
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <AdminError message={error} onRetry={fetchShows} />
      ) : shows.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <CalendarDays className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-text-primary">No shows match your criteria</h3>
          <p className="text-sm text-text-secondary mt-1">Adjust your filters or schedule a new screening.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Schedule Show
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated border-b border-border text-xs text-text-muted uppercase">
                <tr>
                  <th className="px-4 py-3.5">Movie</th>
                  <th className="px-4 py-3.5">Theatre Venue</th>
                  <th className="px-4 py-3.5">Screen & Format</th>
                  <th className="px-4 py-3.5">Date & Time</th>
                  <th className="px-4 py-3.5">Base Price</th>
                  <th className="px-4 py-3.5">Bookings</th>
                  <th className="px-4 py-3.5">State</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {shows.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-elevated/50 transition-colors">
                    {/* Movie */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-11 rounded overflow-hidden bg-surface-elevated shrink-0 border border-border">
                          {s.moviePosterUrl ? (
                            <img
                              src={s.moviePosterUrl}
                              alt={s.movieTitle}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <Film className="w-4 h-4 text-text-muted m-auto mt-3" />
                          )}
                        </div>
                        <span className="font-semibold text-text-primary line-clamp-1">{s.movieTitle}</span>
                      </div>
                    </td>

                    {/* Theatre */}
                    <td className="px-4 py-3.5 text-text-secondary">
                      {s.theatreName}
                    </td>

                    {/* Screen */}
                    <td className="px-4 py-3.5">
                      <div className="text-text-primary font-medium">{s.screenName}</div>
                      <span className="text-[10px] text-primary uppercase font-bold">{s.screenType}</span>
                    </td>

                    {/* Date / Time */}
                    <td className="px-4 py-3.5">
                      <div className="text-text-primary text-xs font-medium">{s.showDate}</div>
                      <div className="flex items-center gap-1 text-text-secondary text-xs mt-0.5">
                        <Clock className="w-3 h-3 text-text-muted" />
                        <span>{s.formattedTime || s.showTime}</span>
                      </div>
                    </td>

                    {/* Base Price */}
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-emerald-400">
                        {formatPrice(s.basePrice)}
                      </span>
                    </td>

                    {/* Bookings */}
                    <td className="px-4 py-3.5 text-text-secondary text-xs">
                      {s.bookingCount ?? 0} booked
                    </td>

                    {/* State */}
                    <td className="px-4 py-3.5">
                      <StatusBadge active={s.active} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(s)}
                          title="Edit show"
                          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {s.active && (
                          <button
                            onClick={() => setConfirmState({ open: true, show: s })}
                            title="Deactivate show"
                            className="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Schedule / Edit Show */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !saving && setIsModalOpen(false)} />
          <div className="relative bg-surface border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                {editingShow ? 'Edit Show' : 'Schedule New Show'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="text-text-muted hover:text-text-primary p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.submit && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formErrors.submit}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Movie */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Movie *
                </label>
                <select
                  required
                  value={formData.movieId}
                  onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a movie...</option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
                <FormError message={formErrors.movieId} />
              </div>

              {/* Theatre and Screen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Theatre Venue *
                  </label>
                  <select
                    required
                    value={formData.theatreId}
                    onChange={(e) => handleModalTheatreChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select theatre...</option>
                    {theatres.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <FormError message={formErrors.theatreId} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Screen / Format *
                  </label>
                  <select
                    required
                    value={formData.screenId}
                    onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                    disabled={!formData.theatreId || modalScreens.length === 0}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  >
                    <option value="">
                      {modalScreens.length === 0 ? 'No active screens' : 'Select screen...'}
                    </option>
                    {modalScreens.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.name} ({sc.screenType || 'Standard'})
                      </option>
                    ))}
                  </select>
                  <FormError message={formErrors.screenId} />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Show Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.showDate}
                    onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <FormError message={formErrors.showDate} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Show Time *
                  </label>
                  <select
                    value={formData.showTime}
                    onChange={(e) => setFormData({ ...formData, showTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {COMMON_SHOW_TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time === '10:30:00' && '10:30 AM (Morning)'}
                        {time === '13:45:00' && '1:45 PM (Matinee)'}
                        {time === '16:30:00' && '4:30 PM (Afternoon)'}
                        {time === '19:15:00' && '7:15 PM (Prime Evening)'}
                        {time === '22:00:00' && '10:00 PM (Night)'}
                      </option>
                    ))}
                  </select>
                  <FormError message={formErrors.showTime} />
                </div>
              </div>

              {/* Base Price */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Base Ticket Price (INR ₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-text-muted">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: undefined, basePrice: e.target.value })}
                    placeholder="200"
                    className="w-full pl-8 pr-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <FormError message={formErrors.basePrice} />
                <p className="text-[11px] text-text-muted mt-1">
                  Pricing applies as: Regular = 1.0x (₹{formData.basePrice || 0}), Premium = 1.5x (₹{(Number(formData.basePrice || 0) * 1.5).toFixed(0)}), Recliner = 2.0x (₹{(Number(formData.basePrice || 0) * 2).toFixed(0)})
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-surface-elevated text-text-primary hover:bg-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm rounded-lg bg-primary hover:bg-primary-hover text-white font-medium shadow-md transition-colors"
                >
                  {saving ? 'Scheduling...' : editingShow ? 'Update Show' : 'Schedule Show'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deactivation */}
      <ConfirmDialog
        open={confirmState.open}
        danger={true}
        title="Deactivate Show"
        message={`Deactivate show for "${confirmState.show?.movieTitle}" on ${confirmState.show?.showDate} at ${confirmState.show?.formattedTime}? Existing bookings remain safely stored.`}
        confirmLabel="Deactivate"
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setConfirmState({ open: false, show: null })}
      />
    </div>
  );
}
