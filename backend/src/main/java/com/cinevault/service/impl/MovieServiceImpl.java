package com.cinevault.service.impl;

import com.cinevault.dto.MovieResponse;
import com.cinevault.entity.Movie;
import com.cinevault.exception.MovieNotFoundException;
import com.cinevault.repository.MovieRepository;
import com.cinevault.service.MovieService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of MovieService.
 * Demonstrates: Interface implementation, Polymorphism, Streams, Lambda expressions,
 * Collections, Generics, Encapsulation.
 */
@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    // Constructor injection (demonstrates constructor usage)
    public MovieServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public List<MovieResponse> getAllActiveMovies() {
        return movieRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
        return mapToResponse(movie);
    }

    @Override
    public List<MovieResponse> getFeaturedMovies() {
        return movieRepository.findByActiveTrueAndFeaturedTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieResponse> searchMovies(String query) {
        return movieRepository.findByActiveTrueAndTitleContainingIgnoreCase(query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Maps a Movie entity to a MovieResponse DTO.
     * Transforms comma-separated strings to lists for frontend compatibility.
     */
    private MovieResponse mapToResponse(Movie movie) {
        MovieResponse response = new MovieResponse();
        response.setId(movie.getId());
        response.setTitle(movie.getTitle());
        response.setTagline(movie.getTagline());
        response.setDescription(movie.getDescription());
        response.setGenre(movie.getGenreList());
        response.setDuration(movie.getDuration());
        response.setRating(movie.getRating());
        response.setReleaseDate(movie.getReleaseDate());
        response.setLanguage(movie.getLanguage());
        response.setCertification(movie.getCertification());
        response.setDirector(movie.getDirector());
        response.setCast(movie.getCastList());
        response.setPoster(movie.getPosterUrl());
        response.setBackdrop(movie.getBackdropUrl());
        response.setFeatured(movie.isFeatured());
        response.setStatus(movie.getStatus());
        return response;
    }
}
