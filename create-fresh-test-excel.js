const XLSX = require('xlsx');
const fs = require('fs');

// Create a simple test Excel file with fresh certificate IDs
const data = [
  ['certificateId', 'studentName', 'internshipDomain', 'startDate', 'endDate', 'email'],
  ['CERT005', 'Charlie Brown', 'Web Development', '2023-01-01', '2023-06-01', 'charlie@example.com'],
  ['CERT006', 'Diana Prince', 'Data Science', '2023-02-01', '2023-07-01', 'diana@example.com']
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Certificates');

// Write to file
XLSX.writeFile(wb, 'fresh-test-certificates.xlsx');
console.log('Fresh test Excel file created: fresh-test-certificates.xlsx');