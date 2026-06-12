package com.planwise.backend.interfaces;

import com.planwise.backend.enums.TaskStatus;

public interface Trackable {
    void updateStatus(TaskStatus status);
    TaskStatus getStatus();
}
