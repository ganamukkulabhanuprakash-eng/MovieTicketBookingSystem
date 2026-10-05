package com.cinevault.dto.admin;

import java.time.LocalDate;
import java.util.List;

/**
 * Full movie details DTO used in admin responses.
 * Includes active status — not exposed in customer-facing MovieResponse.
 */
public class AdminMovieResponse {
    private Long id;
    private String title;
    private String tagline;
    private String description;
    private List<String> genre;
    private Integer duration;
    private Double rating;
    private LocalDate releaseDate;
    private String language;
    private String certification;
    private String director;
    private List<String> cast;
    private String posterUrl;
    private String backdropUrl;
    private String trailerUrl;
    private boolean featured;
    private String status;
    private boolean active;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getGenre() { return genre; }
    public void setGenre(List<String> genre) { this.genre = genre; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCertification() { return certification; }
    public void setCertification(String certification) { this.certification = certification; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public List<String> getCast() { return cast; }
    public void setCast(List<String> cast) { this.cast = cast; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getBackdropUrl() { return backdropUrl; }
    public void setBackdropUrl(String backdropUrl) { this.backdropUrl = backdropUrl; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
