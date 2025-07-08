const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const authMiddleware = require("../middlewares/authMiddleware");

// Lấy danh sách tất cả feedback 
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.requireRole("admin"),
  feedbackController.getAllFeedbacks
);

// Xóa feedback 
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole("admin"),
  feedbackController.deleteFeedback
);

// Admin reply feedback 
router.post(
  "/:id/reply",
  authMiddleware.verifyToken,
  authMiddleware.requireRole("admin"),
  feedbackController.replyFeedback
);

module.exports = router;
