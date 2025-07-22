const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Feedback = require('../models/Feedback');

exports.getAdminSummary = async (req, res) => {
  try {
    // Tổng số user, chia theo role
    const totalUsers = await User.countDocuments();
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Tổng số khoá học, chia theo trạng thái
    const totalCourses = await Course.countDocuments();
    const approvedCourses = await Course.countDocuments({ status: 'approved' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    const rejectedCourses = await Course.countDocuments({ status: 'rejected' });

    // Tổng số bài học
    const totalLessons = await Lesson.countDocuments();

    // Tổng số feedback
    const totalFeedbacks = await Feedback.countDocuments();

    res.json({
      totalUsers,
      totalTeachers,
      totalStudents,
      totalCourses,
      approvedCourses,
      pendingCourses,
      rejectedCourses,
      totalLessons,
      totalFeedbacks
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin summary', error: err.message });
  }
};