package com.cinevault.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "movies")
public class Movie extends BaseEntity {

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String title;

    @Size(max = 300)
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(nullable = false)
    private String genre; // Stored as comma-separated: "Action,Sci-Fi"

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer duration; // in minutes

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double rating;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @NotBlank
    @Column(nullable = false)
    private String language;

    @Size(max = 20)
    private String certification; // PG-13, R, U/A, etc.

    @Size(max = 200)
    private String director;

    @Column(name = "cast_members", columnDefinition = "TEXT")
    private String castMembers; // Comma-separated cast names

    @Column(name = "poster_url")
    private String posterUrl;

    @Column(name = "backdrop_url")
    private String backdropUrl;

    @Column(nullable = false)
    private boolean featured = false;

    @NotBlank
    @Column(nullable = false)
    private String status = "now_showing"; // now_showing, coming_soon

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Show> shows = new ArrayList<>();

    // Constructors
    public Movie() { super(); }

    public Movie(String title, String genre, Integer duration, String language) {
        this();
        this.title = title;
        this.genre = genre;
        this.duration = duration;
        this.language = language;
    }

    // Helper methods
    public List<String> getGenreList() {
        if (genre == null || genre.isBlank()) return List.of();
        return List.of(genre.split(","));
    }

    public void setGenreFromList(List<String> genres) {
        this.genre = String.join(",", genres);
    }

    public List<String> getCastList() {
        if (castMembers == null || castMembers.isBlank()) return List.of();
        return List.of(castMembers.split(","));
    }

    public void setCastFromList(List<String> cast) {
        this.castMembers = String.join(",", cast);
    }

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

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<Show> getShows() { return shows; }
    public void setShows(List<Show> shows) { this.shows = shows; }

    @Override
    public String toString() {
        return "Movie{id=" + getId() + ", title='" + title + "', language='" + language + "'}";
    }
}
