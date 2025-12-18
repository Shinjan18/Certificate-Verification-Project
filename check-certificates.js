const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  internshipDomain: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  email: { type: String, required: true },
  pdfUrl: { type: String },
  qrUrl: { type: String },
  hash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

async function checkCertificates() {
  try {
    console.log('Checking certificates in database...');
    const certificates = await Certificate.find({});
    console.log(`Found ${certificates.length} certificates:`);
    certificates.forEach(cert => {
      console.log(`- ${cert.certificateId}: ${cert.studentName}`);
    });
  } catch (error) {
    console.error('Error checking certificates:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkCertificates();