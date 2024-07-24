const express = require('express');
const router = express.Router();
const { contactForm } = require('../controllers/home')

router.post('/contact-us', contactForm);

module.exports = router;