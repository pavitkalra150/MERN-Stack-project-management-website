import React, { useState } from "react";
import { Card, Accordion } from "react-bootstrap";

const TaskAccordion = ({ tasks }) => {
  const [expandedTask, setExpandedTask] = useState(null);

  const handleTaskToggle = (taskIndex) => {
    if (expandedTask === taskIndex) {
      setExpandedTask(null);
    } else {
      setExpandedTask(taskIndex);
    }
  };

  return (
    <Accordion>
      {tasks && tasks.length > 0 ? (
        tasks.map((task, index) => (
          <Card key={task.taskId}>
            {" "}
            {/* Assuming taskId is a unique identifier */}
            <Accordion.Toggle
              as={Card.Header}
              eventKey={`task-${task.taskId}`}
              onClick={() => handleTaskToggle(index)}
            >
              Task {index + 1}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`task-${task.taskId}`}>
              <Card.Body>
                <p>
                  <strong>Task Name:</strong> {task.name}
                </p>
                <p>
                  <strong>Description:</strong> {task.description}
                </p>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                {/* Display other task details as needed */}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))
      ) : (
        <Card>
          <Card.Body>No tasks available</Card.Body>
        </Card>
      )}
    </Accordion>
  );
};

export default TaskAccordion;
