const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["Completed", "In Progress", "Open"],
    required: true,
  },
  createdBy: { type: String, required: true }, // Storing email as a string
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
