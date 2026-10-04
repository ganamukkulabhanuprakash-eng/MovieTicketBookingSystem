package com.cinevault.entity.enums;

public enum SeatCategory {
    REGULAR("Regular", 1.0),
    PREMIUM("Premium", 1.5),
    RECLINER("Recliner", 2.0);

    private final String displayName;
    private final double priceMultiplier;

    SeatCategory(String displayName, double priceMultiplier) {
        this.displayName = displayName;
        this.priceMultiplier = priceMultiplier;
    }

    public String getDisplayName() {
        return displayName;
    }

    public double getPriceMultiplier() {
        return priceMultiplier;
    }
}
