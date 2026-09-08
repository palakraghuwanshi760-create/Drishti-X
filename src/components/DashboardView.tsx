import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  PlusCircle, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Eye, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { StatCard } from './StatCard';
import { ScreeningRecord, Language, NavigationPage } from '../types';
import { translations } from '../i18n/translations';
import { SCREENING_TRENDS_DATA, INITIAL_STATS } from '../data/mockScreenings';

interface DashboardViewProps {
  stats: typeof INITIAL_STATS;
  recentScreenings: ScreeningRecord[];
  lang: Language;
  onNavigate: (page: NavigationPage) => void;
  onSelectRecord: (record: ScreeningRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentScreenings,
  lang,
  onNavigate,
  onSelectRecord,
}) => {
  const t = translations[lang];

  return (
    <div id="health-worker-dashboard" className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t.welcomeBack}, Sunita Devi
            </h1>
          </div>
          <p className="text-slate-300 text-sm font-medium">
            {t.readyPrompt}
          </p>
          <p className="text-xs text-slate-400 pt-1 flex items-center gap-2">
            <span>Primary Health Centre (PHC) Shirpur • Remote Camp Unit #4</span>
          </p>
        </div>

        <button
          type="button"
          id="dashboard-new-screening-cta"
          onClick={() => onNavigate('new_screening')}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-900/30 hover:shadow-teal-600/30 transition-all cursor-pointer text-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.newScreeningBtn}</span>
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          id="stat-card-total-screened"
          title={t.statTotalScreened}
          value={stats.totalScreened}
          subtitle="All sessions to date"
          icon={Users}
          variant="slate"
          badgeText="100%"
        />

        <StatCard
          id="stat-card-no-dr"
          title={t.statNoDR}
          value={stats.noDR}
          subtitle="Clear retinal media"
          icon={CheckCircle2}
          variant="emerald"
          badgeText="75%"
        />

        <StatCard
          id="stat-card-needs-review"
          title={t.statNeedsReview}
          value={stats.needsReview}
          subtitle="Mild / Quality follow-up"
          icon={AlertTriangle}
          variant="amber"
          badgeText="25%"
        />

        <StatCard
          id="stat-card-referrals"
          title={t.statReferrals}
          value={stats.referrals}
          subtitle="Sent to District Hospital"
          icon={ArrowUpRight}
          variant="rose"
          badgeText="12.5%"
        />
      </div>

      {/* Main Content Grid: Trend Visualization & Recent Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Screenings Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-teal-700" />
                <span>{t.recentScreenings}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Patient records logged in current screening cycle
              </p>
            </div>

            <button
              type="button"
              id="view-all-screenings-link"
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">{t.patientId}</th>
                  <th className="px-3 py-3">{t.date}</th>
                  <th className="px-3 py-3">{t.result}</th>
                  <th className="px-3 py-3 text-center">{t.confidence}</th>
                  <th className="px-3 py-3 text-center">{t.priority}</th>
                  <th className="px-3 py-3 rounded-r-lg">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentScreenings.slice(0, 5).map((rec) => {
                  const isNoDR = rec.drGrade === 'NO_DR';
                  const isHigh = rec.referralPriority === 'HIGH';

                  return (
                    <tr
                      key={rec.id}
                      onClick={() => onSelectRecord(rec)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {rec.patientCode}
                      </td>
                      <td className="px-3 py-3 text-slate-500 whitespace-nowrap">
                        {rec.screeningDate}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-semibold ${
                          isNoDR ? 'text-emerald-700' : isHigh ? 'text-rose-700' : 'text-amber-700'
                        }`}>
                          {rec.drGradeLabel}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-slate-800">
                        {Math.round(rec.confidenceScore * 100)}%
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          rec.referralPriority === 'LOW'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : rec.referralPriority === 'MODERATE'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}>
                          {rec.referralPriority}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Screening Trend & Triage Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Trend Chart Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-teal-700" />
                <span>Screening Trend (Past 7 Days)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Daily volume and referral distribution
              </p>
            </div>

            {/* Simple Accessible Bar Chart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-end justify-between h-36 gap-2 pt-4 px-2 border-b border-slate-200">
                {SCREENING_TRENDS_DATA.map((item, idx) => {
                  const maxH = 24;
                  const totalHeightPct = Math.round((item.total / maxH) * 100);
                  const isCurrent = item.day === 'Today';

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded font-mono pointer-events-none whitespace-nowrap z-10">
                        {item.total} screened ({item.noDR} No DR, {item.referred} Ref)
                      </div>

                      <div 
                        className={`w-full max-w-[24px] rounded-t-md transition-all ${
                          isCurrent 
                            ? 'bg-teal-700 group-hover:bg-teal-600' 
                            : 'bg-slate-300 group-hover:bg-teal-400'
                        }`}
                        style={{ height: `${totalHeightPct}%` }}
                      />
                      <span className={`text-[10px] mt-2 font-medium ${isCurrent ? 'text-teal-900 font-bold' : 'text-slate-400'}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 inline-block"></span>
                  Routine Weekday
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-teal-700 inline-block"></span>
                  Active Camp Session
                </span>
              </div>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-teal-50/70 rounded-3xl border border-teal-200/80 p-5 text-teal-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-900">
              <Stethoscope className="w-4 h-4 text-teal-700" />
              <span>PHC Camp Protocol Reminder</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Ensure dark room pupil adaptation for non-mydriatic fundus cameras. If optical glare or eyelid blink is detected, re-take prior to analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
