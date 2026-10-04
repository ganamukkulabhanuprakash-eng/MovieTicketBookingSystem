package com.cinevault.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Matches the frontend's seat layout structure: { rows: [...] }
 */
public class SeatLayoutResponse {
    private List<SeatRow> rows;

    public SeatLayoutResponse() {}
    public SeatLayoutResponse(List<SeatRow> rows) { this.rows = rows; }

    public List<SeatRow> getRows() { return rows; }
    public void setRows(List<SeatRow> rows) { this.rows = rows; }

    public static class SeatRow {
        private String label;
        private String category;
        private List<SeatInfo> seats;

        public SeatRow() {}
        public SeatRow(String label, String category, List<SeatInfo> seats) {
            this.label = label;
            this.category = category;
            this.seats = seats;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public List<SeatInfo> getSeats() { return seats; }
        public void setSeats(List<SeatInfo> seats) { this.seats = seats; }
    }

    public static class SeatInfo {
        private String id; // Seat label like "A1"
        private Integer number;
        private String status; // "available" or "booked"

        public SeatInfo() {}
        public SeatInfo(String id, Integer number, String status) {
            this.id = id;
            this.number = number;
            this.status = status;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public Integer getNumber() { return number; }
        public void setNumber(Integer number) { this.number = number; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
