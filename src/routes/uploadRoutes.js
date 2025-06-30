const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload } = require('../services/cloudinary');

router.post(
  '/thumbnail',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('teacher', 'admin'),
  upload.single('thumbnail'),
  uploadController.uploadThumbnail
);

module.exports = router;
