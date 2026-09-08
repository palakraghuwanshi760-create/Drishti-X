import React from 'react';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  Eye, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle2,
  FileCheck,
  Building
} from 'lucide-react';
import { ScreeningRecord, Language } from '../types';
import { translations } from '../i18n/translations';
import { Disclaimer } from './Disclaimer';
import { DEMO_ATTENTION_MAPS } from '../assets/sampleImages';

interface ReportViewProps {
  record: ScreeningRecord;
  lang: Language;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  record,
  lang,
  onBack,
}) => {
  const t = translations[lang];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate a printable snapshot or trigger print
    window.print();
  };

  const attentionPoints = DEMO_ATTENTION_MAPS[record.drGrade] || DEMO_ATTENTION_MAPS.MODERATE_DR;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top Action Bar (hidden on print) */}
      <div className="flex items-center justify-between no-print">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Result</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="print-report-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printReport}</span>
          </button>

          <button
            type="button"
            id="download-report-btn"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-xl shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.downloadReport}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div 
        id="printable-medical-report" 
        className="bg-white rounded-3xl border border-slate-300 p-8 sm:p-10 shadow-sm print:border-none print:shadow-none print:p-4 text-slate-900"
      >
        {/* Report Official Header */}
        <div className="border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Drishti-X
                </h1>
              </div>
              <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                {t.reportTitle}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                AI-Assisted Retinal Screening & Tele-Ophthalmology Decision Support
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 font-mono">
              <p className="font-bold text-slate-900 text-sm">
                ID: {record.id}
              </p>
              <p>Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p className="text-[11px] text-teal-700 font-sans font-semibold">
                Screening Camp: {record.centerLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Patient Demographics & Exam Info Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs mb-6">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase">
              {t.patientId}
            </span>
            <span className="font-bold text-slate-900 font-mono text-sm">
              {record.patientCode}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase">
              Age / Sex
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {record.patientAge} Y / {record.patientSex}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase">
              Screening Date
            </span>
            <span className="font-semibold text-slate-800">
              {record.screeningDate}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase">
              Image Quality
            </span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {record.imageQuality === 'GOOD' ? 'Clinical Grade (Good)' : 'Substandard (Poor)'}
            </span>
          </div>
        </div>

        {/* AI Screening Classification Box */}
        <div className="p-5 bg-slate-900 text-white rounded-2xl mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
                Primary Screening Finding
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {record.drGradeLabel}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Automated multi-scale feature inference based on International Clinical Diabetic Retinopathy (ICDR) scale.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Model Confidence
                </span>
                <span className="text-xl font-bold font-mono text-teal-300">
                  {Math.round(record.confidenceScore * 100)}%
                </span>
              </div>

              <div className="text-right pl-4 border-l border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Referral Priority
                </span>
                <span className={`text-base font-black px-2.5 py-0.5 rounded ${
                  record.referralPriority === 'LOW' 
                    ? 'bg-emerald-900 text-emerald-300' 
                    : record.referralPriority === 'MODERATE'
                    ? 'bg-amber-900 text-amber-300'
                    : 'bg-rose-900 text-rose-300'
                }`}>
                  {record.referralPriority}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Retinal Fundus & Grad-CAM Heatmap Comparison Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-teal-700" />
            <span>Fundus Photographic Evidence & Model Attention Maps</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Original Image */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50">
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                <span>Original Fundus Image</span>
                <span className="text-[10px] text-slate-400 font-mono">45° Posterior Pole</span>
              </div>
              <div className="aspect-square bg-black rounded-xl overflow-hidden relative">
                <img
                  src={record.fundusImage}
                  alt="Raw fundus"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* AI Explanation / Grad-CAM */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50">
              <div className="text-xs font-bold text-teal-900 mb-2 flex items-center justify-between">
                <span>AI Explanation (Grad-CAM Overlay)</span>
                <span className="text-[10px] text-teal-700 font-semibold">Spatial Attention Field</span>
              </div>
              <div className="aspect-square bg-black rounded-xl overflow-hidden relative">
                <img
                  src={record.fundusImage}
                  alt="Grad-CAM overlay"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Synthetic Grad-CAM Colormap Layer */}
                <div className="absolute inset-0 pointer-events-none opacity-80">
                  <svg viewBox="0 0 100 100" className="w-full h-full mix-blend-screen filter blur-md" preserveAspectRatio="none">
                    <defs>
                      {attentionPoints.map((pt, idx) => (
                        <radialGradient key={`rep-grad-${idx}`} id={`rep-grad-${idx}`} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={pt.intensity} />
                          <stop offset="40%" stopColor="#f97316" stopOpacity={pt.intensity * 0.9} />
                          <stop offset="70%" stopColor="#eab308" stopOpacity={pt.intensity * 0.6} />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                        </radialGradient>
                      ))}
                    </defs>
                    {attentionPoints.map((pt, idx) => (
                      <circle key={`rep-c-${idx}`} cx={pt.x} cy={pt.y} r={pt.radius} fill={`url(#rep-grad-${idx})`} />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Explanation Section */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs mb-6 space-y-2">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Model Explanation & Feature Attribution
          </h4>
          <p className="text-slate-700 leading-relaxed">
            The model's attention was concentrated around retinal regions that influenced the screening prediction. Attention heatmaps highlight spatial vascular patterns, microaneurysm candidates, and hard exudates that contributed mathematically to the classification.
          </p>
          <p className="text-[11px] text-slate-500 italic">
            Note: Grad-CAM attention activations reflect deep convolutional network feature representations; they indicate algorithmic focus and do not substitute for stereoscopic bio-microscopy examination.
          </p>
        </div>

        {/* Clinical Next Step & Triage Protocol */}
        <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-2xl text-xs mb-6">
          <h4 className="font-bold text-teal-950 uppercase tracking-wider text-[11px] mb-1">
            Clinical Recommendation & Next Step
          </h4>
          <p className="text-teal-900 font-semibold leading-relaxed">
            {record.clinicalNextStep}
          </p>
          <p className="text-[11px] text-teal-800 mt-1">
            Referral Facility: Primary Eye Care Centre / District Hospital Ophthalmology Unit.
          </p>
        </div>

        {/* Mandatory Medical Disclaimer */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs mb-8">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <span className="font-bold">Medical Disclaimer: </span>
              {t.medicalDisclaimerText}
            </p>
          </div>
        </div>

        {/* Signatures & Official Stamp Area */}
        <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Screening Health Worker
            </p>
            <p className="font-bold text-slate-800 mt-1">
              {record.examinerName}
            </p>
            <p className="text-[10px] text-slate-500">
              Community Health Worker (ASHA / Arogya Mitra)
            </p>
            <div className="mt-4 border-b border-dashed border-slate-400 w-48"></div>
            <span className="text-[9px] text-slate-400">Health Worker Signature</span>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              {t.officialStamp}
            </p>
            <div className="inline-block border-2 border-slate-300 rounded-xl p-3 text-center my-1">
              <Building className="w-5 h-5 mx-auto text-slate-400 mb-0.5" />
              <span className="text-[10px] font-bold text-slate-600 uppercase block">
                PHC Sonarpur Health Camp
              </span>
              <span className="text-[8px] text-slate-400">
                Govt. of Maharashtra / NHM
              </span>
            </div>
            <div className="mt-2 border-b border-dashed border-slate-400 w-48 ml-auto"></div>
            <span className="text-[9px] text-slate-400">Ophthalmologist Review Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};
