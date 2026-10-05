package com.cinevault.dto.admin;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * Request DTO for admin creating or updating a movie.
 * All required fields are validated. Optional rich-media fields are nullable.
 */
public class MovieRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be at most 200 characters")
    private String title;

    @Size(max = 300, message = "Tagline must be at most 300 characters")
    private String tagline;

    private String description;

    @NotBlank(message = "Genre is required")
    private String genre;          // Comma-separated e.g. "Action,Sci-Fi"

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;

    @DecimalMin(value = "0.0", message = "Rating must be at least 0.0")
    @DecimalMax(value = "10.0", message = "Rating must be at most 10.0")
    private Double rating;

    private LocalDate releaseDate;

    @NotBlank(message = "Language is required")
    private String language;

    @Size(max = 20)
    private String certification;

    @Size(max = 200)
    private String director;

    private String castMembers;    // Comma-separated

    private String posterUrl;

    private String backdropUrl;

    private String trailerUrl;

    private boolean featured = false;

    @NotBlank(message = "Status is required")
    private String status = "now_showing"; // now_showing | coming_soon

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

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

    public String getCastMembers() { return castMembers; }
    public void setCastMembers(String castMembers) { this.castMembers = castMembers; }

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
}
