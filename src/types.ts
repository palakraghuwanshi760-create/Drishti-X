export type Language = 'en' | 'hi';

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

export type ReferralPriority = 'LOW' | 'MODERATE' | 'HIGH' | 'URGENT';

export type ImageQualityStatus = 'GOOD' | 'POOR' | 'UNCHECKED';

export interface PatientInfo {
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
  intensity: number; // 0 to 1
  label: string;
  notes: string;
}

export interface ScreeningRecord {
  id: string;
  patientCode: string;
  screeningDate: string; // ISO or formatted
  patientAge: number;
  patientSex: 'Male' | 'Female' | 'Other';
  centerLocation: string;
  examinerName: string;
  fundusImage: string; // Data URL or asset path
  imageQuality: ImageQualityStatus;
  qualityIssues?: string[];
  drGrade: DRGrade;
  drGradeLabel: string;
  confidenceScore: number; // e.g. 0.87 for 87%
  classProbabilities: {
    noDR: number;
    mild: number;
    moderate: number;
    severe: number;
  };
  referralPriority: ReferralPriority;
  status: 'Completed' | 'Pending Review' | 'Referred' | 'Follow-up Scheduled';
  attentionRegions?: ModelAttentionRegion[];
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
