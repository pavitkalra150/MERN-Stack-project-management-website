const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3003;

const uri = process.env.ATLAS_URI;
const mongoURI = uri;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log(`Connected to MongoDB database successfully`);
});

app.use(cors());
app.use(express.json());

// Importing your Mongoose models (schemas)
const User = require("./models/userModel");
const Task = require("./models/taskModel");
const Project = require("./models/projectModel")
// Routes for Users
const userRoutes = require("./routes/userRoute");
app.use("/api", userRoutes);

// Routes for Tasks
const taskRoutes = require("./routes/taskRoutes");
app.use("/api", taskRoutes);

const projectRoutes = require("./routes/projectRoute");
app.use("/api", projectRoutes);

// Login Route
const authRoutes = require("./routes/authRoute");
app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
