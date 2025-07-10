const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { Innertube } = require('youtubei.js');

// Lấy videoId từ YouTube URL
const getVideoId = (url) => {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Tính lại tổng thời lượng của Course
const updateCourseDuration = async (courseId) => {
  const lessons = await Lesson.find({ course: courseId });
  const totalDuration = lessons.reduce((sum, l) => sum + (l.videoDuration || 0), 0);
  await Course.findByIdAndUpdate(courseId, { duration: Math.floor(totalDuration / 60) }); // phút
};

exports.createLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, order, isPreviewable, resources, course, collection } = req.body;
    const videoId = getVideoId(videoUrl);

    if (!videoId) {
      return res.status(400).json({ status: 'error', message: 'Video URL không hợp lệ' });
    }

    const youtube = await Innertube.create();
    const info = await youtube.getInfo(videoId);

    const lesson = new Lesson({
      title,
      description,
      videoUrl,
      videoDuration: info.basic_info.duration, // giây
      order,
      isPreviewable,
      resources,
      course,
      collection
    });

    await lesson.save();

    // Cập nhật mảng lessons trong Course
    await Course.findByIdAndUpdate(course, {
      $push: { lessons: lesson._id }
    });

    // Cập nhật tổng thời lượng khóa học
    await updateCourseDuration(course);

    res.status(201).json({ status: 'success', data: lesson });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
    res.status(200).json({ status: 'success', data: lessons });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ status: 'error', message: 'Lesson not found' });
    res.status(200).json({ status: 'success', data: lesson });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const updates = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ status: 'error', message: 'Lesson không tồn tại' });

    // Nếu videoUrl thay đổi thì lấy lại thời lượng mới
    if (updates.videoUrl && updates.videoUrl !== lesson.videoUrl) {
      const videoId = getVideoId(updates.videoUrl);
      if (!videoId) {
        return res.status(400).json({ status: 'error', message: 'Video URL không hợp lệ' });
      }
      const youtube = await Innertube.create();
      const info = await youtube.getInfo(videoId);
      updates.videoDuration = info.basic_info.duration;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, updates, { new: true });
    await updateCourseDuration(updatedLesson.course);

    res.status(200).json({ status: 'success', data: updatedLesson });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.lessonId);
    if (!lesson) return res.status(404).json({ status: 'error', message: 'Lesson không tồn tại' });

    await updateCourseDuration(lesson.course);
    res.status(200).json({ status: 'success', message: 'Lesson đã xoá', data: lesson });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getLessonPagination = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const courses = await Course.find({ teacher: teacherId });
    const courseIds = courses.map(c => c._id);

    const filter = {
      course: { $in: courseIds },
      title: { $regex: new RegExp(search, 'i') }
    };

    const total = await Lesson.countDocuments(filter);
    const lessons = await Lesson.find(filter)
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: 'success',
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: lessons
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.reorderLessons = async (req, res) => {
  try {
    const updates = req.body; // [{ lessonId, order }]
    const bulkOps = updates.map(({ lessonId, order }) => ({
      updateOne: {
        filter: { _id: lessonId },
        update: { $set: { order } }
      }
    }));
    await Lesson.bulkWrite(bulkOps);
    res.status(200).json({ status: 'success', message: 'Thứ tự bài học đã được cập nhật' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};