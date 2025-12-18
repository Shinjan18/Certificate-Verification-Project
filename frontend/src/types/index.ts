export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Certificate {
  _id: string;
  certificateId: string;
  studentName: string;
  email: string;
  internshipDomain: string;
  startDate: string;
  endDate: string;
  issueDate?: string; // Optional, can be derived from startDate
  expiryDate?: string; // Optional, can be derived from endDate
  status?: 'valid' | 'expired' | 'revoked'; // Optional, derived on frontend
  score?: number;
  remarks?: string;
  pdfUrl?: string;
  qrUrl?: string;
  hash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  studentName: string;
  email: string;
  certificateIds: string[];
  count: number;
  latestDomain: string;
  latestStartDate: string;
  latestEndDate: string;
}

export interface PaginatedCertificates {
  data: Certificate[];
  total: number;
}
