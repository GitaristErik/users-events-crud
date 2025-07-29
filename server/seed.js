
require('dotenv').config();
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const User = require('./models/User');
const SimpleUser = require('./models/SimpleUser');
const Event = require('./models/Event');


const DEMO_SIMPLE_USER_COUNT = 15;
const DEMO_EVENT_COUNT = 35;

const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Alex', 'Olga', 'Ivan', 'Maria', 'Oleh', 'Anna', 'Max', 'Sofia', 'Dmytro'];
const lastNames = ['Doe', 'Smith', 'Johnson', 'Wilson', 'Brown', 'Davis', 'Petrov', 'Kovalenko', 'Shevchenko', 'Bondarenko', 'Tkachenko', 'Melnyk', 'Kravchenko', 'Boyko', 'Moroz'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate() {
  const now = Date.now();
  // Від -10 до +20 днів від сьогодні
  const offset = (Math.floor(Math.random() * 31) - 10) * 24 * 60 * 60 * 1000;
  const start = new Date(now + offset);
  const duration = (1 + Math.floor(Math.random() * 6)) * 60 * 60 * 1000; // 1-6 годин
  return { start, end: new Date(start.getTime() + duration) };
}


async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await SimpleUser.deleteMany({});
    await Event.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Створюємо admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phoneNumber: '+10000000000',
      password: "admin",
      role: 'admin'
    });

    // Створюємо 10 simple users, owner: admin
    const simpleUsersData = [];
    for (let i = 1; i <= DEMO_SIMPLE_USER_COUNT; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      simpleUsersData.push({
        firstName,
        lastName,
        email: `simpleuser${i}@example.com`,
        phoneNumber: `+1000000000${i}`,
        owner: admin._id
      });
    }
    const simpleUsers = await SimpleUser.insertMany(simpleUsersData);
    console.log(`✅ Created 1 admin user and ${simpleUsers.length} simple users`);

    // Створюємо 30 івентів для випадкових simple users
    const eventsData = [];
    for (let i = 0; i < DEMO_EVENT_COUNT; i++) {
      const simpleUser = getRandomItem(simpleUsers);
      const { start, end } = getRandomDate();
      eventsData.push({
        userId: simpleUser._id,
        title: `Demo Event #${i + 1}`,
        description: `This is a demo event #${i + 1}`,
        startDate: start,
        endDate: end
      });
    }
    const events = await Event.insertMany(eventsData);
    console.log(`✅ Created ${events.length} events`);
    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedDatabase();
