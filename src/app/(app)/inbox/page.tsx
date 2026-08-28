'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Upload,
  Bot,
  RefreshCw,
  Tag,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';

export default function InboxPage() {
  const [items, setItems] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('ALL');
  const [sentiment, setSentiment] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  // Modals State
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isSimulatedModalOpen, setIsSimulatedModalOpen] = useState(false);

  // Form State
  const [singleContent, setSingleContent] = useState('');
  const [singleChannel, setSingleChannel] = useState('Support Ticket');
  const [singleCustomer, setSingleCustomer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // CSV State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvResult, setCsvResult] = useState<any>(null);

  // Reclassifying State
  const [reclassifyingId, setReclassifyingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInboxItems(1);
  }, [search, channel, sentiment, status]);

  const fetchInboxItems = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        limit: '10',
        search,
        channel,
        sentiment,
        status,
      });

      const res = await fetch(`/api/feedback?${params.toString()}`);
      const data = await res.json();
      setItems(data.items || []);
      setPagination(data.pagination || { page: 1, limit: 10, totalPages: 1, totalCount: 0 });
    } catch (err) {
      console.error('Failed to fetch inbox items:', err);
    } font: {
      setLoading(false);
    }
  };

  // Status inline triage toggle
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Re-classify item using Google Gemini AI
  const handleReclassify = async (id: string) => {
    try {
      setReclassifyingId(id);
      const res = await fetch('/api/feedback/reclassify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId: id }),
      });
      if (res.ok) {
        await fetchInboxItems(pagination.page);
      }
    } catch (err) {
      console.error('Reclassification error:', err);
    } finally {
      setReclassifyingId(null);
    }
  };

  // Handle single feedback submission
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: singleContent,
          channel: singleChannel,
          customerLabel: singleCustomer || 'Direct Submission',
        }),
      });
      if (res.ok) {
        setIsSingleModalOpen(false);
        setSingleContent('');
        fetchInboxItems(1);
      }
    } catch (err) {
      console.error('Single submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle CSV Bulk upload
  const handleCsvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;
    setSubmitting(true);
    setCsvResult(null);

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const res = await fetch('/api/feedback/batch', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setCsvResult(data);
      if (data.success) {
        fetchInboxItems(1);
      }
    } catch (err) {
      console.error('CSV upload error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Trigger Simulated Integration Pull (Zendesk / App Store / Twitter)
  const handleTriggerSimulated = async (channelName: string) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback/simulated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: channelName }),
      });
      if (res.ok) {
        setIsSimulatedModalOpen(false);
        fetchInboxItems(1);
      }
    } catch (err) {
      console.error('Simulated channel pull error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getSentimentBadge = (s: string) => {
    switch (s) {
      case 'POS':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Positive</span>;
      case 'NEG':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Negative</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">Neutral</span>;
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'ACTIONED':
        return <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Actioned</span>;
      case 'REVIEWED':
        return <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-400"><Clock className="w-3.5 h-3.5" /> Reviewed</span>;
      default:
        return <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400"><AlertCircle className="w-3.5 h-3.5" /> New</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback text..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Channels</option>
            <option value="Support Ticket">Support Ticket</option>
            <option value="App Store Review">App Store Review</option>
            <option value="NPS Survey">NPS Survey</option>
            <option value="Sales Call Note">Sales Call Note</option>
            <option value="Community Post">Community Post</option>
            <option value="Zendesk">Zendesk</option>
            <option value="Twitter">Twitter</option>
          </select>

          <select
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Sentiments</option>
            <option value="POS">Positive</option>
            <option value="NEU">Neutral</option>
            <option value="NEG">Negative</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="ACTIONED">Actioned</option>
          </select>
        </div>

        {/* Actions (Single Entry, CSV Bulk, Simulate Channel) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsSingleModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Single Entry
          </button>

          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <Upload className="w-3.5 h-3.5" /> CSV Upload
          </button>

          <button
            onClick={() => setIsSimulatedModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-purple-500/30"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" /> Simulate Channel
          </button>
        </div>
      </div>

      {/* Main Feedback Table / Card List */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-400">Loading feedback items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Tag className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No feedback items match your filters</p>
            <p className="text-xs text-slate-500">Try clearing search or ingesting new items.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-900/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {item.channel}
                    </span>
                    {getSentimentBadge(item.sentiment)}
                    {item.featureArea && (
                      <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {item.featureArea}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-100 leading-relaxed">
                    "{item.content}"
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-[11px] text-slate-500">Customer: <strong className="text-slate-400">{item.customerLabel || 'N/A'}</strong></span>
                    {item.themes?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-indigo-400" />
                        <span className="text-[11px] font-semibold text-indigo-300">
                          {item.themes.map((t: any) => t.theme.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Triage & AI Reclassify Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Inline Status Dropdown */}
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="NEW">🔴 NEW</option>
                    <option value="REVIEWED">🟡 REVIEWED</option>
                    <option value="ACTIONED">🟢 ACTIONED</option>
                  </select>

                  {/* Manual Re-classify Button */}
                  <button
                    onClick={() => handleReclassify(item.id)}
                    disabled={reclassifyingId === item.id}
                    title="Re-classify with AI Engine"
                    className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors disabled:opacity-50"
                  >
                    {reclassifyingId === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    ) : (
                      <Bot className="w-4 h-4 text-purple-400" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Server-Side Pagination Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            Showing Page <strong className="text-white">{pagination.page}</strong> of <strong className="text-white">{pagination.totalPages}</strong> ({pagination.totalCount} items)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchInboxItems(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchInboxItems(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal 1: Single Item Creation */}
      {isSingleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Ingest Single Feedback Item</h3>
              <button onClick={() => setIsSingleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Channel Source</label>
                <select
                  value={singleChannel}
                  onChange={(e) => setSingleChannel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="Support Ticket">Support Ticket</option>
                  <option value="App Store Review">App Store Review</option>
                  <option value="NPS Survey">NPS Survey</option>
                  <option value="Sales Call Note">Sales Call Note</option>
                  <option value="Community Post">Community Post</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer / Account Label</label>
                <input
                  type="text"
                  value={singleCustomer}
                  onChange={(e) => setSingleCustomer(e.target.value)}
                  placeholder="e.g. Enterprise Client Acme"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Feedback Content *</label>
                <textarea
                  required
                  rows={4}
                  value={singleContent}
                  onChange={(e) => setSingleContent(e.target.value)}
                  placeholder="Enter verbatim customer feedback text..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSingleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ingest & Classify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: CSV Bulk Upload */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" /> Bulk CSV Ingestion
              </h3>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCsvSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center space-y-2">
                <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">Upload CSV File</p>
                <p className="text-[11px] text-slate-500">Columns supported: content, channel, customer_label</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400"
                />
              </div>

              {csvResult && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${csvResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400'}`}>
                  Import Summary: {csvResult.importedCount} Imported successfully | {csvResult.failedCount} Failed
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submitting || !csvFile}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 flex items-center gap-1.5 disabled:opacity-40"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start CSV Ingestion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Simulated Channel Trigger */}
      {isSimulatedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" /> Simulated Integration Pull
              </h3>
              <button onClick={() => setIsSimulatedModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select an integration connector to simulate an automated batch pull of realistic live feedback:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleTriggerSimulated('Zendesk')}
                disabled={submitting}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left flex items-center justify-between text-xs font-bold text-white transition-all"
              >
                <span>Sync Zendesk Support Tickets</span>
                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">3 Tickets</span>
              </button>

              <button
                onClick={() => handleTriggerSimulated('App Store')}
                disabled={submitting}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left flex items-center justify-between text-xs font-bold text-white transition-all"
              >
                <span>Pull App Store iOS Reviews</span>
                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">2 Reviews</span>
              </button>

              <button
                onClick={() => handleTriggerSimulated('Twitter')}
                disabled={submitting}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left flex items-center justify-between text-xs font-bold text-white transition-all"
              >
                <span>Fetch Twitter / X Mentions</span>
                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">2 Tweets</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
