import React from 'react';
import { User, Calendar, MapPin, Shield, Info } from 'lucide-react';
import { PatientInfo, Language } from '../types';
import { translations } from '../i18n/translations';

interface PatientFormProps {
  patientInfo: PatientInfo;
  onChange: (updated: Partial<PatientInfo>) => void;
  lang: Language;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patientInfo,
  onChange,
  lang,
}) => {
  const t = translations[lang];

  return (
    <div id="patient-info-form-card" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-700" />
            <span>{t.patientInfoTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Essential screening registration fields.
          </p>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Shield className="w-3 h-3 text-teal-600" />
          HIPAA & DISHA Aligned
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Patient Code / UID */}
        <div>
          <label 
            htmlFor="patient-code-input" 
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            {t.patientCode} <span className="text-rose-500">*</span>
          </label>
          <input
            id="patient-code-input"
            type="text"
            required
            value={patientInfo.patientCode}
            onChange={(e) => onChange({ patientCode: e.target.value })}
            placeholder={t.patientCodePlaceholder}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all font-mono"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            De-identified patient camp token
          </span>
        </div>

        {/* Age */}
        <div>
          <label 
            htmlFor="patient-age-input" 
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            {t.age} <span className="text-rose-500">*</span>
          </label>
          <input
            id="patient-age-input"
            type="number"
            min="1"
            max="120"
            required
            value={patientInfo.age}
            onChange={(e) => onChange({ age: e.target.value ? Number(e.target.value) : '' })}
            placeholder={t.agePlaceholder}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            Years completed
          </span>
        </div>

        {/* Sex */}
        <div>
          <label 
            htmlFor="patient-sex-select" 
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            {t.sex} <span className="text-rose-500">*</span>
          </label>
          <select
            id="patient-sex-select"
            value={patientInfo.sex}
            onChange={(e) => onChange({ sex: e.target.value as 'Male' | 'Female' | 'Other' })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-pointer"
          >
            <option value="Female">{t.female}</option>
            <option value="Male">{t.male}</option>
            <option value="Other">{t.other}</option>
          </select>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Biological sex for epidemiology record
          </span>
        </div>
      </div>

      {/* Secondary Context Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
        <div>
          <label 
            htmlFor="patient-center-input" 
            className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.campLocation}</span>
          </label>
          <input
            id="patient-center-input"
            type="text"
            value={patientInfo.centerLocation || ''}
            onChange={(e) => onChange({ centerLocation: e.target.value })}
            placeholder="e.g. PHC Shirpur, Sub-Centre Vyahad"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
          />
        </div>

        <div>
          <label 
            htmlFor="patient-diabetes-input" 
            className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.diabetesDuration}</span>
          </label>
          <input
            id="patient-diabetes-input"
            type="number"
            min="0"
            max="60"
            value={patientInfo.diabetesDurationYears || ''}
            onChange={(e) => onChange({ diabetesDurationYears: e.target.value ? Number(e.target.value) : '' })}
            placeholder="e.g. 8 years"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
          />
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-slate-500 text-[11px] leading-relaxed">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>{t.privacyNotice}</span>
      </div>
    </div>
  );
};
