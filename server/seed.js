require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');

async function seedDatabase() {
  try {
    // Підключення до MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Очищення існуючих даних
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Створення тестових користувачів
    const users = await User.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith', 
        email: 'jane.smith@example.com',
        phoneNumber: '+1234567891'
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        phoneNumber: '+1234567892'
      },
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@example.com',
        phoneNumber: '+1234567893'
      },
      {
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@example.com',
        phoneNumber: '+1234567894'
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@example.com',
        phoneNumber: '+1234567895'
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Створення тестових подій
    const now = new Date();
    const events = await Event.create([
      {
        userId: users[0]._id,
        title: 'Team Meeting',
        description: 'Weekly team synchronization meeting',
        startDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        endDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) // Tomorrow + 2 hours
      },
      {
        userId: users[1]._id,
        title: 'Project Presentation',
        description: 'Quarterly project review presentation',
        startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // In 3 days
        endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000) // In 3 days + 3 hours
      },
      {
        userId: users[0]._id,
        title: 'Client Call',
        description: 'Important client discussion',
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000) // Next week + 1 hour
      },
      {
        userId: users[2]._id,
        title: 'Training Session',
        description: 'Technical skills development training',
        startDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // In 10 days
        endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000) // In 10 days + 4 hours
      },
      {
        userId: users[1]._id,
        title: 'Conference Call',
        description: 'Monthly department conference',
        startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // In 2 weeks
        endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) // In 2 weeks + 2 hours
      },
      {
        userId: users[3]._id,
        title: 'Workshop',
        description: 'Hands-on coding workshop',
        startDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // In 3 weeks
        endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000) // In 3 weeks + 6 hours
      },
      {
        userId: users[4]._id,
        title: 'Code Review',
        description: 'Weekly code review session',
        startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (past event)
        endDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000) // 2 days ago + 1 hour
      },
      {
        userId: users[4]._id,
        title: 'Product Demo',
        description: 'Demonstration of new features',
        startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // In 5 days (future event)
        endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) // In 5 days + 2 hours
      },
      {
        userId: users[5]._id,
        title: 'Planning Session',
        description: 'Sprint planning for next iteration',
        startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (past event)
        endDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000) // 5 days ago + 3 hours
      }
    ]);

    console.log(`✅ Created ${events.length} events`);
    console.log('🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Запуск seed функції
seedDatabase();
