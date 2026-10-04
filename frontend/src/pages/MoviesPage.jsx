import React, { useState, useEffect, useMemo } from 'react';
import api from '@/services/api';
import SearchBar from '@/components/movies/SearchBar';
import FilterPanel from '@/components/movies/FilterPanel';
import MovieGrid from '@/components/movies/MovieGrid';
import { Film } from 'lucide-react';

const DEFAULT_FILTERS = {
  genre: 'All',
  language: 'All',
  status: 'All',
  sort: 'Release Date',
};

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await api.getMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const uniqueGenres = useMemo(() => {
    const genres = new Set();
    movies.forEach((m) => m.genre?.forEach((g) => genres.add(g)));
    return Array.from(genres).sort();
  }, [movies]);

  const uniqueLanguages = useMemo(() => {
    const langs = new Set(movies.map((m) => m.language).filter(Boolean));
    return Array.from(langs).sort();
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(q));
    }

    if (filters.genre !== 'All') {
      result = result.filter((m) => m.genre?.includes(filters.genre));
    }

    if (filters.language !== 'All') {
      result = result.filter((m) => m.language === filters.language);
    }

    if (filters.status !== 'All') {
      const statusMap = {
        'Now Showing': 'now_showing',
        'Coming Soon': 'coming_soon',
      };
      const mappedStatus = statusMap[filters.status];
      if (mappedStatus) {
        result = result.filter((m) => m.status === mappedStatus);
      }
    }

    result.sort((a, b) => {
      switch (filters.sort) {
        case 'Rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'Title':
          return a.title.localeCompare(b.title);
        case 'Release Date':
        default:
          return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
      }
    });

    return result;
  }, [movies, searchQuery, filters]);

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 flex flex-col gap-6 min-h-[80vh]">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
            <Film className="w-8 h-8 text-primary" aria-hidden="true" />
            Movies
          </h1>
          <p className="text-text-secondary mt-1">
            {loading ? 'Loading…' : `${filteredMovies.length} movie${filteredMovies.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Search bar — full width on mobile, fixed width on sm+ */}
        <div className="w-full sm:w-80 md:w-96 shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search movies…"
          />
        </div>
      </div>

      {/* Filter bar — full width horizontal strip */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        genres={uniqueGenres}
        languages={uniqueLanguages}
      />

      {/* Movie grid */}
      <MovieGrid movies={filteredMovies} loading={loading} />
    </div>
  );
}
