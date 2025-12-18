// React import not needed for this component

const PlatformSection = () => {
  return (
    <section 
      id="platform" 
      className="py-16"
      aria-labelledby="platform-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="platform-heading" className="text-3xl font-bold text-white mb-4">
            Platform
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A unified platform built for secure, scalable certificate operations
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
          <p className="text-lg text-slate-200 mb-6 max-w-4xl mx-auto">
            Our Certificate Verification System is built to scale from university departments to enterprise training programs. 
            It centralizes certificate issuance, verification, analytics, and governance into a single dashboard so teams can 
            issue credentials confidently and manage verification at scale.
          </p>
          
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Centralized registry with searchable certificate IDs and audit logs.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Bulk imports (Excel & API) and role-based admin controls.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Real-time status updates and exportable audit trails.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Designed for high availability and straightforward integration.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;