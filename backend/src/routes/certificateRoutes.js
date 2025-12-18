const express = require('express');
const multer = require('multer');
const {
  createCertificate,
  getCertificates,
  lookupCertificate,
  updateCertificate,
  deleteCertificate,
  bulkUpload,
} = require('../controllers/certificateController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/lookup/:certificateId', lookupCertificate);
router.get('/', protect, adminOnly, getCertificates);
router.post('/', protect, adminOnly, createCertificate);
router.put('/:id', protect, adminOnly, updateCertificate);
router.delete('/:id', protect, adminOnly, deleteCertificate);
router.post('/bulk-upload', protect, adminOnly, upload.single('file'), bulkUpload);

module.exports = router;

