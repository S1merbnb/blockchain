package tn.esprit.microservice.blochchainbackend.farm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.microservice.blochchainbackend.farm.entity.Farm;

import java.util.List;

@Repository
public interface FarmRepository extends JpaRepository<Farm, Long> {

    // Search by farm name, farmer name, or phone
    List<Farm> findByNameContainingIgnoreCaseOrFarmerNameContainingIgnoreCaseOrFarmerPhoneContainingIgnoreCase(
            String name, String farmerName, String farmerPhone
    );
}
