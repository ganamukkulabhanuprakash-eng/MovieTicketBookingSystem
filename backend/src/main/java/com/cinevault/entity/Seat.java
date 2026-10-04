package com.cinevault.entity;

import com.cinevault.entity.enums.SeatCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"screen_id", "row_label", "seat_number"})
})
public class Seat extends BaseEntity {

    @NotBlank
    @Column(name = "row_label", nullable = false, length = 5)
    private String rowLabel; // A, B, C ...

    @NotNull
    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber; // 1, 2, 3 ...

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatCategory category = SeatCategory.REGULAR;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;

    // Constructors
    public Seat() { super(); }

    public Seat(String rowLabel, Integer seatNumber, SeatCategory category, Screen screen) {
        this();
        this.rowLabel = rowLabel;
        this.seatNumber = seatNumber;
        this.category = category;
        this.screen = screen;
    }

    /**
     * Returns a display-friendly seat identifier like "A5", "B12".
     */
    public String getSeatLabel() {
        return rowLabel + seatNumber;
    }

    // Getters and Setters
    public String getRowLabel() { return rowLabel; }
    public void setRowLabel(String rowLabel) { this.rowLabel = rowLabel; }

    public Integer getSeatNumber() { return seatNumber; }
    public void setSeatNumber(Integer seatNumber) { this.seatNumber = seatNumber; }

    public SeatCategory getCategory() { return category; }
    public void setCategory(SeatCategory category) { this.category = category; }

    public Screen getScreen() { return screen; }
    public void setScreen(Screen screen) { this.screen = screen; }

    @Override
    public String toString() {
        return "Seat{" + getSeatLabel() + ", category=" + category + "}";
    }
}
