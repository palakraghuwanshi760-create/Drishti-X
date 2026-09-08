import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language } from '../types';

interface DisclaimerProps {
  lang: Language;
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  lang,
  variant = 'banner',
  className = '',
}) => {
  const t = translations[lang];

  if (variant === 'inline') {
    return (
      <p id="medical-disclaimer-inline" className={`text-xs text-slate-500 italic flex items-center gap-1.5 ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>{t.medicalDisclaimerText}</span>
      </p>
    );
  }

  if (variant === 'card') {
    return (
      <div
        id="medical-disclaimer-card"
        className={`p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-amber-100 rounded-lg shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              {t.medicalDisclaimerTitle}
            </h4>
            <p className="text-xs mt-1 text-amber-800/90 leading-relaxed">
              {t.medicalDisclaimerText}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="medical-disclaimer-banner"
      className={`w-full bg-slate-900 text-slate-300 px-4 py-2.5 text-xs border-b border-slate-800 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-400 shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
            Medical Disclaimer:
          </span>
          <span className="text-slate-300">
            {t.medicalDisclaimerText}
          </span>
        </div>
        <span className="shrink-0 text-[11px] text-teal-400 bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Clinical Decision Support Prototype
        </span>
      </div>
    </div>
  );
};
