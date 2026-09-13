/*
 * NetraRakshak: Explainable AI for Diabetic Retinopathy Screening
 *
 * Designed for rural and resource-constrained healthcare settings in India.
 */

import React, { useState } from 'react';

import {
  Eye,
  UserPlus,
  LogIn,
  CheckCircle2,
  UserCircle,
} from 'lucide-react';

import {
  NavigationPage,
  Language,
  PatientInfo,
  ImageQualityStatus,
  ScreeningRecord,
  DemoPresetKey,
  DRGrade,
} from './types';

import {
  INITIAL_STATS,
  INITIAL_SCREENINGS,
  DEMO_PRESETS,
} from './data/mockScreenings';

import { SAMPLE_FUNDUS_IMAGES } from './assets/sampleImages';

/* Components */
import { Disclaimer } from './components/Disclaimer';
import Navbar from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import  WelcomeView  from './components/WelcomeView';
import { DashboardView } from './components/DashboardView';
import { NewScreeningView } from './components/NewScreeningView';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ScreeningResultView } from './components/ScreeningResultView';
import { ReportView } from './components/ReportView';
import { ScreeningHistory } from './components/ScreeningHistory';
import { SettingsView } from './components/SettingsView';
import { DemoPresetBar } from './components/DemoPresetBar';
import { ErrorStateModal } from './components/ErrorStateModal';


/* =========================================================
   AUTHENTICATION TYPES / STORAGE
   ========================================================= */

type WorkerAccount = {
  name: string;
  email: string;
  password: string;
  role: string;
};

const ACCOUNTS_STORAGE_KEY =
  'netrarakshak_accounts_v1';

const SESSION_STORAGE_KEY =
  'netrarakshak_current_worker_v1';

const DEFAULT_DEMO_ACCOUNT: WorkerAccount = {
  name: 'Sunita Devi',
  email: 'sunita@netrarakshak.in',
  password: 'Netra@123',
  role: 'Community Health Worker',
};

function getStoredAccounts(): WorkerAccount[] {
  try {
    const stored = localStorage.getItem(
      ACCOUNTS_STORAGE_KEY
    );

    if (stored) {
      const parsed = JSON.parse(stored);

      if (
        Array.isArray(parsed) &&
        parsed.length > 0
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error(
      'Unable to read saved accounts:',
      error
    );
  }

  try {
    localStorage.setItem(
      ACCOUNTS_STORAGE_KEY,
      JSON.stringify([DEFAULT_DEMO_ACCOUNT])
    );
  } catch (error) {
    console.error(
      'Unable to save demo account:',
      error
    );
  }

  return [DEFAULT_DEMO_ACCOUNT];
}

function getStoredWorker(): WorkerAccount | null {
  try {
    const stored = localStorage.getItem(
      SESSION_STORAGE_KEY
    );

    if (!stored) {
      return null;
    }

    const worker = JSON.parse(stored);

    if (
      worker &&
      typeof worker.name === 'string' &&
      typeof worker.email === 'string'
    ) {
      return worker;
    }
  } catch (error) {
    console.error(
      'Unable to restore signed-in worker:',
      error
    );
  }

  return null;
}


/* =========================================================
   PATIENT DISEASE TREND COMPONENT
   ========================================================= */

type TrendVisit = {
  visit: string;
  date: string;
  severity: number;
  label: string;
};

type PatientDiseaseTrendProps = {
  screenings: ScreeningRecord[];
};

const PatientDiseaseTrend = ({
  screenings,
}: PatientDiseaseTrendProps) => {
  const patientMap = new Map<
    string,
    ScreeningRecord
  >();

  screenings.forEach((record) => {
    if (!patientMap.has(record.patientCode)) {
      patientMap.set(
        record.patientCode,
        record
      );
    }
  });

  const patients = Array.from(
    patientMap.values()
  );

  const [
    selectedPatientCode,
    setSelectedPatientCode,
  ] = useState<string>(
    patients[0]?.patientCode ||
      'MH-PHC-0891'
  );

  const effectivePatientCode = patients.some(
    (patient) =>
      patient.patientCode ===
      selectedPatientCode
  )
    ? selectedPatientCode
    : patients[0]?.patientCode ||
      'MH-PHC-0891';

  const patientRecords = screenings
    .filter(
      (record) =>
        record.patientCode ===
        effectivePatientCode
    )
    .sort(
      (a, b) =>
        new Date(
          a.screeningDate
        ).getTime() -
        new Date(
          b.screeningDate
        ).getTime()
    )
    .slice(-6);

  const getSeverity = (
    grade: string
  ): number => {
    switch (grade) {
      case 'NO_DR':
        return 0;
      case 'MILD_DR':
        return 1;
      case 'MODERATE_DR':
        return 2;
      case 'SEVERE_DR':
        return 3;
      case 'PROLIFERATIVE_DR':
        return 3;
      default:
        return 0;
    }
  };

  const getLabel = (
    grade: string
  ): string => {
    switch (grade) {
      case 'NO_DR':
        return 'No DR';
      case 'MILD_DR':
        return 'Mild DR';
      case 'MODERATE_DR':
        return 'Moderate DR';
      case 'SEVERE_DR':
        return 'Severe DR';
      case 'PROLIFERATIVE_DR':
        return 'Proliferative DR';
      default:
        return 'Unknown';
    }
  };

  const trendData: TrendVisit[] =
    patientRecords.map(
      (record, index) => ({
        visit: `Visit ${index + 1}`,
        date: record.screeningDate,
        severity: getSeverity(
          record.drGrade
        ),
        label: getLabel(
          record.drGrade
        ),
      })
    );

  if (trendData.length === 0) {
    return (
      <section className="px-4 md:px-8 lg:px-10 mt-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-7">

            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl">
                📈
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                  Patient Disease Trend
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Longitudinal monitoring across multiple screening visits
                </p>
              </div>
            </div>

            {patients.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Select Patient
                </label>

                <select
                  value={effectivePatientCode}
                  onChange={(e) =>
                    setSelectedPatientCode(
                      e.target.value
                    )
                  }
                  className="w-full md:max-w-md px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                >
                  {patients.map(
                    (patient) => (
                      <option
                        key={
                          patient.patientCode
                        }
                        value={
                          patient.patientCode
                        }
                      >
                        {patient.patientName} —{' '}
                        {patient.patientCode}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center">
              <p className="font-bold text-slate-700">
                No screening visits available for this patient.
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Complete a screening for this patient to build their longitudinal disease trend.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const firstSeverity =
    trendData[0]?.severity ?? 0;

  const latestSeverity =
    trendData[
      trendData.length - 1
    ]?.severity ?? 0;

  let trendStatus = 'Stable';

  let trendDescription =
    'Disease severity has remained stable across the available screening visits.';

  let trendIcon = '→';

  if (latestSeverity > firstSeverity) {
    trendStatus = 'Increasing';
    trendDescription =
      'Disease severity has increased across the available screening visits.';
    trendIcon = '↑';
  } else if (
    latestSeverity < firstSeverity
  ) {
    trendStatus = 'Improving';
    trendDescription =
      'Disease severity has decreased across the available screening visits.';
    trendIcon = '↓';
  }

  const latestRecord =
    trendData[
      trendData.length - 1
    ];

  const selectedPatient =
    patients.find(
      (patient) =>
        patient.patientCode ===
        effectivePatientCode
    );

  return (
    <section className="px-4 md:px-8 lg:px-10 mt-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-6 md:p-7 border-b border-slate-100">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

            <div>
              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl">
                  📈
                </div>

                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    Patient Disease Trend
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Longitudinal monitoring across multiple screening visits
                  </p>
                </div>

              </div>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                trendStatus === 'Increasing'
                  ? 'bg-amber-50 text-amber-700'
                  : trendStatus === 'Improving'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              <span>{trendIcon}</span>
              {trendStatus}
            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">

            <div className="flex flex-col md:flex-row md:items-end gap-4">

              <div className="flex-1">

                <label
                  htmlFor="trend-patient"
                  className="block text-xs text-slate-500 uppercase tracking-wide font-bold mb-2"
                >
                  Select Patient
                </label>

                <select
                  id="trend-patient"
                  value={effectivePatientCode}
                  onChange={(e) =>
                    setSelectedPatientCode(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                >
                  {patients.map(
                    (patient) => (
                      <option
                        key={
                          patient.patientCode
                        }
                        value={
                          patient.patientCode
                        }
                      >
                        {patient.patientName} —{' '}
                        {patient.patientCode}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <UserCircle className="w-4 h-4 text-teal-600" />
                Choose a patient to view their screening history
              </div>

            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">
                Patient
              </p>

              <p className="text-base font-bold text-slate-900 mt-1">
                {selectedPatient?.patientName ||
                  'Unknown Patient'}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {effectivePatientCode}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">
                Screening Visits
              </p>

              <p className="text-base font-bold text-slate-900 mt-1">
                {trendData.length} visits
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">
                Latest Assessment
              </p>

              <p className="text-base font-bold text-slate-900 mt-1">
                {latestRecord?.label ||
                  'Not available'}
              </p>
            </div>

          </div>
        </div>

        <div className="p-6 md:p-7">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h3 className="font-black text-slate-900">
                Disease Progression
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Severity level across patient visits
              </p>
            </div>

            <div className="text-xs text-slate-400">
              Higher level = greater severity
            </div>

          </div>

          <div className="relative bg-slate-50 rounded-2xl p-5 md:p-7">

            <div className="absolute left-2 md:left-4 top-6 bottom-12 flex flex-col justify-between text-[10px] md:text-xs text-slate-400 font-semibold">
              <span>Severe</span>
              <span>Moderate</span>
              <span>Mild</span>
              <span>No DR</span>
            </div>

            <div className="ml-14 md:ml-20">

              <div className="relative h-56">

                <div className="absolute left-0 right-0 top-0 border-t border-dashed border-slate-200" />
                <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-slate-200" />
                <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-slate-200" />
                <div className="absolute left-0 right-0 bottom-0 border-t border-dashed border-slate-200" />

                <div className="absolute inset-0 flex items-end justify-around">

                  {trendData.map(
                    (visit, index) => {

                      const bottom =
                        visit.severity === 0
                          ? 0
                          : visit.severity === 1
                          ? 33
                          : visit.severity === 2
                          ? 66
                          : 100;

                      const nextVisit =
                        trendData[index + 1];

                      const nextBottom =
                        nextVisit
                          ? nextVisit.severity === 0
                            ? 0
                            : nextVisit.severity === 1
                            ? 33
                            : nextVisit.severity === 2
                            ? 66
                            : 100
                          : bottom;

                      return (
                        <div
                          key={`${visit.visit}-${index}`}
                          className="relative h-full flex-1 flex items-end justify-center"
                        >

                          {index <
                            trendData.length - 1 && (
                            <div
                              className="absolute h-0.5 bg-teal-300 origin-left"
                              style={{
                                left: '50%',
                                bottom: `${bottom}%`,
                                width: '100%',
                                transform: `rotate(${
                                  Math.atan2(
                                    nextBottom -
                                      bottom,
                                    100
                                  ) *
                                  (180 / Math.PI)
                                }deg)`,
                              }}
                            />
                          )}

                          <div
                            className="absolute -translate-x-1/2"
                            style={{
                              left: '50%',
                              bottom: `${bottom}%`,
                            }}
                          >

                            <div className="relative">

                              <div className="absolute -inset-2 rounded-full bg-teal-100 opacity-60" />

                              <div className="relative w-5 h-5 rounded-full bg-teal-700 border-4 border-white shadow-md" />

                            </div>

                            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">

                              <div className="bg-white border border-slate-200 shadow-sm rounded-lg px-2 py-1 text-[10px] md:text-xs font-bold text-slate-700">
                                {visit.label}
                              </div>

                            </div>

                          </div>
                        </div>
                      );
                    }
                  )}

                </div>
              </div>

              <div className="flex justify-around mt-3">

                {trendData.map(
                  (visit, index) => (
                    <div
                      key={`date-${index}`}
                      className="flex-1 text-center"
                    >
                      <p className="text-xs font-bold text-slate-700">
                        {visit.visit}
                      </p>

                      <p className="text-[10px] text-slate-400 mt-1">
                        {visit.date}
                      </p>
                    </div>
                  )
                )}

              </div>

            </div>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              trendData.length >= 3
                ? 'lg:grid-cols-3'
                : ''
            } gap-3 mt-5`}
          >
            {trendData.map(
              (visit, index) => (
                <div
                  key={`card-${index}`}
                  className="rounded-2xl border border-slate-200 p-4 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      {visit.visit}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {visit.date}
                    </span>
                  </div>

                  <p className="font-black text-slate-900 mt-3 text-sm">
                    {visit.label}
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    Screening record
                  </p>
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                Initial Assessment
              </p>

              <p className="text-lg font-black text-slate-900 mt-2">
                {trendData[0]?.label}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {trendData[0]?.date}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                Latest Assessment
              </p>

              <p className="text-lg font-black text-slate-900 mt-2">
                {latestRecord?.label}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {latestRecord?.date}
              </p>
            </div>

            <div
              className={`rounded-2xl p-5 ${
                trendStatus === 'Increasing'
                  ? 'bg-amber-50'
                  : trendStatus === 'Improving'
                  ? 'bg-emerald-50'
                  : 'bg-blue-50'
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wide">
                Overall Trend
              </p>

              <p className="text-lg font-black mt-2">
                {trendIcon} {trendStatus}
              </p>

              <p className="text-xs mt-1 opacity-75">
                {trendDescription}
              </p>
            </div>

          </div>

          <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700">
                Prototype note:
              </strong>{' '}
              Longitudinal trend visualization is intended to support screening follow-up. It is not a clinical diagnosis and should be reviewed by a qualified eye-care professional.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};


/* =========================================================
   MAIN APP
   ========================================================= */

export default function App() {

  const [currentPage, setCurrentPage] =
  useState<NavigationPage>('dashboard');

  const [aiResult, setAiResult] =
    useState<any>(null);

  /*
   * IMPORTANT:
   * Restore the previous signed-in worker from localStorage.
   */
  const [currentWorker, setCurrentWorker] =
  useState<WorkerAccount | null>(null);

const [isLoggedIn, setIsLoggedIn] =
  useState<boolean>(false);

  const [lang, setLang] =
    useState<Language>('en');

  const [currentPresetKey, setCurrentPresetKey] =
    useState<DemoPresetKey | null>(
      'moderate'
    );


  /* =========================================================
     AUTH STATE
     ========================================================= */

  const [authMode, setAuthMode] =
    useState<'signin' | 'signup'>(
      'signin'
    );

  const [accountName, setAccountName] =
    useState('');

  const [accountEmail, setAccountEmail] =
    useState('');

  const [accountPassword, setAccountPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [authMessage, setAuthMessage] =
    useState('');

  const [authError, setAuthError] =
    useState('');


  /* =========================================================
     STATS & RECORDS STATE
     ========================================================= */

  const [stats, setStats] =
    useState(INITIAL_STATS);

  const [screenings, setScreenings] =
    useState<ScreeningRecord[]>(
      INITIAL_SCREENINGS
    );

  const [activeRecord, setActiveRecord] =
    useState<ScreeningRecord>(
      INITIAL_SCREENINGS[0]
    );


  /* =========================================================
     NEW SCREENING WORKFLOW STATE
     ========================================================= */

  const [patientInfo, setPatientInfo] =
    useState<PatientInfo>({
      patientName: 'Sunita Sharma',
      patientCode: 'MH-PHC-0891',
      age: 58,
      sex: 'Female',
      centerLocation:
        'PHC Shirpur, Dist. Dhule',
      diabetesDurationYears: 7,
    });

  const [fundusImage, setFundusImage] =
    useState<string | null>(
      SAMPLE_FUNDUS_IMAGES.moderate
    );

  const [imageFileName, setImageFileName] =
    useState<string>(
      'fundus_diabetic_microvascular_changes.jpg'
    );

  const [imageFileSize, setImageFileSize] =
    useState<string>('3.1 MB');

  const [uploadProgress, setUploadProgress] =
    useState<number>(100);

  const [imageQuality, setImageQuality] =
    useState<ImageQualityStatus>('GOOD');

  const [qualityIssues, setQualityIssues] =
    useState<string[]>([]);


  /* =========================================================
     MODALS
     ========================================================= */

  const [isErrorModalOpen, setIsErrorModalOpen] =
    useState(false);


  /* =========================================================
     APPLY DEMO PRESET
     ========================================================= */

  const handleApplyPreset = (
    presetKey: DemoPresetKey
  ) => {

    setCurrentPresetKey(
      presetKey
    );

    if (presetKey === 'error_state') {
      setIsErrorModalOpen(true);
      return;
    }

    if (
      presetKey ===
      'analysis_in_progress'
    ) {
      setFundusImage(
        SAMPLE_FUNDUS_IMAGES.moderate
      );

      setImageFileName(
        'fundus_active_scan.jpg'
      );

      setImageQuality('GOOD');

      setCurrentPage('analysis');

      return;
    }

    const preset =
      DEMO_PRESETS.find(
        (p) => p.key === presetKey
      );

    if (!preset) return;


    /* Poor quality */

    if (
      presetKey === 'poor_quality'
    ) {

      setFundusImage(
        SAMPLE_FUNDUS_IMAGES.poorQuality
      );

      setImageFileName(
        'fundus_substandard_illumination.jpg'
      );

      setImageFileSize('1.8 MB');

      setImageQuality('POOR');

      setQualityIssues(
        preset.record.qualityIssues || [
          'Severe lens blur',
          'Optical illumination haze',
        ]
      );

      setPatientInfo({
        patientName:
          preset.record.patientName ||
          'Demo Patient',

        patientCode:
          preset.record.patientCode ||
          'MH-24-0925',

        age:
          preset.record.patientAge ||
          61,

        sex:
          preset.record.patientSex ||
          'Female',

        centerLocation:
          'PHC Shirpur (Sub-centre)',
      });

      setCurrentPage(
        'new_screening'
      );

      return;
    }


    /* Normal / Mild / Moderate / Severe */

    const targetImage =
      presetKey === 'normal'
        ? SAMPLE_FUNDUS_IMAGES.normal
        : SAMPLE_FUNDUS_IMAGES.moderate;

    setFundusImage(targetImage);

    setImageFileName(
      `fundus_${presetKey}_sample.jpg`
    );

    setImageFileSize('2.8 MB');

    setImageQuality('GOOD');

    setQualityIssues([]);

    const recordObj: ScreeningRecord = {
      id:
        `SCR-${Date.now()
          .toString()
          .slice(-4)}`,

      patientName:
        preset.record.patientName ||
        'Demo Patient',

      patientCode:
        preset.record.patientCode ||
        'MH-24-0901',

      screeningDate:
        '2026-09-08',

      patientAge:
        Number(
          preset.record.patientAge
        ) || 54,

      patientSex:
        preset.record.patientSex ||
        'Female',

      centerLocation:
        'PHC Shirpur, Dist. Dhule',

      examinerName:
        currentWorker?.name
          ? `${currentWorker.name} (CHW)`
          : 'Health Worker',

      fundusImage:
        targetImage,

      imageQuality:
        'GOOD',

      drGrade:
        preset.record.drGrade as DRGrade,

      drGradeLabel:
        preset.record.drGradeLabel ||
        'Diabetic Retinopathy Screening',

      confidenceScore:
        preset.record.confidenceScore ||
        0.85,

      classProbabilities:
        preset.record.classProbabilities ||
        {
          noDR: 0.1,
          mild: 0.1,
          moderate: 0.7,
          severe: 0.1,
        },

      referralPriority:
        preset.record.referralPriority ||
        'HIGH',

      status:
        presetKey === 'normal'
          ? 'Completed'
          : 'Referred',

      clinicalNextStep:
        preset.record.clinicalNextStep ||
        'Clinical evaluation recommended.',

      notes:
        preset.record.notes ||
        'Screening evaluated by NetraRakshak model.',

      syncedToCloud:
        true,
    };

    setActiveRecord(recordObj);

    setCurrentPage('result');
  };


  /* =========================================================
     RUN AI ANALYSIS
     ========================================================= */

  const handleRunAnalysis = async () => {

    if (!fundusImage) return;

    if (imageQuality === 'POOR') {
      return;
    }

    try {

      const response =
        await fetch(fundusImage);

      if (!response.ok) {
        throw new Error(
          'Could not read the selected image.'
        );
      }

      const blob =
        await response.blob();

      const file =
        new File(
          [blob],
          imageFileName ||
            'fundus-image.jpg',
          {
            type:
              blob.type ||
              'image/jpeg',
          }
        );

      const formData =
        new FormData();

      formData.append(
        'file',
        file
      );

      const aiResponse =
        await fetch(
          'http://127.0.0.1:8000/predict',
          {
            method: 'POST',
            body: formData,
          }
        );

      if (!aiResponse.ok) {
        throw new Error(
          `AI backend returned ${aiResponse.status}`
        );
      }

      const result =
        await aiResponse.json();

      console.log(
        'NetraRakshak AI Result:',
        result
      );

      /*
       * Save the complete backend response.
       * This includes the real Grad-CAM data.
       */

      setAiResult(result);

      setCurrentPage('analysis');

    } catch (error) {

      console.error(
        'AI analysis failed:',
        error
      );

      window.alert(
        'Unable to connect to the NetraRakshak AI backend. Please make sure the Python backend is running on port 8000.'
      );
    }
  };


  /* =========================================================
     ANALYSIS COMPLETED
     ========================================================= */

  const handleAnalysisCompleted = () => {

    if (!aiResult) {
      window.alert(
        'No AI result is available. Please run the analysis again.'
      );
      return;
    }

    const prediction =
      String(
        aiResult.prediction || ''
      ).toLowerCase();

    let drGrade:
      ScreeningRecord['drGrade'] =
      'NO_DR';

    let drGradeLabel =
      'No Apparent DR Detected';


    if (
      prediction.includes(
        'proliferative'
      )
    ) {

      drGrade =
        'PROLIFERATIVE_DR';

      drGradeLabel =
        'Proliferative DR Suspected';

    } else if (
      prediction.includes(
        'severe'
      )
    ) {

      drGrade =
        'SEVERE_DR';

      drGradeLabel =
        'Severe Non-Proliferative DR Suspected';

    } else if (
      prediction.includes(
        'moderate'
      )
    ) {

      drGrade =
        'MODERATE_DR';

      drGradeLabel =
        'Moderate Non-Proliferative DR Suspected';

    } else if (
      prediction.includes(
        'mild'
      )
    ) {

      drGrade =
        'MILD_DR';

      drGradeLabel =
        'Mild DR Suspected';

    } else {

      drGrade =
        'NO_DR';

      drGradeLabel =
        'No Apparent DR Detected';
    }


    const isNormal =
      drGrade === 'NO_DR';


    /* REAL GRAD-CAM DATA */

    const realExplainability =
      aiResult.explainability
        ? {
            method:
              aiResult.explainability.method ||
              'Grad-CAM',

            targetLayer:
              aiResult.explainability.target_layer ||
              '',

            heatmap:
              aiResult.explainability.heatmap ||
              '',

            heatmapWidth:
              Number(
                aiResult.explainability.heatmap_width
              ) || 0,

            heatmapHeight:
              Number(
                aiResult.explainability.heatmap_height
              ) || 0,
          }
        : undefined;


    /* CREATE FINAL SCREENING RECORD */

    const newRec: ScreeningRecord = {

      id:
        `SCR-2026-${Math.floor(
          1000 +
          Math.random() * 9000
        )}`,

      patientName:
        patientInfo.patientName ||
        'Unnamed Patient',

      patientCode:
        patientInfo.patientCode ||
        'MH-24-0891',

      screeningDate:
        new Date()
          .toISOString()
          .split('T')[0],

      patientAge:
        Number(
          patientInfo.age
        ) || 54,

      patientSex:
        patientInfo.sex,

      centerLocation:
        patientInfo.centerLocation ||
        'PHC Shirpur, Dist. Dhule',

      /*
       * ACTUAL SIGNED-IN WORKER
       */
      examinerName:
        currentWorker?.name
          ? `${currentWorker.name} (CHW)`
          : 'Health Worker',

      fundusImage:
        fundusImage || '',

      imageQuality:
        imageQuality,

      qualityIssues:
        imageQuality === 'POOR'
          ? [
              'Potential focus blur or uneven retinal illumination detected.',
            ]
          : undefined,

      drGrade,

      drGradeLabel,

      /*
       * Current model produces an ordinal score,
       * not a calibrated confidence percentage.
       */
      confidenceScore: 0,

      classProbabilities: {
        noDR: 0,
        mild: 0,
        moderate: 0,
        severe: 0,
      },

      referralPriority:
        isNormal
          ? 'LOW'
          : 'HIGH',

      status:
        isNormal
          ? 'Completed'
          : 'Referred',

      clinicalNextStep:
        isNormal
          ? 'Routine screening follow-up may be considered according to clinical guidance.'
          : 'Clinical evaluation by a qualified eye-care professional is recommended based on this screening result.',

      /*
       * REAL GRAD-CAM
       */
      explainability:
        realExplainability,

      notes:
        `NetraRakshak AI model prediction: ${aiResult.prediction}. Model score: ${aiResult.score}.`,

      syncedToCloud:
        false,
    };


    console.log(
      'Final NetraRakshak screening record:',
      newRec
    );

    if (realExplainability) {

      console.log(
        'REAL GRAD-CAM RECEIVED:',
        {
          method:
            realExplainability.method,

          targetLayer:
            realExplainability.targetLayer,

          heatmapAvailable:
            Boolean(
              realExplainability.heatmap
            ),

          heatmapWidth:
            realExplainability.heatmapWidth,

          heatmapHeight:
            realExplainability.heatmapHeight,
        }
      );

    } else {

      console.warn(
        'No Grad-CAM explainability data was returned by the backend.'
      );
    }


    setActiveRecord(
      newRec
    );

    setScreenings(
      (prev) => [
        newRec,
        ...prev,
      ]
    );

    setStats(
      (prev) => ({
        ...prev,

        totalScreened:
          prev.totalScreened + 1,

        noDR:
          isNormal
            ? prev.noDR + 1
            : prev.noDR,

        needsReview:
          !isNormal
            ? prev.needsReview + 1
            : prev.needsReview,

        referrals:
          !isNormal
            ? prev.referrals + 1
            : prev.referrals,
      })
    );

    setCurrentPage('result');
  };


  /* =========================================================
     IMAGE SELECTED
     ========================================================= */

  const handleImageSelected = (
    src: string,
    name: string,
    sizeText: string,
    quality: ImageQualityStatus
  ) => {

    setFundusImage(src);

    setImageFileName(name);

    setImageFileSize(sizeText);

    setImageQuality(quality);

    setUploadProgress(100);

    if (quality === 'POOR') {

      setQualityIssues([
        'Potential focus blur or uneven retinal illumination detected.',
      ]);

    } else {

      setQualityIssues([]);
    }
  };


  /* =========================================================
     REMOVE IMAGE
     ========================================================= */

  const handleImageRemoved = () => {

    setFundusImage(null);

    setImageFileName('');

    setImageFileSize('');

    setImageQuality(
      'UNCHECKED'
    );

    setQualityIssues([]);

    setUploadProgress(0);
  };


  /* =========================================================
     START NEW SCREENING
     ========================================================= */

  const handleStartNewScreening = () => {

    setPatientInfo({
      patientName: '',

      patientCode:
        `MH-24-${Math.floor(
          1000 +
          Math.random() * 9000
        )}`,

      age: '',

      sex: 'Female',

      centerLocation:
        'PHC Shirpur, Dist. Dhule',
    });

    setFundusImage(null);

    setImageFileName('');

    setImageFileSize('');

    setImageQuality(
      'UNCHECKED'
    );

    setQualityIssues([]);

    setUploadProgress(0);

    setAiResult(null);

    setCurrentPage(
      'new_screening'
    );
  };


  /* =========================================================
     SIGN IN
     ========================================================= */

  const handleSignIn = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setAuthError('');
    setAuthMessage('');

    const enteredEmail =
      accountEmail
        .trim()
        .toLowerCase();

    const enteredPassword =
      accountPassword;

    if (
      !enteredEmail ||
      !enteredPassword
    ) {

      setAuthError(
        'Please enter your email/User ID and password.'
      );

      return;
    }


    /*
     * IMPORTANT:
     * Read ALL previously created accounts.
     */
    const accounts =
      getStoredAccounts();


    const account =
      accounts.find(
        (savedAccount) =>
          savedAccount.email
            .trim()
            .toLowerCase() ===
          enteredEmail
      );


    if (!account) {

      setAuthError(
        'No account found with this Email / User ID. Please create an account first.'
      );

      return;
    }


    /*
     * Check password.
     */
    if (
      account.password !==
      enteredPassword
    ) {

      setAuthError(
        'Incorrect password. Please try again.'
      );

      return;
    }


    /*
     * LOGIN SUCCESSFUL
     */
    const loggedInWorker:
      WorkerAccount = {
        name:
          account.name,

        email:
          account.email,

        password:
          account.password,

        role:
          account.role ||
          'Community Health Worker',
      };


    /*
     * Put the actual person's name into React state.
     */
    setCurrentWorker(
      loggedInWorker
    );

    setIsLoggedIn(true);


    /*
     * IMPORTANT:
     * Remember the currently signed-in person.
     */
    


    setAccountPassword('');

    setConfirmPassword('');

    setAuthError('');

    setAuthMessage('');

    setCurrentPage(
      'welcome'
    );
  };


  /* =========================================================
     CREATE ACCOUNT
     ========================================================= */

  const handleCreateAccount = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setAuthError('');
    setAuthMessage('');


    const name =
      accountName.trim();

    const email =
      accountEmail
        .trim()
        .toLowerCase();

    const password =
      accountPassword;


    if (!name) {

      setAuthError(
        'Please enter your full name.'
      );

      return;
    }


    if (!email) {

      setAuthError(
        'Please enter your email address.'
      );

      return;
    }


    if (
      password.length < 6
    ) {

      setAuthError(
        'Password must contain at least 6 characters.'
      );

      return;
    }


    if (
      password !==
      confirmPassword
    ) {

      setAuthError(
        'Passwords do not match.'
      );

      return;
    }


    /*
     * Read existing accounts.
     */
    const accounts =
      getStoredAccounts();


    /*
     * Prevent duplicate email.
     */
    const alreadyExists =
      accounts.some(
        (account) =>
          account.email
            .trim()
            .toLowerCase() ===
          email
      );


    if (alreadyExists) {

      setAuthError(
        'An account with this email already exists. Please sign in.'
      );

      return;
    }


    /*
     * Create the new account.
     */
    const newAccount:
      WorkerAccount = {

      name,

      email,

      password,

      role:
        'Community Health Worker',
    };


    const updatedAccounts = [
      ...accounts,
      newAccount,
    ];


    try {

      /*
       * SAVE ACCOUNT PERMANENTLY
       */
      localStorage.setItem(
        ACCOUNTS_STORAGE_KEY,
        JSON.stringify(
          updatedAccounts
        )
      );

    } catch (error) {

      console.error(
        'Unable to save account:',
        error
      );

      setAuthError(
        'Unable to save the account in this browser.'
      );

      return;
    }


    /*
     * Move user to Sign In.
     */
    setAccountEmail(email);

    setAccountPassword('');

    setConfirmPassword('');

    setAccountName('');

    setAuthMode(
      'signin'
    );


    setAuthMessage(
      `Account created successfully for ${name}. Please sign in with your password.`
    );
  };


  /* =========================================================
     LOGOUT
     ========================================================= */

  const handleLogout = () => {

    setIsLoggedIn(false);

    setCurrentWorker(null);


    /*
     * IMPORTANT:
     *
     * Only remove the CURRENT LOGIN SESSION.
     *
     * The account remains saved.
     */
    


    setAccountPassword('');

    setConfirmPassword('');

    setAuthError('');

    setAuthMessage('');

    setAuthMode(
      'signin'
    );

    setCurrentPage(
      'dashboard'
    );
  };


  /* =========================================================
     LOGIN PAGE
     ========================================================= */

  if (!isLoggedIn) {

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-6">

        <div className="w-full max-w-md">

          <div className="text-center mb-6">

            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-xl">
              <Eye className="w-9 h-9" />
            </div>

            <h1 className="text-3xl font-black text-white">
              NetraRakshak
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              AI-Assisted Diabetic Retinopathy Screening
            </p>

          </div>


          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Auth tabs */}

            <div className="grid grid-cols-2 border-b border-slate-200">

              <button
                type="button"
                onClick={() => {
                  setAuthMode(
                    'signin'
                  );

                  setAuthError('');

                  setAuthMessage('');
                }}
                className={`py-4 text-sm font-bold transition flex items-center justify-center gap-2 ${
                  authMode === 'signin'
                    ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>


              <button
                type="button"
                onClick={() => {
                  setAuthMode(
                    'signup'
                  );

                  setAuthError('');

                  setAuthMessage('');
                }}
                className={`py-4 text-sm font-bold transition flex items-center justify-center gap-2 ${
                  authMode === 'signup'
                    ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Create Account
              </button>

            </div>


            <div className="p-7 md:p-8">

              <div className="mb-6">

                <h2 className="text-xl font-black text-slate-900">
                  {authMode === 'signin'
                    ? 'Welcome back'
                    : 'Create your account'}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {authMode === 'signin'
                    ? 'Sign in to access your screening dashboard.'
                    : 'Set up your health-worker account for the prototype.'}
                </p>

              </div>


              {/* Success message */}

              {authMessage && (
                <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex gap-3">

                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />

                  <p className="text-sm text-emerald-700 font-medium">
                    {authMessage}
                  </p>

                </div>
              )}


              {/* Error message */}

              {authError && (
                <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3.5">

                  <p className="text-sm text-red-700 font-medium">
                    {authError}
                  </p>

                </div>
              )}


              {/* SIGN IN FORM */}

              {authMode === 'signin' && (
                <form
                  onSubmit={
                    handleSignIn
                  }
                  className="space-y-5"
                >

                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Email / User ID
                    </label>

                    <input
                      type="text"
                      value={
                        accountEmail
                      }
                      onChange={(e) =>
                        setAccountEmail(
                          e.target.value
                        )
                      }
                      required
                      placeholder="Enter your email or user ID"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Password
                    </label>

                    <input
                      type="password"
                      value={
                        accountPassword
                      }
                      onChange={(e) =>
                        setAccountPassword(
                          e.target.value
                        )
                      }
                      required
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                    />

                  </div>


                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition shadow-lg shadow-teal-900/10"
                  >
                    Sign In
                  </button>


                  {/* Demo credentials */}

                  <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">

                    <p className="text-xs font-bold text-teal-800">
                      SIH Demo Account
                    </p>

                    <p className="text-xs text-teal-700 mt-2">
                      User ID: sunita@netrarakshak.in
                    </p>

                    <p className="text-xs text-teal-700 mt-1">
                      Password: Netra@123
                    </p>

                  </div>

                </form>
              )}


              {/* SIGN UP FORM */}

              {authMode === 'signup' && (
                <form
                  onSubmit={
                    handleCreateAccount
                  }
                  className="space-y-4"
                >

                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={
                        accountName
                      }
                      onChange={(e) =>
                        setAccountName(
                          e.target.value
                        )
                      }
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      value={
                        accountEmail
                      }
                      onChange={(e) =>
                        setAccountEmail(
                          e.target.value
                        )
                      }
                      required
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Password
                    </label>

                    <input
                      type="password"
                      value={
                        accountPassword
                      }
                      onChange={(e) =>
                        setAccountPassword(
                          e.target.value
                        )
                      }
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      value={
                        confirmPassword
                      }
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      required
                      minLength={6}
                      placeholder="Re-enter your password"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition"
                    />

                  </div>


                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </button>

                </form>
              )}


              <p className="text-center text-xs text-slate-400 mt-6">
                NetraRakshak prototype • SIH Demonstration
              </p>

            </div>
          </div>

        </div>
      </div>
    );
  }


  /* =========================================================
     AUTHENTICATED APPLICATION
     ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      <Disclaimer
        lang={lang}
        variant="banner"
      />


      <DemoPresetBar
        currentPreset={
          currentPresetKey
        }
        onApplyPreset={
          handleApplyPreset
        }
      />


      {currentPage !== 'welcome' && (
       <Navbar
  userName={currentWorker?.name}
  lang={lang}
  onLanguageToggle={setLang}
  currentPage={currentPage}
  onNavigate={setCurrentPage}
  onLogout={handleLogout}
/>
      )}


      <div className="flex-1 flex w-full">

        {currentPage !== 'welcome' && (
          <Sidebar
            currentPage={
              currentPage
            }
            onNavigate={
              setCurrentPage
            }
            lang={lang}
          />
        )}


        <main className="flex-1 min-w-0 pb-16 md:pb-8">

          {/* WELCOME */}

          {currentPage === 'welcome' && (
            <WelcomeView
              lang={lang}
          
              onStartScreening={
                handleStartNewScreening
              }
              onSignIn={() => {
                setCurrentPage(
                  'dashboard'
                );
              }}
            />
          )}


          {/* DASHBOARD */}

          {currentPage === 'dashboard' && (
            <>
              <DashboardView
                stats={stats}
                recentScreenings={
                  screenings
                }
                lang={lang}
                onNavigate={
                  setCurrentPage
                }
                onSelectRecord={(
                  rec
                ) => {
                  setActiveRecord(
                    rec
                  );

                  setCurrentPage(
                    'result'
                  );
                }}
              />

              <PatientDiseaseTrend
                screenings={
                  screenings
                }
              />
            </>
          )}


          {/* NEW SCREENING */}

          {currentPage ===
            'new_screening' && (
            <NewScreeningView
              patientInfo={
                patientInfo
              }
              onPatientInfoChange={(
                updated
              ) =>
                setPatientInfo(
                  (prev) => ({
                    ...prev,
                    ...updated,
                  })
                )
              }
              imageSrc={
                fundusImage
              }
              fileName={
                imageFileName
              }
              fileSizeText={
                imageFileSize
              }
              uploadProgress={
                uploadProgress
              }
              imageQuality={
                imageQuality
              }
              qualityIssues={
                qualityIssues
              }
              onImageSelected={
                handleImageSelected
              }
              onImageRemoved={
                handleImageRemoved
              }
              onRunAnalysis={
                handleRunAnalysis
              }
              lang={lang}
              onCancel={() =>
                setCurrentPage(
                  'dashboard'
                )
              }
            />
          )}


          {/* ANALYSIS */}

          {currentPage ===
            'analysis' &&
            fundusImage && (
              <AnalysisProgress
                imageSrc={
                  fundusImage
                }
                lang={lang}
                onComplete={
                  handleAnalysisCompleted
                }
                onCancel={() =>
                  setCurrentPage(
                    'new_screening'
                  )
                }
              />
            )}


          {/* RESULT */}

          {currentPage ===
            'result' && (
            <ScreeningResultView
              record={
                activeRecord
              }
              lang={lang}
              onViewReport={() =>
                setCurrentPage(
                  'report'
                )
              }
              onNewScreening={
                handleStartNewScreening
              }
              onBackToHistory={() =>
                setCurrentPage(
                  'dashboard'
                )
              }
            />
          )}


          {/* REPORT */}

          {currentPage ===
            'report' && (
            <ReportView
              record={
                activeRecord
              }
              lang={lang}
              onBack={() =>
                setCurrentPage(
                  'result'
                )
              }
            />
          )}


          {/* HISTORY */}

          {currentPage ===
            'history' && (
            <ScreeningHistory
              screenings={
                screenings
              }
              lang={lang}
              onSelectRecord={(
                rec
              ) => {
                setActiveRecord(
                  rec
                );

                setCurrentPage(
                  'result'
                );
              }}
              onViewReport={(
                rec
              ) => {
                setActiveRecord(
                  rec
                );

                setCurrentPage(
                  'report'
                );
              }}
            />
          )}


          {/* SETTINGS */}

          {currentPage ===
            'settings' && (
            <SettingsView
              lang={lang}
              onLanguageChange={
                setLang
              }
            />
          )}

        </main>
      </div>


      {/* ERROR MODAL */}

      <ErrorStateModal
        isOpen={
          isErrorModalOpen
        }
        onRetry={() => {
          setIsErrorModalOpen(
            false
          );

          handleRunAnalysis();
        }}
        onDismiss={() =>
          setIsErrorModalOpen(
            false
          )
        }
        lang={lang}
      />

    </div>
  );
}