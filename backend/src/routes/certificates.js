const express = require('express');
const Certificate = require('../models/Certificate');
const { computeHash, verifyHash } = require('../utils/hash');
const apiResponse = require('../config/apiResponse');
const { catchAsync, logMessage } = require('../middleware/errorHandler');

const router = express.Router();

// GET /api/certificates/:certificateId - Get certificate by ID
// Return metadata + pdfUrl
router.get('/:certificateId', catchAsync(async (req, res) => {
  const { certificateId } = req.params;

  logMessage('certificates', 'Certificate lookup', { certificateId });

  const certificate = await Certificate.findOne({ certificateId });

  if (!certificate) {
    logMessage('certificates', 'Certificate not found', { certificateId });
    return res.status(404).json(apiResponse.notFound('Certificate not found'));
  }

  // Return metadata + pdfUrl as specified
  const { _id, __v, ...certificateData } = certificate.toObject();
  logMessage('certificates', 'Certificate found', { certificateId });
  res.json(apiResponse.success({
    ...certificateData,
    pdfUrl: certificate.pdfUrl || `/uploads/pdfs/${certificate.certificateId}.pdf`,
    qrUrl: certificate.qrUrl || `/uploads/qrcodes/${certificate.certificateId}.png`
  }, 'Certificate retrieved successfully'));
}));

// GET /api/certificates/verify/:certificateId?h=HASH - Verify certificate authenticity
// Recompute hash and return { valid: true/false, certificate }
router.get('/verify/:certificateId', catchAsync(async (req, res) => {
  const { certificateId } = req.params;
  const { h: providedHash } = req.query;

  logMessage('verification', 'Certificate verification request', { certificateId, hasHash: !!providedHash });

  const certificate = await Certificate.findOne({ certificateId });

  if (!certificate) {
    logMessage('verification', 'Certificate not found for verification', { certificateId });
    return res.status(404).json(apiResponse.notFound('Certificate not found'));
  }

  // Recompute hash
  const computedHash = computeHash({
    certificateId: certificate.certificateId,
    studentName: certificate.studentName,
    internshipDomain: certificate.internshipDomain,
    startDate: certificate.startDate,
    endDate: certificate.endDate
  });

  // Compare with provided hash if given, otherwise just return valid
  const isValid = providedHash ? verifyHash(certificate, providedHash) : true;

  logMessage('verification', 'Certificate verification completed', {
    certificateId,
    valid: isValid,
    hasProvidedHash: !!providedHash
  });

  res.json(apiResponse.success({
    valid: isValid,
    certificate: {
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      internshipDomain: certificate.internshipDomain,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
      email: certificate.email
    }
  }, 'Certificate verification completed'));
}));

// POST /api/certificates/generate-pdf/:certificateId - Generate and return PDF URL
router.post('/generate-pdf/:certificateId', catchAsync(async (req, res) => {
  const { certificateId } = req.params;
  const fs = require('fs');
  const path = require('path');
  const qrGenerator = require('../utils/qrGenerator');
  const pdfGenerator = require('../utils/pdfGenerator');
  const hashUtil = require('../utils/hash');

  logMessage('certificates', 'Certificate PDF generation request', { certificateId });

  const certificate = await Certificate.findOne({ certificateId });

  if (!certificate) {
    return res.status(404).json(apiResponse.notFound('Certificate not found'));
  }

  // 1. Check if PDF already exists and file is on disk
  if (certificate.pdfUrl) {
    const relativePath = certificate.pdfUrl.startsWith('/') ? certificate.pdfUrl.slice(1) : certificate.pdfUrl;
    const absolutePath = path.resolve(process.cwd(), relativePath); // Use process.cwd() as root

    if (fs.existsSync(absolutePath)) {
      logMessage('certificates', 'Existing PDF found', { certificateId, path: certificate.pdfUrl });
      return res.json(apiResponse.success({ pdfUrl: certificate.pdfUrl }, 'Certificate PDF available'));
    } else {
      logMessage('certificates', 'PDF record exists but file missing, regenerating...', { certificateId });
    }
  }

  // 2. Ensure QR exists
  let qrPath = `uploads/qrcodes/${certificate.certificateId}.png`;
  const qrAbsolutePath = path.resolve(process.cwd(), qrPath);

  if (!certificate.qrUrl || !fs.existsSync(qrAbsolutePath)) {
    logMessage('certificates', 'Generating missing QR code', { certificateId });
    const qrUrl = await qrGenerator.generateQR(
      certificate.certificateId,
      certificate.hash || hashUtil.computeHash(certificate) // Use existing hash or recompute
    );
    certificate.qrUrl = qrUrl;
    await certificate.save();
    qrPath = qrUrl.startsWith('/') ? qrUrl.slice(1) : qrUrl; // Adjust path if needed, generator returns relative usually
  }

  // 3. Generate PDF
  logMessage('certificates', 'Generating new PDF', { certificateId });
  const pdfUrl = await pdfGenerator.generatePDF(certificate.toObject(), qrPath);

  // 4. Update DB
  certificate.pdfUrl = pdfUrl;
  await certificate.save();

  logMessage('certificates', 'PDF generated successfully', { certificateId, pdfUrl });
  res.json(apiResponse.success({ pdfUrl }, 'Certificate PDF generated successfully'));
}));

module.exports = router;