import React from 'react';
import {
  Activity,
  ChevronDown,
  LogOut,
  UserCircle,
} from 'lucide-react';

import {
  Language,
  NavigationPage,
} from '../types';

interface NavbarProps {
  userName?: string;

  lang: Language;

  onLanguageToggle: (
    lang: Language
  ) => void;

  currentPage: NavigationPage;

  onNavigate: (
    page: NavigationPage
  ) => void;

  onLogout: () => void;
}


const languages: {
  code: Language;
  label: string;
}[] = [
  {
    code: 'en',
    label: 'English',
  },
  {
    code: 'hi',
    label: 'हिन्दी',
  },
  {
    code: 'hinglish',
    label: 'Hinglish',
  },
  {
    code: 'mr',
    label: 'मराठी',
  },
  {
    code: 'bn',
    label: 'বাংলা',
  },
  {
    code: 'te',
    label: 'తెలుగు',
  },
  {
    code: 'ta',
    label: 'தமிழ்',
  },
  {
    code: 'gu',
    label: 'ગુજરાતી',
  },
  {
    code: 'kn',
    label: 'ಕನ್ನಡ',
  },
  {
    code: 'ml',
    label: 'മലയാളം',
  },
  {
    code: 'pa',
    label: 'ਪੰਜਾਬੀ',
  },
  {
    code: 'or',
    label: 'ଓଡ଼ିଆ',
  },
  {
    code: 'as',
    label: 'অসমীয়া',
  },
  {
    code: 'ur',
    label: 'اردو',
  },
];


export default function Navbar({
  userName,
  lang,
  onLanguageToggle,
  currentPage,
  onNavigate,
  onLogout,
}: NavbarProps) {

  const [languageOpen, setLanguageOpen] =
    React.useState(false);

  const [userMenuOpen, setUserMenuOpen] =
    React.useState(false);


  const currentLanguage =
    languages.find(
      (item) =>
        item.code === lang
    ) || languages[0];


  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800">

      <div className="w-full px-4 md:px-6 lg:px-8">

        <div className="h-16 flex items-center justify-between gap-4">

          {/* LEFT SIDE */}

          <button
            type="button"
            onClick={() =>
              onNavigate('dashboard')
            }
            className="flex items-center gap-3 shrink-0"
          >

            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center shadow-lg shadow-teal-950/30">

              <Activity className="w-5 h-5 text-white" />

            </div>

            <div className="hidden sm:block text-left">

              <div className="text-white font-black text-lg leading-none">
                NetraRakshak
              </div>

              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                AI-Assisted Eye Screening
              </div>

            </div>

          </button>


          {/* RIGHT SIDE */}

          <div className="flex items-center gap-2 md:gap-3">

            {/* LANGUAGE */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setLanguageOpen(
                    (prev) => !prev
                  )
                }
                className="min-h-[44px] px-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition"
              >

                <span>
                  {currentLanguage.label}
                </span>

                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    languageOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />

              </button>


              {languageOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 max-h-80 overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">

                  {languages.map(
                    (language) => (
                      <button
                        type="button"
                        key={
                          language.code
                        }
                        onClick={() => {

                          onLanguageToggle(
                            language.code
                          );

                          setLanguageOpen(
                            false
                          );

                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition ${
                          lang ===
                          language.code
                            ? 'bg-teal-50 text-teal-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {language.label}
                      </button>
                    )
                  )}

                </div>
              )}

            </div>


            {/* USER */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setUserMenuOpen(
                    (prev) => !prev
                  )
                }
                className="min-h-[44px] flex items-center gap-2 px-2 md:px-3 rounded-xl hover:bg-slate-800 transition"
              >

                <UserCircle className="w-7 h-7 text-teal-400" />

                <div className="hidden md:block text-left">

                  <p className="text-sm font-bold text-white max-w-[150px] truncate">
                    {userName ||
                      'Health Worker'}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Community Health Worker
                  </p>

                </div>

                <ChevronDown
                  className={`hidden md:block w-4 h-4 text-slate-400 transition-transform ${
                    userMenuOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />

              </button>


              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">

                  {/* USER INFO */}

                  <div className="p-4 border-b border-slate-100">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">

                        <UserCircle className="w-6 h-6 text-teal-700" />

                      </div>

                      <div className="min-w-0">

                        <p className="font-bold text-slate-900 truncate">
                          {userName ||
                            'Health Worker'}
                        </p>

                        <p className="text-xs text-slate-500">
                          Community Health Worker
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* LOGOUT */}

                  <div className="p-2">

                    <button
                      type="button"
                      onClick={() => {

                        setUserMenuOpen(
                          false
                        );

                        onLogout();

                      }}
                      className="w-full min-h-[44px] flex items-center gap-3 px-3 rounded-lg text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                    >

                      <LogOut className="w-4 h-4" />

                      Sign Out

                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}