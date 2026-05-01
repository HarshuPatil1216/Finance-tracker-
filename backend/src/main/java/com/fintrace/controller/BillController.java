package com.fintrace.controller;

import com.fintrace.entity.Bill;
import com.fintrace.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {

    @Autowired
    private BillRepository repository;

    @GetMapping("/user/{userId}")
    public List<Bill> getByUser(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }

    @PostMapping
    public Bill create(@RequestBody Bill bill) {
        return repository.save(bill);
    }

    @PutMapping("/{id}/status")
    public Bill updateStatus(@PathVariable Long id, @RequestBody String status) {
        Bill bill = repository.findById(id).orElseThrow();
        bill.setStatus(status.replace("\"", ""));
        return repository.save(bill);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
