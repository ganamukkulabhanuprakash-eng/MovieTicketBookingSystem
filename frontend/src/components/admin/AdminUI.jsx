import React from 'react';

/**
 * Reusable status badge for active/inactive entities.
 */
export function StatusBadge({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      active
        ? 'bg-green-500/15 text-green-400 border border-green-500/30'
        : 'bg-red-500/15 text-red-400 border border-red-500/30'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? 'bg-green-400' : 'bg-red-400'}`} />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

/**
 * Simple confirmation modal before destructive actions.
 */
export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-surface border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-surface-elevated text-text-primary hover:bg-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              danger
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Page-level error display for admin API failures.
 */
export function AdminError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">Something went wrong</h3>
      <p className="text-sm text-text-secondary mb-6">{message || 'Failed to load data from the server.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * Admin page header with title and optional action button.
 */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/**
 * Stat card for the dashboard overview.
 */
export function StatCard({ label, value, icon: Icon, color = 'text-primary', subtitle }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</span>
        {Icon && <Icon className={`w-5 h-5 ${color}`} />}
      </div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      {subtitle && <div className="text-xs text-text-muted mt-1">{subtitle}</div>}
    </div>
  );
}

/**
 * Search input bar for admin list pages.
 */
export function AdminSearch({ value, onChange, placeholder = 'Search...' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-xs px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
}

/**
 * Inline form error message.
 */
export function FormError({ message }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-400 mt-1">{message}</p>
  );
}

/**
 * Small loading indicator for table rows / forms.
 */
export function InlineLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default { StatusBadge, ConfirmDialog, AdminError, PageHeader, StatCard, AdminSearch, FormError, InlineLoading };
