const axios = require('axios');

async function debugAdminAccess() {
    try {
        console.log('1. Logging in...');
        // Login to get a fresh token
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@certify.com',
            password: 'Admin@123'
        });

        const token = loginRes.data.data.token;
        console.log('Login successful. Token:', token.substring(0, 20) + '...');

        console.log('2. Accessing Protected Admin Route...');
        // Try to access the protected route
        await axios.get('http://localhost:5000/api/admin/certificates', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Success! Admin route accessed.');
    } catch (error) {
        console.error('Request Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

debugAdminAccess();
