import React, { useState } from 'react';

import {
  ArrowRight,
  ArrowLeft,
  Cpu,
  AlertCircle,
  Eye,
  User,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Brain,
  ShieldCheck,
} from 'lucide-react';

import { PatientForm } from './PatientForm';
import ImageUploader from './ImageUploader';
import { ImageQualityIndicator } from './ImageQualityIndicator';
import { Disclaimer } from './Disclaimer';

import {
  PatientInfo,
  ImageQualityStatus,
  Language,
} from '../types';

import { translations } from '../translations';

interface NewScreeningViewProps {
  patientInfo: PatientInfo;
  onPatientInfoChange: (info: Partial<PatientInfo>) => void;

  imageSrc: string | null;
  fileName: string;
  fileSizeText: string;
  uploadProgress: number;
  imageQuality: ImageQualityStatus;
  qualityIssues?: string[];

  onImageSelected: (
    src: string,
    name: string,
    sizeText: string,
    quality: ImageQualityStatus,
    issues?: string[]
  ) => void;

  onImageRemoved: () => void;

  onRunAnalysis: () => void;

  lang: Language;
  onCancel: () => void;
}

interface PredictionResponse {
  success: boolean;
  filename: string;
  image_size: {
    width: number;
    height: number;
  };
  prediction: string;
  class_id: number;
  score: number;
  thresholds: number[];
  explainability?: {
    method: string;
    target_layer: string;
    heatmap: string;
    heatmap_width: number;
    heatmap_height: number;
  };
}

const NewScreeningView: React.FC<NewScreeningViewProps> = ({
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
  const t = translations[lang] ?? translations.en;

  const [currentStep, setCurrentStep] = useState<1 | 2>(
    imageSrc ? 2 : 1
  );

  const [formError, setFormError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [predictionResult, setPredictionResult] =
    useState<PredictionResponse | null>(null);

  const [analysisError, setAnalysisError] =
    useState<string | null>(null);

  const steps = [
    {
      num: 1,
      label: 'Patient Information',
      icon: User,
    },
    {
      num: 2,
      label: 'Fundus Image',
      icon: ImageIcon,
    },
    {
      num: 3,
      label: 'AI Analysis',
      icon: Cpu,
    },
    {
      num: 4,
      label: 'Review & Submit',
      icon: Eye,
    },
  ];

  const handleNextToImage = () => {
    if (!patientInfo.patientName?.trim()) {
      setFormError('Please enter the patient name.');
      return;
    }

    if (!patientInfo.patientCode?.trim()) {
      setFormError(
        'Please enter a valid Patient Code / Camp Token.'
      );
      return;
    }

    if (!patientInfo.age || Number(patientInfo.age) <= 0) {
      setFormError('Please enter the patient age.');
      return;
    }

    setFormError(null);
    setCurrentStep(2);

    setTimeout(() => {
      document
        .getElementById('fundus-upload-section')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }, 100);
  };

  /*
   * Convert the selected image into a File.
   *
   * Real uploaded images come through as data URLs from ImageUploader.
   * Our demo images are also data URLs.
   */
  const dataUrlToFile = async (
    dataUrl: string,
    filename: string
  ): Promise<File> => {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error('Unable to read the selected image.');
    }

    const blob = await response.blob();

    const extension =
      blob.type === 'image/png'
        ? '.png'
        : blob.type === 'image/webp'
        ? '.webp'
        : '.jpg';

    const safeFilename =
      filename && filename.includes('.')
        ? filename
        : `fundus-image${extension}`;

    return new File([blob], safeFilename, {
      type: blob.type || 'image/jpeg',
    });
  };

  /*
   * REAL AI ANALYSIS
   *
   * Sends the image to:
   *
   * http://localhost:8000/predict
   *
   * Backend expects:
   *
   * multipart/form-data
   * file=<image>
   */
  const runRealAIAnalysis = async () => {
    if (!imageSrc) {
      setFormError(
        'Please upload a fundus image before starting AI analysis.'
      );
      return;
    }

    if (imageQuality === 'POOR') {
      setFormError(
        'Image quality is insufficient. Please recapture the retinal image before analysis.'
      );
      return;
    }

    setFormError(null);
    setAnalysisError(null);
    setPredictionResult(null);
    setIsAnalyzing(true);

    try {
      const imageFile = await dataUrlToFile(
        imageSrc,
        fileName || 'fundus-image.jpg'
      );

      const formData = new FormData();

      formData.append('file', imageFile);

      const response = await fetch(
        'http://localhost:8000/predict',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        let backendMessage = '';

        try {
          const errorData = await response.json();

          if (errorData?.detail) {
            backendMessage =
              typeof errorData.detail === 'string'
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          }
        } catch {
          // Ignore JSON parsing errors.
        }

        throw new Error(
          backendMessage ||
            `AI backend returned HTTP ${response.status}.`
        );
      }

      const result: PredictionResponse =
        await response.json();

      if (!result.success) {
        throw new Error(
          'The AI backend could not complete the screening.'
        );
      }

      setPredictionResult(result);

      /*
       * Keep the existing parent callback available.
       * We call it after successful analysis so the existing
       * application flow can continue if the parent uses it.
       */
      onRunAnalysis();
    } catch (error) {
      console.error('NetraRakshak AI analysis error:', error);

      const message =
        error instanceof Error
          ? error.message
          : 'Unable to connect to the AI backend.';

      setAnalysisError(
        `${message} Please make sure the NetraRakshak backend is running on port 8000.`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeClick = () => {
    void runRealAIAnalysis();
  };

  const handleRecapture = () => {
    setFormError(null);
    setAnalysisError(null);
    setPredictionResult(null);

    onImageRemoved();

    setCurrentStep(2);

    setTimeout(() => {
      document
        .getElementById('fundus-upload-section')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }, 100);
  };

  const isPoorQuality = imageQuality === 'POOR';

  /*
   * Backend class mapping:
   *
   * 0 = No DR
   * 1 = Mild NPDR
   * 2 = Moderate NPDR
   * 3 = Severe NPDR
   * 4 = Proliferative DR
   *
   * We keep this mapping here so the UI can show
   * a clinically understandable label.
   */
  const getReferralPriority = (classId: number) => {
    switch (classId) {
      case 0:
        return 'Routine monitoring';

      case 1:
        return 'Routine follow-up';

      case 2:
        return 'High';

      case 3:
        return 'Urgent';

      case 4:
        return 'Urgent specialist referral';

      default:
        return 'Review required';
    }
  };

  const getResultStyle = (classId: number) => {
    switch (classId) {
      case 0:
        return {
          container:
            'border-emerald-200 bg-emerald-50',
          icon:
            'bg-emerald-100 text-emerald-700',
          title:
            'text-emerald-900',
          text:
            'text-emerald-800',
        };

      case 1:
        return {
          container:
            'border-amber-200 bg-amber-50',
          icon:
            'bg-amber-100 text-amber-700',
          title:
            'text-amber-900',
          text:
            'text-amber-800',
        };

      default:
        return {
          container:
            'border-rose-200 bg-rose-50',
          icon:
            'bg-rose-100 text-rose-700',
          title:
            'text-rose-900',
          text:
            'text-rose-800',
        };
    }
  };

  return (
    <div
      id="new-screening-workflow"
      className="mx-auto max-w-5xl space-y-6 px-4 py-8"
    >
      {/* HEADER */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              {t.newScreening || 'New Screening'}
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Rural primary care fundus screening workflow
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            Cancel and Return
          </button>
        </div>

        {/* STEP INDICATOR */}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
          {steps.map((step) => {
            const isCompleted =
              step.num < currentStep;

            const isCurrent =
              step.num === currentStep;

            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className={`flex items-center gap-2.5 rounded-xl border p-3 transition-all ${
                  isCurrent
                    ? 'border-teal-600 bg-teal-50 text-teal-900'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50 text-slate-700'
                    : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    isCurrent
                      ? 'bg-teal-700 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>

                <span className="truncate text-xs font-bold">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ERROR */}

      {formError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />

          <span>{formError}</span>
        </div>
      )}

      {/* ============================================================
          STEP 1 — PATIENT INFORMATION
          ============================================================ */}

      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                <User className="h-5 w-5 text-teal-700" />
              </div>

              <div>
                <h2 className="text-base font-black text-slate-900">
                  Patient Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Enter the patient's details before uploading
                  the fundus image.
                </p>
              </div>
            </div>

            {/* PATIENT NAME */}

            <div className="mb-5">
              <label
                htmlFor="patient-name"
                className="mb-2 block text-xs font-bold text-slate-700"
              >
                Patient Name{' '}
                <span className="text-rose-500">*</span>
              </label>

              <input
                id="patient-name"
                type="text"
                value={
                  patientInfo.patientName || ''
                }
                onChange={(event) =>
                  onPatientInfoChange({
                    patientName:
                      event.target.value,
                  })
                }
                placeholder="Enter patient name"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <PatientForm
              patientInfo={patientInfo}
              onChange={onPatientInfoChange}
              lang={lang}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNextToImage}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-700 px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-teal-800"
            >
              <span>
                Continue to Fundus Image
              </span>

              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          STEP 2 — FUNDUS IMAGE UPLOAD
          ============================================================ */}

      {currentStep === 2 && (
        <div
          id="fundus-upload-section"
          className="space-y-6"
        >
          {/* PATIENT SUMMARY */}

          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
              <span className="font-bold text-slate-900">
                Patient:{' '}
                {patientInfo.patientName ||
                  'Unnamed Patient'}
              </span>

              <span className="font-mono text-slate-600">
                • {patientInfo.patientCode ||
                  'No Code'}
              </span>

              <span>
                • {patientInfo.age || '--'} Years
              </span>

              <span>
                • {patientInfo.sex || 'Female'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setCurrentStep(1);
              }}
              className="cursor-pointer text-left text-xs font-bold text-teal-700 hover:underline"
            >
              Edit Patient Info
            </button>
          </div>

          {/* BIG UPLOAD SECTION */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                <ImageIcon className="h-5 w-5 text-teal-700" />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Fundus Image
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Upload a retinal fundus photograph for
                  AI-assisted diabetic retinopathy
                  screening.
                </p>
              </div>
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
          </div>

          {/* QUALITY INDICATOR */}

          {imageSrc && (
            <ImageQualityIndicator
              status={imageQuality}
              lang={lang}
              qualityIssues={qualityIssues}
            />
          )}

          {/* POOR QUALITY WARNING */}

          {imageSrc && isPoorQuality && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-rose-900">
                    Image quality insufficient
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-rose-800">
                    This retinal image does not meet the
                    minimum technical quality requirements
                    for reliable screening.
                  </p>

                  {qualityIssues &&
                    qualityIssues.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-1 text-xs font-bold text-rose-900">
                          Detected issues:
                        </p>

                        <ul className="space-y-1">
                          {qualityIssues.map(
                            (issue, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-xs text-rose-800"
                              >
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />

                                {issue}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  <button
                    type="button"
                    onClick={handleRecapture}
                    className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-rose-700"
                  >
                    <RefreshCw className="h-4 w-4" />

                    Recapture Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GOOD QUALITY */}

          {imageSrc &&
            imageQuality === 'GOOD' && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      Image quality passed
                    </p>

                    <p className="mt-0.5 text-xs text-emerald-700">
                      The image can proceed to AI-assisted
                      screening.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* BACKEND ERROR */}

          {analysisError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />

                <div>
                  <h3 className="font-bold text-rose-900">
                    AI analysis failed
                  </h3>

                  <p className="mt-1 text-sm text-rose-800">
                    {analysisError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              REAL AI RESULT
              ======================================================== */}

          {predictionResult && (
            <div className="space-y-5">
              <div
                className={`rounded-3xl border p-6 shadow-sm ${
                  getResultStyle(
                    predictionResult.class_id
                  ).container
                }`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        getResultStyle(
                          predictionResult.class_id
                        ).icon
                      }`}
                    >
                      <Brain className="h-6 w-6" />
                    </div>

                    <div>
                      <p
                        className={`text-xs font-bold uppercase tracking-wider ${
                          getResultStyle(
                            predictionResult.class_id
                          ).text
                        }`}
                      >
                        AI Screening Result
                      </p>

                      <h2
                        className={`mt-1 text-2xl font-black ${
                          getResultStyle(
                            predictionResult.class_id
                          ).title
                        }`}
                      >
                        {predictionResult.prediction}
                      </h2>

                      <p
                        className={`mt-1 text-sm ${
                          getResultStyle(
                            predictionResult.class_id
                          ).text
                        }`}
                      >
                        AI-assisted classification based
                        on the uploaded fundus image.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/70 px-5 py-4 text-center">
                    <p className="text-xs font-semibold text-slate-500">
                      Model Score
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {(
                        predictionResult.score * 100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </div>

              {/* RESULT DETAILS */}

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">
                    DR Grade
                  </p>

                  <p className="mt-2 text-lg font-black text-slate-900">
                    {predictionResult.prediction}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Class ID: {predictionResult.class_id}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">
                    Referral Priority
                  </p>

                  <p className="mt-2 text-lg font-black text-slate-900">
                    {getReferralPriority(
                      predictionResult.class_id
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">
                    Image Size
                  </p>

                  <p className="mt-2 text-lg font-black text-slate-900">
                    {
                      predictionResult.image_size
                        .width
                    }{' '}
                    ×{' '}
                    {
                      predictionResult.image_size
                        .height
                    }
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    pixels
                  </p>
                </div>
              </div>

              {/* EXPLAINABILITY */}

              {predictionResult.explainability && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                      <Eye className="h-5 w-5 text-teal-700" />
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900">
                        Explainable AI
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {predictionResult.explainability.method}{' '}
                        visualization
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                    <img
                      src={`data:image/png;base64,${predictionResult.explainability.heatmap}`}
                      alt="Grad-CAM explainability heatmap"
                      className="mx-auto max-h-[500px] w-full object-contain"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
                    <span className="rounded-lg bg-slate-100 px-3 py-2">
                      Method:{' '}
                      <strong>
                        {
                          predictionResult
                            .explainability.method
                        }
                      </strong>
                    </span>

                    <span className="rounded-lg bg-slate-100 px-3 py-2">
                      Target layer:{' '}
                      <strong>
                        {
                          predictionResult
                            .explainability
                            .target_layer
                        }
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              {/* SAFETY NOTE */}

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      AI-assisted screening
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-amber-800">
                      This result is intended to support
                      screening and referral decisions. It is
                      not a standalone clinical diagnosis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM ACTIONS */}

          {!predictionResult && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setFormError(null);
                  setCurrentStep(1);
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />

                Back to Patient Info
              </button>

              <button
                type="button"
                id="analyze-image-primary-btn"
                disabled={
                  !imageSrc ||
                  imageQuality === 'POOR' ||
                  isAnalyzing
                }
                onClick={handleAnalyzeClick}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold shadow-md transition-all ${
                  imageSrc &&
                  imageQuality !== 'POOR' &&
                  !isAnalyzing
                    ? 'cursor-pointer bg-teal-700 text-white shadow-teal-900/20 hover:bg-teal-800'
                    : 'cursor-not-allowed bg-slate-200 text-slate-400 shadow-none'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    <span>
                      AI is analyzing...
                    </span>
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4" />

                    <span>
                      {isPoorQuality
                        ? 'Recapture Required'
                        : t.analyzeImage ||
                          'Analyze Image'}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ANALYZING STATUS */}

          {isAnalyzing && (
            <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
                  <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
                </div>

                <div>
                  <p className="font-bold text-teal-900">
                    NetraRakshak AI is analyzing the image
                  </p>

                  <p className="mt-1 text-xs text-teal-700">
                    The fundus image is being sent securely
                    to the local AI backend for screening and
                    Grad-CAM explainability.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DISCLAIMER */}

      <Disclaimer
        lang={lang}
        variant="card"
      />
    </div>
  );
};

export { NewScreeningView };

export default NewScreeningView;