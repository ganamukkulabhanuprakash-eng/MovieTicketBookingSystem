package com.cinevault.controller;

import com.cinevault.dto.SeatLayoutResponse;
import com.cinevault.dto.ShowResponse;
import com.cinevault.service.ShowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowResponse>> getShowsForMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(showService.getShowsForMovie(movieId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShowResponse> getShowById(@PathVariable Long id) {
        return ResponseEntity.ok(showService.getShowById(id));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<SeatLayoutResponse> getSeatLayout(@PathVariable Long id) {
        return ResponseEntity.ok(showService.getSeatLayoutForShow(id));
    }
}
