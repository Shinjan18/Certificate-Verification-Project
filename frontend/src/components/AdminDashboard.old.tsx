import { useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Search, Upload as UploadIcon, RefreshCw, FileText, Shield, Loader2, ExternalLink, QrCode, X, CheckCircle } from 'lucide-react';
import { uploadCertificatesExcel } from '../services/certificateService';
// Toast notifications temporarily disabled - will be reimplemented later
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  status: 'pending' | 'verified' | 'rejected';
  email?: string;
  internshipDomain?: string;
  pdfUrl?: string;
  qrUrl?: string;
  hash?: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  // Store certificates in state (unused for now, will be used when we implement the table)
  const [certificates] = useState<Certificate[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = user?.role === 'admin';

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    console.log(`${type.toUpperCase()}:`, text);
    setMessage({ 
      type: type as 'success' | 'error', 
      text: typeof text === 'string' ? text : 'An unknown error occurred' 
    });
    
    // Auto-hide message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  // Message display component
  const MessageBanner = ({ message }: { message: { type: 'success' | 'error'; text: string } }) => {
    const Icon = message.type === 'success' ? CheckCircle : X;
    
    return (
      <div 
        className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-2 z-50 ${
          message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}
      >
        <Icon className="w-5 h-5 text-white" />
        <span className="text-white">{message.text}</span>
      </div>
    );
  };

  // Admin check at the start of the component
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
  {/* Toast container temporarily removed */}
      {message && <MessageBanner message={message} />}
        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-300 mb-6">You don't have permission to view this page.</p>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Selected file:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'application/vnd.ms-excel',
      'application/octet-stream',
      'application/vnd.ms-office'
    ];
    const validExtensions = /\.(xlsx|xls|csv)$/i;
    
    if (!validTypes.includes(file.type) && !file.name.match(validExtensions)) {
      const errorMsg = `Invalid file type. Please upload an Excel file (.xlsx, .xls, or .csv)`;
      console.error(errorMsg, { type: file.type, name: file.name });
      showMessage('error', errorMsg);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const errorMsg = 'File is too large. Maximum size is 5MB.';
      console.error(errorMsg, { size: file.size });
      showMessage('error', errorMsg);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      console.log('Starting file upload...');
      const result = await uploadCertificatesExcel(file);
      
      if (result.success) {
        const successMsg = `Successfully imported ${result.data?.successful || 0} certificates`;
        console.log(successMsg, result.data);
        showMessage('success', successMsg);
        
        // Refresh certificates list
        // fetchCertificates();
      } else {
        const errorMsg = result.message || 'Failed to import certificates';
        console.error('Upload failed:', errorMsg, result);
        showMessage('error', errorMsg);
      }
    } catch (error) {
      console.error('Error in handleFileChange:', error);
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      showMessage('error', `Upload failed: ${errorMsg}`);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    showMessage('info', `Searching for: ${search}`);
  };

  const handleViewPdf = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      showMessage('error', 'PDF URL not available');
    }
  };

  const handleViewQr = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      showMessage('error', 'QR code URL not available');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">Admin workspace</p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Certificate Management</h2>
          </div>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search certificates..."
                className="w-full rounded-lg border border-white/15 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Search
            </button>
          </form>
        </div>

        {/* Message Alert - Using the MessageBanner component instead */}
        {message && <MessageBanner message={message} />}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Stats Panel */}
          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-400">Certificate count</p>
                <p className="mt-1 text-3xl font-semibold text-white">{certificates.length}</p>
              </div>
              <div className="rounded-full bg-purple-500/10 p-3">
                <FileText className="h-6 w-6 text-purple-300" />
              </div>
            </div>
            <button className="mt-4 text-sm font-medium text-purple-300 hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
              View all
            </button>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-400">Recent verifications</p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  {certificates.filter(c => c.status === 'verified').length}
                </p>
              </div>
              <div className="rounded-full bg-teal-500/10 p-3">
                <Shield className="h-6 w-6 text-teal-300" />
              </div>
            </div>
            <button className="mt-4 text-sm font-medium text-teal-300 hover:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">
              View details
            </button>
          </div>

          {/* Upload Form */}
          <div className="bg-slate-800/50 rounded-xl space-y-4 p-5">
            <div className="flex items-center gap-3 text-white">
              <div className="rounded-lg bg-teal-500/20 p-2">
                <UploadIcon className="h-5 w-5 text-teal-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Bulk operations</p>
                <p className="text-lg font-semibold">Bulk Import</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Upload Excel File
                </label>
                <div className="relative">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadIcon className="w-4 h-4" />
                        <span>Upload Excel</span>
                      </>
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx,.xls"
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-teal-600 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Supports .xlsx or .xls files
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Issued</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isUploading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading certificates...
                    </div>
                  </td>
                </tr>
              ) : certificates.length > 0 ? (
                certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-white/5">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                      {cert.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{cert.studentName}</div>
                      {cert.email && (
                        <div className="text-xs text-slate-400">{cert.email}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{cert.courseName}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {cert.internshipDomain || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          cert.status === 'verified'
                            ? 'bg-green-900/20 text-green-400'
                            : cert.status === 'pending'
                            ? 'bg-amber-900/20 text-amber-400'
                            : 'bg-red-900/20 text-red-400'
                        }`}
                      >
                        {cert.status || 'unknown'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-400">
                      {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {cert.pdfUrl && (
                          <button
                            onClick={() => handleViewPdf(cert.pdfUrl)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                            title="View PDF"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        )}
                        {cert.qrUrl && (
                          <button
                            onClick={() => handleViewQr(cert.qrUrl)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                            title="View QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                          </button>
                        )}
                        {cert.hash && (
                          <a
                            href={`/verify/${cert.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                            title="View Public Verification Page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                    {search ? (
                      <div className="space-y-2">
                        <p>No certificates found matching "{search}"</p>
                        <button
                          onClick={() => setSearch('')}
                          className="text-sm text-teal-400 hover:underline"
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      <p>No certificates found</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
