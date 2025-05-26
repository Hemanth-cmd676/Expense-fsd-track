const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// POST /api/users/lookup (already present)
router.post('/lookup', async (req, res) => {
  try {
    const emails = req.body.emails;
    if (!Array.isArray(emails)) {
      return res.status(400).json({ message: 'Invalid input, emails should be an array' });
    }
    const users = await User.find({ email: { $in: emails } }, '_id email');
    res.json(users);
  } catch (err) {
    console.error('Lookup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET user profile
router.get('/me', authMiddleware, getUserProfile);

// ✅ PUT update user profile
router.put('/me', authMiddleware, updateUserProfile);

module.exports = router;
