import { movies } from '../data/movies.js';
import { theatres } from '../data/theatres.js';
import { getShowsForMovie } from '../data/shows.js';
import { generateSeatLayout } from '../data/seats.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getMovies: async () => {
    await delay(300);
    return movies;
  },
  
  getMovieById: async (id) => {
    await delay(250);
    const movie = movies.find(m => m.id === id);
    if (!movie) throw new Error('Movie not found');
    return movie;
  },
  
  getFeaturedMovies: async () => {
    await delay(200);
    return movies.filter(m => m.featured);
  },
  
  searchMovies: async (query) => {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return movies.filter(m => m.title.toLowerCase().includes(lowerQuery));
  },
  
  filterMovies: async ({ genre, language, certification }) => {
    await delay(350);
    let filtered = movies;
    if (genre) {
      filtered = filtered.filter(m => m.genre.includes(genre));
    }
    if (language) {
      filtered = filtered.filter(m => m.language === language);
    }
    if (certification) {
      filtered = filtered.filter(m => m.certification === certification);
    }
    return filtered;
  },
  
  getTheatres: async () => {
    await delay(200);
    return theatres;
  },
  
  getShowsForMovie: async (movieId) => {
    await delay(300);
    return getShowsForMovie(movieId);
  },
  
  getSeatLayout: async (showId) => {
    await delay(300);
    return generateSeatLayout(showId);
  },
  
  createBooking: async (bookingData) => {
    await delay(500);
    // Simulate successful booking creation
    return {
      success: true,
      bookingId: `BKG-${Math.floor(Math.random() * 1000000)}`,
      ...bookingData,
      createdAt: new Date().toISOString()
    };
  }
};

export default api;
