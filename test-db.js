require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    const uri = process.env.MONGO_URI;
    console.log('Testing connection to:', uri.replace(/:([^@]+)@/, ':****@')); // Hide password

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connection successful!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed:');
        console.error(err);
        process.exit(1);
    }
}

testConnection();
