import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { DemoPresetKey, DemoPreset } from '../types';
import { DEMO_PRESETS } from '../data/mockScreenings';

interface DemoPresetBarProps {
  currentPreset: DemoPresetKey | null;
  onApplyPreset: (presetKey: DemoPresetKey) => void;
}

export const DemoPresetBar: React.FC<DemoPresetBarProps> = ({
  currentPreset,
  onApplyPreset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="demo-evaluator-controls" className="bg-slate-900 text-white border-b border-teal-900/60 shadow-inner px-4 py-2 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/40">
            <Sparkles className="w-3 h-3 text-teal-400" />
          </div>
          <span className="font-bold text-teal-300 tracking-tight">
            Innovation Demo Scenarios:
          </span>
          <span className="text-[11px] text-slate-400 hidden md:inline">
            One-click test harness for the 7 required clinical states
          </span>
        </div>

        {/* Quick selector buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {DEMO_PRESETS.map((preset) => {
            const isSelected = currentPreset === preset.key;
            return (
              <button
                key={preset.key}
                type="button"
                id={`demo-preset-btn-${preset.key}`}
                onClick={() => onApplyPreset(preset.key)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs ring-1 ring-teal-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
                title={preset.description}
              >
                {preset.label.split(' ')[1]} {preset.label.split(' ')[2] || ''}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
