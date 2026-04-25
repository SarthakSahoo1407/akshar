"use client";

import React, { useState, useCallback } from "react";
import { Akshar, languageList, Language } from "@/components";

// ─── CSS preset templates ──────────────────────────────────────────────────
const CSS_TEMPLATES: { name: string; label: string; css: string }[] = [
  { name: "default", label: "Default", css: "" },
  {
    name: "dark",
    label: "Dark",
    css: `.akshar-editor { background: #0f172a !important; color: #e2e8f0 !important; border-radius: 12px; caret-color: #60a5fa; }
.akshar-editor::placeholder { color: #475569 !important; }`,
  },
  {
    name: "warm",
    label: "Warm",
    css: `.akshar-editor { background: #fffbeb !important; color: #78350f !important; font-family: Georgia, serif !important; caret-color: #d97706; }
.akshar-editor::placeholder { color: #b45309 !important; opacity: 0.5; }`,
  },
  {
    name: "glass",
    label: "Glass",
    css: `.akshar-editor { background: rgba(255,255,255,0.15) !important; color: #1e293b !important; backdrop-filter: blur(12px); border-radius: 16px; }`,
  },
  {
    name: "terminal",
    label: "Terminal",
    css: `.akshar-editor { background: #001100 !important; color: #00ff41 !important; font-family: 'Courier New', monospace !important; border-radius: 0; caret-color: #00ff41; text-shadow: 0 0 8px rgba(0,255,65,0.6); }
.akshar-editor::placeholder { color: #006600 !important; }`,
  },
];

// ─── Code generator ───────────────────────────────────────────────────────
function buildCode(
  lang: string,
  maxOptions: number,
  offsetY: number,
  offsetX: number,
) {
  return `import { useState } from "react";
import { Akshar } from "akshar";

export default function Editor() {
  const [text, setText] = useState("");

  return (
    <Akshar
      lang="${lang}"
      value={text}
      onChangeText={setText}
      maxOptions={${maxOptions}}
      offsetY={${offsetY}}
      offsetX={${offsetX}}
      renderComponent={(props) => (
        <textarea {...props} placeholder="Type here…" />
      )}
    />
  );
}`;
}

// ─── Syntax-highlighted code block ────────────────────────────────────────
function CodeBlock({
  code,
  onCopy,
  copied,
}: {
  code: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-800">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
          tsx
        </span>
        <button
          onClick={onCopy}
          className="px-3 py-1 rounded-md text-[11px] font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all"
        >
          {copied ? "✓ Copied!" : "Copy code"}
        </button>
      </div>
      <div className="bg-[#0f172a] p-5 font-mono text-[12.5px] leading-relaxed text-slate-300 overflow-x-auto">
        <pre className="whitespace-pre">
          {code
            .split(
              /("[\w-]+"|\d+|import|from|export|default|return|const|useState|function)/g,
            )
            .map((t, i) => {
              if (
                /^(import|from|export|default|return|const|function)$/.test(t)
              )
                return (
                  <span key={i} className="text-violet-400">
                    {t}
                  </span>
                );
              if (/^useState$/.test(t))
                return (
                  <span key={i} className="text-blue-400">
                    {t}
                  </span>
                );
              if (/^".*"$/.test(t))
                return (
                  <span key={i} className="text-emerald-400">
                    {t}
                  </span>
                );
              if (/^\d+$/.test(t))
                return (
                  <span key={i} className="text-amber-400">
                    {t}
                  </span>
                );
              return <span key={i}>{t}</span>;
            })}
        </pre>
      </div>
    </div>
  );
}

// ─── API prop row ─────────────────────────────────────────────────────────
function PropRow({
  name,
  type,
  def,
  desc,
}: {
  name: string;
  type: string;
  def: string;
  desc: string;
}) {
  return (
    <tr className="border-b border-slate-100 last:border-0 align-top hover:bg-slate-50/50">
      <td className="py-2 pr-2 font-mono text-blue-600 text-[11px] whitespace-nowrap">
        {name}
      </td>
      <td className="py-2 pr-2 text-slate-400 text-[11px] whitespace-nowrap italic">
        {type}
      </td>
      <td className="py-2 pr-2 font-mono text-emerald-700 text-[11px] whitespace-nowrap">
        {def}
      </td>
      <td className="py-2 text-slate-500 text-[11px]">{desc}</td>
    </tr>
  );
}

export default function Home() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState<Language>("hi");
  const [maxOptions, setMaxOptions] = useState<number>(5);
  const [offsetY, setOffsetY] = useState<number>(8);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [activeTemplate, setActiveTemplate] = useState("default");
  const [copied, setCopied] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);

  const currentTemplate =
    CSS_TEMPLATES.find((t) => t.name === activeTemplate) ?? CSS_TEMPLATES[0];
  const code = buildCode(lang, maxOptions, offsetY, offsetX);

  const handleCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(code);
    } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleInstallCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText("npm install akshar");
    } catch (_) {}
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 2000);
  }, []);
  const handleLinkRedirect = useCallback(() => {
    window.open("https://www.npmjs.com/package/akshar-typing", "_blank");
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col text-slate-900">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg leading-none font-serif">
              अ
            </span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight leading-none">
              Akshar
            </h1>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
              Indic transliteration for React
            </p>
          </div>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
            v1.0.0
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <a
            href="https://github.com/SarthakSahoo1407/akshar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors text-slate-600"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <button
            onClick={handleLinkRedirect}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold  text-black rounded-md shadow-sm hover:bg-slate-50 transition"
          >
            <img src="/brand-npm.svg" alt="" className="w-5 h-5" />
            npm
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="col-span-1 lg:col-span-4 border-r border-slate-200 bg-white overflow-y-auto flex flex-col divide-y divide-slate-100">
          {/* Language chips */}
          <div className="p-5">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Languages
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {languageList.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code as Language)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                    lang === l.code
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-100 text-slate-600 border-slate-100 hover:border-slate-300"
                  }`}
                >
                  {l.name.charAt(0).toUpperCase() + l.name.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Props knobs */}
          <div className="p-5 flex flex-col gap-4">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Props
            </h2>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-600">
                  <code className="font-mono text-blue-600">maxOptions</code>
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {maxOptions}
                </span>
              </div>
              <select
                value={maxOptions}
                onChange={(e) => setMaxOptions(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-sm"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  <code className="font-mono text-blue-600">offsetY</code>
                </label>
                <input
                  type="number"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  <code className="font-mono text-blue-600">offsetX</code>
                </label>
                <input
                  type="number"
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Style templates */}
          {/* <div className="p-5 flex flex-col gap-3">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Style Template
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {CSS_TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setActiveTemplate(t.name)}
                  className={`py-2 px-1 rounded-lg border text-[11px] font-medium transition-all ${
                    activeTemplate === t.name
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-400/30"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div> */}

          {/* API table */}
          <div className="p-5">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              API Reference
            </h2>
            <div className="rounded-lg border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-2 text-[10px] font-semibold text-slate-500">
                      Prop
                    </th>
                    <th className="p-2 text-[10px] font-semibold text-slate-500">
                      Type
                    </th>
                    <th className="p-2 text-[10px] font-semibold text-slate-500">
                      Default
                    </th>
                    <th className="p-2 text-[10px] font-semibold text-slate-500">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <PropRow
                    name="lang"
                    type="Language"
                    def='"hi"'
                    desc="Target language code"
                  />
                  <PropRow
                    name="value"
                    type="string"
                    def="—"
                    desc="Controlled text value"
                  />
                  <PropRow
                    name="onChangeText"
                    type="fn"
                    def="—"
                    desc="Called with new text"
                  />
                  <PropRow
                    name="maxOptions"
                    type="number"
                    def="5"
                    desc="Max suggestions shown"
                  />
                  <PropRow
                    name="offsetY"
                    type="number"
                    def="0"
                    desc="Vertical popup offset"
                  />
                  <PropRow
                    name="offsetX"
                    type="number"
                    def="0"
                    desc="Horizontal popup offset"
                  />
                  <PropRow
                    name="renderComponent"
                    type="fn"
                    def="<input>"
                    desc="Custom input renderer"
                  />
                  <PropRow
                    name="containerClassName"
                    type="string"
                    def='""'
                    desc="Wrapper class name"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </aside>

        {/* ── Playground ──────────────────────────────────────────────── */}
        <section className="col-span-1 lg:col-span-8 overflow-y-auto flex flex-col">
          {/* Banner */}

          <div className="p-6 md:p-8 flex flex-col gap-8 flex-1">
            {/* Live editor */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Preview
                </h3>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Style: {currentTemplate.label}
                </span>
              </div>

              {currentTemplate.css && <style>{currentTemplate.css}</style>}

              <div
                className={`rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm focus-within:ring-2 ${
                  activeTemplate === "dark"
                    ? "border-slate-700 bg-slate-900 focus-within:ring-blue-500/30"
                    : activeTemplate === "terminal"
                      ? "border-green-900 bg-black focus-within:ring-green-500/30"
                      : activeTemplate === "glass"
                        ? "border-white/40 bg-gradient-to-br from-sky-100 to-violet-100 focus-within:ring-violet-400/30"
                        : activeTemplate === "warm"
                          ? "border-amber-200 bg-amber-50 focus-within:ring-amber-300/30"
                          : "border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-blue-100"
                }`}
              >
                <Akshar
                  renderComponent={(props) => (
                    <textarea
                      {...props}
                      className="akshar-editor w-full h-100 text-xl font-normal leading-relaxed p-6 outline-none focus:ring-0 border-none bg-transparent resize-none min-h-[200px]"
                      placeholder={
                        lang === "en" ? "Start typing…" : `namaste… (${lang})`
                      }
                    />
                  )}
                  value={text}
                  onChangeText={setText}
                  lang={lang}
                  maxOptions={maxOptions}
                  offsetY={offsetY}
                  offsetX={offsetX}
                  containerClassName="w-full"
                />
              </div>

              {text.length > 0 && (
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="text-[11px] text-slate-400">
                    {text.length} characters
                  </span>
                  <button
                    onClick={() => setText("")}
                    className="text-[11px] text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Clear ×
                  </button>
                </div>
              )}
            </div>

            {/* Generated code */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Code
                </h3>
                <span className="text-[10px] text-slate-400">
                  Updates live as you change props
                </span>
              </div>
              <CodeBlock code={code} onCopy={handleCopy} copied={copied} />
            </div>

            {/* Install strip */}
            <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-violet-50 p-5 flex items-center gap-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-bold leading-none">
                  npm
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Get started
                </p>
                <code className="text-xs font-mono text-blue-700">
                  npm install akshar-typing
                </code>
              </div>
              <button
                onClick={handleInstallCopy}
                className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
              >
                {installCopied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 px-6 py-3 flex sm:flex-row flex-col justify-between items-center text-[11px] gap-2">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            API: Online
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span>Powered by Google Transliteration API</span>
        </div>
        <span className="text-slate-600">MIT License &copy; 2026 Akshar</span>
      </footer>
    </div>
  );
}
