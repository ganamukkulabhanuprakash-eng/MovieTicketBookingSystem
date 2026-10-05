import React, { useState, useEffect } from 'react';
import {
  MonitorPlay, Plus, Edit2, Power, AlertCircle, Check, X,
  Building2, Users, Layers
} from 'lucide-react';
import { adminApi } from '@/services/api';
import { StatusBadge, ConfirmDialog, AdminError, PageHeader, FormError } from '@/components/admin/AdminUI';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const SCREEN_TYPES = ['Standard', 'IMAX', 'Dolby Atmos', '4DX', '3D'];

export default function AdminScreensPage() {
  const [screens, setScreens] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatreId, setSelectedTheatreId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    screenType: 'Standard',
    totalSeats: 120,
    theatreId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Confirm dialog
  const [confirmState, setConfirmState] = useState({
    open: false,
    screen: null
  });

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async (theatreIdFilter = selectedTheatreId) => {
    setLoading(true);
    setError(null);
    try {
      const [screensData, theatresData] = await Promise.all([
        adminApi.getScreens(theatreIdFilter || null),
        adminApi.getTheatres()
      ]);
      setScreens(screensData);
      setTheatres(theatresData);
    } catch (err) {
      console.error('Failed to load screen data', err);
      setError(err.message || 'Failed to load screens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTheatreId]);

  const handleTheatreFilterChange = (e) => {
    const val = e.target.value;
    setSelectedTheatreId(val);
  };

  const openCreateModal = () => {
    setEditingScreen(null);
    setFormData({
      name: '',
      screenType: 'Standard',
      totalSeats: 120,
      theatreId: selectedTheatreId || (theatres[0]?.id ? String(theatres[0].id) : '')
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (screen) => {
    setEditingScreen(screen);
    setFormData({
      name: screen.name || '',
      screenType: screen.screenType || 'Standard',
      totalSeats: screen.totalSeats || 120,
      theatreId: String(screen.theatreId)
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Screen name is required (e.g. Audi 1, IMAX)';
    if (!formData.theatreId) errors.theatreId = 'Please select a theatre';
    if (!editingScreen && (!formData.totalSeats || formData.totalSeats < 1)) {
      errors.totalSeats = 'Must have at least 1 seat';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (editingScreen) {
        await adminApi.updateScreen(editingScreen.id, {
          name: formData.name.trim(),
          screenType: formData.screenType,
          totalSeats: Number(formData.totalSeats),
          theatreId: Number(formData.theatreId)
        });
        showToast(`Screen "${formData.name}" updated successfully.`);
      } else {
        await adminApi.createScreen({
          name: formData.name.trim(),
          screenType: formData.screenType,
          totalSeats: Number(formData.totalSeats),
          theatreId: Number(formData.theatreId)
        });
        showToast(`Screen "${formData.name}" and seating layout created.`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Save screen failed', err);
      setFormErrors({ submit: err.message || 'Failed to save screen.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateConfirm = async () => {
    const { screen } = confirmState;
    if (!screen) return;

    try {
      await adminApi.deactivateScreen(screen.id);
      showToast(`Screen "${screen.name}" deactivated.`);
      setConfirmState({ open: false, screen: null });
      loadData();
    } catch (err) {
      console.error('Deactivate screen failed', err);
      alert(err.message || 'Failed to deactivate screen.');
    }
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
        title="Screen Management"
        subtitle="Manage auditoriums and seating capacities organized by Hyderabad theatre venues."
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Screen
          </button>
        }
      />

      {/* Filter by Theatre Bar */}
      <div className="bg-surface border border-border p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Building2 className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider shrink-0">Filter by Venue:</span>
          <select
            value={selectedTheatreId}
            onChange={handleTheatreFilterChange}
            className="w-full sm:w-72 px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Theatres ({theatres.length})</option>
            {theatres.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.location})
              </option>
            ))}
          </select>
          {selectedTheatreId && (
            <button
              onClick={() => setSelectedTheatreId('')}
              className="text-xs text-text-secondary hover:text-text-primary shrink-0"
            >
              Reset
            </button>
          )}
        </div>

        <div className="text-xs text-text-secondary w-full sm:w-auto text-right">
          Total: <span className="font-semibold text-text-primary">{screens.length}</span> Screens
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <AdminError message={error} onRetry={() => loadData()} />
      ) : screens.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <MonitorPlay className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-text-primary">No screens found</h3>
          <p className="text-sm text-text-secondary mt-1">
            {selectedTheatreId
              ? 'No screens configured for the selected theatre.'
              : 'Start by creating a screen for an active theatre.'}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Screen
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated border-b border-border text-xs text-text-muted uppercase">
                <tr>
                  <th className="px-4 py-3.5">Screen Name</th>
                  <th className="px-4 py-3.5">Theatre Venue</th>
                  <th className="px-4 py-3.5">Screen Technology</th>
                  <th className="px-4 py-3.5">Seat Capacity</th>
                  <th className="px-4 py-3.5">State</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {screens.map((sc) => (
                  <tr key={sc.id} className="hover:bg-surface-elevated/50 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3.5 font-semibold text-text-primary">
                      {sc.name}
                    </td>

                    {/* Theatre */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{sc.theatreName}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        sc.screenType === 'IMAX'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : sc.screenType === 'Dolby Atmos'
                          ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                          : sc.screenType === '4DX'
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-surface-elevated text-text-secondary border border-border'
                      }`}>
                        {sc.screenType || 'Standard'}
                      </span>
                    </td>

                    {/* Seats */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Users className="w-3.5 h-3.5 text-text-muted" />
                        <span>{sc.totalSeats} seats</span>
                      </div>
                    </td>

                    {/* State */}
                    <td className="px-4 py-3.5">
                      <StatusBadge active={sc.active} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(sc)}
                          title="Edit screen details"
                          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {sc.active && (
                          <button
                            onClick={() => setConfirmState({ open: true, screen: sc })}
                            title="Deactivate screen"
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

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !saving && setIsModalOpen(false)} />
          <div className="relative bg-surface border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                {editingScreen ? 'Edit Screen' : 'Add New Screen'}
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
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Theatre Venue *
                </label>
                <select
                  required
                  disabled={Boolean(editingScreen)}
                  value={formData.theatreId}
                  onChange={(e) => setFormData({ ...formData, theatreId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                >
                  <option value="">Select a theatre...</option>
                  {theatres.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.location})
                    </option>
                  ))}
                </select>
                <FormError message={formErrors.theatreId} />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Screen Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Screen 1, IMAX, Audi 3"
                  className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <FormError message={formErrors.name} />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Screen Format / Type *
                </label>
                <select
                  value={formData.screenType}
                  onChange={(e) => setFormData({ ...formData, screenType: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {SCREEN_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Total Seats *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  disabled={Boolean(editingScreen)}
                  value={formData.totalSeats}
                  onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                />
                <FormError message={formErrors.totalSeats} />
                {!editingScreen && (
                  <p className="text-[11px] text-text-muted mt-1">
                    Seats are automatically laid out in standard rows (A-J) with Regular, Premium, and Recliner categories.
                  </p>
                )}
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
                  {saving ? 'Saving...' : editingScreen ? 'Update Screen' : 'Create Screen'}
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
        title="Deactivate Screen"
        message={`Deactivate "${confirmState.screen?.name}" at ${confirmState.screen?.theatreName}? It will no longer be eligible for newly scheduled shows.`}
        confirmLabel="Deactivate"
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setConfirmState({ open: false, screen: null })}
      />
    </div>
  );
}
