require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Certificate = require('../models/Certificate');

const seed = async () => {
  try {
    await connectDB();
    await Promise.all([User.deleteMany(), Certificate.deleteMany()]);

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@certify.com',
      password: 'Admin@123',
      role: 'admin',
    });

    const users = await User.insertMany([
      { name: 'Emily Carter', email: 'emily@example.com', password: 'Password1!' },
      { name: 'Noah Patel', email: 'noah@example.com', password: 'Password1!' },
    ]);

    const certificates = [
      {
        certificateId: 'CERT-2025-001',
        studentName: 'Emily Carter',
        email: 'emily@example.com',
        courseName: 'Cloud Fundamentals',
        issueDate: new Date('2025-01-10'),
        expiryDate: new Date('2027-01-10'),
        status: 'valid',
        score: 92,
        remarks: 'Excellent performance',
      },
      {
        certificateId: 'CERT-2025-002',
        studentName: 'Noah Patel',
        email: 'noah@example.com',
        courseName: 'Fullstack Development',
        issueDate: new Date('2025-02-15'),
        expiryDate: new Date('2027-02-15'),
        status: 'valid',
        score: 88,
        remarks: 'Great job',
      },
      {
        certificateId: 'CERT-2024-045',
        studentName: 'Lena Hoffmann',
        email: 'lena@example.com',
        courseName: 'Data Engineering',
        issueDate: new Date('2024-05-20'),
        expiryDate: new Date('2026-05-20'),
        status: 'valid',
        score: 95,
        remarks: 'Top performer',
      },
    ];

    await Certificate.insertMany(certificates);

    console.log('Database seeded successfully');
    console.table({
      Admin: admin.email,
      Users: users.length,
      Certificates: certificates.length,
    });
    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();

