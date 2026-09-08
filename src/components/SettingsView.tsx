import React from 'react';
import { 
  User, 
  Globe, 
  Bell, 
  Sliders, 
  ShieldCheck, 
  Wifi, 
  Database, 
  Check, 
  DownloadCloud,
  FileSpreadsheet
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface SettingsViewProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  lang,
  onLanguageChange,
}) => {
  const t = translations[lang];

  return (
    <div id="settings-page" className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Health worker identity, bilingual language options, offline cache status, and privacy parameters.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Health Worker Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.healthWorkerProfile}</h3>
              <p className="text-xs text-slate-500">Authenticated device credentials for rural camp screening</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-slate-500 mb-1">Health Worker Name</span>
              <input
                type="text"
                readOnly
                value="Sunita Devi"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
              />
            </div>
            <div>
              <span className="block text-slate-500 mb-1">Designation / Role</span>
              <input
                type="text"
                readOnly
                value="Community Health Worker (ASHA / Arogya Mitra)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
            <div>
              <span className="block text-slate-500 mb-1">Assigned Health Center</span>
              <input
                type="text"
                readOnly
                value="Primary Health Centre (PHC) Shirpur"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
            <div>
              <span className="block text-slate-500 mb-1">District / State</span>
              <input
                type="text"
                readOnly
                value="Dhule District, Maharashtra"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Language & Accessibility */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.languageSelection}</h3>
              <p className="text-xs text-slate-500">Primary display language for patient triage and report exports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                lang === 'en'
                  ? 'border-teal-600 bg-teal-50/50 text-teal-900 font-bold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div>
                <span className="text-sm block">English (Primary)</span>
                <span className="text-xs text-slate-500 font-normal">Standard medical screening terminology</span>
              </div>
              {lang === 'en' && <Check className="w-5 h-5 text-teal-700" />}
            </button>

            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                lang === 'hi'
                  ? 'border-teal-600 bg-teal-50/50 text-teal-900 font-bold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div>
                <span className="text-sm block font-hindi">हिन्दी (Hindi)</span>
                <span className="text-xs text-slate-500 font-normal">सामुदायिक स्वास्थ्य कार्यकर्ताओं हेतु सुलभ</span>
              </div>
              {lang === 'hi' && <Check className="w-5 h-5 text-teal-700" />}
            </button>
          </div>
        </div>

        {/* Section 3: Notifications & Rural Offline Mode */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.offlineSyncStatus}</h3>
              <p className="text-xs text-slate-500">Low-bandwidth resilience for remote village outreach camps</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-semibold text-slate-800 block">Local Edge Caching</span>
                <span className="text-slate-500">Allows screening to continue without live internet connection</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[11px]">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-semibold text-slate-800 block">Tele-Ophthalmology Queue</span>
                <span className="text-slate-500">Automated synchronization when 4G/Wi-Fi signal resumes</span>
              </div>
              <span className="font-mono text-slate-700">6 pending sync</span>
            </div>
          </div>
        </div>

        {/* Section 4: Data Privacy & Ethics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.dataPrivacy}</h3>
              <p className="text-xs text-slate-500">Clinical decision-support privacy safeguards</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Drishti-X stores only de-identified patient screening records. Retinal fundus imagery is processed strictly for clinical risk stratification.
          </p>

          <div className="mt-4 p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
            <span>Export anonymous screening registry (CSV format for District Health Officer)</span>
            <button
              type="button"
              onClick={() => alert('Exporting anonymous screening registry CSV...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-[11px] cursor-pointer"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
