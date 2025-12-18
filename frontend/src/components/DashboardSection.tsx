import { useAuthStore } from '../store/useAuthStore';
import AdminDashboard from './AdminDashboard';

const DashboardSection = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <section
        id="dashboard"
        className="py-16"
        aria-labelledby="dashboard-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="dashboard-heading" className="text-3xl font-bold text-white mb-4">
              Dashboard
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Admin workspace — manage certificates and imports
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 text-center max-w-2xl mx-auto">
            <div className="text-yellow-400 text-5xl mb-4">⚠</div>
            <h3 className="text-2xl font-bold text-white mb-2">Restricted Access</h3>
            <p className="text-lg text-slate-300 mb-6">
              Please log in as admin to access the dashboard
            </p>
            <a
              href="/admin/login"
              className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#050a1f]"
            >
              Go to Admin Login
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="dashboard"
      className="py-16"
      aria-labelledby="dashboard-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminDashboard />
      </div>
    </section>
  );
};

export default DashboardSection;