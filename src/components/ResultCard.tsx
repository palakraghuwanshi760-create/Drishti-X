import React from 'react';
import { 
  FileText, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  Calendar,
  Share2,
  Stethoscope,
  Printer
} from 'lucide-react';
import { ScreeningRecord, Language } from '../types';
import { translations } from '../i18n/translations';

interface ResultCardProps {
  record: ScreeningRecord;
  lang: Language;
  onViewReport: () => void;
  onNewScreening: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  record,
  lang,
  onViewReport,
  onNewScreening,
}) => {
  const t = translations[lang];
  const isNoDR = record.drGrade === 'NO_DR';
  const isModerateOrHigher = record.drGrade === 'MODERATE_DR' || record.drGrade === 'SEVERE_DR' || record.drGrade === 'PROLIFERATIVE_DR';

  return (
    <div id="ai-screening-result-card" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Top Banner & Severity Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.screeningResultTitle}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              UID: {record.patientCode}
            </span>
          </div>

          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${
            isNoDR ? 'text-emerald-700' : isModerateOrHigher ? 'text-rose-700' : 'text-amber-700'
          }`}>
            {record.drGradeLabel.toUpperCase()}
          </h2>
        </div>

        {/* Priority Badge */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-center border font-bold text-xs ${
            record.referralPriority === 'LOW'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : record.referralPriority === 'MODERATE'
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-rose-50 text-rose-800 border-rose-300'
          }`}>
            <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-80">
              {t.referralPriority}
            </span>
            <span className="text-sm">
              {record.referralPriority}
            </span>
          </div>

          <div className="bg-slate-50 px-4 py-2 rounded-xl text-center border border-slate-200 font-bold text-xs">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">
              Confidence
            </span>
            <span className="text-sm text-slate-900 font-mono">
              {Math.round(record.confidenceScore * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Clinical Next Step Box */}
      <div id="recommended-next-step-box" className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-teal-100 text-teal-800 rounded-lg shrink-0 mt-0.5">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.recommendedNextStep}
            </h4>
            <p className="text-xs mt-1 text-slate-800 leading-relaxed font-medium">
              {record.clinicalNextStep}
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Target Clinical Window: {
                record.referralPriority === 'LOW' 
                  ? 'Annual Review (12 months)' 
                  : record.referralPriority === 'MODERATE'
                  ? '3 to 6 months at Primary Health Center'
                  : '1 to 2 weeks at District Ophthalmology Centre'
              }</span>
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons: [ View Detailed Report ] [ New Screening ] */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          id="btn-view-detailed-report"
          onClick={onViewReport}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl shadow-xs transition-all cursor-pointer text-sm"
        >
          <FileText className="w-4 h-4" />
          <span>{t.viewDetailedReport}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          id="btn-start-new-screening-from-result"
          onClick={onNewScreening}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-colors cursor-pointer text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.startNewScreening}</span>
        </button>
      </div>
    </div>
  );
};
