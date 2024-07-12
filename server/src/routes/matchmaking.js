//const express = require('express');

const { submitForm, getPortals, getPortalByCourseCode, unMatchPartner } = require('../controllers/matchmaking');
const { Router } = require('express')
const router = Router()
const { userAuth } = require('../middlewares/passport-middleware')
// Route for submitting the form
router.post('/submit-form', userAuth, submitForm);
router.get('/portal', userAuth, getPortals);
router.get('/portal/:id', userAuth, getPortalByCourseCode);
router.patch('/portal/:id/toggle-status', userAuth, unMatchPartner);

module.exports = router;
