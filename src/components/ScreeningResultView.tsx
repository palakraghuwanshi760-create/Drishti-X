import React from 'react';

import {
  ArrowLeft,
  CheckCircle2,
  Brain,
  Info,
  Sparkles,
  ShieldCheck,
  Calendar,
  MapPin,
  UserRound,
  Activity,
} from 'lucide-react';

import { ResultCard } from './ResultCard';
import  OriginalVsExplanationViewer  from './OriginalVsExplanationViewer';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { RiskIndicator } from './RiskIndicator';
import { Disclaimer } from './Disclaimer';
import { ScreeningRecord, Language } from '../types';
import { translations } from '../translations';

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

  const hasGradCAM =
    !!record.explainability?.heatmap;

  return (
    <div
      id="screening-result-page"
      className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6"
    >
      {/* =========================================================
          TOP NAVIGATION
      ========================================================= */}

      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onBackToHistory}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 font-semibold text-teal-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
            Inference Completed
          </span>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-500">
            {record.id}
          </span>

          <span className="hidden text-slate-400 sm:inline">
            • {record.screeningDate}
          </span>
        </div>
      </div>

      {/* =========================================================
          MAIN RESULT
      ========================================================= */}

      <ResultCard
        record={record}
        lang={lang}
        onViewReport={onViewReport}
        onNewScreening={onNewScreening}
      />

      {/* =========================================================
          EXPLAINABLE AI HEADER
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
              <Brain className="h-6 w-6 text-teal-300" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Explainable AI Analysis
                </h2>

                <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-300">
                  XAI
                </span>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-slate-300">
                The visualization shows the regions that contributed most
                strongly to the model&apos;s severity prediction.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Explanation Method
              </p>

              <p className="text-xs font-semibold text-emerald-300">
                {record.explainability?.method || 'Grad-CAM'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN ANALYSIS GRID
      ========================================================= */}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* LEFT — EXPLANATION */}

        <div className="space-y-6 lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  AI Attention Visualization
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Original retinal image compared with the real Grad-CAM
                  explanation generated by the AI model.
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-[11px] font-semibold text-teal-700">
                <Sparkles className="h-3.5 w-3.5" />

                {hasGradCAM
                  ? 'Live Grad-CAM'
                  : 'Explanation Unavailable'}
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <OriginalVsExplanationViewer
                originalImage={record.fundusImage}
                drGrade={record.drGrade}
                lang={lang}
                heatmap={record.explainability?.heatmap}
                method={record.explainability?.method}
                targetLayer={record.explainability?.targetLayer}
              />
            </div>
          </div>

          {/* XAI EXPLANATION NOTE */}

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <Info className="h-4 w-4 text-blue-700" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-blue-900">
                  How to interpret this visualization
                </h4>

                <p className="mt-2 text-xs leading-5 text-blue-800">
                  Grad-CAM highlights image regions that had stronger influence
                  on the model&apos;s severity score during inference. Brighter
                  regions indicate stronger model attention.
                </p>

                <p className="mt-2 text-[11px] font-medium leading-5 text-blue-700">
                  This visualization is an AI explanation aid. It is not
                  independent clinical evidence and does not confirm the
                  presence or absence of a retinal lesion.
                </p>
              </div>
            </div>
          </div>

          {/* TECHNICAL XAI DETAILS */}

          {record.explainability && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Brain className="h-4 w-4 text-teal-600" />

                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Explainability Details
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Method
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {record.explainability.method}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Target Layer
                  </p>

                  <p className="mt-1 break-all text-xs font-bold text-slate-800">
                    {record.explainability.targetLayer}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Heatmap
                  </p>

                  <p className="mt-1 text-sm font-bold text-emerald-700">
                    Generated
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — CONFIDENCE + RISK */}

        <div className="space-y-6 lg:col-span-4">
          <RiskIndicator
            priority={record.referralPriority}
            lang={lang}
          />

          <ConfidenceIndicator
            confidenceScore={record.confidenceScore}
            classProbabilities={record.classProbabilities}
            lang={lang}
          />

          {/* SCREENING CONTEXT */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-600" />

              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Screening Context
              </h4>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  Screening Center
                </div>

                <span className="max-w-[55%] text-right text-xs font-semibold text-slate-800">
                  {record.centerLocation}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <UserRound className="h-3.5 w-3.5" />
                  Health Worker
                </div>

                <span className="text-right text-xs font-semibold text-slate-800">
                  {record.examinerName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-400">
                  Patient Code
                </span>

                <span className="font-mono text-xs font-bold text-slate-900">
                  {record.patientCode}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  Screening Date
                </div>

                <span className="text-xs font-semibold text-slate-800">
                  {record.screeningDate}
                </span>
              </div>
            </div>
          </div>

          {/* QUALITY STATUS */}

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  Image Quality Passed
                </h4>

                <p className="mt-1 text-xs leading-5 text-emerald-800">
                  The retinal image passed the technical quality checks before
                  AI inference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DISCLAIMER */}

      <Disclaimer lang={lang} variant="card" />
    </div>
  );
};