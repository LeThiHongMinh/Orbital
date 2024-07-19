const { submitForm, getPortals, getPortalByCourseCode, unMatchPartner, getMatchedUsers, matchMaking, submitFeedback, getFilesForMatchedUsers, uploadFileForMatchedUsers } = require('../controllers/matchmaking');
const { Router } = require('express');
const router = Router();
const { userAuth } = require('../middlewares/passport-middleware');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage });

// Route for submitting the form
router.post('/submit-form', userAuth, submitForm);

// Route to get portals (matched courses)
router.get('/portal', userAuth, getPortals);

// Route to get portal details by course code
router.get('/portal/:id', userAuth, getPortalByCourseCode);

// Route to unmatch partner
router.patch('/portal/:id/toggle-status', userAuth, unMatchPartner);

// Route to get matched users
router.get('/yourpartner', userAuth, getMatchedUsers);

// Route to upload file for matched users
router.post('/upload-matched-file', userAuth, upload.single('file'), uploadFileForMatchedUsers);

// Route to get files for matched users by course code
router.get('/matched-files', userAuth, getFilesForMatchedUsers);

// Route to submit feedback
router.post('/submit-feedback', userAuth, submitFeedback);

// Note: The matchMaking route is handled automatically when the form is submitted

module.exports = router;
