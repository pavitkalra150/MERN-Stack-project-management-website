import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import "../styles/admin.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const roles = ["User", "Admin"];
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const handleOpenAddTaskModal = () => {
    setShowAddTaskModal(true);
  };
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    project: "", // This will store the selected project's ID
    startDate: "",
    endDate: "",
    assignedTo: "", // This will store the selected user's ID
    hoursWorked: 0,
    status: "Open",
    prerequisiteTasks: [],
  });
  const handleTaskToggle = (taskIndex) => {
    if (expandedTask === taskIndex) {
      setExpandedTask(null);
    } else {
      setExpandedTask(taskIndex);
    }
  };
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "User",
    hourlyRate: 0,
  });
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Open",
    createdBy: sessionStorage.getItem("loggedInEmail") || "",
  });
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
    fetchUsers();
    fetchTasks();
  }, []);

  const handleEditProject = (e, project) => {
    e.stopPropagation();
    setEditedProject(project); // Set the project to be edited
    setShowEditProjectModal(true); // Open the edit project modal
  };

  const handleSaveEditProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:3004/api/projects/${editedProject._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedProject), // Send updated project data
        }
      );

      if (response.ok) {
        // Update the projects array with the edited project
        const updatedProjects = projects.map((project) =>
          project._id === editedProject._id ? editedProject : project
        );
        setProjects(updatedProjects);
        setShowEditProjectModal(false); // Close the edit project modal
        console.log("Project updated successfully");
      } else {
        console.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:3004/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3004/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3004/api/tasks"); // Update the URL to your backend endpoint
      setTasks(response.data); // Update tasks state with fetched data
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handlePrerequisiteChange = (taskId) => {
    const updatedPrerequisites = [...newTask.prerequisiteTasks];
    const taskIndex = updatedPrerequisites.indexOf(taskId);

    if (taskIndex === -1) {
      updatedPrerequisites.push(taskId); // Add taskId if not already selected
    } else {
      updatedPrerequisites.splice(taskIndex, 1); // Remove taskId if already selected
    }

    setNewTask({
      ...newTask,
      prerequisiteTasks: updatedPrerequisites,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the change is for a user or a project
    if (name in newUser) {
      setNewUser({ ...newUser, [name]: value });
    } else if (name in newProject) {
      setNewProject({ ...newProject, [name]: value });
    } else if (name in newTask) {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:3004/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        fetchUsers();
        handleCloseAddUserModal();
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };
  const handleUpdateUser = async () => {
    if (!editUser) {
      console.error("No user selected for editing");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3004/api/users/${editUser._id}`,
        editUser
      );

      if (response.status === 200) {
        console.log("User details updated successfully");

        const updatedUsersResponse = await axios.get(
          "http://localhost:3004/api/users"
        );
        if (updatedUsersResponse.status === 200) {
          setUsers(updatedUsersResponse.data);
        } else {
          console.error("Failed to fetch updated users");
        }

        setShowEditModal(false);
        setEditUser(null);
      } else {
        console.error("Failed to update user details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
    setNewUser({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "User",
      hourlyRate: 0,
    });
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch("http://localhost:3004/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const createdProject = await response.json();
        setProjects([...projects, createdProject]);
        handleCloseAddProjectModal();
      } else {
        console.error("Failed to create project");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const taskData = {
        ...newTask,
        projectId: selectedProjectId,
        assignedTo: selectedUserEmail,
      };

      const response = await fetch("http://localhost:3004/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        console.log("Task created successfully");
        handleCloseAddTaskModal();
        await updateProjectStatus(selectedProjectId);
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCloseAddTaskModal = () => {
    // Reset the newTask state to default values
    setNewTask({
      name: "",
      description: "",
      project: "",
      startDate: "",
      endDate: "",
      assignedTo: "",
      hoursWorked: 0,
      status: "Open",
      prerequisiteTasks: [],
    });
    // Close the modal
    setShowAddTaskModal(false);
  };
  const fetchTasksForProject = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:3004/api/tasks/project?projectId=${projectId}`
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

    // Fetch tasks related to the selected project
    const tasks = await fetchTasksForProject(project._id);
    if (tasks.length > 0) {
      // Set the tasks for the selected project
      setSelectedProject({ ...project, tasks });
    }
  };

  const handleCloseAddProjectModal = () => {
    setShowAddProjectModal(false);
    setNewProject({
      name: "",
      description: "",
      status: "Open",
      createdBy: sessionStorage.getItem("loggedInEmail") || "",
    });
  };

  const handleCloseProjectDetailsModal = () => {
    setShowProjectDetailsModal(false);
    setSelectedProject(null);
  };

  // Function to handle deleting a user
  const handleDeleteUser = async (userId) => {
    if (!userId) {
      console.error("Invalid userId");
      return;
    }

    const confirmDeletion = window.confirm(
      `Are you sure you want to delete this user?`
    );

    if (!confirmDeletion) {
      return; // If the user cancels the deletion, exit the function
    }

    try {
      const response = await axios.delete(
        `http://localhost:3004/api/users/${userId}`
      );

      if (response.status === 200) {
        console.log("User deleted successfully");

        // Fetch updated users after successful deletion
        const updatedUsersResponse = await axios.get(
          "http://localhost:3004/api/users"
        );
        if (updatedUsersResponse.status === 200) {
          // Update the state with the updated list of users
          setUsers(updatedUsersResponse.data);
        } else {
          console.error("Failed to fetch updated users");
        }
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleDeleteProject = async (e, project) => {
    e.stopPropagation(); // To prevent triggering the onClick of the card

    const confirmDeletion = window.confirm(
      `Are you sure you want to delete the project "${project.name}"?`
    );

    if (!confirmDeletion) {
      return; // If the user cancels the deletion, exit the function
    }

    try {
      const response = await fetch(
        `http://localhost:3004/api/projects/${project._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Filter out the deleted project from the projects array
        const updatedProjects = projects.filter((p) => p._id !== project._id);
        setProjects(updatedProjects);
        console.log("Project deleted successfully");
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
        `http://localhost:3004/api/tasks/${taskId}/status`,
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
      return; // If the user cancels, exit the function
    }

    try {
      const response = await axios.put(
        `http://localhost:3004/api/tasks/${taskId}/hours`,
        { hoursWorked: newHoursWorked }
      );

      if (response.status === 200) {
        const updatedTasks = [...selectedProject.tasks];
        updatedTasks[taskIndex].hoursWorked = newHoursWorked;

        setSelectedProject({
          ...selectedProject,
          tasks: updatedTasks,
        });
        console.log("Task hours worked updated successfully");
      } else {
        console.error("Failed to update task hours worked");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditTask = (index) => {
    const selectedTask = selectedProject.tasks[index];
    // Implement logic for editing the task here
    console.log(`Editing task ${index + 1}:`, selectedTask);
    // You can open a modal or perform other edit operations here
  };

  const handleDeleteTask = (index) => {
    const selectedTask = selectedProject.tasks[index];
    const confirmDeletion = window.confirm(
      `Are you sure you want to delete Task Name: ${selectedTask.name}?`
    );

    if (confirmDeletion) {
      deleteTask(selectedTask._id, index);
    }
  };

  const deleteTask = async (taskId, index) => {
    try {
      const response = await fetch(
        `http://localhost:3004/api/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Task ${index + 1} deleted successfully`);
        // Update the tasks list after successful deletion
        const updatedTasks = selectedProject.tasks.filter(
          (task, i) => i !== index
        );
        setSelectedProject({
          ...selectedProject,
          tasks: updatedTasks,
        });
      } else {
        console.error(`Failed to delete task ${index + 1}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateProjectStatus = async (projectId) => {
    try {
      // Fetch all tasks for the given project ID
      console.log(projectId);
      const response = await axios.get(
        `http://localhost:3004/api/tasks/project?projectId=${projectId}`
      );
      const tasks = response.data;

      if (tasks.length === 0) {
        console.log("No tasks found for the project");
        return;
      }

      // Check if any task is 'In Progress'
      const inProgressTasks = tasks.some(
        (task) => task.status === "in progress"
      );
      const allOpen = tasks.every((task) => task.status === "open");
      // Check if all tasks are 'Completed'
      const allCompleted = tasks.every((task) => task.status === "completed");
      const openTasksCount = tasks.filter(
        (task) => task.status === "open"
      ).length;
      // Update the project status based on task statuses
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

      // Update the project's status in the database
      const projectUpdateResponse = await axios.put(
        `http://localhost:3004/api/projects/${projectId}/status`,
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
        // Optionally, you might want to refresh the project list after the update
        // fetchProjects();
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
            Admin Dashboard
          </h1>
          <Button
            style={styles.createProjectBtn}
            variant="success"
            onClick={() => setShowAddProjectModal(true)}
          >
            Create Project
          </Button>
          <Button variant="primary" onClick={handleOpenAddTaskModal}>
            Add Task
          </Button>
          <Modal show={showAddProjectModal} onHide={handleCloseAddProjectModal}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formProjectName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter project name"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formProjectDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter project description"
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddProjectModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateProject}>
                Save Project
              </Button>
            </Modal.Footer>
          </Modal>
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
                  {/* Edit and delete icons */}
                  <div className="d-flex justify-content-end">
                    <span onClick={(e) => handleEditProject(e, project)}>
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ cursor: "pointer", marginRight: "5px" }}
                      />
                    </span>
                    <span onClick={(e) => handleDeleteProject(e, project)}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ cursor: "pointer" }}
                      />
                    </span>
                  </div>

                  <Card.Body>
                    <Card.Title>{project.name}</Card.Title>
                    <Card.Text>Description: {project.description}</Card.Text>
                    <Card.Text>Status: {project.status}</Card.Text>
                    <Card.Text>Created By: {project.createdBy}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <div className="users-section">
            <h2 style={styles.textPrimary}>Users</h2>
            <Button variant="success" onClick={() => setShowAddUserModal(true)}>
              Add User
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Role</th>
                  <th>Hourly Rate</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.role}</td>
                    <td>{user.hourlyRate}</td>
                    <td>
                      {/* Edit icon */}
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ cursor: "pointer", marginRight: "5px" }}
                        onClick={() => handleEditUser(user)}
                      />
                      {/* Delete icon */}
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteUser(user._id)} // Assuming user._id is the valid ID
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Add User Modal */}
      <Modal show={showAddUserModal} onHide={handleCloseAddUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="firstName"
                value={newUser.firstName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastName"
                value={newUser.lastName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserRole">
              <Form.Label>Select Role</Form.Label>
              <Form.Select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formUserHourlyRate">
              <Form.Label>Hourly Rate</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter hourly rate"
                name="hourlyRate"
                value={newUser.hourlyRate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddUserModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Save User
          </Button>
        </Modal.Footer>
      </Modal>
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
          {/* Display tasks related to the selected project */}
          {selectedProject &&
          selectedProject.tasks &&
          selectedProject.tasks.length > 0 ? (
            selectedProject.tasks.map((task, index) => (
              <Card key={task.taskId}>
                {/* Assuming taskId is a unique identifier */}
                <Card.Header
                  onClick={() => handleTaskToggle(index)}
                  className="d-flex justify-content-between align-items-center"
                >
                  {task.name}
                  {/* Edit and Delete icons */}
                  <div>
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => handleEditTask(index)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDeleteTask(index)}
                    />
                  </div>
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

      <Modal show={showAddTaskModal} onHide={handleCloseAddTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskName">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task name"
                name="name"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formTaskDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                name="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formTaskProject">
              <Form.Label>Select Project</Form.Label>
              <Form.Control
                as="select"
                name="project"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
              >
                <option value="">Select project...</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formTaskStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={newTask.startDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, startDate: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formTaskEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={newTask.endDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, endDate: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formTaskAssignedTo">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control
                as="select"
                name="assignedTo"
                value={selectedUserEmail}
                onChange={(e) => {
                  const selectedUserEmail = e.target.value; // Store selected user's email directly
                  setSelectedUserEmail(selectedUserEmail); // Update the state with selected email
                }}
                required
              >
                <option value="">Assigned To</option>
                {users.map((user) => (
                  <option key={user.userId} value={user.email}>
                    {user.email}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formTaskPrerequisites">
              <Form.Label>Select Prerequisite Tasks</Form.Label>
              <div>
                {tasks.map((task) => (
                  <Form.Check
                    key={task._id}
                    type="checkbox"
                    id={`prerequisite-${task._id}`}
                    label={task.name}
                    value={task._id}
                    checked={newTask.prerequisiteTasks.includes(task._id)}
                    onChange={(e) => handlePrerequisiteChange(task._id)}
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddTaskModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateTask}>
            Save Task
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEditProjectModal}
        onHide={() => setShowEditProjectModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEditProjectName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                name="name"
                value={editedProject ? editedProject.name : ""}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEditProjectDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter project description"
                name="description"
                value={editedProject ? editedProject.description : ""}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditProjectModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEditProject}>
            Save Project
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editUser && (
            <Form>
              <Form.Group controlId="formUserEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formUserPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={editUser.password}
                  onChange={(e) =>
                    setEditUser({ ...editUser, password: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formUserFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="firstName"
                  value={editUser.firstName}
                  onChange={(e) =>
                    setEditUser({ ...editUser, firstName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formUserLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  name="lastName"
                  value={editUser.lastName}
                  onChange={(e) =>
                    setEditUser({ ...editUser, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formUserRole">
                <Form.Label>Select Role</Form.Label>
                <Form.Select
                  name="role"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formUserHourlyRate">
                <Form.Label>Hourly Rate</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter hourly rate"
                  name="hourlyRate"
                  value={editUser.hourlyRate}
                  onChange={(e) =>
                    setEditUser({ ...editUser, hourlyRate: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
