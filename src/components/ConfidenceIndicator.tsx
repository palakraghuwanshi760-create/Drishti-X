import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { Gauge, Info } from 'lucide-react';

interface ConfidenceIndicatorProps {
  confidenceScore: number; // e.g. 0.87
  classProbabilities?: {
    noDR: number;
    mild: number;
    moderate: number;
    severe: number;
  };
  lang: Language;
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidenceScore,
  classProbabilities,
  lang,
  className = '',
}) => {
  const t = translations[lang];
  const percent = Math.round(confidenceScore * 100);

  const defaultProbabilities = classProbabilities || {
    noDR: 0.04,
    mild: 0.09,
    moderate: 0.87,
    severe: 0.00,
  };

  return (
    <div id="confidence-indicator-card" className={`bg-white rounded-2xl border border-slate-200 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-teal-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {t.aiConfidence}
          </span>
        </div>
        <span className="text-2xl font-black text-slate-900 font-mono">
          {percent}%
        </span>
      </div>

      {/* Main Confidence Bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200">
        <div 
          className="h-full bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Class Probabilities Distribution */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Model Classification Probabilities
        </p>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>No DR</span>
            <span className="font-mono text-slate-900 font-medium">
              {(defaultProbabilities.noDR * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-400" style={{ width: `${defaultProbabilities.noDR * 100}%` }} />
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Mild DR</span>
            <span className="font-mono text-slate-900 font-medium">
              {(defaultProbabilities.mild * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: `${defaultProbabilities.mild * 100}%` }} />
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold text-teal-900">Moderate DR</span>
            <span className="font-mono text-teal-900 font-bold">
              {(defaultProbabilities.moderate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600" style={{ width: `${defaultProbabilities.moderate * 100}%` }} />
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Severe DR</span>
            <span className="font-mono text-slate-900 font-medium">
              {(defaultProbabilities.severe * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500" style={{ width: `${defaultProbabilities.severe * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-400 leading-snug">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>Softmax probability output over the International Clinical Diabetic Retinopathy (ICDR) scale.</span>
      </div>
    </div>
  );
};
