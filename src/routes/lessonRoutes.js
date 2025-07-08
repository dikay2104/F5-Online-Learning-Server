const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/course/:courseId', lessonController.getLessonsByCourse); // xem tất cả bài học trong 1 khóa
router.get('/:lessonId', lessonController.getLessonById);             // xem chi tiết 1 bài học

// Protected routes: Chỉ giáo viên hoặc admin mới được thao tác
router.get(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('teacher', 'admin'),
  lessonController.getLessonPagination
);

router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('teacher', 'admin'),
  lessonController.createLesson
);

router.put(
  '/reorder',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('teacher', 'admin'),
  lessonController.reorderLessons
);

router.put(
  '/:lessonId',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('teacher', 'admin'),
  lessonController.updateLesson
);

router.delete(
  '/:lessonId',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('teacher', 'admin'),
  lessonController.deleteLesson
);

module.exports = router;
