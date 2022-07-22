package com.ict.planning.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.ict.planning.entities.Planning;

public interface PlanningRepository extends JpaRepository<Planning, Long> {
	Long deleteBySessionId(@Param("sessionId") Long sessionId);
	
	List<Planning> findAllBySessionId(@Param("sessionId") Long sessionId);
}
