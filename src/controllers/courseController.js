const Course = require('../models/Course');

exports.getAllCourse = async (req, res) => {
    try {
        const search = req.query.search || '';
        const regex = new RegExp(search, 'i'); // không phân biệt hoa thường
        const courses = await Course.find({ title: { $regex: regex } })
            .populate('teacher');
        res.status(200).json({ status: 'success', data: courses });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .populate('teacher')
            .populate('lessons');
        if (!course) {
            return res.status(404).json({ status: 'error', message: 'Course not found' });
        }
        res.status(200).json({ status: 'success', data: course });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.createCourse = async (req, res) => {
  try {
    const teacherId = req.user.id; // lấy userId từ middleware gán
    const course = new Course({
      ...req.body,
      teacher: teacherId
    });

    await course.save();
    res.status(201).json({ status: 'success', data: course });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
            new: true,
            runValidators: true
        });
        if (!course) {
            return res.status(404).json({ status: 'error', message: 'Course not found' });
        }
        res.status(200).json({ status: 'success', data: course });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.courseId);
        if (!course) {
            return res.status(404).json({ status: 'error', message: 'Course not found' });
        }
        res.status(200).json({ status: 'success', data: course });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.getCoursePagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search || '';

        const filter = {
            title: { $regex: new RegExp(search, 'i') }
        };
        if (status) filter.status = status;

        const total = await Course.countDocuments(filter);
        const courses = await Course.find(filter)
            .populate('teacher')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: courses
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
