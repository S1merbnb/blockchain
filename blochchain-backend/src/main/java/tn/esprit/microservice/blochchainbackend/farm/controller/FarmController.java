package tn.esprit.microservice.blochchainbackend.farm.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservice.blochchainbackend.farm.entity.Farm;
import tn.esprit.microservice.blochchainbackend.farm.service.FarmService;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
@RequiredArgsConstructor
public class FarmController {

    private final FarmService farmService;

    @PostMapping
    public Farm addFarm(@RequestBody Farm farm) {
        return farmService.addFarm(farm);
    }

    @GetMapping
    public List<Farm> getAllFarms() {
        return farmService.getAllFarms();
    }

    @GetMapping("/search")
    public List<Farm> searchFarms(@RequestParam String keyword) {
        return farmService.searchFarms(keyword);
    }
}
