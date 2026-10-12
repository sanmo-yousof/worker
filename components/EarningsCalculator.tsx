'use client';

import React, { useState } from 'react';
import { SparklesIcon, ArrowRightIcon } from './Icons';

interface EarningsCalculatorProps {
  onOpenApply: () => void;
}

export default function EarningsCalculator({ onOpenApply }: EarningsCalculatorProps) {
  const [hours, setHours] = useState(15);
  const [domainKey, setDomainKey] = useState<'coding' | 'math' | 'writing' | 'lifeSciences'>('coding');

  const domainData = {
    coding: {
      name: 'Software & Code',
      rate: 50,
      description: 'Reviewing Python, TypeScript, algorithms, and system designs.',
    },
    math: {
      name: 'Mathematics & STEM',
      rate: 55,
      description: 'Evaluating calculus, linear algebra, logic puzzles, and physical theorems.',
    },
    writing: {
      name: 'Writing & Humanities',
      rate: 35,
      description: 'Critiquing prose, verifying facts, analyzing tone, and red-teaming safety.',
    },
    lifeSciences: {
      name: 'Medicine & Life Sciences',
      rate: 65,
      description: 'Clinical reasoning, biomedical literature analysis, and chemistry equations.',
    },
  };

  const currentDomain = domainData[domainKey];
  const weeklyEarnings = hours * currentDomain.rate;
  const monthlyEarnings = weeklyEarnings * 4.33;
  const annualEarnings = weeklyEarnings * 52;

  return (
    <section id="earnings" className="py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 mb-4 font-medium">
            <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>TRANSPARENT EARNINGS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Calculate Your Earning Potential
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            See how much you can earn as a freelance contributor on Outlier based on your field of expertise and weekly availability.
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="max-w-4xl mx-auto rounded-2xl md:rounded-3xl border border-slate-200 p-6 md:p-10 shadow-xl shadow-slate-200/50 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Domain Switcher */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 font-semibold">
                  1. Select Your Primary Discipline
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(domainData) as (keyof typeof domainData)[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setDomainKey(key)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        domainKey === key
                          ? 'bg-indigo-50/80 border-indigo-400 text-slate-900 shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-bold">{domainData[key].name}</div>
                      <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                        ${domainData[key].rate}/hr
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for Hours */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    2. Desired Hours Per Week
                  </label>
                  <span className="text-sm font-bold font-mono text-slate-900 px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {hours} hours / week
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1 font-medium">
                  <span>5 hrs (Side Hustle)</span>
                  <span>20 hrs (Part-Time)</span>
                  <span>40 hrs (Full-Time Capacity)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="text-indigo-700 font-semibold">{currentDomain.name}:</span>{' '}
                {currentDomain.description} All payments are processed automatically every Tuesday.
              </div>
            </div>

            {/* Results Display Box */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between h-full shadow-lg">
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                  Estimated Payouts
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-1">Weekly Payout (Every Tuesday)</div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                    ${weeklyEarnings.toLocaleString()}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Estimated Monthly:</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    ~${Math.round(monthlyEarnings).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-xs text-slate-400">
                  <span>Annualized Potential:</span>
                  <span className="font-mono text-slate-300">
                    ${annualEarnings.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenApply}
                className="mt-6 w-full py-3 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Start Earning at This Rate</span>
                <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
