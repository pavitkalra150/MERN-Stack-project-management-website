const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["Completed", "In Progress", "Not Started"],
    required: true,
  },
  totalHoursWorked: { type: Number },
  totalCost: { type: Number },
  // Other relevant fields
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
