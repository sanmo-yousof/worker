'use client';

import React, { useState } from 'react';
import { SparklesIcon, CheckIcon } from './Icons';

export default function Simulator() {
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [selectedPreference, setSelectedPreference] = useState<'A' | 'B' | null>(null);
  const [ratings, setRatings] = useState({
    accuracy: true,
    instruction: true,
    safety: true,
    conciseness: false,
  });
  const [feedbackNote, setFeedbackNote] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const sampleTasks = [
    {
      category: 'Coding & Algorithms',
      rate: '$45.00/hr',
      prompt: 'Write a TypeScript function to deeply debounce an asynchronous function with cancellation support and proper generic typing.',
      modelA: {
        title: 'Model A (Production Quality)',
        code: `export function deepDebounce<T extends (...args: any[]) => Promise<any>>(\n  fn: T,\n  waitMs: number\n): [(...args: Parameters<T>) => Promise<ReturnType<T>>, () => void] {\n  let timer: NodeJS.Timeout | null = null;\n  let cancelReject: ((reason?: any) => void) | null = null;\n  \n  const cancel = () => {\n    if (timer) clearTimeout(timer);\n    if (cancelReject) cancelReject(new Error('Debounce cancelled'));\n  };\n  \n  const debounced = (...args: Parameters<T>) => {\n    cancel();\n    return new Promise<ReturnType<T>>((resolve, reject) => {\n      cancelReject = reject;\n      timer = setTimeout(async () => {\n        try { resolve(await fn(...args)); } catch (e) { reject(e); }\n      }, waitMs);\n    });\n  };\n  return [debounced, cancel];\n}`,
        verdict: 'Accurate, memory-safe, returns cleanup cancellation method.',
        isBetter: true,
      },
      modelB: {
        title: 'Model B (Basic Implementation)',
        code: `export function deepDebounce(fn: any, waitMs: number) {\n  let timer: any;\n  return function (...args: any[]) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), waitMs);\n  };\n}`,
        verdict: 'Lacks TypeScript generic safety, no async cancellation support.',
        isBetter: false,
      },
    },
    {
      category: 'Mathematics & Proofs',
      rate: '$50.00/hr',
      prompt: 'Prove whether the infinite sum sum_{n=1}^\\infty ((-1)^n * n) / (n^2 + 1) converges conditionally or absolutely.',
      modelA: {
        title: 'Model A (Rigorous Derivation)',
        code: `1. Absolute Convergence Test:\nLet a_n = n / (n^2 + 1). Compare with 1/n using Limit Comparison Test:\nlim (n / (n^2 + 1)) / (1/n) = lim n^2 / (n^2 + 1) = 1 > 0.\nSince sum(1/n) diverges (harmonic series), sum|a_n| diverges.\n\n2. Alternating Series Test (Leibniz):\n- a_n > 0 for all n >= 1.\n- f(x) = x/(x^2+1) => f'(x) = (1 - x^2)/(x^2+1)^2 <= 0 for x >= 1 (monotonic decreasing).\n- lim_{n->inf} a_n = 0.\n\nConclusion: The series converges conditionally.`,
        verdict: 'Strict mathematical rigor, verified Leibniz monotonicity with first derivative.',
        isBetter: true,
      },
      modelB: {
        title: 'Model B (Incomplete Argument)',
        code: `The series is alternating because of (-1)^n.\nAs n gets very large, n/(n^2+1) looks like 1/n.\nSince terms go to 0, it converges.\nBecause it looks like 1/n it is conditional.`,
        verdict: 'Skipped formal derivative test for monotonicity, heuristic reasoning.',
        isBetter: false,
      },
    },
    {
      category: 'Writing & Fact Checking',
      rate: '$35.00/hr',
      prompt: 'Summarize the primary discoveries of the James Webb Space Telescope regarding high-redshift galaxies in under 120 words.',
      modelA: {
        title: 'Model A (Precise & Factual)',
        code: `The James Webb Space Telescope (JWST) revolutionized observational cosmology by identifying massive, luminous galaxies existing within 300–400 million years of the Big Bang (such as JADES-GS-z14-0 at redshift z ≈ 14.3). These observations challenge early universe galaxy formation models, revealing that early stellar populations evolved more rapidly, contained unexpected metallicity, and possessed higher stellar masses than previously predicted by standard cosmological simulations.`,
        verdict: '100% scientifically accurate, includes recent benchmark discovery (JADES-GS-z14-0).',
        isBetter: true,
      },
      modelB: {
        title: 'Model B (Vague / Outdated)',
        code: `JWST looked very far back in time and saw some galaxies that were brighter than astronomers thought was possible. It showed that galaxies formed quickly and have black holes. More studies are still being done to know why they are so bright.`,
        verdict: 'Lacks specific cosmological terminology, redshift citations, and depth.',
        isBetter: false,
      },
    },
  ];

  const currentTask = sampleTasks[activeTaskIndex];

  const handleSelectTask = (index: number) => {
    setActiveTaskIndex(index);
    setSelectedPreference(null);
    setHasEvaluated(false);
    setFeedbackNote('');
  };

  const handleCompleteEvaluation = () => {
    if (!selectedPreference) {
      alert('Please select either Model A or Model B as your preferred response.');
      return;
    }
    setHasEvaluated(true);
  };

  return (
    <section id="simulator" className="py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 mb-4 font-medium">
            <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>INTERACTIVE SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Experience What an Evaluation Task Feels Like
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Test your eye for precision. Compare model outputs side-by-side, verify reasoning steps, and see how human feedback shapes foundational model intelligence.
          </p>
        </div>

        {/* Task Category Selector Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {sampleTasks.map((task, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectTask(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTaskIndex === idx
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Task #{idx + 1}: {task.category} ({task.rate})
            </button>
          ))}
        </div>

        {/* The Sandbox Card */}
        <div className="rounded-2xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 bg-white">
          {/* Prompt Bar */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2 font-semibold">
              <span className="text-indigo-700">DOMAIN: {currentTask.category}</span>
              <span className="text-emerald-700">STATUS: READY FOR REVIEW</span>
            </div>
            <p className="text-base sm:text-lg text-slate-900 font-medium">
              "{currentTask.prompt}"
            </p>
          </div>

          {/* Model Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
            {/* Model A */}
            <div className={`p-6 flex flex-col justify-between transition-colors ${
              selectedPreference === 'A' ? 'bg-indigo-50/30' : ''
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 font-mono">{currentTask.modelA.title}</h4>
                  <span className="text-[11px] font-mono text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-semibold">
                    High Quality
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap overflow-x-auto leading-relaxed mb-4 shadow-inner">
                  {currentTask.modelA.code}
                </div>
                <p className="text-xs text-slate-600 italic">
                  Analysis: {currentTask.modelA.verdict}
                </p>
              </div>

              <button
                onClick={() => setSelectedPreference('A')}
                className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  selectedPreference === 'A'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                <span>{selectedPreference === 'A' ? '✓ Selected as Superior Model' : 'Select Model A as Better'}</span>
              </button>
            </div>

            {/* Model B */}
            <div className={`p-6 flex flex-col justify-between transition-colors ${
              selectedPreference === 'B' ? 'bg-indigo-50/30' : ''
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 font-mono">{currentTask.modelB.title}</h4>
                  <span className="text-[11px] font-mono text-amber-700 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 font-semibold">
                    Low Quality
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap overflow-x-auto leading-relaxed mb-4 shadow-inner">
                  {currentTask.modelB.code}
                </div>
                <p className="text-xs text-slate-600 italic">
                  Analysis: {currentTask.modelB.verdict}
                </p>
              </div>

              <button
                onClick={() => setSelectedPreference('B')}
                className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  selectedPreference === 'B'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                <span>{selectedPreference === 'B' ? '✓ Selected as Superior Model' : 'Select Model B as Better'}</span>
              </button>
            </div>
          </div>

          {/* Rubric Evaluation Strip */}
          <div className="p-6 border-t border-slate-200 bg-slate-50/60">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="text-xs font-mono text-slate-500 uppercase font-semibold">
                Scoring Rubric Dimensions:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'accuracy', label: 'Factual Accuracy' },
                  { key: 'instruction', label: 'Followed All Constraints' },
                  { key: 'safety', label: 'Zero Hallucinations' },
                  { key: 'conciseness', label: 'Optimal Formatting' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setRatings({
                        ...ratings,
                        [item.key]: !ratings[item.key as keyof typeof ratings],
                      })
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      ratings[item.key as keyof typeof ratings]
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span>{ratings[item.key as keyof typeof ratings] ? '✓' : '+'}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Optional contributor critique note (e.g. 'Model A followed memory constraints perfectly')..."
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
              <button
                onClick={handleCompleteEvaluation}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shrink-0 shadow-sm"
              >
                Submit Simulation
              </button>
            </div>

            {hasEvaluated && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-emerald-600" />
                  <span>
                    <strong>Spot-on assessment!</strong> You selected Model {selectedPreference}, which correctly matched our gold-standard calibration. You have the analytical eye to succeed on Outlier.
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 hidden md:inline">Calibration: 100%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
