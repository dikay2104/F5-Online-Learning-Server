const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progress: Number,
  paid: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
