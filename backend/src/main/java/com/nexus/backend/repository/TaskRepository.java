package com.nexus.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexus.backend.entity.Task;

/**
 * TaskRepository
 */
public interface TaskRepository extends JpaRepository<Task, Long> {
}
