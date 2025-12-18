const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const qrGenerator = {
  // Generate QR code pointing to frontend verification URL with hash parameter
  generateQR: async (certificateId, hash, options = {}) => {
    try {
      const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const verificationUrl = `${baseUrl}/verify/${certificateId}?h=${hash}`;
      
      const defaultOptions = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 200,
        height: 200,
        margin: 1,
        color: {
          dark: '#005555',
          light: '#ffffff'
        }
      };
      
      const qrOptions = { ...defaultOptions, ...options };
      
      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, qrOptions);
      
      // Extract base64 data
      const base64Data = qrDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Save to uploads/qrcodes directory
      const filename = `${certificateId}.png`;
      const filepath = path.join('uploads', 'qrcodes', filename);
      
      // Ensure directory exists
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filepath, buffer);
      
      return `/uploads/qrcodes/${filename}`;
    } catch (error) {
      console.error('QR generation error:', error);
      throw error;
    }
  }
};

module.exports = qrGenerator;