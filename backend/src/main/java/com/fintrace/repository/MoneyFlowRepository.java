package com.fintrace.repository;

import com.fintrace.entity.MoneyFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MoneyFlowRepository extends JpaRepository<MoneyFlow, Long> {
    List<MoneyFlow> findByUserId(String userId);
}
