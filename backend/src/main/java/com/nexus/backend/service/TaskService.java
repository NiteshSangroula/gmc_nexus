package com.nexus.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nexus.backend.dto.request.TaskRequest;
import com.nexus.backend.dto.response.TaskResponse;

/**
 * TaskService
 */
public interface TaskService {
    TaskResponse createTask(TaskRequest request);

    TaskResponse getTaskById(Long id);

    Page<TaskResponse> getAllTasks(Pageable pageable);

    TaskResponse updateTask(Long id, TaskRequest request);

    void deleteTask(Long id);
}
