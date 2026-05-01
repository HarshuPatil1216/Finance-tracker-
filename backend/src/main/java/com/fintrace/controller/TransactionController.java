package com.fintrace.controller;

import com.fintrace.entity.Transaction;
import com.fintrace.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*") // Allow React to connect
public class TransactionController {

    @Autowired
    private TransactionRepository repository;

    @GetMapping("/user/{userId}")
    public List<Transaction> getByUser(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }

    @PostMapping
    public Transaction create(@RequestBody Transaction transaction) {
        return repository.save(transaction);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
