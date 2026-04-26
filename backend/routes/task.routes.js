const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/task.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(adminOnly, deleteTask);

module.exports = router;
