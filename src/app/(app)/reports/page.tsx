'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Bot, Download, Calendar, Loader2, CheckCircle2, TrendingDown, ChevronRight } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [periodDays, setPeriodDays] = useState('30');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data || []);
      if (data && data.length > 0) {
        setSelectedReport(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch VoC reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodDays }),
      });
      const newReport = await res.json();
      if (res.ok) {
        setReports((prev) => [newReport, ...prev]);
        setSelectedReport(newReport);
      }
    } catch (err) {
      console.error('Error generating VoC report:', err);
    } finally {
      setGenerating(false);
    }
  };

  const parseReportContent = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return null;
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Voice of Customer (VoC) Digest Generator
          </h2>
          <p className="text-xs text-slate-400">
            Synthesize period metrics with AI Intelligence Engine to produce exportable executive reports.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={periodDays}
            onChange={(e) => setPeriodDays(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300"
          >
            <option value="7">Last 7 Days Digest</option>
            <option value="30">Last 30 Days Digest</option>
            <option value="90">Quarterly Digest (90 Days)</option>
          </select>

          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            Generate New Report
          </button>
        </div>
      </div>

      {/* Main Container: Report History List & View Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Saved Reports List */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Saved Reports</h3>

          {loading ? (
            <div className="p-6 text-center">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
            </div>
          ) : reports.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No reports generated yet.</p>
          ) : (
            <div className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedReport?.id === report.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <h4 className="text-xs font-bold line-clamp-1">{report.title}</h4>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Generated {new Date(report.createdAt).toLocaleDateString()}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Report View */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          {selectedReport ? (
            <>
              {/* Report Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Executive VoC Report
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-1">{selectedReport.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Period: {new Date(selectedReport.periodStart).toLocaleDateString()} — {new Date(selectedReport.periodEnd).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={handlePrintPdf}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" /> Export PDF
                </button>
              </div>

              {/* Report Content Body */}
              {(() => {
                const parsed = parseReportContent(selectedReport.contentJson);
                if (!parsed) return <p className="text-xs text-rose-400">Error parsing report payload.</p>;

                return (
                  <div className="space-y-6">
                    {/* Executive Summary Narrative */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-purple-400" /> Executive Narrative
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800 whitespace-pre-line">
                        {parsed.executiveSummary || parsed.summary}
                      </p>
                    </div>

                    {/* Top Friction Points */}
                    {parsed.topPainPoints && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                          <TrendingDown className="w-4 h-4" /> Primary Pain Points & Friction Areas
                        </h3>
                        <div className="space-y-1.5">
                          {parsed.topPainPoints.map((pt: string, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-200 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strategic Recommended Actions */}
                    {parsed.recommendedActions && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Recommended Engineering & Product Actions
                        </h3>
                        <div className="space-y-1.5">
                          {parsed.recommendedActions.map((act: string, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-200 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">Select a report to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
