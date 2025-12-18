const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { dbName: 'certificate_verification' });

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

async function verifyCertificate() {
  try {
    console.log('Verifying certificate CERT007...');
    const certificate = await Certificate.findOne({ certificateId: 'CERT007' });
    if (certificate) {
      console.log('Certificate found:', certificate);
    } else {
      console.log('Certificate not found');
    }
  } catch (error) {
    console.error('Error verifying certificate:', error);
  } finally {
    mongoose.connection.close();
  }
}

verifyCertificate();