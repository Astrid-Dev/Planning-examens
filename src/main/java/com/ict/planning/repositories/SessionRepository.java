package com.ict.planning.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.ict.planning.entities.Session;

public interface SessionRepository extends JpaRepository<Session, Long> {
	List<Session> findAllByUserId(@Param("userId") Long userId);
}
