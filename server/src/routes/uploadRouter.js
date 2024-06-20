// routes/uploadRouter.js

const { Router } = require('express')
const router = Router()
const multer = require('multer');
const { uploadLibrary, searchFiles } = require('../controllers/uploadController');

// Multer storage configuration
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.single('file'), uploadLibrary);
router.get('/search', searchFiles);

module.exports = router;
