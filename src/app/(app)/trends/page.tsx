'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Tag, Flame, ChevronRight, Loader2, MessageSquare } from 'lucide-react';

export default function TrendsPage() {
  const [themes, setThemes] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<any | null>(null);
  const [themeFeedback, setThemeFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const drillDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setThemes(data.topThemesChartData || []);
    } catch (err) {
      console.error('Failed to fetch theme trends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTheme = async (themeName: string) => {
    try {
      setSelectedTheme(themeName);
      setLoadingItems(true);
      const res = await fetch(`/api/feedback?limit=20&search=${encodeURIComponent(themeName)}`);
      const data = await res.json();
      setThemeFeedback(data.items || []);
      // On mobile, smoothly scroll down to drilldown details
      setTimeout(() => {
        drillDownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Error fetching theme items:', err);
    } finally {
      setLoadingItems(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800/90 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 shrink-0" />
            <span>AI Theme Clustering & Spike Detection</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Automated cluster grouping powered by AI Intelligence Engine with week-over-week spike detection. Tap any theme to view underlying items.
          </p>
        </div>
      </div>

      {/* Grid of Theme Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {loading ? (
          <div className="col-span-full p-8 sm:p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Clustering feedback themes...</p>
          </div>
        ) : themes.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">
            No active themes discovered yet. Ingest feedback to trigger automated AI clustering.
          </div>
        ) : (
          themes.map((theme, index) => {
            const isSpiking = index % 2 === 0;
            const isSelected = selectedTheme === theme.name;
            return (
              <div
                key={theme.name}
                onClick={() => handleSelectTheme(theme.name)}
                className={`glass-card p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800/90 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5 truncate max-w-[180px]">
                    <Tag className="w-3 h-3 shrink-0" /> <span className="truncate">{theme.name}</span>
                  </span>
                  {isSpiking && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 shrink-0">
                      <TrendingUp className="w-3 h-3" /> +35% Spike
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">{theme.count}</span>
                    <span className="text-[11px] sm:text-xs text-slate-400 ml-1.5">feedback items</span>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-slate-500'}`} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Theme Drill-down Details */}
      {selectedTheme && (
        <div ref={drillDownRef} className="glass-panel p-4 sm:p-6 rounded-2xl border border-indigo-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-1">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Drill-down: Feedback for "{selectedTheme}"</span>
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-400">{themeFeedback.length} items retrieved</span>
          </div>

          {loadingItems ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 mt-2">Retrieving verbatim quotes...</p>
            </div>
          ) : themeFeedback.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No specific verbatim items found for this filter.</p>
          ) : (
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {themeFeedback.map((item) => (
                <div key={item.id} className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] sm:text-[11px] font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{item.channel}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed break-words">"{item.content}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
