const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { asyncHandler, sendSuccess } = require('../utils/response');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
} = require('../middleware/validation');
const AuthService = require('../services/AuthService');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, asyncHandler(async(req, res) => {
  const result = await AuthService.register(req.body);
  sendSuccess(res, result, 'User registered successfully', 201);
}));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, asyncHandler(async(req, res) => {
  const result = await AuthService.login(req.body);
  sendSuccess(res, result, 'Login successful');
}));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', auth, asyncHandler(async(req, res) => {
  const user = await AuthService.getCurrentUser(req.user._id);
  sendSuccess(res, { user });
}));

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', auth, updateProfileValidation, asyncHandler(async(req, res) => {
  const user = await AuthService.updateProfile(req.user._id, req.body);
  sendSuccess(res, { user }, 'Profile updated successfully');
}));

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', auth, changePasswordValidation, asyncHandler(async(req, res) => {
  const user = await AuthService.changePassword(req.user._id, req.body);
  sendSuccess(res, { user }, 'Profile and password updated successfully');
}));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (in a real app, you'd handle token blacklisting)
 * @access  Private
 */
router.post('/logout', auth, (req, res) => {
  sendSuccess(res, null, 'Logout successful');
});

module.exports = router;
