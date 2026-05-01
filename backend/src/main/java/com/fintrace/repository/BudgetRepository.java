package com.fintrace.repository;

import com.fintrace.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserId(String userId);
    List<Budget> findByUserIdAndCategoryAndMonth(String userId, String category, String month);
}
