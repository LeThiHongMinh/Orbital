//const express = require('express');

const { submitForm, getPortals, getPortalByCourseCode, unMatchPartner, getMatchedUsers, matchMaking } = require('../controllers/matchmaking');
const { Router } = require('express')
const router = Router()
const { userAuth } = require('../middlewares/passport-middleware')
const { authenticateToken } = require('../middlewares/authenticateToken')
// Route for submitting the form
router.post('/submit-form', userAuth, submitForm);
router.get('/portal', userAuth, getPortals);
router.get('/portal/:id', userAuth, getPortalByCourseCode);
router.patch('/portal/:id/toggle-status', userAuth, unMatchPartner);
router.get('/yourpartner', userAuth, getMatchedUsers);
router.post('/creatematch', userAuth, matchMaking);

module.exports = router;
