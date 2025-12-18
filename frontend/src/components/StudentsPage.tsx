import { useCallback, useEffect, useState } from 'react';
import { Loader2, Search, ArrowLeft, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import type { Student } from '../types';
import { useAuthStore } from '../store/useAuthStore';

const StudentsPage = () => {
    const { user } = useAuthStore();
    const [students, setStudents] = useState<Student[]>([]);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const isAdmin = user?.role === 'admin';

    const fetchStudents = useCallback(async (query = '') => {
        if (!isAdmin) return;
        setLoading(true);
        setMessage(null);
        try {
            const response = await api.get('/admin/students', {
                params: {
                    search: query,
                    page,
                    limit: pageSize,
                },
            });

            const responseData = response.data;
            const studentsList = responseData.data?.students || [];
            const totalCount = responseData.data?.totalStudents || 0;
            const pages = responseData.data?.totalPages || 1;

            setStudents(Array.isArray(studentsList) ? studentsList : []);
            setTotal(totalCount);
            setTotalPages(pages);
        } catch (error: any) {
            console.error('Error fetching students:', error);
            setMessage(error.response?.data?.message || 'Unable to fetch students');
        } finally {
            setLoading(false);
        }
    }, [isAdmin, page, pageSize]);

    useEffect(() => {
        fetchStudents(search);
    }, [fetchStudents, search, page]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== '') {
                setPage(1); // Reset to page 1 on new search
                fetchStudents(search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search, fetchStudents]);

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
                <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
                    <p className="text-slate-300 mb-6">You don't have permission to view this page.</p>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">All Students</h1>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className="rounded-lg bg-blue-500/10 p-4 text-blue-300">
                        <p>{message}</p>
                    </div>
                )}

                {/* Students Table */}
                <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-800/50 shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-teal-400" />
                            Student Registry
                        </h2>
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full rounded-lg border border-white/15 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none sm:w-64"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
                                        Latest Domain
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
                                        Certificates
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-slate-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-400">
                                            <div className="flex justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : students.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-400">
                                            No students found.
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student) => (
                                        <tr key={student.email} className="hover:bg-slate-700/30">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                                {student.studentName}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                                                {student.email}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                                                {student.latestDomain || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-300">
                                                <div className="flex flex-wrap gap-1">
                                                    {student.certificateIds.slice(0, 3).map(id => (
                                                        <span key={id} className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/10">
                                                            {id}
                                                        </span>
                                                    ))}
                                                    {student.certificateIds.length > 3 && (
                                                        <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/10">
                                                            +{student.certificateIds.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                <button className="text-teal-400 hover:text-teal-300 transition-colors">
                                                    View Details
                                                </button>
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

export default StudentsPage;
