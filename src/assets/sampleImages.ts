// Retinal Fundus photographic assets and Grad-CAM attention visualizers
import fundusNormalImg from './images/fundus_normal_1788852692511.jpg';
import fundusModerateImg from './images/fundus_dr_moderate_1788852707102.jpg';
import fundusPoorQualityImg from './images/fundus_poor_quality_1788852722589.jpg';

export const SAMPLE_FUNDUS_IMAGES = {
  normal: fundusNormalImg,
  moderate: fundusModerateImg,
  poorQuality: fundusPoorQualityImg,
};

export interface AttentionPoint {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  radius: number; // percentage
  intensity: number; // 0.1 to 1.0
  regionType: string;
}

export const DEMO_ATTENTION_MAPS: Record<string, AttentionPoint[]> = {
  MODERATE_DR: [
    { x: 58, y: 44, radius: 14, intensity: 0.95, regionType: 'Temporal Macular Microvascular Attention' },
    { x: 67, y: 52, radius: 11, intensity: 0.88, regionType: 'Inferotemporal Vascular Arch' },
    { x: 42, y: 38, radius: 10, intensity: 0.76, regionType: 'Superotemporal Arcade Anomalies' },
    { x: 32, y: 48, radius: 9, intensity: 0.65, regionType: 'Peripapillary Zone Focus' },
  ],
  MILD_DR: [
    { x: 62, y: 48, radius: 9, intensity: 0.82, regionType: 'Isolated Microvascular Focus' },
    { x: 54, y: 39, radius: 7, intensity: 0.68, regionType: 'Foveal Avascular Zone Margin' },
  ],
  SEVERE_DR: [
    { x: 55, y: 42, radius: 16, intensity: 0.98, regionType: 'Extensive Mid-Peripheral Attention' },
    { x: 68, y: 56, radius: 13, intensity: 0.94, regionType: 'Inferior Arcade Hemorrhage Field' },
    { x: 40, y: 32, radius: 12, intensity: 0.90, regionType: 'Superior Venous Beading Zone' },
    { x: 31, y: 50, radius: 11, intensity: 0.85, regionType: 'Peripapillary Capillary Drop' },
  ],
  NO_DR: [
    { x: 30, y: 50, radius: 10, intensity: 0.35, regionType: 'Normal Optic Disc Center' },
    { x: 60, y: 50, radius: 9, intensity: 0.30, regionType: 'Normal Foveal Depression' },
  ]
};
