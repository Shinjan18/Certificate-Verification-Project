const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const generateCertificate = require('./generateCertificate');

const excelParser = {
  // Parse Excel file and create certificates
  parseAndCreateCertificates: async (fileBuffer) => {
    try {
      // Read the Excel file
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('Excel data:', jsonData);
      
      if (!jsonData || jsonData.length === 0) {
        throw new Error('No data found in Excel file');
      }
      
      console.log(`Processing ${jsonData.length} rows from Excel file`);
      
      let successful = 0;
      let failed = 0;
      const skippedRows = [];
      
      // Process each row
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const rowIndex = i + 1; // 1-based indexing for user-friendly messages
        
        console.log(`Processing row ${rowIndex}:`, row);
                  
        try {
          // Validate required fields
          const missingFields = [];
          if (!row.certificateId) missingFields.push('certificateId');
          if (!row.studentName) missingFields.push('studentName');
          if (!row.internshipDomain) missingFields.push('internshipDomain');
          if (!row.startDate) missingFields.push('startDate');
          if (!row.endDate) missingFields.push('endDate');
          if (!row.email) missingFields.push('email');
                    
          console.log(`Row ${rowIndex} missing fields:`, missingFields);
                    
          if (missingFields.length > 0) {
            skippedRows.push({
              row: rowIndex,
              reason: `Missing required fields: ${missingFields.join(', ')}`
            });
            failed++;
            continue;
          }
                    
          console.log(`Row ${rowIndex} passed required fields validation`);
          
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          console.log(`Row ${rowIndex} email:`, row.email, 'Valid:', emailRegex.test(row.email));
          if (!emailRegex.test(row.email)) {
            skippedRows.push({
              row: rowIndex,
              reason: `Invalid email format: ${row.email}`
            });
            failed++;
            continue;
          }
          
          console.log(`Row ${rowIndex} passed email validation`);
          
          // Validate date formats
          const startDate = new Date(row.startDate);
          const endDate = new Date(row.endDate);
          
          console.log(`Row ${rowIndex} dates:`, row.startDate, row.endDate, 'Start valid:', !isNaN(startDate.getTime()), 'End valid:', !isNaN(endDate.getTime()));
          
          if (isNaN(startDate.getTime())) {
            skippedRows.push({
              row: rowIndex,
              reason: `Invalid start date format: ${row.startDate}`
            });
            failed++;
            continue;
          }
          
          if (isNaN(endDate.getTime())) {
            skippedRows.push({
              row: rowIndex,
              reason: `Invalid end date format: ${row.endDate}`
            });
            failed++;
            continue;
          }
          
          if (endDate < startDate) {
            skippedRows.push({
              row: rowIndex,
              reason: `End date (${row.endDate}) is before start date (${row.startDate})`
            });
            failed++;
            continue;
          }
          
          console.log(`Row ${rowIndex} passed date validation`);
          
          // Create certificate
          console.log(`Creating certificate for row ${rowIndex}`);
          await generateCertificate({
            certificateId: row.certificateId.toString().trim(),
            studentName: row.studentName.toString().trim(),
            internshipDomain: row.internshipDomain.toString().trim(),
            startDate: startDate,
            endDate: endDate,
            email: row.email.toString().toLowerCase().trim(),
          });
          
          console.log(`Certificate created successfully for row ${rowIndex}`);
          successful++;
        } catch (error) {
          console.error(`Error processing row ${rowIndex}:`, error);
          skippedRows.push({
            row: rowIndex,
            reason: error.message
          });
          failed++;
        }
      }
      
      return { 
        successful, 
        failed, 
        total: jsonData.length,
        skippedRows 
      };
    } catch (error) {
      console.error('Excel parsing error:', error);
      throw error;
    }
  }
};

module.exports = excelParser;