const express = require('express');
const router = express.Router();
const { asyncHandler, sendSuccess } = require('../utils/response');
const { userValidation } = require('../middleware/validation');
const UserService = require('../services/UserService');

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post('/', userValidation, asyncHandler(async (req, res) => {
  const user = await UserService.createUser(req.body);
  sendSuccess(res, user, 'User created successfully', 201);
}));

/**
 * @route   GET /api/users
 * @desc    Get all users with events statistics
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const users = await UserService.getAllUsersWithStats();
  sendSuccess(res, users);
}));

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile with events
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const userProfile = await UserService.getUserProfile(req.params.id);
  sendSuccess(res, userProfile);
}));

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Public
 */
router.put('/:id', userValidation, asyncHandler(async (req, res) => {
  const user = await UserService.updateUser(req.params.id, req.body);
  sendSuccess(res, user, 'User updated successfully');
}));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user and all their events
 * @access  Public
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  await UserService.deleteUser(req.params.id);
  sendSuccess(res, null, 'User deleted successfully');
}));

module.exports = router;
