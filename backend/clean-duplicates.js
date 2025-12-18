const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const Certificate = require('./src/models/Certificate.js');

async function cleanDuplicates() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/certificate_verification');
        console.log('Connected to MongoDB');

        const certificates = await Certificate.find({});
        console.log(`Found ${certificates.length} total certificates`);

        const ids = {};
        let duplicates = 0;
        let deleted = 0;

        for (const cert of certificates) {
            if (ids[cert.certificateId]) {
                console.log(`Duplicate found: ${cert.certificateId} (ID: ${cert._id})`);
                duplicates++;
                // Keep the one created later, or just remove the current one
                await Certificate.findByIdAndDelete(cert._id);
                deleted++;
            } else {
                ids[cert.certificateId] = true;
            }
        }

        console.log(`Summary: Found ${duplicates} duplicates. Deleted ${deleted} entries.`);

        // Explicitly sync indexes to ensure unique constraint
        await Certificate.syncIndexes();
        console.log('Indexes synced.');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanDuplicates();
