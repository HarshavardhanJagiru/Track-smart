const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, deleteUser, verifyEmail, promoteUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.get('/verify/:token', verifyEmail);
router.post('/login', loginUser);
router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, promoteUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
