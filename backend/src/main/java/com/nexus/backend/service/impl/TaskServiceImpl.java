package com.nexus.backend.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.nexus.backend.dto.request.TaskRequest;
import com.nexus.backend.dto.response.TaskResponse;
import com.nexus.backend.entity.Status;
import com.nexus.backend.entity.Task;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.mapper.TaskMapper;
import com.nexus.backend.repository.TaskRepository;
import com.nexus.backend.service.TaskService;

import lombok.AllArgsConstructor;

/**
 * TaskServiceImpl
 */
@Service
@AllArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;

    public TaskResponse createTask(TaskRequest request) {
        Task task = TaskMapper.toEntity(request);
        return TaskMapper.toResponse(taskRepository.save(task));
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return TaskMapper.toResponse(task);
    }

    public Page<TaskResponse> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable)
                .map(TaskMapper::toResponse);
    }

    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setTitle(request.title());
        task.setDescription(request.description());
        return TaskMapper.toResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);

        }
        taskRepository.deleteById(id);
    }
}
