require('dotenv').config();
const connectDB = require('../config/db');
const Certificate = require('../models/Certificate');
const pdfGenerator = require('./pdfGenerator');
const qrGenerator = require('./qrGenerator');

const generateMissingPdfs = async () => {
  try {
    await connectDB();

    // Find ALL certificates to regenerate them with the fixed QR code
    // You can revert this query later if you only want missing ones
    const certificates = await Certificate.find({});

    if (certificates.length === 0) {
      console.log('No certificates found');
      process.exit(0);
    }

    console.log(`Found ${certificates.length} certificates to process`);

    let successCount = 0;
    let errorCount = 0;

    const path = require('path');

    for (const cert of certificates) {
      try {
        // Generate QR code if missing OR just to be safe
        const hash = require('./hash').computeHash(cert);
        const qrUrl = await qrGenerator.generateQR(cert.certificateId, hash);

        // Save the QR URL references
        cert.qrUrl = qrUrl;

        // Construct ABSOLUTE path for Puppeteer
        const qrFilename = `${cert.certificateId}.png`;
        const absoluteQrPath = path.resolve(process.cwd(), 'uploads', 'qrcodes', qrFilename);

        // Generate PDF
        const pdfUrl = await pdfGenerator.generatePDF(cert.toObject(), absoluteQrPath);

        // Update certificate with PDF URL
        cert.pdfUrl = pdfUrl;
        await cert.save();

        successCount++;
        console.log(`Regenerated PDF for: ${cert.certificateId}`);
      } catch (error) {
        console.error(`Error generating PDF for ${cert.certificateId}:`, error);
        errorCount++;
      }
    }

    console.log(`\nPDF generation completed: ${successCount} successful, ${errorCount} failed`);
    process.exit(0);
  } catch (error) {
    console.error('Error generating missing PDFs:', error);
    process.exit(1);
  }
};

generateMissingPdfs();