package com.fintrace.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "money_flows")
@Data
public class MoneyFlow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String type; // 'give' or 'take'
    private String personName;
    private Double amount;
    private String dueDate;
    private String status; // 'pending' or 'settled'
    private String notes;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
