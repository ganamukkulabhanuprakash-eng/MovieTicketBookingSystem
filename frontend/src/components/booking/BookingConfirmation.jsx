import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Calendar, Clock, MapPin, MonitorPlay, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const BookingConfirmation = ({ booking }) => {
  if (!booking) return null;

  const {
    bookingNumber,
    bookingId,
    movie,
    theatre,
    show,
    seats,
    totalPrice,
    totalAmount,
    status = 'CONFIRMED',
    movieTitle,
    moviePoster,
    theatreName,
    theatreLocation,
    screenType,
    showDate: respShowDate,
    showTime: respShowTime,
    createdAt
  } = booking;
  
  const displayBookingId = bookingNumber || bookingId || 'CV-BK00000000';
  const displayTitle = movieTitle || movie?.title || 'Movie';
  const displayPoster = moviePoster || movie?.poster;
  const displayTheatre = theatreName || theatre?.name || 'CineVault Theatre';
  const displayLocation = theatreLocation || theatre?.location || 'Main Auditorium';
  const displayScreen = screenType || show?.screenType || 'Standard';
  const displayTime = respShowTime || show?.time || 'Showtime';
  const displayAmount = totalAmount != null ? Number(totalAmount) : (totalPrice != null ? Number(totalPrice) : 0);
  
  const bookingDate = createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString();
  const rawShowDate = respShowDate || show?.date;
  const showDate = rawShowDate ? new Date(rawShowDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Today';

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-2xl overflow-hidden shadow-lg"
      >
        {/* Success Header */}
        <div className="bg-success/10 p-8 flex flex-col items-center justify-center text-center border-b border-success/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <CheckCircle className="w-20 h-20 text-success mb-4" />
          </motion.div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-success/20 text-success mb-2 uppercase tracking-wide">
            {status}
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Booking Confirmed!</h1>
          <p className="text-text-secondary">Your tickets have been successfully booked.</p>
          
          <div className="mt-6 px-6 py-3 bg-surface rounded-xl border border-border border-dashed flex flex-col items-center">
            <span className="text-xs text-text-muted uppercase tracking-wider">Booking ID</span>
            <span className="text-xl font-mono font-bold text-primary mt-1">{displayBookingId}</span>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b border-border">
            {/* Poster (if available) */}
            {displayPoster ? (
              <img src={displayPoster} alt={displayTitle} className="w-32 h-48 object-cover rounded-lg shadow-md hidden md:block" />
            ) : (
              <div className="w-32 h-48 bg-surface-elevated rounded-lg hidden md:flex items-center justify-center text-text-muted">
                <Ticket className="w-12 h-12 opacity-50" />
              </div>
            )}
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">{displayTitle}</h2>
                <div className="text-sm text-text-muted mt-1">{movie?.language || 'Hindi / English'} • {movie?.certification || 'UA'}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary">{displayTheatre}</div>
                    <div className="text-sm text-text-muted">{displayLocation}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MonitorPlay className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary">Screen</div>
                    <div className="text-sm text-text-muted">{displayScreen}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary">{showDate}</div>
                    <div className="text-sm text-text-muted">Date</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary">{displayTime}</div>
                    <div className="text-sm text-text-muted">Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seats and Amount */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 bg-surface-elevated p-6 rounded-xl">
            <div className="text-center sm:text-left">
              <div className="text-sm text-text-muted mb-1">Seats</div>
              <div className="text-lg font-bold text-text-primary">
                {Array.isArray(seats) ? seats.join(', ') : (seats || 'A1')}
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-border"></div>
            
            <div className="text-center sm:text-right">
              <div className="text-sm text-text-muted mb-1">Amount Paid</div>
              <div className="text-2xl font-bold text-primary">₹{displayAmount.toFixed(2)}</div>
            </div>
          </div>

          <div className="text-center text-xs text-text-muted mb-8">
            Booked on {bookingDate}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile">
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Ticket className="w-4 h-4" />
                View My Bookings
              </Button>
            </Link>
            <Link to="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
