# Backend ↔ Frontend Connection API

## Implemented API Endpoints

### 1. Search Certificate
**GET** `/api/certificates/:certificateId`
- Returns certificate metadata + pdfUrl

**Example Response:**
```json
{
  "certificateId": "CERT001",
  "studentName": "John Doe",
  "internshipDomain": "Web Development",
  "startDate": "2023-01-01T00:00:00.000Z",
  "endDate": "2023-06-01T00:00:00.000Z",
  "email": "john.doe@example.com",
  "pdfUrl": "/uploads/CERT001.pdf",
  "qrUrl": "/uploads/CERT001_qr.png",
  "hash": "a1b2c3d4e5f6...",
  "createdAt": "2023-06-02T10:30:00.000Z",
  "updatedAt": "2023-06-02T10:30:00.000Z"
}
```

### 2. Verify Certificate
**GET** `/api/certificates/verify/:certificateId?h=HASH`
- Recomputes hash and compares with provided hash
- Returns `{ valid: true/false, certificate }`

**Example Response:**
```json
{
  "valid": true,
  "certificate": {
    "certificateId": "CERT001",
    "studentName": "John Doe",
    "internshipDomain": "Web Development",
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-06-01T00:00:00.000Z",
    "email": "john.doe@example.com"
  }
}
```

### 3. Admin Login
**POST** `/api/auth/login`
- Returns JWT token upon successful authentication

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 4. Excel Import
**POST** `/api/admin/upload`
- Protected route (requires authentication)
- Accepts Excel file via FormData
- Returns summary of import operation

**Form Data:**
```
file: [Excel file content]
```

**Example Response:**
```json
{
  "message": "25 certificates created successfully, 0 failed",
  "successful": 25,
  "failed": 0
}
```

### 5. Admin Certificates
**GET** `/api/admin/certificates`
- Protected route (requires authentication)
- Returns all certificates

**Example Response:**
```json
{
  "certificates": [
    {
      "certificateId": "CERT001",
      "studentName": "John Doe",
      "internshipDomain": "Web Development",
      "startDate": "2023-01-01T00:00:00.000Z",
      "endDate": "2023-06-01T00:00:00.000Z",
      "email": "john.doe@example.com",
      "pdfUrl": "/uploads/CERT001.pdf",
      "qrUrl": "/uploads/CERT001_qr.png",
      "hash": "a1b2c3d4e5f6...",
      "createdAt": "2023-06-02T10:30:00.000Z",
      "updatedAt": "2023-06-02T10:30:00.000Z"
    }
  ]
}
```