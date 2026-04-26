const express = require('express');
const { getUsers } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, getUsers);

module.exports = router;
