'use client';

import React, { useState } from 'react';
import { Akshar, languageList, Language } from '@/components';

export default function Home() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState<Language>('hi');

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col text-slate-900">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex flex-col sm:flex-row justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none font-serif pt-1">अ</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Akshar <span className="text-slate-400 font-normal text-sm">v1.0.0</span>
          </h1>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            GitHub
          </a>
          <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition">
            Install NPM
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto">
        {/* Sidebar / Docs */}
        <aside className="col-span-1 lg:col-span-4 border-r border-slate-200 bg-white p-6 md:p-8 flex flex-col gap-8">
          
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Active Language</h2>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="en">English (No transliteration)</option>
              {languageList.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name.charAt(0).toUpperCase() + l.name.slice(1)} ({l.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Component Props</h2>
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-3 font-semibold text-slate-600">Prop</th>
                    <th className="p-3 font-semibold text-slate-600">Type</th>
                    <th className="p-3 font-semibold text-slate-600">Default</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 bg-white">
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-mono text-blue-600">lang</td>
                    <td className="p-3">string</td>
                    <td className="p-3">&apos;hi&apos;</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-mono text-blue-600">value</td>
                    <td className="p-3">string</td>
                    <td className="p-3">-</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-mono text-blue-600">onChangeText</td>
                    <td className="p-3">function</td>
                    <td className="p-3">-</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-mono text-blue-600">maxOptions</td>
                    <td className="p-3">number</td>
                    <td className="p-3">5</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-mono text-blue-600">offsetY</td>
                    <td className="p-3">number</td>
                    <td className="p-3">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Supported Languages</h2>
            <div className="flex flex-wrap gap-2">
              {languageList.map((l) => (
                <span
                  key={l.code}
                  className={`px-2 py-1 rounded text-xs font-medium border ${
                    lang === l.code
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-slate-100 text-slate-600 border-slate-100'
                  }`}
                >
                  {l.name.charAt(0).toUpperCase() + l.name.slice(1)} ({l.code})
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Playground Area */}
        <section className="col-span-1 lg:col-span-8 p-6 md:p-10 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end mb-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Interactive Demo</h3>
              <p className="text-slate-500 text-sm">Type in Phonetic English to see Indic output</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-400">
                <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm font-sans font-medium text-[10px]">Tab / Space</kbd> to select
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm font-sans font-medium text-[10px]">↑↓</kbd> to navigate
              </span>
            </div>
          </div>

          {/* The "Component" Mockup wrapper */}
          <div className="relative bg-white border-2 border-slate-200 rounded-xl shadow-sm p-1 flex flex-col focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
            <Akshar
              renderComponent={(props) => (
                <textarea
                  {...props}
                  className="w-full flex-1 text-2xl font-normal leading-relaxed text-slate-800 p-6 outline-none focus:ring-0 border-none bg-transparent resize-y min-h-[300px]"
                  placeholder={`Namaste, aap kaise ${lang === 'en' ? 'hain' : 'हैं'}...`}
                />
              )}
              value={text}
              onChangeText={setText}
              lang={lang}
              maxOptions={2}
              offsetY={8}
              containerClassName="w-full h-full flex flex-col"
            />
          </div>

          {/* Code Snippet Area */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Implementation</h4>
            <div className="bg-[#1e293b] rounded-xl p-5 font-mono text-sm leading-relaxed text-slate-300 overflow-x-auto shadow-inner">
              <div className="flex gap-2 mb-2">
                <span className="text-pink-400">import</span>
                <span className="text-white">{' { Akshar } '}</span>
                <span className="text-pink-400">from</span>
                <span className="text-emerald-400">&quot;akshar&quot;</span>;
              </div>
              <div className="text-slate-500 italic mb-1 mt-4">{/* Inside your component */}</div>
              <div className="flex gap-2">
                <span className="text-white">&lt;</span><span className="text-blue-300">Akshar</span>
              </div>
              <div className="pl-6 text-slate-300 flex flex-col">
                <span>lang={'{'}<span className="text-emerald-400">&quot;{lang}&quot;</span>{'}'}</span>
                <span>value={'{text}'}</span>
                <span>onChangeText={'{setText}'}</span>
                <span>maxOptions={'{5}'}</span>
                <span>containerClassName=<span className="text-emerald-400">&quot;custom-editor&quot;</span></span>
              </div>
              <span className="text-white">/&gt;</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="bg-slate-900 text-slate-400 px-6 py-2 flex sm:flex-row flex-col justify-between items-center text-[11px] gap-2">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
            API: Online
          </span>
          <span className="hidden sm:inline">|</span>
          <span>Powered by Google Input Tools</span>
        </div>
        <div>
          Released under MIT License &copy; 2026
        </div>
      </footer>
    </div>
  );
}
