const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Tạo quiz mới
router.post('/', quizController.createQuiz);
// Lấy danh sách quiz
router.get('/', quizController.getAllQuiz);
// Lấy chi tiết quiz (không trả đáp án đúng)
router.get('/:quizId', quizController.getQuiz);
// Nộp đáp án, tự động chấm điểm
router.post('/:quizId/submit', quizController.submitQuiz);

module.exports = router; 