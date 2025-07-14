require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'src', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created uploads folder at:', uploadDir);
}

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const enrollmentRoutes = require('./src/routes/enrollmentRoutes');
const lessonRoutes = require('./src/routes/lessonRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const collectionRoutes = require('./src/routes/collectionRoutes');
const progressRoutes = require('./src/routes/progressRoutes');
const driveRoutes = require('./src/routes/driveRoutes');
const connectDB = require('./src/config/db');

const app = express();

console.log('MONGO_URI:', process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/drive', driveRoutes);

// Kết nối DB và khởi động server
connectDB().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
  });
});
