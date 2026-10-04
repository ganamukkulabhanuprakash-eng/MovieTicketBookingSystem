import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const SeatMap = ({ seatLayout, selectedSeats = [], onSeatToggle, showPrice = 100 }) => {
  if (!seatLayout || !seatLayout.rows) return null;

  const calculatePrice = (basePrice, category) => {
    switch (category?.toLowerCase()) {
      case 'premium': return basePrice * 1.5;
      case 'economy': return basePrice * 0.7;
      default: return basePrice;
    }
  };

  const getSeatColorClass = (status, isSelected, category) => {
    if (status === 'booked') return 'bg-seat-booked text-text-muted border-border cursor-not-allowed opacity-50';
    if (isSelected) return 'bg-seat-selected border-seat-selected text-canvas';
    
    // Available seat colors based on category
    switch (category?.toLowerCase()) {
      case 'premium': return 'bg-surface-elevated border-seat-premium hover:border-seat-selected text-text-secondary';
      case 'economy': return 'bg-surface-elevated border-seat-economy hover:border-seat-selected text-text-secondary';
      default: return 'bg-surface-elevated border-border hover:border-seat-selected text-text-secondary';
    }
  };

  const { totalSelectedPrice, selectedCount } = useMemo(() => {
    let price = 0;
    let count = 0;

    seatLayout.rows.forEach(row => {
      row.seats.forEach(seat => {
        if (selectedSeats.includes(seat.id)) {
          count++;
          price += calculatePrice(showPrice, row.category);
        }
      });
    });

    return { totalSelectedPrice: price, selectedCount: count };
  }, [seatLayout, selectedSeats, showPrice]);

  return (
    <div className="flex flex-col items-center w-full p-4 md:p-8 bg-surface rounded-xl border border-border">
      
      {/* Screen Indicator */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-text-muted to-transparent opacity-30 blur-[1px] rounded-[100%] shadow-[0_15px_30px_rgba(255,255,255,0.1)]"></div>
        <div className="text-text-muted text-xs tracking-widest mt-4 uppercase">All eyes this way</div>
      </div>

      {/* Seat Grid */}
      <div className="overflow-x-auto w-full pb-8 scrollbar-none flex justify-center">
        <div className="flex flex-col gap-4 min-w-max">
          {seatLayout.rows.map((row) => (
            <div key={row.label} className="flex items-center gap-4">
              
              {/* Row Label (Left) */}
              <div className="w-6 text-center text-text-muted font-medium text-sm flex-shrink-0 flex items-center justify-between">
                <span>{row.label}</span>
                {row.category?.toLowerCase() === 'premium' && <span className="w-1.5 h-1.5 rounded-full bg-seat-premium ml-1"></span>}
                {row.category?.toLowerCase() === 'economy' && <span className="w-1.5 h-1.5 rounded-full bg-seat-economy ml-1"></span>}
              </div>

              {/* Seats */}
              <div className="flex items-center gap-2">
                {row.seats.map((seat, idx) => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isBooked = seat.status === 'booked';
                  
                  // Create an aisle after the 6th seat (idx 5) if row is wide enough
                  const isAisle = idx === 5 && row.seats.length > 8;

                  return (
                    <React.Fragment key={seat.id}>
                      <motion.button
                        whileHover={!isBooked ? { scale: 1.1 } : {}}
                        whileTap={!isBooked ? { scale: 0.95 } : {}}
                        onClick={() => !isBooked && onSeatToggle(seat.id)}
                        disabled={isBooked}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-[10px] font-medium transition-colors border ${getSeatColorClass(seat.status, isSelected, row.category)}`}
                        title={`${row.label}${seat.number} - ₹${calculatePrice(showPrice, row.category)}`}
                      >
                        {seat.number}
                      </motion.button>
                      
                      {isAisle && <div className="w-6 sm:w-8"></div>}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Label (Right) */}
              <div className="w-6 text-center text-text-muted font-medium text-sm flex-shrink-0">
                {row.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 p-4 bg-surface-elevated rounded-lg w-full max-w-2xl text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-border bg-surface-elevated"></div>
          <span className="text-text-secondary">Standard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-seat-premium bg-surface-elevated"></div>
          <span className="text-text-secondary">Premium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-seat-economy bg-surface-elevated"></div>
          <span className="text-text-secondary">Economy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-seat-selected bg-seat-selected"></div>
          <span className="text-text-secondary">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-border bg-seat-booked opacity-50"></div>
          <span className="text-text-secondary">Booked</span>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedCount > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl bg-primary/10 border border-primary/20 rounded-xl p-4">
          <div>
            <div className="text-primary font-medium">{selectedCount} {selectedCount === 1 ? 'Seat' : 'Seats'} Selected</div>
            <div className="text-sm text-text-muted">Total amount payable</div>
          </div>
          <div className="text-2xl font-bold text-text-primary mt-2 sm:mt-0">
            ₹{totalSelectedPrice.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
