import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Search, Edit2, Power, AlertCircle, Check, X,
  MapPin, Sparkles, MonitorPlay
} from 'lucide-react';
import { adminApi } from '@/services/api';
import { StatusBadge, ConfirmDialog, AdminError, PageHeader, FormError } from '@/components/admin/AdminUI';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const INITIAL_THEATRE_FORM = {
  name: '',
  location: '',
  address: '',
  city: 'Hyderabad',
  facilities: 'Dolby Atmos,4K Projection,Recliner Seating,Food Court'
};

export default function AdminTheatresPage() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [formData, setFormData] = useState(INITIAL_THEATRE_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Confirm Dialog
  const [confirmState, setConfirmState] = useState({
    open: false,
    theatre: null,
    action: 'deactivate'
  });

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchTheatres = async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getTheatres(searchQuery);
      setTheatres(data);
    } catch (err) {
      console.error('Failed to load theatres', err);
      setError(err.message || 'Failed to load theatres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTheatres(search);
  };

  const openCreateModal = () => {
    setEditingTheatre(null);
    setFormData(INITIAL_THEATRE_FORM);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (theatre) => {
    setEditingTheatre(theatre);
    setFormData({
      name: theatre.name || '',
      location: theatre.location || '',
      address: theatre.address || '',
      city: theatre.city || 'Hyderabad',
      facilities: Array.isArray(theatre.facilities)
        ? theatre.facilities.join(',')
        : (theatre.facilities || '')
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Theatre name is required';
    if (!formData.location?.trim()) errors.location = 'Location/Area is required (e.g. Banjara Hills)';
    if (!formData.city?.trim()) errors.city = 'City is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (editingTheatre) {
        await adminApi.updateTheatre(editingTheatre.id, formData);
        showToast(`Theatre "${formData.name}" updated successfully.`);
      } else {
        await adminApi.createTheatre(formData);
        showToast(`Theatre "${formData.name}" created successfully.`);
      }
      setIsModalOpen(false);
      fetchTheatres(search);
    } catch (err) {
      console.error('Save theatre failed', err);
      setFormErrors({ submit: err.message || 'Failed to save theatre.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActiveConfirm = async () => {
    const { theatre, action } = confirmState;
    if (!theatre) return;

    try {
      if (action === 'deactivate') {
        await adminApi.deactivateTheatre(theatre.id);
        showToast(`Theatre "${theatre.name}" deactivated.`);
      } else {
        await adminApi.activateTheatre(theatre.id);
        showToast(`Theatre "${theatre.name}" reactivated.`);
      }
      setConfirmState({ open: false, theatre: null, action: 'deactivate' });
      fetchTheatres(search);
    } catch (err) {
      console.error('Toggle active failed', err);
      alert(err.message || 'Failed to update theatre status.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl animate-fade-in text-sm font-medium">
          <Check className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Theatre Management"
        subtitle="Configure Hyderabad cinema locations, addresses, amenities, and operational statuses."
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Theatre
          </button>
        }
      />

      {/* Search and Filters */}
      <div className="bg-surface border border-border p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or area (e.g. Gachibowli, Kukatpally)..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 text-sm bg-surface-elevated hover:bg-border text-text-primary rounded-lg border border-border font-medium transition-colors"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                fetchTheatres('');
              }}
              className="px-2.5 py-2 text-xs text-text-secondary hover:text-text-primary"
            >
              Clear
            </button>
          )}
        </form>

        <div className="text-xs text-text-secondary w-full sm:w-auto text-right">
          Total: <span className="font-semibold text-text-primary">{theatres.length}</span> Hyderabad Theatres
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <AdminError message={error} onRetry={() => fetchTheatres(search)} />
      ) : theatres.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <Building2 className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-text-primary">No theatres found</h3>
          <p className="text-sm text-text-secondary mt-1">Try another search or add a new theatre location.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Theatre
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated border-b border-border text-xs text-text-muted uppercase">
                <tr>
                  <th className="px-4 py-3.5">Theatre Name</th>
                  <th className="px-4 py-3.5">Area / Location</th>
                  <th className="px-4 py-3.5">Address</th>
                  <th className="px-4 py-3.5">Facilities</th>
                  <th className="px-4 py-3.5">Screens</th>
                  <th className="px-4 py-3.5">State</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {theatres.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-elevated/50 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3.5 font-semibold text-text-primary">
                      {t.name}
                    </td>

                    {/* Area / Location */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{t.location}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="px-4 py-3.5 text-text-secondary text-xs max-w-xs truncate">
                      {t.address || '—'}
                    </td>

                    {/* Facilities badges */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {Array.isArray(t.facilities) && t.facilities.length > 0 ? (
                          t.facilities.slice(0, 3).map((f, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-text-secondary border border-border"
                            >
                              {f.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-text-muted">—</span>
                        )}
                        {Array.isArray(t.facilities) && t.facilities.length > 3 && (
                          <span className="text-[10px] text-text-muted">+{t.facilities.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Screens count */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-text-secondary text-xs">
                        <MonitorPlay className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.screenCount ?? 0}</span>
                      </div>
                    </td>

                    {/* State */}
                    <td className="px-4 py-3.5">
                      <StatusBadge active={t.active} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(t)}
                          title="Edit theatre"
                          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmState({
                            open: true,
                            theatre: t,
                            action: t.active ? 'deactivate' : 'activate'
                          })}
                          title={t.active ? 'Deactivate theatre' : 'Reactivate theatre'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            t.active
                              ? 'text-text-secondary hover:text-red-400 hover:bg-red-500/10'
                              : 'text-text-secondary hover:text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !saving && setIsModalOpen(false)} />
          <div className="relative bg-surface border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                {editingTheatre ? 'Edit Theatre' : 'Add New Theatre'}
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
                  Theatre Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. AMB Cinemas"
                  className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <FormError message={formErrors.name} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Area / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Gachibowli, Kukatpally"
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <FormError message={formErrors.location} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.city}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated/50 border border-border rounded-lg text-text-muted cursor-not-allowed"
                  />
                  <p className="text-[10px] text-text-muted mt-0.5">Fixed to Hyderabad, Telangana</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Street Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Beside IKEA, Gachibowli, Hyderabad"
                  className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Facilities (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  placeholder="IMAX, Dolby Atmos, Luxury Recliner, Food Court"
                  className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
                  {saving ? 'Saving...' : editingTheatre ? 'Update Theatre' : 'Create Theatre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmState.open}
        danger={confirmState.action === 'deactivate'}
        title={confirmState.action === 'deactivate' ? 'Deactivate Theatre' : 'Reactivate Theatre'}
        message={
          confirmState.action === 'deactivate'
            ? `Deactivate "${confirmState.theatre?.name}"? New shows will not be permitted for this venue, but historical bookings remain preserved.`
            : `Reactivate "${confirmState.theatre?.name}" to allow scheduling new shows and customer bookings?`
        }
        confirmLabel={confirmState.action === 'deactivate' ? 'Deactivate' : 'Reactivate'}
        onConfirm={handleToggleActiveConfirm}
        onCancel={() => setConfirmState({ open: false, theatre: null, action: 'deactivate' })}
      />
    </div>
  );
}
