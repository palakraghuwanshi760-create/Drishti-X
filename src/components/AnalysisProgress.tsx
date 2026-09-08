import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  Eye, 
  Cpu, 
  Sparkles, 
  ShieldAlert,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AnalysisProgressProps {
  imageSrc: string;
  lang: Language;
  onComplete: () => void;
  onCancel?: () => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  imageSrc,
  lang,
  onComplete,
  onCancel,
}) => {
  const t = translations[lang];
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(15);

  const stages = [
    { label: t.stageUploaded, status: 'complete', detail: 'Fundus resolution normalized to 512x512 with green channel enhancement' },
    { label: t.stageQuality, status: 'complete', detail: 'Vessel contrast and illumination verified adequate for screening' },
    { label: t.stageDetecting, status: 'active', detail: 'Extracting microaneurysms, hemorrhages, and exudate feature signatures' },
    { label: t.stageGenerating, status: 'pending', detail: 'Calculating multi-class probabilities (ICDR severity scale)' },
    { label: t.stageExplanation, status: 'pending', detail: 'Synthesizing spatial gradient-weighted class activation mapping (Grad-CAM)' },
  ];

  useEffect(() => {
    // Stage 1: Quality (0 - 1s)
    const t1 = setTimeout(() => {
      setCurrentStage(1);
      setProgressPercent(35);
    }, 700);

    // Stage 2: Feature detection (1s - 2.2s)
    const t2 = setTimeout(() => {
      setCurrentStage(2);
      setProgressPercent(60);
    }, 1500);

    // Stage 3: Classification (2.2s - 3.2s)
    const t3 = setTimeout(() => {
      setCurrentStage(3);
      setProgressPercent(82);
    }, 2400);

    // Stage 4: Grad-CAM generation (3.2s - 4.2s)
    const t4 = setTimeout(() => {
      setCurrentStage(4);
      setProgressPercent(98);
    }, 3200);

    // Final finish (4.2s)
    const tFinal = setTimeout(() => {
      setProgressPercent(100);
      onComplete();
    }, 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tFinal);
    };
  }, [onComplete]);

  return (
    <div id="ai-analysis-screen" className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 mb-3">
          <Cpu className="w-3.5 h-3.5 text-teal-600 animate-spin" />
          Offline-Edge Retinal Feature Model
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.analysisTitle}
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
          {t.analysisSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Left: Retinal Fundus with Live Scanning Effect */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-black border-4 border-slate-800 shadow-xl flex items-center justify-center">
            <img
              src={imageSrc}
              alt="Analyzing retinal fundus"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Medical scanning laser overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-1 bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.9)] animate-pulse transition-all duration-1000"
                style={{
                  position: 'absolute',
                  top: `${(progressPercent % 90) + 5}%`,
                  left: 0,
                }}
              />
              {/* Retinal target grid */}
              <div className="absolute inset-0 border border-teal-500/20 rounded-2xl grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-teal-500/20"></div>
                <div className="border-r border-b border-teal-500/20"></div>
                <div className="border-b border-teal-500/20"></div>
                <div className="border-r border-b border-teal-500/20"></div>
                <div className="border-r border-b border-teal-500/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-teal-400/40 animate-ping"></div>
                </div>
                <div className="border-b border-teal-500/20"></div>
                <div className="border-r border-teal-500/20"></div>
                <div className="border-r border-teal-500/20"></div>
                <div></div>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg text-[11px] text-teal-300 font-mono flex items-center justify-between border border-slate-700">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                Vascular Segmentation
              </span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Right: Progress Stages */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Inference Pipeline Progress
              </span>
              <span className="text-xs font-bold text-teal-700 font-mono">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-teal-600 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Sequential Stages List */}
          <div className="space-y-3.5">
            {stages.map((stage, idx) => {
              const isCompleted = idx < currentStage;
              const isActive = idx === currentStage;
              const isPending = idx > currentStage;

              return (
                <div 
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-teal-50/80 border border-teal-200'
                      : isCompleted
                      ? 'bg-slate-50 border border-slate-100'
                      : 'opacity-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    {isActive && (
                      <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                    )}
                    {isPending && (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${
                      isActive ? 'text-teal-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                    }`}>
                      {stage.label}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {stage.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fallibility & Safety Notice */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-slate-600 text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold text-slate-700">Safety Verification: </span>
              {t.analysisProgressNotice} Drishti-X serves purely as a screening prioritization tool and does not provide an infallible diagnosis.
            </div>
          </div>

          {onCancel && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                {t.cancelAnalysis}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
