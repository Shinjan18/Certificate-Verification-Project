const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create sample Excel file with 5 test certificate rows
const createSampleExcel = () => {
  try {
    // Sample data
    const data = [
      {
        certificateId: 'CERT001',
        studentName: 'Alice Johnson',
        internshipDomain: 'Web Development',
        startDate: '2025-01-15',
        endDate: '2025-04-15',
        email: 'alice.johnson@email.com'
      },
      {
        certificateId: 'CERT002',
        studentName: 'Bob Smith',
        internshipDomain: 'Data Science',
        startDate: '2025-02-01',
        endDate: '2025-05-01',
        email: 'bob.smith@email.com'
      },
      {
        certificateId: 'CERT003',
        studentName: 'Carol Davis',
        internshipDomain: 'Mobile App Development',
        startDate: '2025-03-10',
        endDate: '2025-06-10',
        email: 'carol.davis@email.com'
      },
      {
        certificateId: 'CERT004',
        studentName: 'David Wilson',
        internshipDomain: 'Cloud Computing',
        startDate: '2025-01-20',
        endDate: '2025-04-20',
        email: 'david.wilson@email.com'
      },
      {
        certificateId: 'CERT005',
        studentName: 'Eva Brown',
        internshipDomain: 'Artificial Intelligence',
        startDate: '2025-02-15',
        endDate: '2025-05-15',
        email: 'eva.brown@email.com'
      }
    ];
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Certificates');
    
    // Write to file
    const outputPath = path.join(__dirname, '..', 'temp', 'sample-certificates.xlsx');
    const outputDir = path.dirname(outputPath);
    
    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    XLSX.writeFile(workbook, outputPath);
    
    console.log(`Sample Excel file created at: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error creating sample Excel file:', error);
    throw error;
  }
};

// If running directly
if (require.main === module) {
  createSampleExcel();
}

module.exports = createSampleExcel;