import React, { useState } from "react";
import axios from "axios";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3005/api/login", {
        email,
        password,
      });
      const userRole = response.data.role;
      //localStorage.setItem("token", token);
      sessionStorage.setItem("loggedInEmail", email);

      if (userRole === "Admin") {
        window.location.href = "/admin-dashboard";
      } else if (userRole === "User") {
        window.location.href = "/user-dashboard";
      } else {
        setError("Invalid user role");
      }
    } catch (error) {
      setError("Invalid credentials");
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow login-card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4 text-primary">
                Project Management Login
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
