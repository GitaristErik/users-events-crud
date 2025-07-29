const express = require('express');
const router = express.Router();
const { asyncHandler, sendSuccess } = require('../utils/response');
const { eventValidation } = require('../middleware/validation');
const EventService = require('../services/EventService');

/**
 * @route   GET /api/events
 * @desc    Get all events with optional user filter
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const events = await EventService.getAllEvents(userId);
  sendSuccess(res, events);
}));

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const event = await EventService.getEventById(req.params.id);
  sendSuccess(res, event);
}));

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Public
 */
router.post('/', eventValidation, asyncHandler(async (req, res) => {
  const event = await EventService.createEvent(req.body);
  sendSuccess(res, event, 'Event created successfully', 201);
}));

/**
 * @route   PUT /api/events/:id
 * @desc    Update an event
 * @access  Public
 */
router.put('/:id', eventValidation, asyncHandler(async (req, res) => {
  const event = await EventService.updateEvent(req.params.id, req.body);
  sendSuccess(res, event, 'Event updated successfully');
}));

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event
 * @access  Public
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  await EventService.deleteEvent(req.params.id);
  sendSuccess(res, null, 'Event deleted successfully');
}));

module.exports = router;