const express = require('express');
const { getLeads, getLeadById, createLead, updateLead, deleteLead } = require('../controllers/lead.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLeadById).put(updateLead).delete(deleteLead);

module.exports = router;
