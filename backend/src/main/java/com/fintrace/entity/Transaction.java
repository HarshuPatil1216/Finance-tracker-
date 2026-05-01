package com.fintrace.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String type; // 'income' or 'expense'
    private Double amount;
    private String category;
    private String date;
    private String notes;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
