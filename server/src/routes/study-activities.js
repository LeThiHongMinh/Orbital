const express = require('express');
const router = express.Router();
const studyActivitiesController = require('../controllers/study-activities');
const { userAuth } = require('../middlewares/passport-middleware');
const { authenticateToken } = require('../controllers/auth');


router.post('/study-activities', authenticateToken, studyActivitiesController.createStudyActivity);
router.get('/study-activities', authenticateToken, studyActivitiesController.getStudyActivities);
router.get('/study-activities/:id', authenticateToken, studyActivitiesController.getStudyActivity);
router.put('/study-activities/:id', authenticateToken, studyActivitiesController.updateStudyActivity);
router.delete('/study-activities/:id', authenticateToken, studyActivitiesController.deleteStudyActivity);
router.patch('/study-activities/:id/toggle-status', authenticateToken, studyActivitiesController.toggleActivityStatus);

module.exports = router;
