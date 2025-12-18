import { FileSpreadsheet, Database, FileCheck, Download, Search, Shield } from 'lucide-react';

const features = [
  {
    id: 1,
    title: 'User Roles and Authentication',
    description: ['Create & manage Admin accounts', 'Secure JWT-based sessions', 'Granular role policies'],
    icon: Shield,
    accent: 'from-teal-400/30 to-cyan-400/10',
  },
  {
    id: 2,
    title: 'Data Management',
    description: ['Bulk Excel uploads', 'MongoDB cloud backups', 'Audit-ready logs'],
    icon: Database,
    accent: 'from-sky-400/30 to-blue-500/10',
  },
  {
    id: 3,
    title: 'Certificate Generation',
    description: ['Auto-populate templates', 'Smart validation rules', 'Digital signatures'],
    icon: FileSpreadsheet,
    accent: 'from-purple-400/30 to-fuchsia-400/10',
  },
  {
    id: 4,
    title: 'Certificate Search & Retrieval',
    description: ['Global search & filters', 'Real-time status updates', 'Shareable verification links'],
    icon: Search,
    accent: 'from-indigo-400/30 to-blue-400/10',
  },
  {
    id: 5,
    title: 'Certificate Download',
    description: ['Secure PDF downloads', 'Watermarked exports', 'One-click share'],
    icon: Download,
    accent: 'from-cyan-400/30 to-teal-400/10',
  },
  {
    id: 6,
    title: 'Security & Data Integrity',
    description: ['Encrypted login sessions', 'Automated data validation', 'Tamper-proof logs'],
    icon: FileCheck,
    accent: 'from-rose-400/30 to-amber-400/10',
  },
];

const FeatureGrid = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Platform capabilities</p>
          <h2 className="font-display text-3xl text-white sm:text-4xl">What's included out of the box</h2>
        </div>
        <p className="max-w-xl text-sm text-slate-300">
          Every workflow you need to verify certificates at scale: secure onboarding, data import, automated generation,
          and delightful retrieval experiences for students and partners.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ id, title, description, icon: Icon, accent }) => (
          <div
            key={id}
            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition group-hover:opacity-100`} />
            <div className="relative z-10 flex flex-col gap-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-200">
                {description.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;


