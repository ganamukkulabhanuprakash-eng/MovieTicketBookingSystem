import React from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Film } from 'lucide-react';

export default function MovieGrid({ movies = [], loading = false }) {
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="w-full py-12">
        <EmptyState 
          title="No movies found" 
          description="We couldn't find any movies matching your criteria. Try adjusting your filters or search term."
          icon={Film}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
