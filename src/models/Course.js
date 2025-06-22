const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: { type: Number, default: 0}, 
  thumbnail: String,
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner'},
  category: { type: String, default: 'programming' },
  duration: Number,
  studentsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
