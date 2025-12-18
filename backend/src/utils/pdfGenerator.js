const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const pdfGenerator = {
  // Generate PDF by replacing placeholders in HTML template and using Puppeteer
  generatePDF: async (certificateData, qrPath) => {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Read HTML template
      const templatePath = path.join(__dirname, '..', 'templates', 'certificate.html');
      let htmlContent = fs.readFileSync(templatePath, 'utf8');
      
      // Replace placeholders with actual data
      htmlContent = htmlContent.replace(/{{studentName}}/g, certificateData.studentName || '');
      htmlContent = htmlContent.replace(/{{internshipDomain}}/g, certificateData.internshipDomain || '');
      htmlContent = htmlContent.replace(/{{startDate}}/g, new Date(certificateData.startDate).toLocaleDateString() || '');
      htmlContent = htmlContent.replace(/{{endDate}}/g, new Date(certificateData.endDate).toLocaleDateString() || '');
      htmlContent = htmlContent.replace(/{{email}}/g, certificateData.email || '');
      htmlContent = htmlContent.replace(/{{certificateId}}/g, certificateData.certificateId || '');
      
      // Replace QR code placeholder with file path
      htmlContent = htmlContent.replace(/{{qrCode}}/g, qrPath);
      
      // Write temporary HTML file
      const tempHtmlPath = path.join(__dirname, '..', 'temp', `${certificateData.certificateId}.html`);
      const tempDir = path.dirname(tempHtmlPath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      fs.writeFileSync(tempHtmlPath, htmlContent);
      
      // Convert HTML file to PDF
      await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '2cm',
          right: '2cm',
          bottom: '2cm',
          left: '2cm'
        }
      });
      
      await browser.close();
      
      // Clean up temporary HTML file
      fs.unlinkSync(tempHtmlPath);
      
      // Save PDF to uploads/pdfs directory
      const filename = `${certificateData.certificateId}.pdf`;
      const filepath = path.join('uploads', 'pdfs', filename);
      
      // Ensure directory exists
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filepath, pdfBuffer);
      
      return `/uploads/pdfs/${filename}`;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }
};

module.exports = pdfGenerator;