import React from 'react';
import { 
  Eye, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Globe, 
  UserCheck, 
  CheckCircle2, 
  Layers, 
  Flame, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { Language, NavigationPage } from '../types';
import { translations } from '../i18n/translations';
import { SAMPLE_FUNDUS_IMAGES } from '../assets/sampleImages';

interface WelcomeViewProps {
  lang: Language;
  onLanguageToggle: (l: Language) => void;
  onStartScreening: () => void;
  onSignIn: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  lang,
  onLanguageToggle,
  onStartScreening,
  onSignIn,
}) => {
  const t = translations[lang];

  return (
    <div id="welcome-page" className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Gradient & Retinal Vascular Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-teal-500 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-600 rounded-full blur-[140px]"></div>
        {/* Subtle grid */}
        <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-15"></div>
      </div>

      {/* Top Bar with Language Toggle & Prototype Badge */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            Clinical Decision Support System
          </span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-slate-800/90 rounded-full p-1 border border-slate-700">
          <button
            type="button"
            id="welcome-lang-en"
            onClick={() => onLanguageToggle('en')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            id="welcome-lang-hi"
            onClick={() => onLanguageToggle('hi')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer font-hindi ${
              lang === 'hi'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading & Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-700/60">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>AI for Resource-Constrained Primary Care in India</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
            {lang === 'hi' ? 'दृष्टि-X' : 'Drishti-X'}
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-teal-300 font-sans tracking-tight">
            "{t.tagline}"
          </p>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
            {t.heroSubtitle}
          </p>

          {/* Key Trust Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <span className="block text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Explainable Grad-CAM
              </span>
              <span className="text-[11px] text-slate-400">
                Visual attention heatmaps for clinicians
              </span>
            </div>

            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <span className="block text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Offline-First Edge
              </span>
              <span className="text-[11px] text-slate-400">
                Operates smoothly in rural screening camps
              </span>
            </div>

            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <span className="block text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Triage & Referral
              </span>
              <span className="text-[11px] text-slate-400">
                Objective referral prioritization for PHCs
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              type="button"
              id="welcome-start-screening-btn"
              onClick={onStartScreening}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-900/40 hover:shadow-teal-600/30 transition-all cursor-pointer text-base group"
            >
              <span>{t.startScreening}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              id="welcome-sign-in-btn"
              onClick={onSignIn}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl border border-slate-700 transition-colors cursor-pointer text-sm"
            >
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>{t.signIn}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Abstract Retinal Eye Scan Visualization */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full p-2 bg-gradient-to-tr from-teal-500/30 via-slate-800 to-cyan-500/30 border border-slate-700 shadow-2xl flex items-center justify-center">
            {/* Outer Retinal Dial */}
            <div className="absolute inset-4 rounded-full border border-teal-500/20 animate-[spin_30s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-teal-400"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400"></div>
            </div>

            {/* Fundus Retinal Photography Core with Grad-CAM heat simulation */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden bg-black border-4 border-slate-800 shadow-inner">
              <img
                src={SAMPLE_FUNDUS_IMAGES.moderate}
                alt="Retinal Fundus Photography"
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
              
              {/* Semi-transparent Grad-CAM Heatmap Radial simulation */}
              <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-screen">
                <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-radial from-red-500 via-orange-400 to-transparent rounded-full blur-md"></div>
                <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-radial from-amber-400 via-teal-500 to-transparent rounded-full blur-md"></div>
              </div>

              {/* Scanning Ray Line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-pulse"
                style={{ top: '48%' }}
              />

              {/* Center HUD reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full border border-teal-400/40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-300"></div>
                </div>
              </div>
            </div>

            {/* Floating Info Tag */}
            <div className="absolute -bottom-2 bg-slate-900/95 border border-teal-500/40 text-teal-300 px-4 py-2 rounded-xl text-xs font-mono shadow-xl flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>Optic Disc & Macula Aligned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Medical Disclaimer & National Innovation Competition Footer */}
      <div className="relative z-10 border-t border-slate-800/80 bg-slate-950/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className="text-center sm:text-left text-[11px] leading-relaxed max-w-3xl">
            <span className="font-bold text-amber-400">Medical Disclaimer: </span>
            {t.medicalDisclaimerText}
          </p>

          <span className="shrink-0 text-[11px] font-medium text-slate-500">
            Drishti-X • National Student Innovation Prototype
          </span>
        </div>
      </div>
    </div>
  );
};
