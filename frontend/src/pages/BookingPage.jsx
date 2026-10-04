import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import ShowtimeSelector from '@/components/booking/ShowtimeSelector';
import SeatMap from '@/components/booking/SeatMap';
import BookingSummary from '@/components/booking/BookingSummary';
import PaymentForm from '@/components/booking/PaymentForm';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState('showtime'); // showtime | seats | payment | confirmation
  const [loading, setLoading] = useState(true);
  
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  
  const [seatLayout, setSeatLayout] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [movieData, showsData, theatresData] = await Promise.all([
          api.getMovieById(id),
          api.getShowsForMovie(id),
          api.getTheatres()
        ]);
        setMovie(movieData);
        setShows(showsData);
        setTheatres(theatresData);
      } catch (err) {
        console.error("Failed to load booking data", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (selectedShow) {
      api.getSeatLayout(selectedShow.id).then(setSeatLayout).catch(console.error);
    }
  }, [selectedShow]);

  const handleShowtimeContinue = () => {
    if (selectedShow) setStep('seats');
  };

  const handleSeatsProceed = () => {
    if (selectedSeats.length > 0) setStep('payment');
  };

  const calculateTotalPrice = () => {
    if (!selectedShow || !seatLayout) return 0;
    
    let total = 0;
    seatLayout.rows.forEach(row => {
      row.seats.forEach(seat => {
        if (selectedSeats.includes(seat.id)) {
          let factor = 1.0;
          if (row.category === 'Premium') factor = 1.5;
          else if (row.category === 'Economy') factor = 0.7;
          total += (selectedShow.price || 150) * factor;
        }
      });
    });
    return total;
  };

  const handlePaymentComplete = async (paymentResult) => {
    try {
      setLoading(true);
      const bookingData = {
        movieId: movie.id,
        showId: selectedShow.id,
        theatreId: selectedShow.theatreId,
        seats: selectedSeats,
        totalPrice: calculateTotalPrice() + (selectedSeats.length * 30), // include fee
        payment: paymentResult
      };
      const confirmation = await api.createBooking(bookingData);
      setBookingConfirmation({
        ...confirmation,
        movie,
        show: selectedShow,
        theatre: theatres.find(t => t.id === selectedShow.theatreId)
      });
      setStep('confirmation');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'seats') setStep('showtime');
    else if (step === 'payment') setStep('seats');
    else navigate(-1);
  };

  if (loading && step !== 'confirmation' && step !== 'payment') {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!movie && !loading) {
    return <div className="text-center py-20">Movie not found</div>;
  }

  const steps = ['Select Show', 'Select Seats', 'Payment', 'Confirmation'];
  const currentStepIdx = { showtime: 0, seats: 1, payment: 2, confirmation: 3 }[step];

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh]">
      
      {/* Header & Progress */}
      {step !== 'confirmation' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={goBack} className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" /> Back
            </Button>
            <h1 className="text-2xl font-bold text-text-primary text-center hidden md:block">
              {movie?.title} Booking
            </h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
          
          <div className="flex items-center justify-center space-x-2 md:space-x-4 max-w-3xl mx-auto">
            {steps.map((label, idx) => (
              <React.Fragment key={idx}>
                <div className={`flex flex-col items-center gap-2 ${idx <= currentStepIdx ? 'text-primary' : 'text-text-muted opacity-50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx <= currentStepIdx ? 'bg-primary text-white' : 'bg-surface-elevated border border-border'}`}>
                    {idx + 1}
                  </div>
                  <span className="text-xs md:text-sm font-medium hidden sm:block">{label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-1 w-12 md:w-24 rounded ${idx < currentStepIdx ? 'bg-primary' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Content based on step */}
      <div className="mt-8">
        {step === 'showtime' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex gap-4 items-center bg-surface-elevated p-4 rounded-xl border border-border">
              <img src={movie.poster} alt={movie.title} className="w-16 h-24 object-cover rounded shadow" />
              <div>
                <h2 className="text-xl font-bold text-text-primary">{movie.title}</h2>
                <p className="text-text-secondary">{movie.language} • {movie.certification} • {movie.genre?.join(', ')}</p>
              </div>
            </div>
            <ShowtimeSelector 
              shows={shows} 
              theatres={theatres} 
              selectedShow={selectedShow} 
              onShowSelect={setSelectedShow} 
            />
            <div className="flex justify-end pt-4 border-t border-border">
              <Button size="lg" disabled={!selectedShow} onClick={handleShowtimeContinue} className="px-10">
                Continue to Seats
              </Button>
            </div>
          </div>
        )}

        {step === 'seats' && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 w-full overflow-x-auto bg-surface border border-border rounded-xl p-4 md:p-8">
              <h2 className="text-xl font-bold mb-6 text-text-primary text-center">Select your Seats</h2>
              {seatLayout ? (
                <SeatMap 
                  seatLayout={seatLayout} 
                  selectedSeats={selectedSeats} 
                  onSeatToggle={(seatId) => setSelectedSeats(prev => 
                    prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
                  )}
                  showPrice={selectedShow?.price || 150}
                />
              ) : (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
              )}
            </div>
            <div className="w-full lg:w-96 shrink-0">
              <BookingSummary 
                movie={movie}
                show={selectedShow}
                theatre={theatres.find(t => t.id === selectedShow.theatreId)}
                selectedSeats={selectedSeats}
                seatLayout={seatLayout}
                totalPrice={calculateTotalPrice()}
                onProceed={handleSeatsProceed}
              />
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="max-w-md mx-auto">
            <PaymentForm 
              totalAmount={calculateTotalPrice() + (selectedSeats.length * 30)} 
              onPaymentComplete={handlePaymentComplete}
              onCancel={goBack}
            />
            {loading && (
              <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4 bg-surface p-8 rounded-2xl border border-border shadow-2xl">
                  <LoadingSpinner size="lg" />
                  <p className="text-lg font-medium text-text-primary">Processing Payment...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'confirmation' && bookingConfirmation && (
          <BookingConfirmation booking={bookingConfirmation} />
        )}
      </div>
    </div>
  );
}
