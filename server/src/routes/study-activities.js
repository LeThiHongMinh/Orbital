const express = require('express');
const router = express.Router();
const studyActivitiesController = require('../controllers/study-activities');
const { userAuth } = require('../middlewares/passport-middleware');
const { authenticateToken } = require('../controllers/auth');

router.post('/study-activities', studyActivitiesController.createStudyActivity);
router.get('/study-activities', studyActivitiesController.getStudyActivities);
router.get('/study-activities/:id', studyActivitiesController.getStudyActivity);
router.put('/study-activities/:id', studyActivitiesController.updateStudyActivity);
router.delete('/study-activities/:id', studyActivitiesController.deleteStudyActivity);
router.patch('/study-activities/:id/toggle-status', studyActivitiesController.toggleActivityStatus);

module.exports = router;
