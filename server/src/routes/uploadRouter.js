// routes/uploadRouter.js

const { Router } = require('express')
const router = Router()
const multer = require('multer');
const { uploadLibrary, searchFiles, getLibraryFiles,  downloadFiles } = require('../controllers/uploadController');

// Multer storage configuration
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.single('file'), uploadLibrary);
router.get('/search', searchFiles);
router.get('/files', getLibraryFiles);
router.get('/files/:id/download', downloadFiles);

module.exports = router;
