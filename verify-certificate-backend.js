const mongoose = require('mongoose');
const Certificate = require('./backend/src/models/Certificate');
require('dotenv').config({ path: './backend/.env' });

async function verifyCertificate() {
  try {
    // Connect to MongoDB using the same connection string and options as the backend
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/certificate_verification';
    
    const options = {
      dbName: 'certificate_verification',
      serverSelectionTimeoutMS: 5000,
      // New MongoDB driver options
      maxPoolSize: 10,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    };
    
    await mongoose.connect(uri, options);
    console.log('Connected to MongoDB');
    
    console.log('Verifying certificate CERT005...');
    const certificate = await Certificate.findOne({ certificateId: 'CERT005' });
    if (certificate) {
      console.log('Certificate found:', certificate);
    } else {
      console.log('Certificate not found');
      
      // Let's check all certificates
      const allCertificates = await Certificate.find({});
      console.log(`Total certificates in database: ${allCertificates.length}`);
      allCertificates.forEach(cert => {
        console.log(`- ${cert.certificateId}: ${cert.studentName}`);
      });
    }
  } catch (error) {
    console.error('Error verifying certificate:', error);
  } finally {
    mongoose.connection.close();
  }
}

verifyCertificate();