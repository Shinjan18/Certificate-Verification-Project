import api from '../api/client';

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    successful: number;
    failed: number;
    errors?: Array<{ row: number; error: string }>;
  };
}

export const uploadCertificatesExcel = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  console.log('Starting file upload:', file.name);
  
  try {
    console.log('Sending request to /admin/upload with file:', file.name);
    const response = await api.post<UploadResponse>('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });
    
    console.log('Upload successful:', response.data);
    
    // Ensure the response has the expected format
    if (!response.data) {
      throw new Error('No response data received from server');
    }
    
    return {
      success: response.data.success || false,
      message: response.data.message || 'File uploaded successfully',
      data: response.data.data || { successful: 0, failed: 0 }
    };
    
  } catch (error: any) {
    console.error('Error uploading Excel file:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // Extract error message from different possible locations
    let errorMessage = 'Failed to upload Excel file. Please try again.';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
    // Handle specific error cases
    if (error.response?.status === 413) {
      errorMessage = 'File is too large. Please upload a file smaller than 5MB.';
    } else if (error.response?.status === 400) {
      errorMessage = errorMessage || 'Invalid file format. Please upload a valid Excel file.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Session expired. Please log in again.';
    }
    
    return {
      success: false,
      message: errorMessage,
      data: { successful: 0, failed: 0 }
    };
  }
};
