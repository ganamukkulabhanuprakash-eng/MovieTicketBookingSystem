import React, { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const ShowtimeSelector = ({ shows = [], theatres = [], selectedShow, onShowSelect }) => {
  const formatDateKey = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();
  const [selectedDateKey, setSelectedDateKey] = useState(() => formatDateKey(new Date()));

  // Group shows by theatre
  const groupedShows = theatres.reduce((acc, theatre) => {
    // Filter shows for this theatre and selected date
    const theatreShows = shows.filter(show => {
      if (show.theatreId !== theatre.id) return false;
      const showDateKey = typeof show.date === 'string'
        ? show.date.split('T')[0]
        : formatDateKey(new Date(show.date));
      return showDateKey === selectedDateKey;
    });

    if (theatreShows.length > 0) {
      acc.push({
        theatre,
        shows: theatreShows.sort((a, b) => (a.time || '').localeCompare(b.time || ''))
      });
    }
    return acc;
  }, []);

  const formatDateLabel = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div>
        <h3 className="text-text-primary font-medium mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Select Date
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {dates.map((date) => {
            const key = formatDateKey(date);
            const isSelected = key === selectedDateKey;
            return (
              <button
                key={key}
                onClick={() => setSelectedDateKey(key)}
                className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-xl border transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border bg-surface hover:bg-surface-elevated text-text-muted'
                }`}
              >
                <span className="text-xs font-medium uppercase">{formatDateLabel(date)}</span>
                <span className={`text-xl font-bold mt-1 ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                  {date.getDate()}
                </span>
                <span className="text-xs mt-1">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theatres & Showtimes */}
      <div className="space-y-6">
        {groupedShows.length === 0 ? (
          <div className="text-center py-8 text-text-muted bg-surface rounded-xl border border-border">
            No shows available for the selected date.
          </div>
        ) : (
          groupedShows.map(({ theatre, shows }) => (
            <div key={theatre.id} className="bg-surface border border-border rounded-xl p-5">
              {/* Theatre Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
                <div>
                  <h4 className="text-lg font-bold text-text-primary">{theatre.name}</h4>
                  <div className="flex items-center text-text-muted text-sm mt-1 gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {theatre.location}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {theatre.facilities?.map((facility, index) => (
                    <Badge key={index} variant="secondary" className="text-[10px]">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Showtimes */}
              <div className="flex flex-wrap gap-3">
                {shows.map(show => {
                  const isSelected = selectedShow?.id === show.id;
                  return (
                    <button
                      key={show.id}
                      onClick={() => onShowSelect(show)}
                      className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-lg border transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-text-muted bg-surface-elevated'
                      }`}
                    >
                      <div className={`text-lg font-medium flex items-center gap-1.5 ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                        {isSelected && <Clock className="w-3.5 h-3.5" />}
                        {show.time}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted">₹{show.price}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-text-secondary">
                          {show.screenType}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShowtimeSelector;
