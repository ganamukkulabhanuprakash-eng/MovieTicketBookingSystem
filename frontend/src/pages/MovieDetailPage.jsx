import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { motion } from 'framer-motion';
import Rating from '@/components/ui/Rating';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Clock, Calendar, Globe, Star, Users, Play, ChevronLeft } from 'lucide-react';

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await api.getMovieById(id);
        if (data) {
          setMovie(data);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch movie');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">{error || 'Movie not found'}</h2>
        <Link to="/movies">
          <Button variant="secondary">Back to Movies</Button>
        </Link>
      </div>
    );
  }

  const hours = Math.floor(movie.duration / 60);
  const mins = movie.duration % 60;
  const formattedDuration = `${hours}h ${mins}m`;

  const releaseDate = new Date(movie.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-canvas pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-surface-elevated overflow-hidden">
        <img 
          src={movie.backdrop || movie.poster || '/placeholder-backdrop.jpg'} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/50 to-transparent" />
        
        <div className="absolute top-8 left-4 md:left-8 z-10">
          <Link to="/movies" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors bg-canvas/40 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
            <ChevronLeft className="w-5 h-5" /> Back to Movies
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-32 md:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Poster - hidden on mobile */}
          <div className="hidden md:block w-64 lg:w-80 shrink-0">
            <motion.img 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              src={movie.poster || '/placeholder-poster.jpg'} 
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl border border-border bg-surface-elevated object-cover aspect-[2/3]"
            />
          </div>

          {/* Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 space-y-6 pt-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-xl text-text-secondary italic mt-2">"{movie.tagline}"</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Rating value={movie.rating} max={10} size="lg" />
              <div className="w-px h-6 bg-border hidden sm:block"></div>
              <div className="flex flex-wrap gap-2">
                {movie.genre?.map(g => (
                  <Badge key={g} variant="secondary">{g}</Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm font-medium text-text-primary bg-surface-elevated/50 backdrop-blur-md p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> {formattedDuration}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" /> {movie.language}
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" /> {movie.certification}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> {releaseDate}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div>
                <h3 className="text-text-muted text-sm font-medium mb-1">Director</h3>
                <p className="text-text-primary font-medium">{movie.director || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-text-muted text-sm font-medium mb-1 flex items-center gap-1">
                  <Users className="w-4 h-4" /> Cast
                </h3>
                <p className="text-text-primary font-medium line-clamp-2">
                  {movie.cast?.join(', ') || 'N/A'}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-lg font-bold text-text-primary mb-2">About the Movie</h3>
              <p className="text-text-secondary leading-relaxed text-lg">
                {movie.description}
              </p>
            </div>

            <div className="pt-6 flex flex-wrap gap-4">
              <Link to={`/booking/${movie.id}`}>
                <Button size="lg" className="px-10 text-lg font-semibold flex items-center gap-2 shadow-lg shadow-primary/20">
                  <TicketIcon className="w-5 h-5" /> Book Tickets
                </Button>
              </Link>
              <Button size="lg" variant="secondary" className="px-8 flex items-center gap-2">
                <Play className="w-5 h-5" /> Watch Trailer
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TicketIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
