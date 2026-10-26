const express = require('express');
const Application = require('../models/Application');

const router = express.Router();

// POST /api/applications — save one application
router.post('/', async (req, res) => {
  try {
    const { name, email, rollNumber, internship } = req.body;

    const application = await Application.create({
      name,
      email,
      rollNumber,
      internship,
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Please check the application details.',
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }

    console.error('Could not save application:', error);
    res.status(500).json({ message: 'Could not submit the application.' });
  }
});

// GET /api/applications — retrieve saved applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Could not retrieve applications:', error);
    res.status(500).json({ message: 'Could not retrieve applications.' });
  }
});

module.exports = router;