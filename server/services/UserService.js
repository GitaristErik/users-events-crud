const User = require('../models/User');
const Event = require('../models/Event');
const EventService = require('./EventService');

class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData) {
    const { firstName, lastName, email, phoneNumber } = userData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 400;
      throw error;
    }
    
    return await User.create({ firstName, lastName, email, phoneNumber });
  }

  /**
   * Get all users with events statistics
   */
  static async getAllUsersWithStats() {
    const users = await User.find().lean();

    const result = await Promise.all(users.map(async (user) => {
      const allEvents = await EventService.getUserEvents(user._id);
      const upcomingEvents = await EventService.getUpcomingEvents(user._id, 1);
      
      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        eventsCount: allEvents.length,
        nextEventDate: upcomingEvents.length > 0 ? upcomingEvents[0].startDate : null
      };
    }));

    return result;
  }

  /**
   * Get user profile with events
   */
  static async getUserProfile(userId) {
    const user = await User.findById(userId).lean();
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    const events = await EventService.getUserEvents(userId);
    
    return { user, events };
  }

  /**
   * Update user
   */
  static async updateUser(userId, userData) {
    const { firstName, lastName, email, phoneNumber } = userData;
    
    // Check if email is being changed and if it's already taken
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      const error = new Error('Email is already taken');
      error.statusCode = 400;
      throw error;
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, phoneNumber },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    return user;
  }

  /**
   * Delete user and all their events
   */
  static async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Delete all user's events
    await Event.deleteMany({ userId });
    
    return user;
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId) {
    const user = await User.findById(userId).lean();
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    return user;
  }
}

module.exports = UserService;
