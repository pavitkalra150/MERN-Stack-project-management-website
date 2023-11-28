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
    enum: ["Completed", "In Progress", "Open"],
    required: true,
  },
  hoursWorked: { type: Number },
  prerequisiteTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  assignedTo: { type: String, required: true },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
