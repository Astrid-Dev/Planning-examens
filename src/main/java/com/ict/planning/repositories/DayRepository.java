package com.ict.planning.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.ict.planning.entities.Day;

public interface DayRepository extends JpaRepository<Day, Long> {

	Long deleteBySessionId(@Param("sessionId") Long sessionId);
	
	List<Day> findAllBySessionId(@Param("sessionId") Long sessionId);
}
