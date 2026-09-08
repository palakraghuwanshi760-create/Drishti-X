import React from 'react';
import { ReferralPriority, Language } from '../types';
import { translations } from '../i18n/translations';
import { ShieldCheck, AlertCircle, AlertTriangle, Zap } from 'lucide-react';

interface RiskIndicatorProps {
  priority: ReferralPriority;
  lang: Language;
  className?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  priority,
  lang,
  className = '',
}) => {
  const t = translations[lang];

  const levels: { key: ReferralPriority; label: string; desc: string; icon: any }[] = [
    { key: 'LOW', label: t.lowRisk, desc: 'Annual routine screening', icon: ShieldCheck },
    { key: 'MODERATE', label: t.moderateRisk, desc: '3-6 months review', icon: AlertCircle },
    { key: 'HIGH', label: t.highRisk, desc: 'Hospital referral needed', icon: AlertTriangle },
    { key: 'URGENT', label: t.urgentRisk, desc: 'Immediate vitreo-retina evaluation', icon: Zap },
  ];

  const activeIdx = priority === 'LOW' ? 0 : priority === 'MODERATE' ? 1 : priority === 'HIGH' ? 2 : 3;

  return (
    <div id="risk-indicator-container" className={`bg-white rounded-2xl border border-slate-200 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t.riskIndicatorLabel}
        </span>
        <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
          priority === 'LOW'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : priority === 'MODERATE'
            ? 'bg-amber-50 text-amber-800 border-amber-300'
            : 'bg-rose-50 text-rose-800 border-rose-300'
        }`}>
          {priority} REFERRAL PRIORITY
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {levels.slice(0, 3).map((level, idx) => {
          const isActive = idx === Math.min(activeIdx, 2);
          const Icon = level.icon;

          let activeStyle = '';
          if (isActive) {
            if (level.key === 'LOW') {
              activeStyle = 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600 ring-offset-1';
            } else if (level.key === 'MODERATE') {
              activeStyle = 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500 ring-offset-1';
            } else {
              activeStyle = 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600 ring-offset-1';
            }
          } else {
            activeStyle = 'bg-slate-50 text-slate-400 border border-slate-200 opacity-60';
          }

          return (
            <div
              key={level.key}
              className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${activeStyle}`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-xs font-bold tracking-tight">
                {level.key}
              </span>
              <span className={`text-[10px] mt-0.5 leading-tight ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                {level.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
