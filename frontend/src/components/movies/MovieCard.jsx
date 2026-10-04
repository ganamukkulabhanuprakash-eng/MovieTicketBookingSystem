import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import Rating from '@/components/ui/Rating';

export default function MovieCard({ movie }) {
  if (!movie) return null;

  // Guard against undefined/null duration
  const duration = movie.duration ?? 0;
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;
  const formattedDuration = duration > 0 ? `${hours}h ${mins}m` : null;

  // Status badge config
  const statusConfig = {
    now_showing: { label: 'Now Showing', className: 'bg-success/10 text-success border-success/20' },
    coming_soon: { label: 'Coming Soon', className: 'bg-info/10 text-info border-info/20' },
  };
  const statusBadge = statusConfig[movie.status];

  return (
    <Link to={`/movies/${movie.id}`} className="group block h-full outline-none" aria-label={`View details for ${movie.title}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex flex-col h-full bg-surface rounded-xl overflow-hidden border border-border
                   group-hover:border-border-hover group-focus-visible:ring-2 group-focus-visible:ring-primary
                   transition-colors"
      >
        {/* ── Poster ── */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-elevated shrink-0">
          <img
            src={movie.poster || '/placeholder-poster.jpg'}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Status badge — top-left */}
          {statusBadge && (
            <span
              className={`absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide
                          px-2 py-0.5 rounded-full border backdrop-blur-sm ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-canvas/85 opacity-0 group-hover:opacity-100
                          transition-opacity duration-300 flex flex-col justify-end p-3">
            <h3 className="text-base font-bold text-text-primary mb-1 line-clamp-2">{movie.title}</h3>
            {movie.rating != null && (
              <div className="mb-2">
                <Rating value={movie.rating} size="sm" />
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {movie.genre?.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-elevated/80
                             text-text-secondary border border-border"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Below-image info ── */}
        <div className="p-3 flex flex-col flex-1 gap-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-2
                         group-hover:text-primary transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between mt-auto pt-1 gap-2 min-w-0">
            {formattedDuration && (
              <span className="text-xs text-text-muted shrink-0">{formattedDuration}</span>
            )}
            <div className="flex gap-1 flex-wrap justify-end min-w-0">
              {movie.genre?.slice(0, 2).map((g) => (
                <Badge key={g} variant="secondary" className="text-[10px] px-1.5 py-0 leading-5 whitespace-nowrap">
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
