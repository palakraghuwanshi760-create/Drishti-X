/**
 * Drishti-X: Explainable AI for Diabetic Retinopathy Screening
 * Designed for rural and resource-constrained healthcare settings in India.
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationPage, 
  Language, 
  PatientInfo, 
  ImageQualityStatus, 
  ScreeningRecord,
  DemoPresetKey,
  DRGrade
} from './types';
import { translations } from './i18n/translations';
import { INITIAL_STATS, INITIAL_SCREENINGS, DEMO_PRESETS } from './data/mockScreenings';
import { SAMPLE_FUNDUS_IMAGES } from './assets/sampleImages';

// Components
import { Disclaimer } from './components/Disclaimer';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WelcomeView } from './components/WelcomeView';
import { DashboardView } from './components/DashboardView';
import { NewScreeningView } from './components/NewScreeningView';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ScreeningResultView } from './components/ScreeningResultView';
import { ReportView } from './components/ReportView';
import { ScreeningHistory } from './components/ScreeningHistory';
import { SettingsView } from './components/SettingsView';
import { DemoPresetBar } from './components/DemoPresetBar';
import { ErrorStateModal } from './components/ErrorStateModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [currentPresetKey, setCurrentPresetKey] = useState<DemoPresetKey | null>('moderate');

  // Stats & Records State
  const [stats, setStats] = useState(INITIAL_STATS);
  const [screenings, setScreenings] = useState<ScreeningRecord[]>(INITIAL_SCREENINGS);
  const [activeRecord, setActiveRecord] = useState<ScreeningRecord>(INITIAL_SCREENINGS[0]);

  // New Screening Workflow State
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    patientCode: 'MH-PHC-0891',
    age: 58,
    sex: 'Female',
    centerLocation: 'PHC Shirpur, Dist. Dhule',
    diabetesDurationYears: 7,
  });

  const [fundusImage, setFundusImage] = useState<string | null>(SAMPLE_FUNDUS_IMAGES.moderate);
  const [imageFileName, setImageFileName] = useState<string>('fundus_diabetic_microvascular_changes.jpg');
  const [imageFileSize, setImageFileSize] = useState<string>('3.1 MB');
  const [uploadProgress, setUploadProgress] = useState<number>(100);
  const [imageQuality, setImageQuality] = useState<ImageQualityStatus>('GOOD');
  const [qualityIssues, setQualityIssues] = useState<string[]>([]);

  // Modals & Analysis State
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // Apply Demo Preset Handler
  const handleApplyPreset = (presetKey: DemoPresetKey) => {
    setCurrentPresetKey(presetKey);

    if (presetKey === 'error_state') {
      setIsErrorModalOpen(true);
      return;
    }

    if (presetKey === 'analysis_in_progress') {
      setFundusImage(SAMPLE_FUNDUS_IMAGES.moderate);
      setImageFileName('fundus_active_scan.jpg');
      setImageQuality('GOOD');
      setCurrentPage('analysis');
      return;
    }

    const preset = DEMO_PRESETS.find((p) => p.key === presetKey);
    if (!preset) return;

    if (presetKey === 'poor_quality') {
      setFundusImage(SAMPLE_FUNDUS_IMAGES.poorQuality);
      setImageFileName('fundus_substandard_illumination.jpg');
      setImageFileSize('1.8 MB');
      setImageQuality('POOR');
      setQualityIssues(preset.record.qualityIssues || ['Severe lens blur', 'Optical illumination haze']);
      setPatientInfo({
        patientCode: preset.record.patientCode || 'MH-24-0925',
        age: preset.record.patientAge || 61,
        sex: preset.record.patientSex || 'Female',
        centerLocation: 'PHC Shirpur (Sub-centre)',
      });
      setCurrentPage('new_screening');
      return;
    }

    // For normal, mild, moderate, severe presets:
    const targetImage = presetKey === 'normal' 
      ? SAMPLE_FUNDUS_IMAGES.normal 
      : SAMPLE_FUNDUS_IMAGES.moderate;

    setFundusImage(targetImage);
    setImageFileName(`fundus_${presetKey}_sample.jpg`);
    setImageFileSize('2.8 MB');
    setImageQuality('GOOD');
    setQualityIssues([]);

    const recordObj: ScreeningRecord = {
      id: `SCR-${Date.now().toString().slice(-4)}`,
      patientCode: preset.record.patientCode || 'MH-24-0901',
      screeningDate: '2026-09-08',
      patientAge: Number(preset.record.patientAge) || 54,
      patientSex: preset.record.patientSex || 'Female',
      centerLocation: 'PHC Shirpur, Dist. Dhule',
      examinerName: 'Sunita Devi (CHW)',
      fundusImage: targetImage,
      imageQuality: 'GOOD',
      drGrade: preset.record.drGrade as DRGrade,
      drGradeLabel: preset.record.drGradeLabel || 'Diabetic Retinopathy Screening',
      confidenceScore: preset.record.confidenceScore || 0.85,
      classProbabilities: preset.record.classProbabilities || { noDR: 0.1, mild: 0.1, moderate: 0.7, severe: 0.1 },
      referralPriority: preset.record.referralPriority || 'HIGH',
      status: presetKey === 'normal' ? 'Completed' : 'Referred',
      clinicalNextStep: preset.record.clinicalNextStep || 'Clinical evaluation recommended.',
      notes: preset.record.notes || 'Screening evaluated by Drishti-X model.',
      syncedToCloud: true,
    };

    setActiveRecord(recordObj);
    setCurrentPage('result');
  };

  // Run AI Analysis Handler
  const handleRunAnalysis = () => {
    if (!fundusImage) return;

    if (imageQuality === 'POOR') {
      // If quality is poor, alert the user or ask them to proceed with inconclusive flag
      const proceed = window.confirm(
        'Warning: The fundus image has been flagged as "Poor Quality". Analyzing poor quality images may produce inconclusive results. Would you like to proceed anyway?'
      );
      if (!proceed) return;
    }

    setCurrentPage('analysis');
  };

  // On Analysis Completion
  const handleAnalysisCompleted = () => {
    // Generate new record based on current image and patient
    const isNormal = fundusImage === SAMPLE_FUNDUS_IMAGES.normal;
    const isPoor = imageQuality === 'POOR';

    const newRec: ScreeningRecord = {
      id: `SCR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientCode: patientInfo.patientCode || 'MH-24-0891',
      screeningDate: new Date().toISOString().split('T')[0],
      patientAge: Number(patientInfo.age) || 54,
      patientSex: patientInfo.sex,
      centerLocation: patientInfo.centerLocation || 'PHC Shirpur, Dist. Dhule',
      examinerName: 'Sunita Devi (CHW)',
      fundusImage: fundusImage || SAMPLE_FUNDUS_IMAGES.moderate,
      imageQuality: imageQuality,
      qualityIssues: isPoor ? ['Optical haze', 'Insufficient illumination'] : undefined,
      drGrade: isNormal ? 'NO_DR' : isPoor ? 'MODERATE_DR' : 'MODERATE_DR',
      drGradeLabel: isNormal 
        ? 'No Apparent DR Detected' 
        : isPoor 
        ? 'Inconclusive (Substandard Clarity) - Moderate DR Suspected' 
        : 'Moderate Non-Proliferative DR Suspected',
      confidenceScore: isNormal ? 0.94 : isPoor ? 0.58 : 0.87,
      classProbabilities: isNormal
        ? { noDR: 0.94, mild: 0.04, moderate: 0.02, severe: 0.00 }
        : { noDR: 0.04, mild: 0.09, moderate: 0.87, severe: 0.00 },
      referralPriority: isNormal ? 'LOW' : 'HIGH',
      status: isNormal ? 'Completed' : 'Referred',
      clinicalNextStep: isNormal
        ? 'Routine annual diabetic eye screening advised at next primary health checkup.'
        : 'Clinical evaluation by a qualified eye-care professional is recommended based on this screening result.',
      notes: 'Automated Drishti-X screening evaluation completed.',
      syncedToCloud: true,
    };

    setActiveRecord(newRec);
    setScreenings((prev) => [newRec, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalScreened: prev.totalScreened + 1,
      noDR: isNormal ? prev.noDR + 1 : prev.noDR,
      needsReview: !isNormal && newRec.referralPriority !== 'HIGH' ? prev.needsReview + 1 : prev.needsReview,
      referrals: newRec.referralPriority === 'HIGH' ? prev.referrals + 1 : prev.referrals,
    }));

    setCurrentPage('result');
  };

  // Image Upload Handlers
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
      setQualityIssues(['Potential focus blur or uneven retinal illumination detected.']);
    } else {
      setQualityIssues([]);
    }
  };

  const handleImageRemoved = () => {
    setFundusImage(null);
    setImageFileName('');
    setImageFileSize('');
    setImageQuality('UNCHECKED');
    setQualityIssues([]);
    setUploadProgress(0);
  };

  const handleStartNewScreening = () => {
    // Reset to clean patient
    setPatientInfo({
      patientCode: `MH-24-${Math.floor(1000 + Math.random() * 9000)}`,
      age: '',
      sex: 'Female',
      centerLocation: 'PHC Shirpur, Dist. Dhule',
    });
    setFundusImage(null);
    setImageFileName('');
    setImageFileSize('');
    setImageQuality('UNCHECKED');
    setCurrentPage('new_screening');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      {/* Top Level Medical Disclaimer Banner */}
      <Disclaimer lang={lang} variant="banner" />

      {/* Demo Scenario Test Switcher Bar (For Innovation Competition Evaluators) */}
      <DemoPresetBar
        currentPreset={currentPresetKey}
        onApplyPreset={handleApplyPreset}
      />

      {/* Navigation Header */}
      {currentPage !== 'welcome' && (
        <Navbar
          lang={lang}
          onLanguageToggle={setLang}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
      )}

      {/* Main Layout Body */}
      <div className="flex-1 flex w-full">
        {/* Sidebar Navigation for Authenticated Pages */}
        {currentPage !== 'welcome' && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            lang={lang}
          />
        )}

        {/* Dynamic Page Views */}
        <main className="flex-1 min-w-0 pb-16 md:pb-8">
          {currentPage === 'welcome' && (
            <WelcomeView
              lang={lang}
              onLanguageToggle={setLang}
              onStartScreening={handleStartNewScreening}
              onSignIn={() => setCurrentPage('dashboard')}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardView
              stats={stats}
              recentScreenings={screenings}
              lang={lang}
              onNavigate={setCurrentPage}
              onSelectRecord={(rec) => {
                setActiveRecord(rec);
                setCurrentPage('result');
              }}
            />
          )}

          {currentPage === 'new_screening' && (
            <NewScreeningView
              patientInfo={patientInfo}
              onPatientInfoChange={(updated) =>
                setPatientInfo((prev) => ({ ...prev, ...updated }))
              }
              imageSrc={fundusImage}
              fileName={imageFileName}
              fileSizeText={imageFileSize}
              uploadProgress={uploadProgress}
              imageQuality={imageQuality}
              qualityIssues={qualityIssues}
              onImageSelected={handleImageSelected}
              onImageRemoved={handleImageRemoved}
              onRunAnalysis={handleRunAnalysis}
              lang={lang}
              onCancel={() => setCurrentPage('dashboard')}
            />
          )}

          {currentPage === 'analysis' && fundusImage && (
            <AnalysisProgress
              imageSrc={fundusImage}
              lang={lang}
              onComplete={handleAnalysisCompleted}
              onCancel={() => setCurrentPage('new_screening')}
            />
          )}

          {currentPage === 'result' && (
            <ScreeningResultView
              record={activeRecord}
              lang={lang}
              onViewReport={() => setCurrentPage('report')}
              onNewScreening={handleStartNewScreening}
              onBackToHistory={() => setCurrentPage('dashboard')}
            />
          )}

          {currentPage === 'report' && (
            <ReportView
              record={activeRecord}
              lang={lang}
              onBack={() => setCurrentPage('result')}
            />
          )}

          {currentPage === 'history' && (
            <ScreeningHistory
              screenings={screenings}
              lang={lang}
              onSelectRecord={(rec) => {
                setActiveRecord(rec);
                setCurrentPage('result');
              }}
              onViewReport={(rec) => {
                setActiveRecord(rec);
                setCurrentPage('report');
              }}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsView
              lang={lang}
              onLanguageChange={setLang}
            />
          )}
        </main>
      </div>

      {/* Edge Diagnostic Error Simulation Modal */}
      <ErrorStateModal
        isOpen={isErrorModalOpen}
        onRetry={() => {
          setIsErrorModalOpen(false);
          handleRunAnalysis();
        }}
        onDismiss={() => setIsErrorModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
