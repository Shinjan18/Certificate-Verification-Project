import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Mail, Shield, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const AuthPanel = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const hydrate = useAuthStore((state) => state.hydrate);
  const [email, setEmail] = useState('admin@certify.com');
  const [password, setPassword] = useState('Admin@123');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  if (user) {
    return (
      <div className="glass-panel flex h-full flex-col justify-between p-6">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Authenticated</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">Welcome back, {user.name}</h3>
          <div className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-purple-300" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Role</p>
                <p className="font-semibold text-white">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-teal-200" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
                <p className="font-semibold text-white">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white hover:border-white/40 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <Shield className="h-5 w-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white hover:border-white/40 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Admin access</p>
          <h3 className="text-2xl font-semibold text-white">Secure login</h3>
        </div>
        <Lock className="h-10 w-10 text-purple-300" />
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="text-sm font-medium text-slate-300" htmlFor="email">
          Email
        </label>
        <div className="flex items-center rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white">
          <Mail className="mr-2 h-5 w-5 text-purple-200" />
          <input
            id="email"
            type="email"
            className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
            placeholder="you@academy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <label className="text-sm font-medium text-slate-300" htmlFor="password">
          Password
        </label>
        <div className="flex items-center rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white">
          <User className="mr-2 h-5 w-5 text-teal-200" />
          <input
            id="password"
            type="password"
            className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-6 py-3 font-semibold text-white shadow-glow transition disabled:opacity-50"
        >
          <Shield className="h-5 w-5" />
          {loading ? 'Authenticating...' : 'Login as Admin'}
        </button>
      </form>
      <p className="mt-4 text-xs text-slate-400">
        Demo credentials are pre-filled. Passwords are encrypted with bcrypt and JWT tokens keep your session secure.
      </p>
    </div>
  );
};

export default AuthPanel;


