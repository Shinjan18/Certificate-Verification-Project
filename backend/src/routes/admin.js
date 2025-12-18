const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const excelParser = require('../utils/excelParser');
const apiResponse = require('../config/apiResponse');
const { catchAsync, logMessage } = require('../middleware/errorHandler');

const router = express.Router();

router.get('/ping', (req, res) => res.json({ message: 'pong' }));

// Configure multer for Excel file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Allow Excel files based on extension
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    console.log('File info:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      extname: fileExtension
    });

    if (allowedExtensions.includes(fileExtension)) {
      return cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  }
});

// POST /api/admin/certificates/upload - Upload Excel file with certificate data
// Protected route  
// Accept Excel via FormData  
// Return summary
router.post('/certificates/upload', authenticateToken, upload.single('file'), catchAsync(async (req, res) => {
  console.log('Upload endpoint hit');
  console.log('Request file:', req.file);

  if (!req.file) {
    logMessage('upload', 'Upload failed - No file provided');
    return res.status(400).json(apiResponse.validationError('No file uploaded'));
  }

  logMessage('upload', 'Excel file upload started', {
    fileName: req.file.originalname,
    fileSize: req.file.size
  });

  // Parse Excel file and create certificates
  const result = await excelParser.parseAndCreateCertificates(req.file.buffer);

  logMessage('upload', 'Excel file processing completed', {
    successful: result.successful,
    failed: result.failed
  });

  res.json(apiResponse.success({
    successful: result.successful,
    failed: result.failed
  }, `${result.successful} certificates created successfully, ${result.failed} failed`));
}));

// GET /api/admin/certificates - List all certificates (protected route)
// Protected
// GET /api/admin/certificates - List paginated certificates (protected route)
// Protected
router.get('/certificates', authenticateToken, catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  logMessage('admin', 'Fetching certificates', { page, limit, search });

  const Certificate = require('../models/Certificate');

  // Build query
  const query = {};
  if (search) {
    query.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { certificateId: { $regex: search, $options: 'i' } },
      { internshipDomain: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const [certificates, total] = await Promise.all([
    Certificate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Certificate.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / limit);

  logMessage('admin', 'Certificates fetched successfully', { count: certificates.length, total });

  res.json(apiResponse.success({
    certificates,
    page,
    limit,
    total,
    totalPages
  }, 'Certificates retrieved successfully'));
}));

// GET /api/admin/students - List unique students aggregated from certificates
router.get('/students', authenticateToken, catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  console.log('Fetching students with params:', { page, limit, search });

  const pipeline = [];

  // 1. Match stage for search
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { studentName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
    });
  }

  // 2. Group by email
  pipeline.push({
    $group: {
      _id: "$email", // Group by email
      studentName: { $first: "$studentName" }, // Take the first name encountered (should be consistent)
      email: { $first: "$email" },
      certificateIds: { $push: "$certificateId" },
      totalCertificates: { $sum: 1 },
      // Get the latest certificate details
      latestCertificate: { $last: "$$ROOT" } // Assuming sorted input or we sort before group
    }
  });

  // Optional: Sort documents before grouping to ensure "latest" is actually latest?
  // Or sort the groups. Let's sort the groups by studentName for display.
  pipeline.push({
    $sort: { studentName: 1 }
  });

  // 3. Facet for pagination and counting
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: skip }, { $limit: limit }]
    }
  });

  const Certificate = require('../models/Certificate');
  const result = await Certificate.aggregate(pipeline);

  const data = result[0].data;
  const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
  const totalPages = Math.ceil(total / limit);

  // Format the response
  const students = data.map(group => ({
    studentName: group.studentName,
    email: group.email,
    certificateIds: group.certificateIds,
    count: group.totalCertificates,
    latestDomain: group.latestCertificate.internshipDomain,
    latestStartDate: group.latestCertificate.startDate,
    latestEndDate: group.latestCertificate.endDate
  }));

  logMessage('admin', 'Students fetched successfully', { count: students.length, total });

  res.json(apiResponse.success({
    students,
    page,
    totalPages,
    totalStudents: total
  }, 'Students retrieved successfully'));
}));

module.exports = router;