import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Container, Row, Col } from "react-bootstrap";
import "../styles/admin.css";
import axios from "axios";
const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  const handleTaskToggle = (taskIndex) => {
    if (expandedTask === taskIndex) {
      setExpandedTask(null);
    } else {
      setExpandedTask(taskIndex);
    }
  };
  const styles = {
    body: {
      fontFamily: "Arial, sans-serif",
    },
    textPrimary: {
      color: "#1976d2",
    },
    createProjectBtn: {
      backgroundColor: "#4caf50",
      border: "none",
      color: "white",
      padding: "10px 20px",
    },
    projectCard: {
      backgroundColor: "#f7f7f7",
      marginBottom: "20px",
      cursor: "pointer",
      transition: "box-shadow 0.3s ease-in-out",
    },
    projectCardHover: {
      boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
    },
    modalTitle: {
      color: "#1976d2",
      fontWeight: "bold",
    },
    // Define other modal styles...
  };
  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:3005/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3005/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchTasksForProject = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/tasks/project?projectId=${projectId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks for the project");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching tasks for the project:", error);
      return [];
    }
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setShowProjectDetailsModal(true);
    const tasks = await fetchTasksForProject(project._id);
    if (tasks.length > 0) {
      setSelectedProject({ ...project, tasks });
    }
  };

  const handleCloseProjectDetailsModal = () => {
    setShowProjectDetailsModal(false);
    setSelectedProject(null);
  };

  const handleStatusChange = async (event, taskIndex) => {
    const newStatus = event.target.value;
    const task = selectedProject.tasks[taskIndex];
    if (!task || !task._id) {
      console.error("Invalid task or taskId");
      return;
    }

    if (newStatus === "in progress" || newStatus === "completed") {
      const prerequisiteTasks = task.prerequisiteTasks;

      try {
        const prerequisiteTasksResponse = await Promise.all(
          prerequisiteTasks.map(async (prerequisiteTaskId) => {
            const prerequisiteTask = selectedProject.tasks.find(
              (task) => task._id === prerequisiteTaskId
            );

            if (!prerequisiteTask || prerequisiteTask.status !== "completed") {
              return false;
            }
            return true;
          })
        );

        if (prerequisiteTasksResponse.includes(false)) {
          window.alert(
            `Cannot change status to ${newStatus}. Prerequisite tasks are not completed.`
          );
          return;
        }
      } catch (error) {
        console.error("Error checking prerequisite tasks:", error);
        return;
      }
    }

    try {
      const taskId = task._id;
      const response = await axios.put(
        `http://localhost:3005/api/tasks/${taskId}/status`,
        { status: newStatus }
      );

      if (response.status === 200) {
        const updatedTasks = [...selectedProject.tasks];
        updatedTasks[taskIndex].status = newStatus;

        setSelectedProject({
          ...selectedProject,
          tasks: updatedTasks,
        });

        await updateProjectStatus(selectedProject._id);

        console.log("Task status updated successfully");
      } else {
        console.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleHoursWorkedChange = async (event, taskIndex) => {
    const newHoursWorked = event.target.value;
    const taskId = selectedProject.tasks[taskIndex]._id;

    const confirmUpdate = window.confirm(
      `Are you sure you want to update the hours worked to ${newHoursWorked}?`
    );

    if (!confirmUpdate) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3005/api/tasks/${taskId}/hours`,
        { hoursWorked: newHoursWorked }
      );

      if (response.status === 200) {
        const updatedTasks = [...selectedProject.tasks];
        updatedTasks[taskIndex].hoursWorked = newHoursWorked;

        setSelectedProject({
          ...selectedProject,
          tasks: updatedTasks,
        });
        fetchProjects();
        console.log("Task hours worked updated successfully");
      } else {
        console.error("Failed to update task hours worked");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateProjectStatus = async (projectId) => {
    try {
      const response = await axios.get(
        `http://localhost:3005/api/tasks/project?projectId=${projectId}`
      );
      const tasks = response.data;

      if (tasks.length === 0) {
        console.log("No tasks found for the project");
        return;
      }

      const inProgressTasks = tasks.some(
        (task) => task.status === "in progress"
      );
      const allOpen = tasks.every((task) => task.status === "open");

      const allCompleted = tasks.every((task) => task.status === "completed");
      const openTasksCount = tasks.filter(
        (task) => task.status === "open"
      ).length;
      let updatedProjectStatus;
      if (allCompleted) {
        updatedProjectStatus = "Completed";
      } else if (inProgressTasks || openTasksCount > 0) {
        updatedProjectStatus = "In Progress";
      } else if (allOpen) {
        updatedProjectStatus = "Open";
      } else {
        updatedProjectStatus = "In Progress";
      }

      const projectUpdateResponse = await axios.put(
        `http://localhost:3005/api/projects/${projectId}/status`,
        {
          status: updatedProjectStatus,
        }
      );

      if (projectUpdateResponse.status === 200) {
        console.log(
          "Project status updated successfully:",
          updatedProjectStatus
        );
        fetchProjects();
      } else {
        console.error("Failed to update project status");
      }
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h1 style={styles.textPrimary} className="mb-4">
            User Dashboard
          </h1>

          <h2 style={styles.textPrimary} className="mt-4">
            Projects
          </h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {projects.map((project) => (
              <Col key={project._id}>
                <Card
                  style={styles.projectCard}
                  bg="light"
                  className="projectCard"
                  text="dark"
                  onClick={() => handleProjectClick(project)}
                >
                  <Card.Body>
                    <Card.Title>{project.name}</Card.Title>
                    <Card.Text>Description: {project.description}</Card.Text>
                    <Card.Text>Status: {project.status}</Card.Text>
                    <Card.Text>Created By: {project.createdBy}</Card.Text>
                    <Card.Text>Project Cost: ${project.projectCost}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row className="mt-4"></Row>
      <Modal
        show={showProjectDetailsModal}
        onHide={handleCloseProjectDetailsModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProject && `Tasks in ${selectedProject.name}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject &&
          selectedProject.tasks &&
          selectedProject.tasks.length > 0 ? (
            selectedProject.tasks.map((task, index) => (
              <Card key={task.taskId}>
                <Card.Header
                  onClick={() => handleTaskToggle(index)}
                  className="d-flex justify-content-between align-items-center"
                >
                  {task.name}
                </Card.Header>
                {expandedTask === index && (
                  <Card.Body>
                    <p>
                      <strong>Task Name:</strong> {task.name}
                    </p>
                    <p>
                      <strong>Description:</strong> {task.description}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(e, index)}
                      >
                        <option value="open">Open</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </p>
                    <p>
                      <strong>Assigned To:</strong> {task.assignedTo}
                    </p>
                    <p>
                      <strong>End Date:</strong> {task.endDate}
                    </p>
                    <p>
                      <strong>Hours Worked:</strong>{" "}
                      <input
                        type="number"
                        value={task.hoursWorked}
                        onChange={(e) => handleHoursWorkedChange(e, index)}
                      />
                    </p>
                    <p>
                      {task.prerequisiteTasks.length > 0 ? (
                        <p>
                          <strong>Prerequisite Tasks:</strong>{" "}
                          {task.prerequisiteTasks.map((prereqTaskId, index) => {
                            const prereqTask = tasks.find(
                              (task) => task._id === prereqTaskId
                            );
                            return prereqTask ? (
                              <span key={index}>{prereqTask.name}, </span>
                            ) : null;
                          })}
                        </p>
                      ) : (
                        <p>No prerequisite tasks added</p>
                      )}
                    </p>
                  </Card.Body>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <Card.Body>No tasks available</Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProjectDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
