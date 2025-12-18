const XLSX = require('xlsx');
const Certificate = require('../models/Certificate');

const normalizeId = (id) => (id || '').toString().trim().toUpperCase();

const createCertificate = async (req, res) => {
  try {
    const payload = { ...req.body, certificateId: normalizeId(req.body.certificateId) };
    const cert = await Certificate.create(payload);
    res.status(201).json(cert);
  } catch (error) {
    console.error('Create certificate error:', error.message);
    res.status(500).json({ message: 'Unable to create certificate' });
  }
};

const getCertificates = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = search
      ? {
          $or: [
            { certificateId: { $regex: search, $options: 'i' } },
            { studentName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      Certificate.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit, 10)),
      Certificate.countDocuments(query),
    ]);

    res.json({ data, total });
  } catch (error) {
    console.error('List certificates error:', error.message);
    res.status(500).json({ message: 'Unable to fetch certificates' });
  }
};

const lookupCertificate = async (req, res) => {
  try {
    const certificateId = normalizeId(req.params.certificateId);
    const cert = await Certificate.findOne({ certificateId });
    if (!cert) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(cert);
  } catch (error) {
    console.error('Lookup certificate error:', error.message);
    res.status(500).json({ message: 'Unable to fetch certificate' });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Update certificate error:', error.message);
    res.status(500).json({ message: 'Unable to update certificate' });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const deleted = await Certificate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json({ message: 'Certificate removed' });
  } catch (error) {
    console.error('Delete certificate error:', error.message);
    res.status(500).json({ message: 'Unable to delete certificate' });
  }
};

const bulkUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet);
    const formatted = rows.map((row) => ({
      certificateId: normalizeId(row.certificateId || row.CertificateID || row.ID),
      studentName: row.studentName || row.StudentName || row.Name,
      email: (row.email || row.Email || '').toLowerCase(),
      courseName: row.courseName || row.CourseName || row.Course,
      issueDate: row.issueDate || row.IssueDate || new Date(),
      expiryDate: row.expiryDate || row.ExpiryDate || null,
      status: (row.status || row.Status || 'valid').toLowerCase(),
      score: row.score || row.Score || null,
      remarks: row.remarks || row.Remarks || '',
    }));

    const filtered = formatted.filter((item) => item.certificateId && item.studentName && item.email);
    if (!filtered.length) {
      return res.status(400).json({ message: 'No valid rows found in file' });
    }

    const results = await Certificate.insertMany(filtered, { ordered: false });
    res.status(201).json({ inserted: results.length });
  } catch (error) {
    console.error('Bulk upload error:', error.message);
    res.status(500).json({ message: 'Unable to process file' });
  }
};

module.exports = {
  createCertificate,
  getCertificates,
  lookupCertificate,
  updateCertificate,
  deleteCertificate,
  bulkUpload,
};

