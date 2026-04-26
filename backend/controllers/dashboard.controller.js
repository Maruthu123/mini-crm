const Lead = require('../models/Lead');
const Task = require('../models/Task');

// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [leadStats, taskStats, tasksDueToday, completedTasks] = await Promise.all([
      // Lead aggregation by status
      Lead.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Total tasks
      Task.countDocuments(),

      // Tasks due today
      Task.countDocuments({
        dueDate: { $gte: today, $lt: tomorrow },
        status: { $ne: 'Completed' },
      }),

      // Completed tasks
      Task.countDocuments({ status: 'Completed' }),
    ]);

    const totalLeads = leadStats.reduce((acc, s) => acc + s.count, 0);
    const qualifiedLeads = leadStats.find((s) => s._id === 'Qualified')?.count || 0;
    const wonLeads = leadStats.find((s) => s._id === 'Won')?.count || 0;

    res.json({
      success: true,
      data: {
        totalLeads,
        qualifiedLeads,
        wonLeads,
        tasksDueToday,
        completedTasks,
        totalTasks: taskStats,
        leadsByStatus: leadStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
