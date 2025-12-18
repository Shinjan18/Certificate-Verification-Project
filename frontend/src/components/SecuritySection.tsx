// React import not needed for this component

const SecuritySection = () => {
  return (
    <section 
      id="security" 
      className="py-16"
      aria-labelledby="security-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="security-heading" className="text-3xl font-bold text-white mb-4">
            Security
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Built with integrity and compliance in mind
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
          <p className="text-lg text-slate-200 mb-6 max-w-4xl mx-auto">
            Security is core to trust. The system uses modern encryption, tamper-evident hashes, 
            and auditable logs to make sure that every certificate can be verified and every action can be traced back.
          </p>
          
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Encrypted sessions and JWT-based auth for admin operations.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Tamper-evident SHA256 hashing + QR verification links.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Role-based access control and activity logging.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Data-at-rest encryption-ready and privacy-first logging policies.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Optional S3-backed file storage and signed URLs for PDFs.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;