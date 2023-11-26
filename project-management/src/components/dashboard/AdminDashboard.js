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
  Accordion,
} from "react-bootstrap";
import "../styles/admin.css";
const TaskAccordion = ({ tasks }) => {
  const [expandedTask, setExpandedTask] = useState(null);

  const handleTaskToggle = (task) => {
    if (expandedTask === task) {
      setExpandedTask(null);
    } else {
      setExpandedTask(task);
    }
  };

  return (
    <Accordion>
      {tasks && tasks.length > 0 ? (
        tasks.map((task, index) => (
          <Card key={index}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey={index.toString()}
              onClick={() => handleTaskToggle(index)}
            >
              Task {index + 1}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index.toString()}>
              <Card.Body>
                <p>Task details...</p>
                {/* Render task details here */}
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
const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [users, setUsers] = useState([]);
  const roles = ["User", "Admin"];
  const [showAddUserModal, setShowAddUserModal] = useState(false);
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
    // Define other styles...
    // For brevity, I'm showing only a few styles here
    textPrimary: {
      color: "#1976d2",
    },
    createProjectBtn: {
      backgroundColor: "#4caf50",
      border: "none",
      color: "white",
      padding: "10px 20px",
      // Define other button styles...
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
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the change is for a user or a project
    if (name in newUser) {
      setNewUser({ ...newUser, [name]: value });
    } else if (name in newProject) {
      setNewProject({ ...newProject, [name]: value });
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
        fetchUsers(); // Fetch updated users after adding a new one
        handleCloseAddUserModal();
      } else {
        console.error("Failed to create user");
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

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectDetailsModal(true);
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
                {/* Add more form fields for other project details */}
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
            <Button
              variant="success"
              onClick={() => setShowAddUserModal(true)}
            >
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
                  <tr key={user.userId}>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.role}</td>
                    <td>{user.hourlyRate}</td>
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
        {/* Other form fields for user data */}
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
          {selectedProject && (
            <TaskAccordion tasks={selectedProject.tasks} />
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
