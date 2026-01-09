package tn.esprit.microservice.blochchainbackend.farm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "farms")
@Data              // Generates getters, setters, toString, equals & hashCode
@NoArgsConstructor // No-arg constructor
@AllArgsConstructor // All-args constructor
@Builder           // Optional: to use builder pattern
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String farmerName;

    private String farmerPhone;

    private String cropType;

    private Double area;

    @Column(columnDefinition = "json")
    private String polygon; // Store as JSON for now

    private String notes;

    private LocalDateTime createdAt;
}
