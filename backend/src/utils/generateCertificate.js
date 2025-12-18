const Certificate = require('../models/Certificate');
const hashUtil = require('./hash');
const qrGenerator = require('./qrGenerator');
const pdfGenerator = require('./pdfGenerator');

const generateCertificate = async (record) => {
  try {
    console.log('Generating certificate for:', record);

    // Compute hash using specified fields
    const hash = hashUtil.computeHash(record);

    // Check if certificate with this ID already exists
    const existingCertificate = await Certificate.findOne({ certificateId: record.certificateId });
    if (existingCertificate) {
      console.log(`Certificate with ID ${record.certificateId} already exists`);
      throw new Error(`Certificate with ID ${record.certificateId} already exists`);
    }

    // Create new certificate object with computed hash
    const certificate = new Certificate({
      ...record,
      hash,
      createdAt: new Date()
    });

    console.log('Saving certificate to database:', certificate);

    // Save to database first to ensure data is persisted
    await certificate.save();

    console.log('Certificate saved successfully:', certificate._id);

    // Generate QR code - now passing the hash as parameter
    const qrFilename = `${record.certificateId}.png`;
    const qrUrl = await qrGenerator.generateQR(record.certificateId, hash);

    // Update certificate with QR URL
    certificate.qrUrl = qrUrl;
    await certificate.save();

    // Generate PDF using the ABSOLUTE QR file path for Puppeteer
    const path = require('path');
    const absoluteQrPath = path.resolve(process.cwd(), 'uploads', 'qrcodes', qrFilename);
    const pdfUrl = await pdfGenerator.generatePDF(certificate.toObject(), absoluteQrPath);

    // Update certificate with PDF URL
    certificate.pdfUrl = pdfUrl;
    await certificate.save();

    console.log(`Successfully generated certificate for ${record.studentName} (${record.certificateId})`);

    return certificate;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};

module.exports = generateCertificate;