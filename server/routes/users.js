var express = require('express');
var router = express.Router();

const User = require('../models/User');
const Event = require('../models/Event');

// Створити користувача
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;
    const user = await User.create({ firstName, lastName, email, phoneNumber });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Отримати список користувачів з Events Count та Next Event Date
router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    const result = await Promise.all(users.map(async (user) => {
      const events = await Event.find({ userId: user._id }).sort({ startDate: 1 });
      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        eventsCount: events.length,
        nextEventDate: events.length > 0 ? events[0].startDate : null
      };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Отримати профіль користувача з подіями
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const events = await Event.find({ userId: user._id }).sort({ startDate: 1 });
    res.json({ user, events });
  } catch (err) {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;
