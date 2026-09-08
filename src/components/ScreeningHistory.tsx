import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpDown, 
  User, 
  Sparkles,
  Inbox,
  Clock,
  MapPin
} from 'lucide-react';
import { ScreeningRecord, Language, DRGrade, ReferralPriority } from '../types';
import { translations } from '../i18n/translations';

interface ScreeningHistoryProps {
  screenings: ScreeningRecord[];
  lang: Language;
  onSelectRecord: (record: ScreeningRecord) => void;
  onViewReport: (record: ScreeningRecord) => void;
}

export const ScreeningHistory: React.FC<ScreeningHistoryProps> = ({
  screenings,
  lang,
  onSelectRecord,
  onViewReport,
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredRecords = useMemo(() => {
    return screenings.filter((rec) => {
      const matchesSearch = 
        rec.patientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.centerLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.drGradeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesResult = 
        resultFilter === 'ALL' ||
        (resultFilter === 'NO_DR' && rec.drGrade === 'NO_DR') ||
        (resultFilter === 'MILD_DR' && rec.drGrade === 'MILD_DR') ||
        (resultFilter === 'MODERATE_DR' && rec.drGrade === 'MODERATE_DR') ||
        (resultFilter === 'SEVERE_DR' && (rec.drGrade === 'SEVERE_DR' || rec.drGrade === 'PROLIFERATIVE_DR'));

      const matchesPriority =
        priorityFilter === 'ALL' || rec.referralPriority === priorityFilter;

      const matchesStatus =
        statusFilter === 'ALL' || rec.status === statusFilter;

      return matchesSearch && matchesResult && matchesPriority && matchesStatus;
    });
  }, [screenings, searchTerm, resultFilter, priorityFilter, statusFilter]);

  return (
    <div id="screening-history-page" className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.historyTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived diabetic retinopathy screening records from district camps and primary centers.
          </p>
        </div>
        <span className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs font-medium">
          Showing <strong className="text-slate-900">{filteredRecords.length}</strong> of {screenings.length} records
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="history-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
            />
          </div>

          {/* Result Filter */}
          <div>
            <select
              id="history-result-filter"
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <option value="ALL">All DR Results</option>
              <option value="NO_DR">No DR Apparent</option>
              <option value="MILD_DR">Mild DR Suspected</option>
              <option value="MODERATE_DR">Moderate DR Suspected</option>
              <option value="SEVERE_DR">Severe DR Suspected</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              id="history-priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low Referral</option>
              <option value="MODERATE">Moderate Referral</option>
              <option value="HIGH">High Referral</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="history-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <option value="ALL">All Workflow Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Referred">Referred</option>
              <option value="Follow-up Scheduled">Follow-up Scheduled</option>
            </select>
          </div>
        </div>

        {/* Clear Filters helper */}
        {(searchTerm || resultFilter !== 'ALL' || priorityFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setResultFilter('ALL');
                setPriorityFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-[11px] text-teal-700 font-semibold hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Records Table & Cards */}
      {filteredRecords.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">{t.patientId}</th>
                  <th className="px-4 py-3.5">{t.date}</th>
                  <th className="px-4 py-3.5">{t.result}</th>
                  <th className="px-4 py-3.5 text-center">{t.confidence}</th>
                  <th className="px-4 py-3.5 text-center">{t.priority}</th>
                  <th className="px-4 py-3.5">{t.status}</th>
                  <th className="px-5 py-3.5 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => {
                  const isNoDR = record.drGrade === 'NO_DR';
                  const isHigh = record.referralPriority === 'HIGH';

                  return (
                    <tr 
                      key={record.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectRecord(record)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-300">
                            <img
                              src={record.fundusImage}
                              alt="Fundus thumb"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 font-mono">
                              {record.patientCode}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {record.patientAge}y / {record.patientSex}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{record.screeningDate}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`font-semibold ${
                          isNoDR ? 'text-emerald-700' : isHigh ? 'text-rose-700' : 'text-amber-700'
                        }`}>
                          {record.drGradeLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                          {record.centerLocation}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-900">
                        {Math.round(record.confidenceScore * 100)}%
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          record.referralPriority === 'LOW'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : record.referralPriority === 'MODERATE'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}>
                          {record.referralPriority}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {record.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(record);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                        >
                          View Result
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewReport(record);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredRecords.map((record) => (
              <div 
                key={record.id} 
                onClick={() => onSelectRecord(record)}
                className="p-4 space-y-2.5 hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 font-mono">
                    {record.patientCode}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    record.referralPriority === 'LOW'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : record.referralPriority === 'MODERATE'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}>
                    {record.referralPriority}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-black overflow-hidden shrink-0 border border-slate-300">
                    <img
                      src={record.fundusImage}
                      alt="Fundus scan"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-slate-900">
                      {record.drGradeLabel}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {record.screeningDate} • Confidence: {Math.round(record.confidenceScore * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Status: <strong className="text-slate-800">{record.status}</strong>
                  </span>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecord(record);
                      }}
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Inspect
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewReport(record);
                      }}
                      className="text-xs font-semibold text-slate-600 hover:underline"
                    >
                      Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div id="screening-history-empty-state" className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            {t.noRecordsFound}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search terms or clearing selected filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setResultFilter('ALL');
              setPriorityFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
