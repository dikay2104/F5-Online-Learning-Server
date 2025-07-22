const Quiz = require('../models/Quiz');

// Tạo quiz mới
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const quiz = new Quiz({ title, description, questions });
    await quiz.save();
    res.status(201).json({ status: 'success', data: quiz });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Lấy danh sách quiz
exports.getAllQuiz = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'title description');
    res.json({ status: 'success', data: quizzes });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Lấy chi tiết quiz (không trả đáp án đúng)
exports.getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ status: 'error', message: 'Quiz not found' });
    const questions = quiz.questions.map(q => ({ question: q.question, options: q.options }));
    res.json({ status: 'success', data: { _id: quiz._id, title: quiz.title, description: quiz.description, questions } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Nộp đáp án, tự động chấm điểm, trả về kết quả từng câu
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // array of selected option index
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ status: 'error', message: 'Quiz not found' });
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ status: 'error', message: 'Số lượng đáp án không hợp lệ' });
    }
    let correct = 0;
    const detail = quiz.questions.map((q, idx) => {
      const isCorrect = answers[idx] === q.correctOption;
      if (isCorrect) correct++;
      return {
        question: q.question,
        yourAnswer: answers[idx],
        correctAnswer: q.correctOption,
        isCorrect,
        options: q.options
      };
    });
    const score = Math.round((correct / quiz.questions.length) * 100);
    res.json({ status: 'success', data: { total: quiz.questions.length, correct, score, detail } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}; 