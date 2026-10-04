package com.cinevault.entity;

import com.cinevault.entity.enums.BookingStatus;
import com.cinevault.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {

    @Column(name = "booking_number", unique = true, nullable = false)
    private String bookingNumber; // Human-readable booking ID like "BKG-123456"

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @NotNull
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "convenience_fee", precision = 10, scale = 2)
    private BigDecimal convenienceFee = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_transaction_id")
    private String paymentTransactionId;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<BookingSeat> bookedSeats = new ArrayList<>();

    // Constructors
    public Booking() { super(); }

    public Booking(String bookingNumber, User user, Show show, BigDecimal totalAmount) {
        this();
        this.bookingNumber = bookingNumber;
        this.user = user;
        this.show = show;
        this.totalAmount = totalAmount;
    }

    /**
     * Returns the number of seats in this booking.
     */
    public int getSeatCount() {
        return bookedSeats.size();
    }

    /**
     * Adds a seat to this booking (bidirectional helper).
     */
    public void addBookedSeat(BookingSeat bookingSeat) {
        bookedSeats.add(bookingSeat);
        bookingSeat.setBooking(this);
    }

    // Getters and Setters
    public String getBookingNumber() { return bookingNumber; }
    public void setBookingNumber(String bookingNumber) { this.bookingNumber = bookingNumber; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Show getShow() { return show; }
    public void setShow(Show show) { this.show = show; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getConvenienceFee() { return convenienceFee; }
    public void setConvenienceFee(BigDecimal convenienceFee) { this.convenienceFee = convenienceFee; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentTransactionId() { return paymentTransactionId; }
    public void setPaymentTransactionId(String paymentTransactionId) { this.paymentTransactionId = paymentTransactionId; }

    public List<BookingSeat> getBookedSeats() { return bookedSeats; }
    public void setBookedSeats(List<BookingSeat> bookedSeats) { this.bookedSeats = bookedSeats; }

    @Override
    public String toString() {
        return "Booking{id=" + getId() + ", number='" + bookingNumber + "', status=" + status + "}";
    }
}
