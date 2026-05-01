package com.fintrace.controller;

import com.fintrace.entity.MoneyFlow;
import com.fintrace.repository.MoneyFlowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/moneyflow")
@CrossOrigin(origins = "*") // Allow React to connect
public class MoneyFlowController {

    @Autowired
    private MoneyFlowRepository repository;

    @GetMapping("/user/{userId}")
    public List<MoneyFlow> getByUser(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }

    @PostMapping
    public MoneyFlow create(@RequestBody MoneyFlow flow) {
        return repository.save(flow);
    }

    @PutMapping("/{id}/status")
    public MoneyFlow updateStatus(@PathVariable Long id, @RequestBody String status) {
        MoneyFlow flow = repository.findById(id).orElseThrow();
        flow.setStatus(status.replace("\"", "")); // Handle JSON string quotes
        return repository.save(flow);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
