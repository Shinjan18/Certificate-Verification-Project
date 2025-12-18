import { useCallback, useEffect, useState, useRef } from 'react';
import { Loader2, Upload, RefreshCw, Search, FileText, QrCode, ExternalLink, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import type { Certificate } from '../types';
import { useAuthStore } from '../store/useAuthStore';

// ...

// ...

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  // const uploadSectionRef = useRef<HTMLDivElement>(null); // Unused
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [sortField, setSortField] = useState<SortField>('issueDate'); // Unused
  // const [sortDirection, setSortDirection] = useState<SortDirection>('desc'); // Unused
  const pageSize = 10;

  const isAdmin = user?.role === 'admin';

  // Helper to determine status
  const getStatus = (cert: Certificate) => {
    if (cert.status) return cert.status;
    return new Date(cert.endDate) < new Date() ? 'expired' : 'valid';
  };

  const fetchCertificates = useCallback(async (query = '') => {
    if (!isAdmin) return;
    setLoading(true);
    setMessage(null);
    try {
      // The response structure is {success: true, data: {certificates: [...] }, message: ... }
      // So data.data is {certificates: [...] }
      const response = await api.get('/admin/certificates', {
        params: {
          search: query,
          page,
          limit: pageSize,
          fields: 'certificateId,studentName,email,internshipDomain,issueDate,expiryDate,status,pdfUrl,qrUrl,startDate,endDate,hash,remarks'
        },
      });

      const responseData = response.data;
      const certificatesList = responseData.data?.certificates || [];
      const totalCount = responseData.data?.total || 0;
      const pages = responseData.data?.totalPages || 1;

      setCertificates(Array.isArray(certificatesList) ? certificatesList : []);
      setTotal(totalCount);
      setTotalPages(pages);
    } catch (error: any) {
      console.error('Error fetching certificates:', error);
      setMessage(error.response?.data?.message || 'Unable to fetch certificates');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, page, pageSize]);

  useEffect(() => {
    fetchCertificates(search);
  }, [fetchCertificates, search, page]);

  // handleSort function removed as it's not currently used

  const handleViewPdf = (url: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleViewQr = (url: string) => {
    if (!url) return;
    // If URL is relative (starts with /), prepend the Server URL (strip /api from VITE_API_URL)
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const serverBase = apiBase.replace(/\/api$/, '');
    const fullUrl = url.startsWith('http')
      ? url
      : `${serverBase}${url}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setMessage('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setUploading(true);
    setMessage('Uploading file...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      await api.post('/admin/certificates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('File uploaded successfully! Refreshing data...');

      // Reset to page 1 to see new data
      setPage(1);
      await fetchCertificates();

      // Optionally clear the file input
      if (uploadRef.current) {
        uploadRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      setMessage(error.response?.data?.message || error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  // const scrollToTable = () => {
  //   tableRef.current?.scrollIntoView({behavior: 'smooth' });
  // }; // Unused

  // scrollToUpload function removed as it's not currently used

  // handleViewAllClick function removed as it's not currently used

  const handleRefresh = () => {
    fetchCertificates(search);
    setMessage('Refreshing data...');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-300 mb-6">You don't have permission to view this page.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/students"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Users className="h-4 w-4" />
              View Students
            </Link>
            <button
              onClick={() => uploadRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload Excel
            </button>
            <input
              type="file"
              ref={uploadRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls"
              className="hidden"
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="rounded-lg bg-blue-500/10 p-4 text-blue-300">
            <p>{message}</p>
          </div>
        )}

        {/* Certificates Table */}
        <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-800/50 shadow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
            <h2 className="text-lg font-semibold text-white">Certificates</h2>
            <div className="flex w-full items-center space-x-3 sm:w-auto">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </button>
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  className="w-full rounded-lg border border-white/15 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none sm:w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div ref={tableRef} className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-slate-700/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300"
                  >
                    Certificate ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300"
                  >
                    Student Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300"
                  >
                    Issue Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-400">
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
                      </div>
                    </td>
                  </tr>
                ) : certificates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-400">
                      No certificates found.
                    </td>
                  </tr>
                ) : (
                  certificates.map((cert) => (
                    <tr key={cert.certificateId} className="hover:bg-slate-700/30">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                        {cert.certificateId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                        {cert.studentName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                        {cert.internshipDomain}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                        {new Date(cert.startDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatus(cert) === 'valid'
                            ? 'bg-green-100 text-green-800'
                            : getStatus(cert) === 'expired'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {getStatus(cert).charAt(0).toUpperCase() + getStatus(cert).slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {cert.pdfUrl && (
                            <button
                              onClick={() => handleViewPdf(cert.pdfUrl!)}
                              className="text-blue-400 hover:text-blue-300"
                              title="View PDF"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                          )}
                          {cert.qrUrl && (
                            <button
                              onClick={() => handleViewQr(cert.qrUrl!)}
                              className="text-green-400 hover:text-green-300"
                              title="View QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </button>
                          )}
                          <a
                            href={`/verify/${cert.certificateId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:text-teal-300"
                            title="View in new tab"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-white/10 bg-slate-800/50 px-6 py-4">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(page * pageSize, total)}
                  </span>{' '}
                  of <span className="font-medium">{total}</span> results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-white/10 bg-slate-700/50 px-3 py-1 text-sm font-medium text-white hover:bg-slate-600/50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="rounded-md border border-white/10 bg-slate-700/50 px-3 py-1 text-sm font-medium text-white hover:bg-slate-600/50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
