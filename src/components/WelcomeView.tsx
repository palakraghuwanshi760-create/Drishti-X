import React from 'react';
import { translations } from '../translations';
import type { Language } from '../types';

interface WelcomeViewProps {
  lang: Language;
  onStartScreening: () => void;
  onSignIn: () => void;
}

export default function WelcomeView({
  lang,
  onStartScreening,
  onSignIn,
}: WelcomeViewProps) {
  const t =
    translations[lang as keyof typeof translations] ??
    translations.en;

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              NetraRakshak
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onSignIn}
            className="rounded-xl border border-teal-400/30 bg-teal-400/10 px-5 py-2.5 text-sm font-semibold text-teal-300 transition hover:bg-teal-400/20"
          >
            {t.signIn}
          </button>
        </header>

        {/* Hero */}
        <main className="flex flex-1 items-center">
          <div className="grid w-full gap-12 py-16 lg:grid-cols-2 lg:items-center">

            {/* Left side */}
            <section>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-sm text-teal-300">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
                AI-assisted retinal screening
              </div>

              <h2 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {t.welcomeBack}
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {t.subtitle}
              </p>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                {t.readyPrompt}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={onStartScreening}
                  className="rounded-xl bg-teal-400 px-6 py-3.5 font-semibold text-slate-950 shadow-lg shadow-teal-400/10 transition hover:bg-teal-300"
                >
                  {t.startScreening}
                </button>

                <button
                  type="button"
                  onClick={onSignIn}
                  className="rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 font-semibold text-white transition hover:border-teal-400/40 hover:bg-slate-800"
                >
                  {t.signIn}
                </button>
              </div>
            </section>

            {/* Right visual */}
            <section className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-[#0c1929] p-8 shadow-2xl">

                {/* Decorative glow */}
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative">

                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        Screening overview
                      </p>

                      <p className="mt-1 text-xl font-semibold text-white">
                        NetraRakshak
                      </p>
                    </div>

                    <div className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-300">
                      AI-assisted
                    </div>
                  </div>

                  {/* Retina-style visual */}
                  <div className="mx-auto flex aspect-square max-w-sm items-center justify-center rounded-full border border-teal-400/20 bg-[#07111f]">

                    <div className="flex h-[72%] w-[72%] items-center justify-center rounded-full border border-teal-300/30 bg-gradient-to-br from-teal-400/10 to-blue-500/10 shadow-[0_0_80px_rgba(45,212,191,0.08)]">

                      <div className="flex h-[58%] w-[58%] items-center justify-center rounded-full border border-teal-300/20 bg-[#0b1727]">

                        <div className="h-20 w-20 rounded-full bg-teal-400/10 shadow-[0_0_50px_rgba(45,212,191,0.15)]" />

                      </div>
                    </div>
                  </div>

                  {/* Feature cards */}
                  <div className="mt-8 grid grid-cols-3 gap-3">

                    <div className="rounded-xl border border-slate-700/70 bg-slate-900/50 p-4">
                      <p className="text-xs text-slate-500">
                        Screening
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        AI-assisted
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-700/70 bg-slate-900/50 p-4">
                      <p className="text-xs text-slate-500">
                        Explainability
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        Grad-CAM
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-700/70 bg-slate-900/50 p-4">
                      <p className="text-xs text-slate-500">
                        Tracking
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        Longitudinal
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 pt-6">
          <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <p>
              {t.dataPrivacy}
            </p>

            <p>
              NetraRakshak • AI-assisted screening prototype
            </p>

          </div>
        </footer>

      </div>
    </div>
  );
}