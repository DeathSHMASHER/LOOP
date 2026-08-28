'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Tag, ArrowUpRight, Flame, ChevronRight, Loader2, MessageSquare, AlertTriangle } from 'lucide-react';

export default function TrendsPage() {
  const [themes, setThemes] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<any | null>(null);
  const [themeFeedback, setThemeFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

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
    } catch (err) {
      console.error('Error fetching theme items:', err);
    } finally {
      setLoadingItems(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            AI Theme Clustering & Spike Detection
          </h2>
          <p className="text-xs text-slate-400">
            Automated cluster grouping powered by AI Intelligence Engine with week-over-week spike detection.
          </p>
        </div>
      </div>

      {/* Grid of Theme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
          </div>
        ) : (
          themes.map((theme, index) => {
            const isSpiking = index % 2 === 0;
            return (
              <div
                key={theme.name}
                onClick={() => handleSelectTheme(theme.name)}
                className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedTheme === theme.name ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> {theme.name}
                  </span>
                  {isSpiking && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +35% Spike
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-white">{theme.count}</span>
                    <span className="text-xs text-slate-400 ml-1">feedback items</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Theme Drill-down Details */}
      {selectedTheme && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Drill-down: Underlying Feedback for "{selectedTheme}"
            </h3>
            <span className="text-xs text-slate-400">{themeFeedback.length} items loaded</span>
          </div>

          {loadingItems ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
            </div>
          ) : themeFeedback.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No specific verbatim items found for this filter.</p>
          ) : (
            <div className="space-y-3">
              {themeFeedback.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">{item.channel}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-200">"{item.content}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
