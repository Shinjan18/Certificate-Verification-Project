require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

const { MONGODB_URI } = process.env;   // yeh line ADD karo

const ADMIN_EMAIL = 'admin@certify.com';
const ADMIN_PASSWORD = 'Admin@123';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      email: ADMIN_EMAIL,
      passwordHash: ADMIN_PASSWORD, // pre-save hook hash karega
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();