import React from 'react';

export default function TrustedBy() {
  const stats = [
    { label: 'Paid Out to Contributors', value: '$150M+' },
    { label: 'Verified Global Experts', value: '250,000+' },
    { label: 'Countries Supported', value: '100+' },
    { label: 'Subject Matter Domains', value: '50+' },
  ];

  const partners = [
    { name: 'Scale AI', note: 'Parent Platform' },
    { name: 'OpenAI', note: 'LLM Research' },
    { name: 'Anthropic', note: 'Alignment & Safety' },
    { name: 'Google DeepMind', note: 'Frontier Intelligence' },
    { name: 'Meta AI', note: 'Open Source Models' },
    { name: 'Cohere', note: 'Enterprise NLP' },
    { name: 'Mistral AI', note: 'Reasoning Engines' },
  ];

  return (
    <section className="py-16 border-y border-slate-200 bg-slate-50/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metric Counters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-slate-200 text-center shadow-sm hover:shadow-md transition-all group"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-2 font-mono">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium">
                {stat.label}
              </div>
              <div className="w-12 h-1 mx-auto mt-4 bg-indigo-500/20 group-hover:bg-indigo-600 rounded-full transition-colors" />
            </div>
          ))}
        </div>

        {/* Frontier AI Lab Partners Strip */}
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-8">
            Empowering Human Feedback for Frontier AI Research
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
            {partners.map((partner, index) => (
              <div key={index} className="flex flex-col items-center group cursor-default">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-700 group-hover:text-slate-950 transition-colors">
                  {partner.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-600 transition-colors font-medium">
                  {partner.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
