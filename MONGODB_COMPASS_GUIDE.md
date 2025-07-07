# Hướng dẫn tạo Database MongoDB Compass cho F5 Online Learning

## 📋 Cấu trúc Database

Database này có 6 collections chính:

### 1. **users** - Quản lý người dùng
- `fullName`: Tên đầy đủ
- `email`: Email (unique)
- `password`: Mật khẩu (đã hash)
- `role`: Vai trò (student/teacher/admin)
- `avatar`: Ảnh đại diện
- `isActive`: Trạng thái hoạt động

### 2. **courses** - Quản lý khóa học
- `title`: Tiêu đề khóa học
- `description`: Mô tả
- `price`: Giá (0 = miễn phí)
- `thumbnail`: Ảnh đại diện
- `level`: Cấp độ (beginner/intermediate/advanced)
- `category`: Danh mục
- `duration`: Thời lượng (phút)
- `studentsCount`: Số học viên
- `status`: Trạng thái (draft/pending/approved/rejected)
- `teacher`: ID giảng viên
- `lessons`: Danh sách bài học

### 3. **lessons** - Quản lý bài học
- `title`: Tiêu đề bài học
- `description`: Mô tả
- `videoUrl`: Link video
- `videoDuration`: Thời lượng video
- `order`: Thứ tự bài học
- `isPreviewable`: Cho phép học thử
- `resources`: Tài liệu kèm theo
- `course`: ID khóa học

### 4. **enrollments** - Quản lý đăng ký
- `course`: ID khóa học
- `user`: ID học viên
- `progress`: Tiến độ học (0-100)
- `status`: Trạng thái đăng ký
- `enrolledAt`: Ngày đăng ký
- `payment`: Thông tin thanh toán

### 5. **assignments** - Quản lý bài tập
- `course`: ID khóa học
- `student`: ID học viên
- `fileUrl`: Link file bài tập
- `submittedAt`: Ngày nộp

### 6. **feedback** - Quản lý đánh giá
- `course`: ID khóa học
- `student`: ID học viên
- `comment`: Nhận xét
- `rating`: Điểm đánh giá (1-5)

## 🚀 Cách tạo Database trong MongoDB Compass

### Bước 1: Kết nối MongoDB
1. Mở MongoDB Compass
2. Kết nối đến: `mongodb://localhost:27017`
3. Tạo database mới: `f5-online-learning`

### Bước 2: Tạo Collections
Tạo 6 collections:
- `users`
- `courses`
- `lessons`
- `enrollments`
- `assignments`
- `feedback`

### Bước 3: Import dữ liệu
1. Mở file `database_data.json`
2. Copy từng collection data
3. Trong MongoDB Compass:
   - Chọn collection
   - Click "Add Data" → "Insert Document"
   - Paste JSON data
   - Click "Insert"

## 📊 Dữ liệu mẫu

### Users (5 records)
- **Admin**: admin@f5learning.com / admin123
- **Teacher 1**: teacher1@f5learning.com / teacher123
- **Teacher 2**: teacher2@f5learning.com / teacher123
- **Student 1**: student1@f5learning.com / student123
- **Student 2**: student2@f5learning.com / student123

### Courses (3 records)
1. **JavaScript Cơ Bản** - Miễn phí
2. **React.js Nâng Cao** - 299,000 VND
3. **Node.js Backend Development** - 399,000 VND

### Lessons (3 records)
- 2 bài học cho khóa JavaScript
- 1 bài học cho khóa React

### Enrollments (3 records)
- Student 1 đăng ký 2 khóa học
- Student 2 đăng ký 1 khóa học

### Assignments (2 records)
- 2 bài tập cho khóa JavaScript

### Feedback (3 records)
- Đánh giá từ 2 học viên

## 🔗 Relationships
- `courses.teacher` → `users._id`
- `courses.lessons` → `lessons._id`
- `lessons.course` → `courses._id`
- `enrollments.course` → `courses._id`
- `enrollments.user` → `users._id`
- `assignments.course` → `courses._id`
- `assignments.student` → `users._id`
- `feedback.course` → `courses._id`
- `feedback.student` → `users._id`

## 💡 Lưu ý
- Tất cả ObjectId đã được tạo sẵn để đảm bảo relationships hoạt động đúng
- Passwords đã được hash (trong thực tế sẽ dùng bcrypt)
- Timestamps đã được set sẵn
- Dữ liệu phù hợp với schema đã định nghĩa trong models 