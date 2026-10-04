import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import MovieCarousel from '@/components/movies/MovieCarousel';
import MovieGrid from '@/components/movies/MovieGrid';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Film, Calendar } from 'lucide-react';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [allMovies, featured] = await Promise.all([
          api.getMovies(),
          api.getFeaturedMovies()
        ]);
        setMovies(allMovies);
        setFeaturedMovies(featured);
      } catch (error) {
        console.error("Error fetching home page data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const nowShowing = movies.filter(m => m.status === 'now_showing').slice(0, 8);
  const comingSoon = movies.filter(m => m.status === 'coming_soon').slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Carousel */}
      <MovieCarousel movies={featuredMovies} />

      <main className="container mx-auto px-4 md:px-8 py-12 flex flex-col gap-16">
        
        {/* Now Showing Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Now Showing</h2>
            </div>
            <Link to="/movies" className="text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors">
              See All <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
          <MovieGrid movies={nowShowing} />
        </section>

        {/* Coming Soon Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Coming Soon</h2>
            </div>
            <Link to="/movies?status=coming_soon" className="text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors">
              See All <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
          <MovieGrid movies={comingSoon} />
        </section>
      </main>

      {/* CTA Section */}
      <section className="bg-surface-elevated border-t border-border py-16 mt-8">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <h2 className="text-4xl font-extrabold text-text-primary">
              Ready for the ultimate movie experience?
            </h2>
            <p className="text-lg text-text-secondary">
              Book your tickets now and enjoy the best seats in the house.
            </p>
            <Link to="/movies">
              <Button size="lg" className="mt-4 px-8 text-lg">
                Browse All Movies
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
