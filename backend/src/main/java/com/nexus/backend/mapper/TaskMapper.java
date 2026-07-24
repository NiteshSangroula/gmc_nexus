package com.nexus.backend.mapper;

import com.nexus.backend.dto.request.TaskRequest;
import com.nexus.backend.dto.response.TaskResponse;
import com.nexus.backend.entity.Status;
import com.nexus.backend.entity.Task;

/**
 * TaskMapper
 */
public class TaskMapper {
    public static TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getCreatedAt());
    }

    public static Task toEntity(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(Status.TODO);
        return task;
    }
}
