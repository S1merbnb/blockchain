package tn.esprit.microservice.blochchainbackend.farm.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservice.blochchainbackend.farm.entity.Farm;
import tn.esprit.microservice.blochchainbackend.farm.service.FarmService;

import java.util.List;
import java.util.Optional;

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

    @PutMapping("/{id}")
    public ResponseEntity<Farm> updateFarm(@PathVariable Long id, @RequestBody Farm farm) {
        Optional<Farm> updated = farmService.updateFarm(id, farm);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarm(@PathVariable Long id) {
        boolean deleted = farmService.deleteFarm(id);
        if (deleted) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
