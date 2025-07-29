const Event = require('../models/Event');
const User = require('../models/User');

class EventService {
  /**
   * Check if event times overlap with existing events for the same user
   */
  static async checkEventOverlap(userId, startDate, endDate, excludeEventId = null) {
    const filter = {
      userId,
      $or: [
        {
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) }
        }
      ]
    };
    
    if (excludeEventId) {
      filter._id = { $ne: excludeEventId };
    }
    
    return await Event.findOne(filter);
  }

  /**
   * Get all events with optional user filter
   */
  static async getAllEvents(userId = null) {
    const filter = userId ? { userId } : {};
    
    return await Event.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ startDate: 1 })
      .lean();
  }

  /**
   * Get event by ID
   */
  static async getEventById(eventId) {
    const event = await Event.findById(eventId)
      .populate('userId', 'firstName lastName email')
      .lean();
      
    if (!event) {
      throw new Error('Event not found');
    }
    
    return event;
  }

  /**
   * Create a new event
   */
  static async createEvent(eventData) {
    const { title, description, startDate, endDate, userId } = eventData;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Check for overlapping events
    const overlapping = await this.checkEventOverlap(userId, startDate, endDate);
    if (overlapping) {
      const error = new Error('Event time overlaps with existing event');
      error.statusCode = 400;
      throw error;
    }

    const event = await Event.create({ title, description, startDate, endDate, userId });
    
    return await Event.findById(event._id)
      .populate('userId', 'firstName lastName email')
      .lean();
  }

  /**
   * Update an event
   */
  static async updateEvent(eventId, eventData) {
    const { title, description, startDate, endDate, userId } = eventData;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Check for overlapping events (excluding current event)
    const overlapping = await this.checkEventOverlap(userId, startDate, endDate, eventId);
    if (overlapping) {
      const error = new Error('Event time overlaps with existing event');
      error.statusCode = 400;
      throw error;
    }

    const event = await Event.findByIdAndUpdate(
      eventId,
      { title, description, startDate, endDate, userId },
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email');

    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }

    return event;
  }

  /**
   * Delete an event
   */
  static async deleteEvent(eventId) {
    const event = await Event.findByIdAndDelete(eventId);
    
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }
    
    return event;
  }

  /**
   * Get events for a specific user
   */
  static async getUserEvents(userId) {
    return await Event.find({ userId })
      .sort({ startDate: 1 })
      .lean();
  }

  /**
   * Get upcoming events for a user
   */
  static async getUpcomingEvents(userId, limit = null) {
    const now = new Date();
    const query = Event.find({ 
      userId, 
      startDate: { $gte: now } 
    }).sort({ startDate: 1 });
    
    if (limit) {
      query.limit(limit);
    }
    
    return await query.lean();
  }
}

module.exports = EventService;
