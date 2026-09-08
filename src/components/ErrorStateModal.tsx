import React from 'react';
import { AlertOctagon, RefreshCw, X, WifiOff, Camera, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface ErrorStateModalProps {
  isOpen: boolean;
  errorMessage?: string;
  errorDetail?: string;
  onRetry: () => void;
  onDismiss: () => void;
  lang: Language;
}

export const ErrorStateModal: React.FC<ErrorStateModalProps> = ({
  isOpen,
  errorMessage = 'Inference Stream Disconnected',
  errorDetail = 'Digital fundus camera optical feed timed out or the low-bandwidth edge synchronization socket failed to handshake.',
  onRetry,
  onDismiss,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
      <div 
        id="error-state-dialog"
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-200 text-slate-900 space-y-5"
      >
        <div className="flex items-start justify-between">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            Rural Edge Diagnostic Error (Code #E-409)
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-2">
            {errorMessage}
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            {errorDetail}
          </p>
        </div>

        {/* Troubleshooting Checklist */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 text-slate-700">
          <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
            Health Worker Action Steps:
          </p>
          <div className="flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span>Ensure USB camera optic cord is firmly plugged in.</span>
          </div>
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Enable Local Edge Offline Mode if cellular data dropped.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onDismiss}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Dismiss
          </button>

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reconnect & Retry Inference</span>
          </button>
        </div>
      </div>
    </div>
  );
};
