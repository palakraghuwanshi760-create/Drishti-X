import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  Sliders, 
  Sparkles, 
  HelpCircle, 
  Info, 
  SplitSquareVertical, 
  Maximize2,
  ZoomIn,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { Language, DRGrade } from '../types';
import { translations } from '../i18n/translations';
import { DEMO_ATTENTION_MAPS, AttentionPoint } from '../assets/sampleImages';

interface OriginalVsExplanationViewerProps {
  originalImage: string;
  drGrade: DRGrade;
  lang: Language;
  className?: string;
}

export const OriginalVsExplanationViewer: React.FC<OriginalVsExplanationViewerProps> = ({
  originalImage,
  drGrade,
  lang,
  className = '',
}) => {
  const t = translations[lang];
  const [viewMode, setViewMode] = useState<'original' | 'explanation' | 'split'>('explanation');
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.75);
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage for split comparison
  const [activeHotspot, setActiveHotspot] = useState<AttentionPoint | null>(null);

  const attentionPoints: AttentionPoint[] = DEMO_ATTENTION_MAPS[drGrade] || DEMO_ATTENTION_MAPS.MODERATE_DR;

  return (
    <div id="original-vs-explanation-viewer" className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-xs ${className}`}>
      {/* Viewer Header with Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-700" />
            <span>Explainable AI Retinal Visualization</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial gradient-weighted Class Activation Mapping (Grad-CAM)
          </p>
        </div>

        {/* View Mode Toggle: [ Original ] [ AI Explanation ] [ Split ] */}
        <div id="view-mode-toggle-group" className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            id="btn-view-original"
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'original'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.viewOriginal}
          </button>

          <button
            type="button"
            id="btn-view-explanation"
            onClick={() => setViewMode('explanation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'explanation'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.viewExplanation}</span>
          </button>

          <button
            type="button"
            id="btn-view-split"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'split'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative w-full max-w-2xl mx-auto aspect-square rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-md select-none group">
        {/* Base Layer: Original Fundus Image */}
        <img
          src={originalImage}
          alt="Retinal Fundus Photography"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />

        {/* Grad-CAM Heatmap Layer */}
        {(viewMode === 'explanation' || viewMode === 'split') && (
          <div
            className="absolute inset-0 transition-opacity duration-200 pointer-events-none"
            style={{
              opacity: viewMode === 'split' ? 1 : heatmapOpacity,
              clipPath: viewMode === 'split' ? `inset(0 0 0 ${splitPosition}%)` : 'none',
            }}
          >
            {/* SVG Synthetic Jet/Turbo Colormap Heatmap Mesh */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full mix-blend-screen filter blur-md"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Radial gradients simulating Grad-CAM neural attention hotspots */}
                {attentionPoints.map((pt, idx) => (
                  <radialGradient
                    key={`grad-${idx}`}
                    id={`hotspot-grad-${idx}`}
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                  >
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={pt.intensity} />
                    <stop offset="35%" stopColor="#f97316" stopOpacity={pt.intensity * 0.9} />
                    <stop offset="65%" stopColor="#eab308" stopOpacity={pt.intensity * 0.65} />
                    <stop offset="85%" stopColor="#06b6d4" stopOpacity={pt.intensity * 0.35} />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                  </radialGradient>
                ))}
              </defs>

              {/* Render attention blobs */}
              {attentionPoints.map((pt, idx) => (
                <circle
                  key={`circle-${idx}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={pt.radius}
                  fill={`url(#hotspot-grad-${idx})`}
                />
              ))}
            </svg>
          </div>
        )}

        {/* Interactive Hotspot Annotation Markers (Only in Explanation mode) */}
        {viewMode === 'explanation' && (
          <div className="absolute inset-0">
            {attentionPoints.map((pt, idx) => (
              <div
                key={`marker-${idx}`}
                onClick={() => setActiveHotspot(pt)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group/marker"
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-amber-400 opacity-60"></span>
                  <div className="w-5 h-5 rounded-full bg-amber-500/90 border border-white text-white text-[10px] font-bold flex items-center justify-center shadow-lg hover:scale-125 transition-transform">
                    {idx + 1}
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/marker:flex flex-col bg-slate-900/95 text-white text-[10px] p-2 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-20 pointer-events-none">
                  <span className="font-bold text-amber-300">{pt.regionType}</span>
                  <span className="text-slate-300">Model Attention Weight: {Math.round(pt.intensity * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Split-View Drag Slider Divider */}
        {viewMode === 'split' && (
          <>
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)] pointer-events-none z-10"
              style={{ left: `${splitPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white text-slate-800 rounded-full shadow-md flex items-center justify-center text-xs font-bold border border-slate-300">
                ↔
              </div>
            </div>
            {/* Range input for split control */}
            <input
              type="range"
              min="0"
              max="100"
              value={splitPosition}
              onChange={(e) => setSplitPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </>
        )}

        {/* Mode Label Badges */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5">
          {viewMode === 'original' && (
            <>
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>Raw Fundus (45°)</span>
            </>
          )}
          {viewMode === 'explanation' && (
            <>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Grad-CAM Attention Heatmap</span>
            </>
          )}
          {viewMode === 'split' && (
            <>
              <SplitSquareVertical className="w-3.5 h-3.5 text-cyan-400" />
              <span>Slide to Compare (Left: Raw | Right: AI Attention)</span>
            </>
          )}
        </div>

        {/* Grad-CAM Colormap Legend */}
        {viewMode === 'explanation' && (
          <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs border border-slate-700 text-[10px] text-white p-2 rounded-lg flex items-center gap-2">
            <span className="text-slate-400">Attention:</span>
            <div className="w-20 h-2 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500"></div>
            <span className="text-red-400 font-bold">High</span>
          </div>
        )}
      </div>

      {/* Heatmap Opacity Slider (When in explanation mode) */}
      {viewMode === 'explanation' && (
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Sliders className="w-4 h-4 text-teal-700" />
            <span>{t.heatmapIntensity}: {Math.round(heatmapOpacity * 100)}%</span>
          </div>
          <div className="w-full sm:w-64 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono">0%</span>
            <input
              id="heatmap-opacity-slider"
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={heatmapOpacity}
              onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
            />
            <span className="text-[10px] text-slate-400 font-mono">100%</span>
          </div>
        </div>
      )}

      {/* "Why was this flagged?" Card */}
      <div id="why-flagged-section" className="mt-5 p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-teal-950">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-teal-100 rounded-lg shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-teal-800" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
              {t.whyFlagged}
            </h4>
            <p className="text-xs text-teal-900 leading-relaxed">
              {t.whyFlaggedExplanation}
            </p>
            <p className="text-[11px] text-teal-800/90 italic pt-1 border-t border-teal-200/60 mt-1">
              {t.modelExplanationNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
