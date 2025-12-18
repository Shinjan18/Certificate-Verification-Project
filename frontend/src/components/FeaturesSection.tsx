// React import not needed for this component

const FeaturesSection = () => {
  return (
    <section 
      id="features" 
      className="py-16"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="features-heading" className="text-3xl font-bold text-white mb-4">
            Features
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to issue, verify, and manage certificates
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
          <p className="text-lg text-slate-200 mb-6 max-w-4xl mx-auto">
            We focused on the features that actually matter: accurate issuance, tamper-evident verification, 
            and a delightful experience for both admins and recipients. Each feature is designed to save time and reduce risk.
          </p>
          
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Admin roles & secure authentication — granular permissions for teams.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Bulk Excel upload — validated, fast imports with clear error reporting.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Automated PDF generation — branded certificates with QR verification.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Fast certificate search & retrieval — instant lookups by certificate ID.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Downloadable and shareable PDFs — watermarking and printing-ready output.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-slate-300">Audit-ready logging — every action is recorded for compliance.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;