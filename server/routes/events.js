const express = require('express');
const router = express.Router();
const { asyncHandler, sendSuccess } = require('../utils/response');
const { eventValidation } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const EventService = require('../services/EventService');

/**
 * @route   GET /api/events
 * @desc    Get all events with optional user filter
 * @access  Private
 */
router.get('/', auth, asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const events = await EventService.getAllEvents(userId, req.user.id);
  sendSuccess(res, events);
}));

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Private
 */
router.get('/:id', auth, asyncHandler(async (req, res) => {
  const event = await EventService.getEventById(req.params.id, req.user.id);
  sendSuccess(res, event);
}));

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Private
 */
router.post('/', auth, eventValidation, asyncHandler(async (req, res) => {
  const event = await EventService.createEvent(req.body, req.user.id);
  sendSuccess(res, event, 'Event created successfully', 201);
}));

/**
 * @route   PUT /api/events/:id
 * @desc    Update an event
 * @access  Private
 */
router.put('/:id', auth, eventValidation, asyncHandler(async (req, res) => {
  const event = await EventService.updateEvent(req.params.id, req.body, req.user.id);
  sendSuccess(res, event, 'Event updated successfully');
}));

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event
 * @access  Private
 */
router.delete('/:id', auth, asyncHandler(async (req, res) => {
  await EventService.deleteEvent(req.params.id, req.user.id);
  sendSuccess(res, null, 'Event deleted successfully');
}));

module.exports = router;