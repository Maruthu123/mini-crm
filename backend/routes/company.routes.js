const express = require('express');
const { getCompanies, getCompanyById, createCompany, updateCompany } = require('../controllers/company.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getCompanies).post(createCompany);
router.route('/:id').get(getCompanyById).put(updateCompany);

module.exports = router;
