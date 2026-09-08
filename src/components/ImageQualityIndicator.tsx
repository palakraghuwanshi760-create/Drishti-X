import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, RefreshCw } from 'lucide-react';
import { ImageQualityStatus, Language } from '../types';
import { translations } from '../i18n/translations';

interface ImageQualityIndicatorProps {
  status: ImageQualityStatus;
  lang: Language;
  qualityIssues?: string[];
  onRecheck?: () => void;
  className?: string;
}

export const ImageQualityIndicator: React.FC<ImageQualityIndicatorProps> = ({
  status,
  lang,
  qualityIssues,
  onRecheck,
  className = '',
}) => {
  const t = translations[lang];

  if (status === 'UNCHECKED') {
    return (
      <div 
        id="image-quality-indicator-unchecked"
        className={`p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs flex items-center justify-between ${className}`}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Image quality verification pending analysis</span>
        </div>
        {onRecheck && (
          <button
            type="button"
            onClick={onRecheck}
            className="text-teal-700 font-semibold hover:underline text-xs"
          >
            Run Quality Check
          </button>
        )}
      </div>
    );
  }

  if (status === 'POOR') {
    return (
      <div
        id="image-quality-warning-area"
        className={`p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                <span>{t.imageQualityPoor}</span>
              </h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 uppercase">
                Substandard Clarity
              </span>
            </div>
            <p className="text-xs mt-1.5 text-amber-900 leading-relaxed font-medium">
              {t.imageQualityPoorDesc}
            </p>
            {qualityIssues && qualityIssues.length > 0 && (
              <ul className="mt-2 text-xs text-amber-800 list-disc list-inside space-y-0.5">
                {qualityIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            )}
            <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-xs">
              <span className="text-amber-800 text-[11px]">
                Tip: Instruct patient to fixate on internal green target; adjust illumination ring.
              </span>
              {onRecheck && (
                <button
                  type="button"
                  onClick={onRecheck}
                  className="inline-flex items-center gap-1 text-amber-900 font-bold hover:underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-evaluate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GOOD
  return (
    <div
      id="image-quality-warning-area"
      className={`p-4 bg-emerald-50/90 border border-emerald-300 rounded-xl text-emerald-950 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-emerald-100 rounded-lg shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
              <span>{t.imageQualityGood}</span>
            </h4>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 uppercase">
              Clinical Grade
            </span>
          </div>
          <p className="text-xs mt-1 text-emerald-800 leading-relaxed">
            {t.imageQualityGoodDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
