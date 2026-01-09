package tn.esprit.microservice.blochchainbackend.farm.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import tn.esprit.microservice.blochchainbackend.farm.entity.Farm;
import tn.esprit.microservice.blochchainbackend.farm.repository.FarmRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmService {

    private final FarmRepository farmRepository;

    public Farm addFarm(Farm farm) {
        farm.setCreatedAt(LocalDateTime.now());
        return farmRepository.save(farm);
    }

    public List<Farm> searchFarms(String keyword) {
        return farmRepository.findByNameContainingIgnoreCaseOrFarmerNameContainingIgnoreCaseOrFarmerPhoneContainingIgnoreCase(
                keyword, keyword, keyword
        );
    }

    public List<Farm> getAllFarms() {
        return farmRepository.findAll();
    }
}
