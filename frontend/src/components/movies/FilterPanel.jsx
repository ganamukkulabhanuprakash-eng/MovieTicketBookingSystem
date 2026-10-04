import React from 'react';
import { ChevronDown, X } from 'lucide-react';

// Reusable labelled select with a custom chevron icon
function FilterSelect({ label, value, onChange, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-text-muted select-none">
        {label}
      </label>
      <div className="relative min-w-[140px]">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none bg-surface border border-border text-text-primary text-sm rounded-md
                     py-2 pl-3 pr-9 outline-none cursor-pointer
                     focus:border-primary focus:ring-1 focus:ring-primary
                     hover:border-border-hover transition-colors"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function FilterPanel({ filters, onFilterChange, genres = [], languages = [] }) {

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.genre !== 'All' ||
    filters.language !== 'All' ||
    filters.status !== 'All' ||
    filters.sort !== 'Release Date';

  const clearFilters = () => {
    onFilterChange({ genre: 'All', language: 'All', status: 'All', sort: 'Release Date' });
  };

  return (
    <div className="w-full bg-surface-elevated border border-border rounded-xl p-4">
      <div className="flex flex-wrap items-end gap-4">

        {/* Genre */}
        <FilterSelect
          label="Genre"
          value={filters.genre || 'All'}
          onChange={(e) => handleChange('genre', e.target.value)}
        >
          <option value="All">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </FilterSelect>

        {/* Language */}
        <FilterSelect
          label="Language"
          value={filters.language || 'All'}
          onChange={(e) => handleChange('language', e.target.value)}
        >
          <option value="All">All Languages</option>
          {languages.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </FilterSelect>

        {/* Status */}
        <FilterSelect
          label="Status"
          value={filters.status || 'All'}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Now Showing">Now Showing</option>
          <option value="Coming Soon">Coming Soon</option>
        </FilterSelect>

        {/* Sort By */}
        <FilterSelect
          label="Sort By"
          value={filters.sort || 'Release Date'}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          <option value="Release Date">Release Date</option>
          <option value="Rating">Rating</option>
          <option value="Title">Title (A–Z)</option>
        </FilterSelect>

        {/* Clear Filters — only shown when something is active */}
        {hasActiveFilters && (
          <div className="flex flex-col gap-1">
            {/* invisible label spacer so button aligns with select bottoms */}
            <span className="text-xs invisible select-none">clear</span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary
                         hover:text-text-primary border border-border hover:border-border-hover
                         bg-surface hover:bg-surface-elevated rounded-md px-3 py-2
                         transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
