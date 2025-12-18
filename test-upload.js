const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
  try {
    console.log('Testing upload endpoint...');
    
    // First, login to get a valid token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@certify.com',
      password: 'Admin@123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('Login successful, token received');
    
    // Read the test Excel file
    const filePath = './fresh-test-certificates.xlsx';
    const fileBuffer = fs.readFileSync(filePath);
    
    // Create FormData
    const form = new FormData();
    form.append('file', fileBuffer, {
      filename: 'fresh-test-certificates.xlsx',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    // Send the request
    const response = await axios.post('http://localhost:5000/api/admin/upload', 
      form, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...form.getHeaders()
        }
      }
    );
    
    console.log('Upload response:', response.data);
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
  }
}

testUpload();