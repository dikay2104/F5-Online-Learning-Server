const express = require('express');
const { getAdminSummary } = require('../controllers/adminStatsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get(
  '/summary',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('admin'),
  getAdminSummary
);

module.exports = router;