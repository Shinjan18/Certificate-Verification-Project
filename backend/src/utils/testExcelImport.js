require('dotenv').config();
const connectDB = require('../config/db');
const fs = require('fs');
const path = require('path');
const excelParser = require('./excelParser');

const testExcelImport = async () => {
  try {
    await connectDB();
    
    // Path to sample Excel file
    const excelPath = path.join(__dirname, '..', 'temp', 'sample-certificates.xlsx');
    
    // Check if file exists
    if (!fs.existsSync(excelPath)) {
      console.error(`Sample Excel file not found at: ${excelPath}`);
      process.exit(1);
    }
    
    // Read file buffer
    const fileBuffer = fs.readFileSync(excelPath);
    
    // Parse and import certificates
    console.log('Starting Excel import test...');
    const result = await excelParser.parseAndCreateCertificates(fileBuffer);
    
    // Log results
    console.log('\n--- IMPORT SUMMARY ---');
    console.log(`Total rows processed: ${result.total}`);
    console.log(`Successfully created: ${result.successful}`);
    console.log(`Failed to process: ${result.failed}`);
    
    if (result.skippedRows && result.skippedRows.length > 0) {
      console.log('\n--- SKIPPED ROWS ---');
      result.skippedRows.forEach(row => {
        console.log(`Row ${row.row}: ${row.reason}`);
      });
    }
    
    console.log('\nExcel import test completed!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  testExcelImport();
}

module.exports = testExcelImport;