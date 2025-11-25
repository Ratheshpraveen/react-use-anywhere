const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Access to protected route successful',
    user: req.user
  });
});

module.exports = router;
