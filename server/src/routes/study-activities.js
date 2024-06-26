const express = require('express');
const router = express.Router();
const studyActivitiesController = require('../controllers/study-activities');
const { userAuth } = require('../middlewares/passport-middleware');

router.post('/study-activities', userAuth, studyActivitiesController.createStudyActivity);
router.get('/study-activities', userAuth, studyActivitiesController.getStudyActivities);
router.get('/study-activities/:id', userAuth, studyActivitiesController.getStudyActivity);
router.put('/study-activities/:id', userAuth, studyActivitiesController.updateStudyActivity);
router.delete('/study-activities/:id', userAuth, studyActivitiesController.deleteStudyActivity);
router.get('/study-activities', userAuth, studyActivitiesController.getTasksForDate);
router.patch('/study-activities/:id/toggle-status', userAuth, studyActivitiesController.toggleActivityStatus);

module.exports = router;
