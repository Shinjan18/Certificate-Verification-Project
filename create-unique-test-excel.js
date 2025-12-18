const XLSX = require('xlsx');
const fs = require('fs');

// Create a simple test Excel file with unique certificate IDs
const data = [
  ['certificateId', 'studentName', 'internshipDomain', 'startDate', 'endDate', 'email'],
  ['CERT007', 'Ethan Hunt', 'Cyber Security', '2023-03-01', '2023-08-01', 'ethan@example.com'],
  ['CERT008', 'Fiona Gallagher', 'UI/UX Design', '2023-04-01', '2023-09-01', 'fiona@example.com']
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Certificates');

// Write to file
XLSX.writeFile(wb, 'unique-test-certificates.xlsx');
console.log('Unique test Excel file created: unique-test-certificates.xlsx');