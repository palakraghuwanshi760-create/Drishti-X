import React from 'react';
import { 
  ArrowLeft, 
  Share2, 
  FileText, 
  PlusCircle, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ResultCard } from './ResultCard';
import { OriginalVsExplanationViewer } from './OriginalVsExplanationViewer';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { RiskIndicator } from './RiskIndicator';
import { Disclaimer } from './Disclaimer';
import { ScreeningRecord, Language } from '../types';
import { translations } from '../i18n/translations';

interface ScreeningResultViewProps {
  record: ScreeningRecord;
  lang: Language;
  onViewReport: () => void;
  onNewScreening: () => void;
  onBackToHistory: () => void;
}

export const ScreeningResultView: React.FC<ScreeningResultViewProps> = ({
  record,
  lang,
  onViewReport,
  onNewScreening,
  onBackToHistory,
}) => {
  const t = translations[lang];

  return (
    <div id="screening-result-page" className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <button
          type="button"
          onClick={onBackToHistory}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            Inference Completed • {record.id}
          </span>
          <span className="hidden sm:inline">• {record.screeningDate}</span>
        </div>
      </div>

      {/* Main Result Card */}
      <ResultCard
        record={record}
        lang={lang}
        onViewReport={onViewReport}
        onNewScreening={onNewScreening}
      />

      {/* Grid: Main Explainable Visualizer (Left) + Triage & Confidence (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Explanation (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <OriginalVsExplanationViewer
            originalImage={record.fundusImage}
            drGrade={record.drGrade}
            lang={lang}
          />
        </div>

        {/* Right Column: Confidence Breakdown & Risk Triage (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <RiskIndicator
            priority={record.referralPriority}
            lang={lang}
          />

          <ConfidenceIndicator
            confidenceScore={record.confidenceScore}
            classProbabilities={record.classProbabilities}
            lang={lang}
          />

          {/* Screening Metadata Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs space-y-3 shadow-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Screening Context
            </h4>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Screening Center:</span>
                <span className="font-medium text-slate-800 text-right">{record.centerLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Health Worker:</span>
                <span className="font-medium text-slate-800">{record.examinerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient Code:</span>
                <span className="font-mono font-bold text-slate-900">{record.patientCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quality Assessment:</span>
                <span className="font-semibold text-emerald-700">Clinical Grade ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Medical Disclaimer */}
      <Disclaimer lang={lang} variant="card" />
    </div>
  );
};
