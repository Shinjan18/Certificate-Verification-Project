import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, BadgeCheck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-[34px] bg-gradient-soft p-10 md:p-14">
      <div className="absolute inset-0 opacity-60 blur-3xl">
        <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-teal-500/60 pulse" />
        <div className="absolute -bottom-12 -right-4 h-64 w-64 rounded-full bg-purple-600/60 pulse" />
      </div>
      <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white"
          >
            <Sparkles className="h-4 w-4 text-teal-300" />
            Instant digital trust for academic credentials
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Verify, manage, and deliver certificates with{' '}
            <span className="bg-gradient-brand bg-clip-text text-transparent">absolute confidence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl text-lg text-slate-200"
          >
            A modern SaaS platform for academic teams to issue, track, and validate certificates. Built with
            enterprise-grade security, delightful UX, and analytics that help you scale verification with ease.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-4"
          >
            <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 font-medium text-white shadow-glow transition hover:shadow-glow-purple">
              <ShieldCheck className="h-4 w-4" />
              Start verification
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-medium text-white hover:border-white/40">
              <BadgeCheck className="h-4 w-4 text-teal-300" />
              Admin workspace
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid gap-4 text-sm text-slate-200 sm:grid-cols-3"
          >
            {[
              { value: '3K+', label: 'Certificates issued in 2025' },
              { value: '12min', label: 'Average support response' },
              { value: '99.98%', label: 'Uptime across regions' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 px-4 py-3 backdrop-blur">
                <div className="text-2xl font-semibold text-white">{stat.value}</div>
                <div className="text-xs text-slate-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="gradient-border"
        >
          <div className="inner relative h-full rounded-[26px] p-6">
            <div className="absolute inset-x-10 top-10 h-52 rounded-full bg-gradient-brand blur-3xl opacity-30" />
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                <span>Live Trust Graph</span>
                <span>Last synced - 2 mins ago</span>
              </div>
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                {[60, 75, 90, 45].map((confidence, idx) => (
                  <div key={confidence} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>Certificate #{idx + 1}</span>
                      <span>{confidence}% confidence</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-brand transition-all"
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Automations', value: '22 active' },
                  { label: 'Integrations', value: 'Slack, Teams, Zapier' },
                  { label: 'Bulk imports', value: 'Excel & API' },
                  { label: 'Security scans', value: 'Passed 7 checks' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300">
                    <div className="text-xs uppercase tracking-wide">{item.label}</div>
                    <div className="text-base font-semibold text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;


