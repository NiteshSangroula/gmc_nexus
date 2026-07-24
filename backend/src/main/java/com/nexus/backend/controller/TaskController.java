package com.nexus.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Sort;

import com.nexus.backend.dto.request.TaskRequest;
import com.nexus.backend.dto.response.ApiResponse;
import com.nexus.backend.dto.response.TaskResponse;
import com.nexus.backend.service.TaskService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

/**
 * TaskController
 */
@RestController
@AllArgsConstructor
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        TaskResponse response = taskService.createTask(request);
        ApiResponse<TaskResponse> apiResponse = ApiResponse.success(response, "Task created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        TaskResponse response = taskService.getTaskById(id);
        ApiResponse<TaskResponse> apiResponse = ApiResponse.success(response, "Task fetched successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> getAllTasks(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<TaskResponse> response = taskService.getAllTasks(pageable);
        ApiResponse<Page<TaskResponse>> apiResponse = ApiResponse.success(response, "Tasks fetched successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(@PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        TaskResponse response = taskService.updateTask(id, request);
        ApiResponse<TaskResponse> apiResponse = ApiResponse.success(response, "Task updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        ApiResponse<Void> apiResponse = ApiResponse.success(null, "Task deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

}
