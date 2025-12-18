const XLSX = require('xlsx');
const fs = require('fs');

// Create a simple test Excel file
const data = [
  ['certificateId', 'studentName', 'internshipDomain', 'startDate', 'endDate', 'email'],
  ['CERT001', 'John Doe', 'Web Development', '2023-01-01', '2023-06-01', 'john@example.com'],
  ['CERT002', 'Jane Smith', 'Data Science', '2023-02-01', '2023-07-01', 'jane@example.com']
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Certificates');

// Write to file
XLSX.writeFile(wb, 'test-certificates.xlsx');
console.log('Test Excel file created: test-certificates.xlsx');