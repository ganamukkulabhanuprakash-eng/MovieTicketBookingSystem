import React from 'react';
import { Calendar, Clock, MapPin, MonitorPlay, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const BookingSummary = ({ movie, show, theatre, selectedSeats = [], seatLayout, totalPrice, onProceed }) => {
  
  if (!movie || !show || !theatre) return null;

  // Format date
  const showDate = new Date(show.date);
  const formattedDate = showDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });

  // Get seat names and categories
  const getSeatDetails = () => {
    const details = [];
    if (!seatLayout) return details;

    seatLayout.rows.forEach(row => {
      row.seats.forEach(seat => {
        if (selectedSeats.includes(seat.id)) {
          details.push({
            id: seat.id,
            name: `${row.label}${seat.number}`,
            category: row.category || 'Standard'
          });
        }
      });
    });
    return details;
  };

  const selectedSeatDetails = getSeatDetails();
  const seatNames = selectedSeatDetails.map(s => s.name).join(', ');

  // Group by category for breakdown
  const categoryCounts = selectedSeatDetails.reduce((acc, seat) => {
    acc[seat.category] = (acc[seat.category] || 0) + 1;
    return acc;
  }, {});

  const convenienceFee = selectedSeats.length * 30; // ₹30 per seat
  const subtotal = totalPrice;
  const finalTotal = subtotal + convenienceFee;

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col h-full sticky top-24">
      {/* Header */}
      <div className="p-4 bg-surface-elevated border-b border-border">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary" />
          Booking Summary
        </h3>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-6 overflow-y-auto">
        
        {/* Movie Info */}
        <div className="flex gap-4">
          {movie.poster ? (
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-16 h-24 object-cover rounded shadow-md"
            />
          ) : (
            <div className="w-16 h-24 bg-surface-elevated rounded flex items-center justify-center text-xs text-text-muted">
              No Poster
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold text-text-primary truncate">{movie.title}</h4>
            <div className="text-sm text-text-muted mt-1">{movie.language} • {movie.certification}</div>
          </div>
        </div>

        {/* Theatre & Showtime Info */}
        <div className="space-y-3 p-4 bg-surface-elevated rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-medium text-text-primary">{theatre.name}</div>
              <div className="text-xs text-text-muted mt-0.5">{theatre.location}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <div className="text-sm text-text-primary">{formattedDate}</div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <div className="text-sm text-text-primary">{show.time}</div>
          </div>

          <div className="flex items-center gap-3">
            <MonitorPlay className="w-4 h-4 text-primary shrink-0" />
            <div className="text-sm text-text-primary">{show.screenType}</div>
          </div>
        </div>

        {/* Seat Selection Info */}
        {selectedSeats.length > 0 ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-text-muted mb-1">Selected Seats ({selectedSeats.length})</div>
              <div className="text-sm font-medium text-text-primary leading-relaxed break-words">
                {seatNames}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-border space-y-2 text-sm">
              <div className="text-text-muted mb-2">Price Breakdown</div>
              
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="flex justify-between text-text-secondary">
                  <span>{category} Ticket x {count}</span>
                  {/* Note: This is an approximation since we don't have per-seat price calculated here in summary */}
                </div>
              ))}
              
              <div className="flex justify-between text-text-secondary">
                <span>Tickets Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Convenience Fee</span>
                <span>₹{convenienceFee.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-text-muted flex-1 flex items-center justify-center">
            Select seats to view price details
          </div>
        )}
      </div>

      {/* Footer Total & Action */}
      <div className="p-5 bg-surface-elevated border-t border-border mt-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-text-primary font-medium">Total Amount</span>
          <span className="text-xl font-bold text-primary">₹{selectedSeats.length > 0 ? finalTotal.toFixed(2) : '0.00'}</span>
        </div>
        
        <Button 
          className="w-full" 
          size="lg" 
          disabled={selectedSeats.length === 0}
          onClick={() => onProceed && onProceed(finalTotal)}
        >
          {selectedSeats.length > 0 ? 'Proceed to Payment' : 'Select Seats'}
        </Button>
      </div>
    </div>
  );
};

export default BookingSummary;
