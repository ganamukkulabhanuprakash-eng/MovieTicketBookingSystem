package com.cinevault.service;

import com.cinevault.dto.TheatreResponse;

import java.util.List;

public interface TheatreService {
    List<TheatreResponse> getAllActiveTheatres();
    TheatreResponse getTheatreById(Long id);
}
