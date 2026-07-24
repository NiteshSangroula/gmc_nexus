package com.nexus.backend.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nexus.backend.dto.request.TaskRequest;
import com.nexus.backend.dto.response.TaskResponse;
import com.nexus.backend.entity.Task;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.TaskRepository;

import static org.mockito.Mockito.*;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * TaskServiceImplTest
 */
@ExtendWith(MockitoExtension.class)
public class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    @Test
    void createTask_success_returnsTaskResponse() {
        TaskRequest request = new TaskRequest("Test title", "Test desc");
        Task savedTask = Task.builder().id(1L).title("Test title").description("Test desc").build();

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        TaskResponse response = taskService.createTask(request);

        assertThat(response.title()).isEqualTo("Test title");
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void getTaskById_notFound_throwsResourceNotFoundException() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteTask_success_callsRepositoryDelete() {
        when(taskRepository.existsById(1L)).thenReturn(true);

        taskService.deleteTask(1L);

        verify(taskRepository).deleteById(1L);
    }

}
