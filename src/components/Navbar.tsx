import React from 'react';
import { Eye, Bell, Globe, Wifi, UserCheck, Shield } from 'lucide-react';
import { Language, NavigationPage } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  lang: Language;
  onLanguageToggle: (l: Language) => void;
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  notificationCount?: number;
  userName?: string;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageToggle,
  currentPage,
  onNavigate,
  notificationCount = 2,
  userName = 'Sunita Devi',
  userRole = 'Community Health Worker (ASHA/CHW)',
}) => {
  const t = translations[lang];

  return (
    <header id="app-navbar" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div 
          id="navbar-logo"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Eye className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-sans">
                {lang === 'hi' ? 'दृष्टि-X' : 'Drishti-X'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Rural Care v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Rural Offline-First Badge */}
          <div 
            id="offline-sync-badge" 
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300"
            title="Local offline caching active for remote screening camps without internet"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium">PHC Shirpur (Offline-Ready)</span>
          </div>

          {/* Language Toggle */}
          <div id="language-toggle-group" className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              id="lang-btn-en"
              type="button"
              onClick={() => onLanguageToggle('en')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                lang === 'en'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              id="lang-btn-hi"
              type="button"
              onClick={() => onLanguageToggle('hi')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors font-hindi ${
                lang === 'hi'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Notifications */}
          <button
            id="navbar-notification-btn"
            type="button"
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Tele-ophthalmology alerts"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-slate-900" />
            )}
          </button>

          {/* Health Worker Profile */}
          <div 
            id="health-worker-profile-pill"
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-full cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-teal-800 text-teal-200 flex items-center justify-center font-semibold text-xs border border-teal-600">
              SD
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                <span>{userName}</span>
                <UserCheck className="w-3 h-3 text-teal-400" />
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {userRole}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
