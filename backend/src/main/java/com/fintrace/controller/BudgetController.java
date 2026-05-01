package com.fintrace.controller;

import com.fintrace.entity.Budget;
import com.fintrace.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {

    @Autowired
    private BudgetRepository repository;

    @GetMapping("/user/{userId}")
    public List<Budget> getByUser(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }

    @PostMapping
    public Budget createOrUpdate(@RequestBody Budget budget) {
        List<Budget> existing = repository.findByUserIdAndCategoryAndMonth(
            budget.getUserId(), budget.getCategory(), budget.getMonth()
        );
        if (!existing.isEmpty()) {
            Budget b = existing.get(0);
            b.setAmount(budget.getAmount());
            return repository.save(b);
        }
        return repository.save(budget);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
