const Company = require('../models/Company');
const Lead = require('../models/Lead');

// @route   GET /api/companies
// @access  Private
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/companies/:id
// @access  Private
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('createdBy', 'name');

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Get associated leads (soft-deleted excluded via schema middleware)
    const leads = await Lead.find({ company: req.params.id })
      .populate('assignedTo', 'name email')
      .select('name email status assignedTo createdAt');

    res.json({ success: true, data: company, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/companies
// @access  Private
const createCompany = async (req, res) => {
  try {
    const company = await Company.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/companies/:id
// @access  Private
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCompanies, getCompanyById, createCompany, updateCompany };
