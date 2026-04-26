const Task = require('../models/Task');

// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { leadId, status } = req.query;
    const query = {};

    if (leadId) query.lead = leadId;
    if (status) query.status = status;

    // Agents see only their assigned tasks; admins see all
    if (req.user.role !== 'admin') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('lead', 'name email')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    await task.populate('lead', 'name email');
    await task.populate('assignedTo', 'name email');

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/tasks/:id
// @access  Private — only assigned user or admin can update
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Authorization: only assignedTo user or admin can update
    const isAssigned = task.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAssigned && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned user or admin can update this task',
      });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('lead', 'name email')
      .populate('assignedTo', 'name email');

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/tasks/:id
// @access  Private — admin only
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
