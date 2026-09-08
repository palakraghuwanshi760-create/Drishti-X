import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileClock, 
  FileText, 
  Settings, 
  LogOut,
  HelpCircle,
  Sparkles,
  Award
} from 'lucide-react';
import { NavigationPage, Language } from '../types';
import { translations } from '../i18n/translations';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  lang,
}) => {
  const t = translations[lang];

  const navItems = [
    {
      id: 'nav-item-dashboard',
      page: 'dashboard' as NavigationPage,
      label: t.navDashboard,
      icon: LayoutDashboard,
      activePages: ['dashboard'],
    },
    {
      id: 'nav-item-new-screening',
      page: 'new_screening' as NavigationPage,
      label: t.navNewScreening,
      icon: PlusCircle,
      activePages: ['new_screening', 'analysis', 'result'],
      highlight: true,
    },
    {
      id: 'nav-item-history',
      page: 'history' as NavigationPage,
      label: t.navHistory,
      icon: FileClock,
      activePages: ['history'],
    },
    {
      id: 'nav-item-reports',
      page: 'report' as NavigationPage,
      label: t.navReports,
      icon: FileText,
      activePages: ['report'],
    },
    {
      id: 'nav-item-settings',
      page: 'settings' as NavigationPage,
      label: t.navSettings,
      icon: Settings,
      activePages: ['settings'],
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside 
        id="app-sidebar-desktop" 
        className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none p-4 justify-between"
      >
        <div className="space-y-6">
          {/* Section: Primary Action */}
          <div>
            <button
              id="sidebar-new-screening-cta"
              onClick={() => onNavigate('new_screening')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.newScreeningBtn}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.activePages.includes(currentPage);
              return (
                <button
                  key={item.page}
                  id={item.id}
                  onClick={() => onNavigate(item.page)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-teal-50 text-teal-900 font-semibold border-l-4 border-teal-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Support & Competition Info */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-1">
              <Award className="w-3.5 h-3.5 text-teal-600" />
              <span>Drishti-X AI Prototype</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Explainable Grad-CAM heatmaps for community eye-care screening.
            </p>
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={() => onNavigate('welcome')}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        id="app-bottom-nav-mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 flex justify-around items-center shadow-lg"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.activePages.includes(currentPage);
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`flex flex-col items-center py-1.5 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-teal-800 font-semibold' : 'text-slate-500'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
              <span className="truncate max-w-[64px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
