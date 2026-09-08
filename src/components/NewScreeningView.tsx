import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Cpu, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  User, 
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { PatientForm } from './PatientForm';
import { ImageUploader } from './ImageUploader';
import { ImageQualityIndicator } from './ImageQualityIndicator';
import { Disclaimer } from './Disclaimer';
import { PatientInfo, ImageQualityStatus, Language, ScreeningRecord } from '../types';
import { translations } from '../i18n/translations';
import { SAMPLE_FUNDUS_IMAGES } from '../assets/sampleImages';

interface NewScreeningViewProps {
  patientInfo: PatientInfo;
  onPatientInfoChange: (info: Partial<PatientInfo>) => void;
  imageSrc: string | null;
  fileName: string;
  fileSizeText: string;
  uploadProgress: number;
  imageQuality: ImageQualityStatus;
  qualityIssues?: string[];
  onImageSelected: (src: string, name: string, sizeText: string, quality: ImageQualityStatus) => void;
  onImageRemoved: () => void;
  onRunAnalysis: () => void;
  lang: Language;
  onCancel: () => void;
}

export const NewScreeningView: React.FC<NewScreeningViewProps> = ({
  patientInfo,
  onPatientInfoChange,
  imageSrc,
  fileName,
  fileSizeText,
  uploadProgress,
  imageQuality,
  qualityIssues,
  onImageSelected,
  onImageRemoved,
  onRunAnalysis,
  lang,
  onCancel,
}) => {
  const t = translations[lang];
  const [currentStep, setCurrentStep] = useState<1 | 2>(imageSrc ? 2 : 1);
  const [formError, setFormError] = useState<string | null>(null);

  const steps = [
    { num: 1, label: t.step1, icon: User },
    { num: 2, label: t.step2, icon: ImageIcon },
    { num: 3, label: t.step3, icon: Cpu },
    { num: 4, label: t.step4, icon: Eye },
  ];

  const handleNextToImage = () => {
    if (!patientInfo.patientCode.trim()) {
      setFormError('Please enter a valid Patient Code / Camp Token');
      return;
    }
    if (!patientInfo.age || Number(patientInfo.age) <= 0) {
      setFormError('Please enter the patient age');
      return;
    }
    setFormError(null);
    setCurrentStep(2);
  };

  return (
    <div id="new-screening-workflow" className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Workflow Header & Step Indicator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.navNewScreening}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Protocol: Rural primary care fundus triage workflow
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Cancel and Return
          </button>
        </div>

        {/* 4 Steps Indicator Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {steps.map((s) => {
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;
            const isFuture = s.num > currentStep;
            const Icon = s.icon;

            return (
              <div
                key={s.num}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
                  isCurrent
                    ? 'bg-teal-50 border-teal-600 text-teal-900'
                    : isCompleted
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-white border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-teal-700 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold leading-tight truncate">
                    {s.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {formError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Step 1: Patient Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <PatientForm
            patientInfo={patientInfo}
            onChange={onPatientInfoChange}
            lang={lang}
          />

          <div className="flex justify-end">
            <button
              type="button"
              id="btn-proceed-to-image"
              onClick={handleNextToImage}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl shadow-xs transition-all cursor-pointer text-sm"
            >
              <span>Continue to Fundus Image</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Image Upload & Quality Check */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Patient Header Summary Pill */}
          <div className="p-3.5 bg-slate-100 rounded-2xl flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 font-mono">
                Patient: {patientInfo.patientCode || 'MH-PHC-0891'}
              </span>
              <span>• {patientInfo.age || 54} Years</span>
              <span>• {patientInfo.sex || 'Female'}</span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-teal-700 font-semibold hover:underline cursor-pointer"
            >
              Edit Info
            </button>
          </div>

          <ImageUploader
            imageSrc={imageSrc}
            fileName={fileName}
            fileSizeText={fileSizeText}
            uploadProgress={uploadProgress}
            imageQuality={imageQuality}
            onImageSelected={onImageSelected}
            onImageRemoved={onImageRemoved}
            lang={lang}
          />

          {/* Quality Indicator if image uploaded */}
          {imageSrc && (
            <ImageQualityIndicator
              status={imageQuality}
              lang={lang}
              qualityIssues={qualityIssues}
            />
          )}

          {/* Primary Action Button: [ Analyze Image ] */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Patient Info</span>
            </button>

            <button
              type="button"
              id="analyze-image-primary-btn"
              disabled={!imageSrc}
              onClick={onRunAnalysis}
              className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                imageSrc
                  ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-900/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{t.analyzeImage}</span>
            </button>
          </div>
        </div>
      )}

      {/* Medical Disclaimer Card at bottom */}
      <Disclaimer lang={lang} variant="card" />
    </div>
  );
};
