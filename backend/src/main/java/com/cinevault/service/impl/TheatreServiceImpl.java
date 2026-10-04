package com.cinevault.service.impl;

import com.cinevault.dto.TheatreResponse;
import com.cinevault.entity.Theatre;
import com.cinevault.exception.TheatreNotFoundException;
import com.cinevault.repository.TheatreRepository;
import com.cinevault.service.TheatreService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TheatreServiceImpl implements TheatreService {

    private final TheatreRepository theatreRepository;

    public TheatreServiceImpl(TheatreRepository theatreRepository) {
        this.theatreRepository = theatreRepository;
    }

    @Override
    public List<TheatreResponse> getAllActiveTheatres() {
        return theatreRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TheatreResponse getTheatreById(Long id) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new TheatreNotFoundException(id));
        return mapToResponse(theatre);
    }

    private TheatreResponse mapToResponse(Theatre theatre) {
        TheatreResponse response = new TheatreResponse();
        response.setId(theatre.getId());
        response.setName(theatre.getName());
        response.setLocation(theatre.getLocation());
        response.setAddress(theatre.getAddress());
        response.setCity(theatre.getCity());
        response.setFacilities(theatre.getFacilitiesList());
        return response;
    }
}
