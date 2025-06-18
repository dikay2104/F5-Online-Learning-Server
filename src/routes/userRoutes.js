const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

//---- Router tĩnh -----
// [GET] /api/users/profile - yêu cầu token
router.get('/profile/me', authMiddleware.verifyToken, userController.getCurrentUserProfile);

// [GET] test middleware
router.get('/admin-data', authMiddleware.verifyToken, authMiddleware.requireRole('admin'), (req, res) => {
  res.json({ message: 'Chào admin!' });
});

//---- Router động -----
// [GET] /api/users/:id - công khai (test)
router.get('/:id', userController.getUserProfile);
module.exports = router;
