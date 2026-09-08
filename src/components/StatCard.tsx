import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id: string;
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'teal' | 'emerald' | 'amber' | 'rose' | 'slate';
  badgeText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'teal',
  badgeText,
}) => {
  const variantStyles = {
    teal: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-teal-300',
      iconBg: 'bg-teal-50 text-teal-700',
      valueColor: 'text-slate-900',
      badge: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    emerald: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-700',
      valueColor: 'text-slate-900',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    amber: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-700',
      valueColor: 'text-slate-900',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    rose: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-700',
      valueColor: 'text-slate-900',
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    slate: {
      bg: 'bg-white',
      border: 'border-slate-200 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-900',
      badge: 'bg-slate-100 text-slate-800 border-slate-200',
    }
  }[variant];

  return (
    <div
      id={id}
      className={`${variantStyles.bg} rounded-xl p-5 border ${variantStyles.border} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className={`text-3xl font-extrabold ${variantStyles.valueColor} tracking-tight`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${variantStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>{subtitle}</span>
          {badgeText && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${variantStyles.badge}`}>
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
