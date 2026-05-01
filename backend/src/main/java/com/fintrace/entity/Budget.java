package com.fintrace.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
@Data
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String category;
    private Double amount;
    private String month; // YYYY-MM
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
