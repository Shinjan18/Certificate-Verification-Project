const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUniqueUpload() {
  try {
    console.log('Testing unique upload endpoint...');
    
    // First, login to get a valid token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@certify.com',
      password: 'Admin@123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('Login successful, token received');
    
    // Read the test Excel file with unique certificate IDs
    const filePath = './unique-test-certificates.xlsx';
    const fileBuffer = fs.readFileSync(filePath);
    
    // Create FormData
    const form = new FormData();
    form.append('file', fileBuffer, {
      filename: 'unique-test-certificates.xlsx',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    console.log('Sending request with form data...');
    
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
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

testUniqueUpload();