const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes: Xem danh sách & chi tiết khoá học
router.get('/', courseController.getAllCourse);
router.get('/pagination', authMiddleware.verifyToken, courseController.getCoursePagination);

router.get('/:courseId', courseController.getCourseById);

// Protected routes: Chỉ giáo viên hoặc admin mới được tạo/sửa/xoá
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('teacher', 'admin'),
  courseController.createCourse
);

router.put(
  '/:courseId',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('teacher', 'admin'),
  courseController.updateCourse
);

router.delete(
  '/:courseId',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('teacher', 'admin'),
  courseController.deleteCourse
);

router.put(
  '/:courseId/submit',
  authMiddleware.verifyToken,
  authMiddleware.requireRole('teacher', 'admin'),
  courseController.submitCourse
);

module.exports = router;
