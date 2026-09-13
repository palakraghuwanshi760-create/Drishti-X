export type Language =
  | 'en'
  | 'hi'
  | 'hinglish'
  | 'mr'
  | 'bn'
  | 'te'
  | 'ta'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as'
  | 'ur';

export type NavigationPage =
  | 'welcome'
  | 'dashboard'
  | 'new_screening'
  | 'analysis'
  | 'result'
  | 'report'
  | 'history'
  | 'settings';

export type DRGrade =
  | 'NO_DR'
  | 'MILD_DR'
  | 'MODERATE_DR'
  | 'SEVERE_DR'
  | 'PROLIFERATIVE_DR';

export type ReferralPriority =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'URGENT';

export type ImageQualityStatus =
  | 'GOOD'
  | 'POOR'
  | 'UNCHECKED';

export interface PatientInfo {
  patientName: string;
  patientCode: string;
  age: number | string;
  sex: 'Male' | 'Female' | 'Other';
  centerLocation?: string;
  diabetesDurationYears?: number | string;
  contactNumberMasked?: string;
}

export interface ModelAttentionRegion {
  id: string;
  xPercent: number;
  yPercent: number;
  radiusPercent: number;
  intensity: number;
  label: string;
  notes: string;
}

export interface ScreeningRecord {
  id: string;

  patientName: string;
  patientCode: string;

  screeningDate: string;

  patientAge: number;
  patientSex: 'Male' | 'Female' | 'Other';

  centerLocation: string;
  examinerName: string;

  fundusImage: string;

  imageQuality: ImageQualityStatus;
  qualityIssues?: string[];

  drGrade: DRGrade;
  drGradeLabel: string;

  confidenceScore: number;

  classProbabilities: {
    noDR: number;
    mild: number;
    moderate: number;
    severe: number;
  };

  referralPriority: ReferralPriority;

  status:
    | 'Completed'
    | 'Pending Review'
    | 'Referred'
    | 'Follow-up Scheduled';

  /*
   * Older/demo explainability data.
   * Kept for compatibility with the existing UI.
   */
  attentionRegions?: ModelAttentionRegion[];

  /*
   * Real Grad-CAM explainability data generated
   * by the Python AI backend.
   */
  explainability?: {
    method: string;
    targetLayer: string;
    heatmap: string;
    heatmapWidth: number;
    heatmapHeight: number;
  };

  clinicalNextStep: string;

  notes?: string;

  syncedToCloud?: boolean;
}

export type DemoPresetKey =
  | 'normal'
  | 'mild'
  | 'moderate'
  | 'severe'
  | 'poor_quality'
  | 'analysis_in_progress'
  | 'error_state';

export interface DemoPreset {
  key: DemoPresetKey;
  label: string;
  description: string;
  record: Partial<ScreeningRecord>;
}