package com.ict.planning.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.ict.planning.entities.Time;

public interface TimeRepository extends JpaRepository<Time, Long> {
	Long deleteBySessionId(@Param("sessionId") Long sessionId);
	
	List<Time> findAllBySessionId(@Param("sessionId") Long sessionId);
}
