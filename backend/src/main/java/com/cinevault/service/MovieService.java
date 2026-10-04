package com.cinevault.service;

import com.cinevault.dto.MovieResponse;

import java.util.List;

/**
 * Service interface for movie operations.
 * Demonstrates: Interface, Abstraction.
 */
public interface MovieService {
    List<MovieResponse> getAllActiveMovies();
    MovieResponse getMovieById(Long id);
    List<MovieResponse> getFeaturedMovies();
    List<MovieResponse> searchMovies(String query);
}
