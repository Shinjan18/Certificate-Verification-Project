const crypto = require('crypto');

const hashUtil = {
  // Compute SHA256 hash using specified fields
  computeHash: (record) => {
    try {
      // Create canonical string from record data in specified order
      const canonicalString = [
        record.certificateId || '',
        record.studentName || '',
        record.internshipDomain || '',
        record.startDate ? new Date(record.startDate).toISOString().split('T')[0] : '',
        record.endDate ? new Date(record.endDate).toISOString().split('T')[0] : ''
      ].join('|');
      
      // Generate SHA256 hash
      const hash = crypto.createHash('sha256');
      hash.update(canonicalString);
      return hash.digest('hex');
    } catch (error) {
      console.error('Hash computation error:', error);
      throw error;
    }
  },
  
  // Verify if a hash matches the record data
  verifyHash: (record, hash) => {
    const computedHash = hashUtil.computeHash(record);
    return computedHash === hash;
  }
};

module.exports = hashUtil;