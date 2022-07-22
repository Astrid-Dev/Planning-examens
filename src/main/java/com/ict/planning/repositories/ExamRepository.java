package com.ict.planning.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.ict.planning.entities.Exam;

public interface ExamRepository extends JpaRepository<Exam, Long> {
	Long deleteBySessionId(@Param("sessionId") Long sessionId);
	
	List<Exam> findAllBySessionId(@Param("sessionId") Long sessionId);
}
