const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@certify.com',
      password: 'Admin@123'
    });
    console.log('Login response:', response.data);
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
  }
}

testLogin();