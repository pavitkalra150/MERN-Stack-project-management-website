const Task = require('../models/taskModel');
const User = require('../models/userModel');

const calculateProjectCost = async (projectId) => {
  try {
    const tasks = await Task.find({ projectId });

    const uniqueUserIds = Array.from(new Set(tasks.map((task) => task.assignedTo)));
    const users = await User.find({ email: { $in: uniqueUserIds } });

    let totalCost = 0;

    tasks.forEach((task) => {
      const user = users.find((usr) => usr.email === task.assignedTo);

      if (user) {
        const taskCost = (task.hoursWorked || 0) * (user.hourlyRate || 0);
        totalCost += taskCost;
      }
    });

    return totalCost;
  } catch (error) {
    console.error('Error calculating project cost:', error);
    throw error;
  }
};

module.exports = { calculateProjectCost };
