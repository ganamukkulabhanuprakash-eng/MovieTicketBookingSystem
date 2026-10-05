/**
 * CineVault API Service
 * Connects to the Spring Boot backend at http://localhost:8080
 * Includes:
 *   - Public customer-facing APIs (movies, shows, theatres)
 *   - Authentication APIs (register, login)
 *   - Admin APIs (CRUD for all entities) — require ADMIN JWT token
 */

const BASE_URL = 'http://localhost:8080/api';

function getToken() {
  try {
    const raw = localStorage.getItem('cinevault_auth');
    return raw ? JSON.parse(raw)?.token : null;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      errorMessage = err.message || err.error || errorMessage;
    } catch { /* ignore parse error */ }
    const error = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login:    (data) => request('/auth/login',    { method: 'POST', body: JSON.stringify(data) }),
};

// ─────────────────────────────────────────────────────────────
// PUBLIC — MOVIES
// ─────────────────────────────────────────────────────────────
export const moviesApi = {
  getAll:      ()      => request('/movies'),
  getById:     (id)    => request(`/movies/${id}`),
  getFeatured: ()      => request('/movies/featured'),
  search:      (query) => request(`/movies/search?query=${encodeURIComponent(query)}`),
};

// ─────────────────────────────────────────────────────────────
// PUBLIC — THEATRES
// ─────────────────────────────────────────────────────────────
export const theatresApi = {
  getAll:   () => request('/theatres'),
  getById:  (id) => request(`/theatres/${id}`),
};

// ─────────────────────────────────────────────────────────────
// PUBLIC — SHOWS
// ─────────────────────────────────────────────────────────────
export const showsApi = {
  getForMovie:      (movieId) => request(`/shows/movie/${movieId}`),
  getById:          (id)      => request(`/shows/${id}`),
  getSeatLayout:    (showId)  => request(`/shows/${showId}/seats`),
};

// ─────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────
export const adminApi = {
  // Dashboard
  getStats: () => request('/admin/stats'),

  // Movies
  getMovies:       (search = '') => request(`/admin/movies${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getMovie:        (id)          => request(`/admin/movies/${id}`),
  createMovie:     (data)        => request('/admin/movies',      { method: 'POST',  body: JSON.stringify(data) }),
  updateMovie:     (id, data)    => request(`/admin/movies/${id}`, { method: 'PUT',   body: JSON.stringify(data) }),
  deactivateMovie: (id)          => request(`/admin/movies/${id}/deactivate`, { method: 'PATCH' }),
  activateMovie:   (id)          => request(`/admin/movies/${id}/activate`,   { method: 'PATCH' }),

  // Theatres
  getTheatres:       (search = '') => request(`/admin/theatres${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getTheatre:        (id)          => request(`/admin/theatres/${id}`),
  createTheatre:     (data)        => request('/admin/theatres',       { method: 'POST',  body: JSON.stringify(data) }),
  updateTheatre:     (id, data)    => request(`/admin/theatres/${id}`,  { method: 'PUT',   body: JSON.stringify(data) }),
  deactivateTheatre: (id)          => request(`/admin/theatres/${id}/deactivate`, { method: 'PATCH' }),
  activateTheatre:   (id)          => request(`/admin/theatres/${id}/activate`,   { method: 'PATCH' }),

  // Screens
  getScreens:       (theatreId)    => request(`/admin/screens${theatreId ? `?theatreId=${theatreId}` : ''}`),
  getScreen:        (id)           => request(`/admin/screens/${id}`),
  createScreen:     (data)         => request('/admin/screens',       { method: 'POST',  body: JSON.stringify(data) }),
  updateScreen:     (id, data)     => request(`/admin/screens/${id}`,  { method: 'PUT',   body: JSON.stringify(data) }),
  deactivateScreen: (id)           => request(`/admin/screens/${id}/deactivate`, { method: 'PATCH' }),

  // Shows
  getShows:       (movieId, theatreId, date) => {
    const params = new URLSearchParams();
    if (movieId)   params.set('movieId',   movieId);
    if (theatreId) params.set('theatreId', theatreId);
    if (date)      params.set('date',      date);
    const qs = params.toString();
    return request(`/admin/shows${qs ? `?${qs}` : ''}`);
  },
  getShow:        (id)         => request(`/admin/shows/${id}`),
  createShow:     (data)       => request('/admin/shows',      { method: 'POST',  body: JSON.stringify(data) }),
  updateShow:     (id, data)   => request(`/admin/shows/${id}`, { method: 'PUT',   body: JSON.stringify(data) }),
  updateShowPrice: (id, basePrice) => request(`/admin/shows/${id}/pricing`, { method: 'PATCH', body: JSON.stringify({ basePrice }) }),
  deactivateShow: (id)         => request(`/admin/shows/${id}/deactivate`, { method: 'PATCH' }),

  // Bookings (admin read-only)
  getBookings: () => request('/admin/bookings'),
};

// ─────────────────────────────────────────────────────────────
// CUSTOMER BOOKINGS API
// ─────────────────────────────────────────────────────────────
export const bookingsApi = {
  create:        (data)          => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getMyBookings: ()              => request('/bookings/my-bookings'),
  getByNumber:   (bookingNumber) => request(`/bookings/${bookingNumber}`),
};

// ─────────────────────────────────────────────────────────────
// Legacy api object — keeps existing customer-facing pages working
// ─────────────────────────────────────────────────────────────
export const api = {
  getMovies:      () => moviesApi.getAll(),
  getMovieById:   (id) => moviesApi.getById(id),
  getFeaturedMovies: () => moviesApi.getFeatured(),
  searchMovies:   (query) => moviesApi.search(query),
  filterMovies:   async ({ genre, language, certification }) => {
    const movies = await moviesApi.getAll();
    return movies.filter(m => {
      const genres = Array.isArray(m.genre) ? m.genre : [m.genre];
      if (genre && !genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))) return false;
      if (language && m.language !== language) return false;
      if (certification && m.certification !== certification) return false;
      return true;
    });
  },
  getTheatres:      () => theatresApi.getAll(),
  getShowsForMovie: (movieId) => showsApi.getForMovie(movieId),
  getSeatLayout:    (showId) => showsApi.getSeatLayout(showId),
  createBooking:    (bookingData) => bookingsApi.create(bookingData),
  getMyBookings:    () => bookingsApi.getMyBookings(),
};

export default api;
