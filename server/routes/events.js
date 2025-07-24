const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Створити подію для користувача
router.post('/:userId', async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const userId = req.params.userId;

    const overlapping = await Event.findOne({
      userId,
      $or: [
        {
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) }
        }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ error: "You can’t create event for this time" });
    }

    const event = await Event.create({
      userId,
      title,
      description,
      startDate,
      endDate
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
