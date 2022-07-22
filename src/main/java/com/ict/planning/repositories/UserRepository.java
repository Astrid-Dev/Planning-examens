package com.ict.planning.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ict.planning.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
	public User findByEmail(String email);
}
