package com.cinevault.service;

import com.cinevault.dto.SeatLayoutResponse;
import com.cinevault.dto.ShowResponse;

import java.util.List;

public interface ShowService {
    List<ShowResponse> getShowsForMovie(Long movieId);
    ShowResponse getShowById(Long id);
    SeatLayoutResponse getSeatLayoutForShow(Long showId);
}
