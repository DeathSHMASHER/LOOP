'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  TrendingDown,
  Calendar,
  Loader2,
  ThumbsUp,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard metrics');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTick = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}`;
    }
    return dateStr;
  };

  if (loading) {
    return (
      <div className="h-72 sm:h-96 flex flex-col items-center justify-center p-4 space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs sm:text-sm font-semibold text-slate-400 text-center">
          Aggregating workspace feedback intelligence...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 glass-panel rounded-2xl border border-rose-500/20 text-rose-400 font-semibold text-xs sm:text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Executive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Feedback */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-2 relative overflow-hidden transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Feedback</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{data?.statCards?.totalFeedback || 0}</span>
            <span className="text-[11px] sm:text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Total ingested across all channels</p>
        </div>

        {/* Negative Ratio */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-2 relative overflow-hidden transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Negative Ratio</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{data?.statCards?.negativePct || '0%'}</span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">of total volume</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Requires triage attention</p>
        </div>

        {/* Positive Ratio */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-2 relative overflow-hidden transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Positive Ratio</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{data?.statCards?.positivePct || '0%'}</span>
            <span className="text-[11px] sm:text-xs font-semibold text-emerald-400">High satisfaction</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Promoters & positive mentions</p>
        </div>

        {/* New This Week */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-2 relative overflow-hidden transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">New This Week</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{data?.statCards?.newThisWeek || 0}</span>
            <span className="text-[11px] sm:text-xs font-semibold text-purple-400 font-mono">7-day ingest</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Recent customer interactions</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Feedback Volume Over Time (Area Chart) */}
        <div className="lg:col-span-2 glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800/90 space-y-4 overflow-hidden">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Feedback Volume (Last 30 Days)</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Daily breakdown of positive and negative items</p>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2 -ml-2 sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.volumeChartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={formatDateTick}
                  minTickGap={28}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPos)" name="Positive" />
                <Area type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorNeg)" name="Negative" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Distribution Breakdown (Pie Chart) */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800/90 space-y-4 flex flex-col justify-between overflow-hidden">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Sentiment Share</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Proportion of POS, NEU, and NEG sentiment</p>
          </div>

          <div className="h-48 sm:h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.sentimentChartData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data?.sentimentChartData || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
            {(data?.sentimentChartData || []).map((s: any) => (
              <div key={s.name} className="space-y-0.5 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block truncate">{s.name}</span>
                <span className="text-xs sm:text-sm font-bold text-white block">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Emerging Themes Bar Chart */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800/90 space-y-4 overflow-hidden">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white">Top Active Customer Themes</h3>
          <p className="text-[11px] sm:text-xs text-slate-400">Most frequent topics automatically clustered by AI Intelligence Engine</p>
        </div>

        <div className="h-60 sm:h-72 w-full pt-2 -ml-3 sm:ml-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.topThemesChartData || []}
              layout="vertical"
              margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={10} allowDecimals={false} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#94a3b8"
                fontSize={11}
                width={120}
                tickFormatter={(val) => val && val.length > 18 ? `${val.slice(0, 16)}...` : val}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} name="Feedback Items" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
