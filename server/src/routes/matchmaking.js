//const express = require('express');

const { submitForm } = require('../controllers/matchmaking');
const { Router } = require('express')
const router = Router()

// Route for submitting the form
router.post('/submit-form', submitForm);

module.exports = router;
