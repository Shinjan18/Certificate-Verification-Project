const XLSX = require('xlsx');
const fs = require('fs');

// Create a simple test Excel file with new certificate IDs
const data = [
  ['certificateId', 'studentName', 'internshipDomain', 'startDate', 'endDate', 'email'],
  ['CERT003', 'Alice Johnson', 'Web Development', '2023-01-01', '2023-06-01', 'alice@example.com'],
  ['CERT004', 'Bob Smith', 'Data Science', '2023-02-01', '2023-07-01', 'bob@example.com']
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Certificates');

// Write to file
XLSX.writeFile(wb, 'new-test-certificates.xlsx');
console.log('New test Excel file created: new-test-certificates.xlsx');