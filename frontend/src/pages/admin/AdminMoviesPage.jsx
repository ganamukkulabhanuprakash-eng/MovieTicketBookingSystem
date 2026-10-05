import React, { useState, useEffect } from 'react';
import {
  Film, Plus, Search, Edit2, Power, Eye, AlertCircle, CheckCircle,
  X, Image as ImageIcon, Star, Clock, Calendar, Check
} from 'lucide-react';
import { adminApi } from '@/services/api';
import { StatusBadge, ConfirmDialog, AdminError, PageHeader, FormError, InlineLoading } from '@/components/admin/AdminUI';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const INITIAL_FORM = {
  title: '',
  tagline: '',
  description: '',
  genre: 'Action,Thriller',
  duration: 120,
  rating: 8.0,
  releaseDate: new Date().toISOString().split('T')[0],
  language: 'Telugu',
  certification: 'U/A',
  director: '',
  castMembers: '',
  posterUrl: '',
  backdropUrl: '',
  featured: false,
  status: 'now_showing'
};

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [posterError, setPosterError] = useState(false);

  // Deactivate/Activate Confirm Modal
  const [confirmState, setConfirmState] = useState({
    open: false,
    movie: null,
    action: 'deactivate'
  });

  // Success message toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchMovies = async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getMovies(searchQuery);
      setMovies(data);
    } catch (err) {
      console.error('Failed to load movies', err);
      setError(err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies(search);
  };

  const openCreateModal = () => {
    setEditingMovie(null);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setPosterError(false);
    setIsModalOpen(true);
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      tagline: movie.tagline || '',
      description: movie.description || '',
      genre: Array.isArray(movie.genre) ? movie.genre.join(',') : (movie.genre || ''),
      duration: movie.duration || 120,
      rating: movie.rating || 7.5,
      releaseDate: movie.releaseDate || new Date().toISOString().split('T')[0],
      language: movie.language || 'Telugu',
      certification: movie.certification || 'U/A',
      director: movie.director || '',
      castMembers: Array.isArray(movie.cast) ? movie.cast.join(',') : (movie.cast || ''),
      posterUrl: movie.posterUrl || '',
      backdropUrl: movie.backdropUrl || '',
      featured: Boolean(movie.featured),
      status: movie.status || 'now_showing'
    });
    setFormErrors({});
    setPosterError(false);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.genre?.trim()) errors.genre = 'Genre is required';
    if (!formData.language?.trim()) errors.language = 'Language is required';
    if (!formData.duration || formData.duration < 1) errors.duration = 'Duration must be at least 1 min';
    if (formData.rating && (formData.rating < 0 || formData.rating > 10)) {
      errors.rating = 'Rating must be between 0.0 and 10.0';
    }
    if (formData.posterUrl && !formData.posterUrl.startsWith('http')) {
      errors.posterUrl = 'Poster URL must start with http:// or https://';
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
        ...formData,
        duration: Number(formData.duration),
        rating: formData.rating ? Number(formData.rating) : null,
      };

      if (editingMovie) {
        await adminApi.updateMovie(editingMovie.id, payload);
        showToast(`Movie "${formData.title}" updated successfully.`);
      } else {
        await adminApi.createMovie(payload);
        showToast(`Movie "${formData.title}" created successfully.`);
      }

      setIsModalOpen(false);
      fetchMovies(search);
    } catch (err) {
      console.error('Save failed', err);
      setFormErrors({ submit: err.message || 'Failed to save movie.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActiveConfirm = async () => {
    const { movie, action } = confirmState;
    if (!movie) return;

    try {
      if (action === 'deactivate') {
        await adminApi.deactivateMovie(movie.id);
        showToast(`Movie "${movie.title}" deactivated.`);
      } else {
        await adminApi.activateMovie(movie.id);
        showToast(`Movie "${movie.title}" reactivated.`);
      }
      setConfirmState({ open: false, movie: null, action: 'deactivate' });
      fetchMovies(search);
    } catch (err) {
      console.error('Toggle active failed', err);
      alert(err.message || 'Failed to change movie status.');
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
        title="Movie Management"
        subtitle="Add, modify, monitor poster visuals, and activate or deactivate movies."
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Movie
          </button>
        }
      />

      {/* Search and Filters Bar */}
      <div className="bg-surface border border-border p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies by title..."
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
                fetchMovies('');
              }}
              className="px-2.5 py-2 text-xs text-text-secondary hover:text-text-primary"
            >
              Clear
            </button>
          )}
        </form>

        <div className="text-xs text-text-secondary w-full sm:w-auto text-right">
          Total: <span className="font-semibold text-text-primary">{movies.length}</span> movies
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <AdminError message={error} onRetry={() => fetchMovies(search)} />
      ) : movies.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <Film className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-text-primary">No movies found</h3>
          <p className="text-sm text-text-secondary mt-1">Try searching with a different keyword or create a new movie.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Movie
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated border-b border-border text-xs text-text-muted uppercase">
                <tr>
                  <th className="px-4 py-3.5">Poster & Title</th>
                  <th className="px-4 py-3.5">Genre</th>
                  <th className="px-4 py-3.5">Language</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-4 py-3.5">Rating</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">State</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {movies.map((m) => (
                  <tr key={m.id} className="hover:bg-surface-elevated/50 transition-colors">
                    {/* Poster + Title */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded-md overflow-hidden bg-surface-elevated shrink-0 border border-border/80 flex items-center justify-center">
                          {m.posterUrl ? (
                            <img
                              src={m.posterUrl}
                              alt={m.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span class="text-[9px] text-text-muted">No Image</span>';
                              }}
                            />
                          ) : (
                            <span className="text-[9px] text-text-muted text-center px-1">No poster</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-text-primary line-clamp-1">{m.title}</div>
                          <div className="text-xs text-text-muted">Release: {m.releaseDate || 'N/A'}</div>
                          {m.certification && (
                            <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-surface-elevated text-text-secondary border border-border mt-0.5">
                              {m.certification}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Genre */}
                    <td className="px-4 py-3 text-text-secondary">
                      {Array.isArray(m.genre) ? m.genre.slice(0, 2).join(', ') : m.genre}
                    </td>

                    {/* Language */}
                    <td className="px-4 py-3 text-text-secondary">
                      {m.language}
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-3 text-text-secondary">
                      {m.duration}m
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-amber-400 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{m.rating ? m.rating.toFixed(1) : '-'}</span>
                      </div>
                    </td>

                    {/* Showing / Coming soon */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs capitalize ${
                        m.status === 'now_showing'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-indigo-500/10 text-indigo-400'
                      }`}>
                        {m.status ? m.status.replace('_', ' ') : 'Now Showing'}
                      </span>
                    </td>

                    {/* Active State */}
                    <td className="px-4 py-3">
                      <StatusBadge active={m.active} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(m)}
                          title="Edit movie"
                          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmState({
                            open: true,
                            movie: m,
                            action: m.active ? 'deactivate' : 'activate'
                          })}
                          title={m.active ? 'Deactivate movie' : 'Reactivate movie'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            m.active
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

      {/* Create / Edit Movie Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !saving && setIsModalOpen(false)} />
          <div className="relative bg-surface border border-border rounded-2xl p-6 max-w-2xl w-full shadow-2xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <h2 className="text-xl font-bold text-text-primary">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="text-text-muted hover:text-text-primary p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {formErrors.submit && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formErrors.submit}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Title & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Kalki 2898 AD"
                  />
                  <FormError message={formErrors.title} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. The future begins here"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Plot summary..."
                />
              </div>

              {/* Poster URL with live preview */}
              <div className="p-3.5 rounded-xl bg-surface-elevated/70 border border-border space-y-3">
                <label className="block text-xs font-semibold text-text-primary">
                  Poster Image URL & Live Preview *
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1 w-full">
                    <input
                      type="url"
                      value={formData.posterUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, posterUrl: e.target.value });
                        setPosterError(false);
                      }}
                      className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://image-url.com/poster.jpg"
                    />
                    <FormError message={formErrors.posterUrl} />
                    <p className="text-[11px] text-text-muted mt-1">
                      Enter any publicly accessible image URL. Replace freely to test new artwork.
                    </p>
                  </div>

                  {/* Thumbnail Live Preview */}
                  <div className="w-20 h-28 rounded-lg overflow-hidden border border-border bg-surface shrink-0 flex items-center justify-center relative">
                    {formData.posterUrl && !posterError ? (
                      <img
                        src={formData.posterUrl}
                        alt="Poster Preview"
                        className="w-full h-full object-cover"
                        onError={() => setPosterError(true)}
                      />
                    ) : (
                      <div className="text-center p-1">
                        <ImageIcon className="w-6 h-6 text-text-muted mx-auto mb-1" />
                        <span className="text-[9px] text-text-muted block leading-tight">
                          {posterError ? 'Failed to load' : 'Preview'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Genre, Language, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Genre * (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Action, Sci-Fi"
                  />
                  <FormError message={formErrors.genre} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Language *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Telugu, Hindi, English"
                  />
                  <FormError message={formErrors.language} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Duration (mins) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <FormError message={formErrors.duration} />
                </div>
              </div>

              {/* Rating, Release Date, Certification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Rating (0.0 - 10.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <FormError message={formErrors.rating} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Certification
                  </label>
                  <select
                    value={formData.certification}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="U">U (Universal)</option>
                    <option value="U/A">U/A</option>
                    <option value="A">A (Adults Only)</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                  </select>
                </div>
              </div>

              {/* Status and Featured toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Showing Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-primary font-medium">Featured on Homepage Hero</span>
                  </label>
                </div>
              </div>

              {/* Director & Cast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Director
                  </label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. S. S. Rajamouli"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Cast (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.castMembers}
                    onChange={(e) => setFormData({ ...formData, castMembers: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Prabhas, Deepika Padukone"
                  />
                </div>
              </div>

              {/* Backdrop URL */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Backdrop / Banner URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.backdropUrl}
                  onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://image-url.com/backdrop.jpg"
                />
              </div>

              {/* Form buttons */}
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
                  className="px-5 py-2 text-sm rounded-lg bg-primary hover:bg-primary-hover text-white font-medium shadow-md transition-colors flex items-center gap-1.5"
                >
                  {saving ? 'Saving...' : editingMovie ? 'Update Movie' : 'Create Movie'}
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
        title={confirmState.action === 'deactivate' ? 'Deactivate Movie' : 'Reactivate Movie'}
        message={
          confirmState.action === 'deactivate'
            ? `Are you sure you want to deactivate "${confirmState.movie?.title}"? It will no longer appear on the customer browsing page, but existing booking history is safely preserved.`
            : `Reactivate "${confirmState.movie?.title}" so it becomes visible and eligible for show scheduling?`
        }
        confirmLabel={confirmState.action === 'deactivate' ? 'Deactivate' : 'Reactivate'}
        onConfirm={handleToggleActiveConfirm}
        onCancel={() => setConfirmState({ open: false, movie: null, action: 'deactivate' })}
      />
    </div>
  );
}
