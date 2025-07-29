const express = require('express');
const router = express.Router();
const { asyncHandler, sendSuccess } = require('../utils/response');
const { simpleUserValidation } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const UserService = require('../services/UserService');

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Private
 */
router.post('/', auth, ...simpleUserValidation, asyncHandler(async(req, res) => {
  const user = await UserService.createUser(req.body, req.user.id);
  sendSuccess(res, user, 'User created successfully', 201);
}));

/**
 * @route   GET /api/users
 * @desc    Get all users with events statistics
 * @access  Private
 */
router.get('/', auth, asyncHandler(async(req, res) => {
  const users = await UserService.getAllUsersWithStats(req.user.id);
  sendSuccess(res, users);
}));

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile with events
 * @access  Private
 */
router.get('/:id', auth, asyncHandler(async(req, res) => {
  const userProfile = await UserService.getUserProfile(req.params.id, req.user.id);
  sendSuccess(res, userProfile);
}));

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private
 */
router.put('/:id', auth, ...simpleUserValidation, asyncHandler(async(req, res) => {
  const user = await UserService.updateUser(req.params.id, req.body, req.user.id);
  sendSuccess(res, user, 'User updated successfully');
}));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user and all their events
 * @access  Private
 */
router.delete('/:id', auth, asyncHandler(async(req, res) => {
  await UserService.deleteUser(req.params.id, req.user.id);
  sendSuccess(res, null, 'User deleted successfully');
}));

module.exports = router;
