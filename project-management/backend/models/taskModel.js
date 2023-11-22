const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["Completed", "In Progress", "Not Started"],
    required: true,
  },
  hoursWorked: { type: Number },
  prerequisiteTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  // Other relevant fields
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
