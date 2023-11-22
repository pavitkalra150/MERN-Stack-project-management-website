import React from "react";
import { Card, Button } from "react-bootstrap";

const AdminDashboard = () => {
  // Dummy data for projects and tasks
  const projects = [
    {
      id: 1,
      name: "Project A",
      tasks: [
        { id: 101, title: "Task 1", description: "Description for Task 1" },
        { id: 102, title: "Task 2", description: "Description for Task 2" },
      ],
    },
    {
      id: 2,
      name: "Project B",
      tasks: [
        { id: 201, title: "Task 1", description: "Description for Task 1" },
      ],
    },
    // ... Add more project data if needed
  ];

  // Dummy data for users
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    // ... Add more user data if needed
  ];

  const renderProjects = () => {
    return projects.map((project) => (
      <Card key={project.id} className="mb-3">
        <Card.Header>
          <Button variant="link" eventKey={project.id}>
            {project.name}
          </Button>
        </Card.Header>
        <Card.Body>
          <ul className="list-group list-group-flush">
            {project.tasks.map((task) => (
              <li key={task.id} className="list-group-item">
                <h5 className="text-dark">{task.title}</h5>
                <p className="text-secondary">{task.description}</p>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <div className="admin-dashboard container py-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-primary">Projects</h2>
          {renderProjects()}
        </div>
        <div className="col-md-6">
          <div className="users-section">
            <h2 className="text-primary">Users</h2>
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
