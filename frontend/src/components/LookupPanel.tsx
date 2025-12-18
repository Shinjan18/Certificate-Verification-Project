import { useState } from 'react';
import { BadgeCheck, Search, AlertCircle, ExternalLink, Loader2, Download } from 'lucide-react';
import api from '../api/client';
import type { Certificate } from '../types';
import { AxiosError } from 'axios';

const statusColors = {
  valid: 'bg-green-500/10 text-green-400',
  expired: 'bg-yellow-500/10 text-yellow-400',
  revoked: 'bg-red-500/10 text-red-400',
};

const LookupPanel = () => {
  const [certificateId, setCertificateId] = useState('');
  const [result, setResult] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isNotFound?: boolean } | null>(null);

  const getStatus = (cert: Certificate) => {
    if (cert.status) return cert.status;
    return new Date(cert.endDate) < new Date() ? 'expired' : 'valid';
  };

  const handleLookup = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = certificateId.trim().toUpperCase();

    if (!normalized) {
      setError({ message: 'Please enter a certificate ID to search.' });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.get<{ success: boolean; data: Certificate; message: string }>(`/certificates/${normalized}`);
      setResult(response.data.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 404) {
        setError({
          message: 'Certificate not found',
          isNotFound: true
        });
      } else if (axiosError.response?.status === 400) {
        setError({ message: 'Invalid certificate ID format' });
      } else if (axiosError.message === 'Network Error') {
        setError({ message: 'Unable to connect to the server. Please check your connection.' });
      } else {
        setError({ message: 'An error occurred while verifying the certificate. Please try again.' });
        console.error('Certificate lookup error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel h-full p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Instant Verification</p>
          <h3 className="text-2xl font-semibold text-white">Search certificate registry</h3>
        </div>
        <BadgeCheck className="h-10 w-10 text-teal-300" />
      </div>

      <form onSubmit={handleLookup} className="space-y-4">
        <label className="text-sm font-medium text-slate-300" htmlFor="certificateId">
          Certificate ID
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <div className="flex items-center rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white focus-within:border-teal-300/70">
              <Search className="mr-2 h-5 w-5 shrink-0 text-teal-200" />
              <input
                id="certificateId"
                className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-slate-400"
                placeholder="e.g. CERT-2025-001"
                value={certificateId}
                onChange={(e) => {
                  setCertificateId(e.target.value);
                  // Clear error when user starts typing again
                  if (error) setError(null);
                }}
                disabled={loading}
                aria-label="Certificate ID"
                aria-invalid={!!error}
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 animate-spin text-teal-300" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !certificateId.trim()}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-6 py-3 font-semibold text-white shadow-glow transition disabled:opacity-50"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify now'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div
          className={`mt-4 flex items-start gap-3 rounded-xl p-4 ${error.isNotFound
            ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-200'
            : 'border-red-500/20 bg-red-500/10 text-red-200'
            }`}
          role="alert"
          id="error-message"
        >
          {error.isNotFound ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          )}
          <p>{error.message}</p>
        </div>
      )}

      {!loading && result && (
        <div
          className="mt-6 space-y-4 rounded-2xl border border-teal-500/30 bg-teal-500/10 p-5"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div>
              <h4 className="text-lg font-semibold text-white">{result.studentName}</h4>
              <p className="text-sm text-teal-200">{result.internshipDomain}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-teal-100/80">
                <span>Issued: {result.startDate ? new Date(result.startDate).toLocaleDateString() : 'N/A'}</span>
                {result.endDate && (
                  <span>• Completed: {new Date(result.endDate).toLocaleDateString()}</span>
                )}
                {result.expiryDate && (
                  <span>• Expires: {new Date(result.expiryDate).toLocaleDateString()}</span>
                )}
              </div>
              {result.email && (
                <p className="mt-1 text-xs text-teal-100/70">{result.email}</p>
              )}
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusColors[getStatus(result) as keyof typeof statusColors] || statusColors.valid
                  }`}
                aria-label={`Status: ${getStatus(result)}`}
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                {getStatus(result).charAt(0).toUpperCase() + getStatus(result).slice(1)}
              </div>
              {result.score !== undefined && result.score !== null && (
                <div className="text-right">
                  <p className="text-xs text-slate-400">Score</p>
                  <p className="text-sm font-medium">{result.score}%</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 pt-3">
            {/* Download/Generate Certificate Button */}
            <button
              onClick={async () => {
                if (!result?.certificateId) return;
                const btn = document.activeElement as HTMLButtonElement;
                const originalText = btn?.innerText || 'Download Certificate';

                if (btn) {
                  btn.innerText = 'Downloading...';
                  btn.disabled = true;
                }

                try {
                  const response = await api.post<{ success: boolean; data: { pdfUrl: string }; message: string }>(`/certificates/generate-pdf/${result.certificateId}`);
                  const pdfUrl = response.data.data?.pdfUrl;

                  if (pdfUrl) {
                    const url = pdfUrl.startsWith('http') ? pdfUrl : `http://localhost:5000${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  } else {
                    throw new Error('No PDF URL returned');
                  }
                } catch (err) {
                  console.error('Download failed', err);
                  alert('Unable to download certificate. Please try again.');
                } finally {
                  if (btn) {
                    btn.innerText = originalText;
                    btn.disabled = false;
                  }
                }
              }}
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
              aria-label="Download Certificate"
            >
              <Download className="h-4 w-4" />
              Download Certificate
            </button>

            {result.qrUrl && (
              <a
                href={result.qrUrl.startsWith('http')
                  ? result.qrUrl
                  : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '')}${result.qrUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="View QR Code"
              >
                <ExternalLink className="h-4 w-4" />
                View QR Code
              </a>
            )}
          </div>
          {result.remarks && (
            <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-xs font-medium text-slate-400">Remarks</p>
              <p className="text-sm text-slate-200">{result.remarks}</p>
            </div>
          )}
          <div className="pt-2 text-right">
            <p className="text-xs text-slate-500">
              Verified on {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LookupPanel;


