const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String,
  resources: [String], // Tài liệu kèm theo
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
