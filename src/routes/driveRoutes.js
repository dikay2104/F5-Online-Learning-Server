// src/routes/driveRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadDrive } = require('../controllers/driveController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('video'), uploadDrive);

module.exports = router;
