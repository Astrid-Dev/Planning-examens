package com.ict.planning.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import com.ict.planning.entities.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
	Long deleteBySessionId(@Param("sessionId") Long sessionId);
	
	List<Room> findAllBySessionId(@Param("sessionId") Long sessionId);
}
