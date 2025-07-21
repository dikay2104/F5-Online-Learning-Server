const express = require('express');
const { getTeacherStatistics } = require('../controllers/statisticsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/teacher', authMiddleware.verifyToken, authMiddleware.requireRole("teacher"), getTeacherStatistics);

module.exports = router;
