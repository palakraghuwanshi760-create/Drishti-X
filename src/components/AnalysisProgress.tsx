import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Circle,
  Eye,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

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

  /*
   * IMPORTANT:
   * Grad-CAM is NOT generated/displayed on this screen.
   * The real Grad-CAM returned by the backend is shown later
   * inside ScreeningResultView.
   */

  const stages = [
    {
      label: 'Image Uploaded',
      detail:
        'Fundus image received and prepared for AI screening.',
    },
    {
      label: t.imageQuality,
      detail:
        'Checking retinal image quality, illumination, and vessel visibility.',
    },
    {
      label: 'Detecting retinal features',
      detail:
        'Analyzing retinal structures and visual features relevant to diabetic retinopathy.',
    },
    {
      label: 'Generating analysis',
      detail:
        'Calculating the diabetic retinopathy severity score.',
    },
  ];

  useEffect(() => {
    // Stage 1
    const t1 = setTimeout(() => {
      setCurrentStage(1);
      setProgressPercent(35);
    }, 700);

    // Stage 2
    const t2 = setTimeout(() => {
      setCurrentStage(2);
      setProgressPercent(60);
    }, 1500);

    // Stage 3
    const t3 = setTimeout(() => {
      setCurrentStage(3);
      setProgressPercent(82);
    }, 2400);

    // Finish
    const tFinal = setTimeout(() => {
      setProgressPercent(100);
      setCurrentStage(4);

      /*
       * Move to the result page.
       * The real Grad-CAM is already available from the backend
       * and will be displayed there.
       */
      onComplete();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tFinal);
    };
  }, [onComplete]);

  return (
    <div
      id="ai-analysis-screen"
      className="mx-auto max-w-4xl px-4 py-8"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
          <Cpu className="h-3.5 w-3.5 animate-spin text-teal-600" />
          AI Retinal Screening
        </span>

        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          AI Retinal Analysis
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          NetraRakshak is analyzing the retinal image for
          diabetic retinopathy screening.
        </p>
      </div>

      {/* Main Card */}
      <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:grid-cols-12">

        {/* LEFT — IMAGE */}
        <div className="flex flex-col items-center md:col-span-5">
          <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl border-4 border-slate-800 bg-black shadow-xl sm:h-72 sm:w-72">

            <img
              src={imageSrc}
              alt="Analyzing retinal fundus"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Scanning overlay */}
            <div className="pointer-events-none absolute inset-0">

              {/* Scanning line */}
              <div
                className="absolute left-0 h-1 w-full bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.9)] transition-all duration-700"
                style={{
                  top: `${Math.min(progressPercent, 95)}%`,
                }}
              />

              {/* Retinal grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 rounded-2xl border border-teal-500/20">
                <div className="border-b border-r border-teal-500/20" />
                <div className="border-b border-r border-teal-500/20" />
                <div className="border-b border-teal-500/20" />

                <div className="border-b border-r border-teal-500/20" />

                <div className="flex items-center justify-center border-b border-r border-teal-500/30">
                  <div className="h-12 w-12 animate-ping rounded-full border border-teal-400/40" />
                </div>

                <div className="border-b border-teal-500/20" />

                <div className="border-r border-teal-500/20" />
                <div className="border-r border-teal-500/20" />
                <div />
              </div>
            </div>

            {/* Image status */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-mono text-teal-300 backdrop-blur-sm">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 text-teal-400" />
                Retinal Scan
              </span>

              <span>{progressPercent}%</span>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Please wait while the AI completes the screening.
          </p>
        </div>

        {/* RIGHT — PROGRESS */}
        <div className="space-y-6 md:col-span-7">

          {/* Progress bar */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Analysis Progress
              </span>

              <span className="font-mono text-xs font-bold text-teal-700">
                {progressPercent}%
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-all duration-700"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>

          {/* Stages */}
          <div className="space-y-3.5">
            {stages.map((stage, idx) => {
              const isCompleted = idx < currentStage;
              const isActive = idx === currentStage;
              const isPending = idx > currentStage;

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 rounded-xl p-3 transition-all duration-300 ${
                    isActive
                      ? 'border border-teal-200 bg-teal-50/80'
                      : isCompleted
                      ? 'border border-slate-100 bg-slate-50'
                      : 'opacity-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    )}

                    {isActive && (
                      <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
                    )}

                    {isPending && (
                      <Circle className="h-5 w-5 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-xs font-bold ${
                        isActive
                          ? 'text-teal-900'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.label}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {stage.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Safety notice */}
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold text-slate-700">
                Screening Safety:
              </span>{' '}
              Please wait while the AI completes the retinal image
              analysis. NetraRakshak is a screening prioritization
              tool and does not provide an infallible diagnosis.
            </div>
          </div>

          {/* Cancel */}
          {onCancel && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer text-xs font-medium text-slate-500 transition hover:text-slate-800"
              >
                Cancel Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};