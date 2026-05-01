package com.fintrace.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
@Data
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String name;
    private Double amount;
    private String dueDate;
    private String status; // 'paid', 'unpaid', 'pending'
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
