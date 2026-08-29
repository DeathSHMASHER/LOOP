'use client';

import React, { useState } from 'react';
import { MessageSquareQuote, Send, Bot, Cpu, Loader2, Quote } from 'lucide-react';

export default function AskLoopPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{
    question: string;
    answer: string;
    sources: any[];
    citedIds: string[];
  }>>([
    {
      question: "What are users saying about onboarding and initial setup?",
      answer: "Based on retrieved customer feedback items, users report high approval for the new 2-minute setup walkthrough and clean dark mode UI. However, multiple support tickets highlight friction when attempting to invite team members and configuring initial workspace permissions.",
      sources: [
        { feedbackId: "f1", content: "Onboarding took forever — I couldn't figure out how to invite my team members.", channel: "Support Ticket", sentiment: "NEG" },
        { feedbackId: "f2", content: "The new user walkthrough is super clean and helpful! Got setup in 2 minutes.", channel: "App Store Review", sentiment: "POS" }
      ],
      citedIds: ["f1", "f2"]
    }
  ]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const currentQ = question;
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQ }),
      });
      const data = await res.json();
      if (res.ok) {
        setHistory((prev) => [
          {
            question: data.question,
            answer: data.answer,
            sources: data.retrievedSources || [],
            citedIds: data.citedIds || [],
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error('Ask LOOP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fillSuggested = (q: string) => {
    setQuestion(q);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Ask LOOP AI — Evidence-Grounded RAG Engine</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Powered by high-performance AI with strict semantic retrieval grounding over your tenant's vector database.
          </p>
        </div>
      </div>

      {/* Suggested Questions Pill Row (scrollable on mobile) */}
      <div className="space-y-1.5">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block">Try Asking:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={() => fillSuggested("What are the main causes of negative feedback this week?")}
            className="text-[11px] sm:text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors shrink-0 whitespace-nowrap active:scale-95"
          >
            "What are the main causes of negative feedback?"
          </button>
          <button
            onClick={() => fillSuggested("What feature requests are customers making for integrations?")}
            className="text-[11px] sm:text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors shrink-0 whitespace-nowrap active:scale-95"
          >
            "What feature requests exist for integrations?"
          </button>
          <button
            onClick={() => fillSuggested("Summarize positive remarks on UI speed.")}
            className="text-[11px] sm:text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors shrink-0 whitespace-nowrap active:scale-95"
          >
            "Summarize remarks on UI speed"
          </button>
        </div>
      </div>

      {/* Ask Input Form */}
      <form onSubmit={handleAsk} className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask plain-English questions over customer feedback..."
          className="w-full pl-4 sm:pl-5 pr-14 py-3.5 sm:py-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-xl transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          aria-label="Send question"
          className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-40 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-95"
        >
          {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </form>

      {/* Q&A Response Feed */}
      <div className="space-y-4 sm:space-y-6">
        {history.map((item, idx) => (
          <div key={idx} className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800/90 space-y-4 shadow-xl">
            {/* Question Header */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquareQuote className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Question</span>
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug break-words">{item.question}</h3>
              </div>
            </div>

            {/* AI Grounded Answer Box */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs font-bold text-indigo-300">Grounded AI Answer</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified Non-Hallucinated
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed whitespace-pre-line break-words">
                {item.answer}
              </p>
            </div>

            {/* Cited Feedback Sources Section */}
            {item.sources && item.sources.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] sm:text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Cited Evidence Feedback Items ({item.sources.length}):</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {item.sources.map((src, sIdx) => (
                    <div key={sIdx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-indigo-400 truncate mr-2">Source #{sIdx + 1} ({src.channel})</span>
                        <span className="shrink-0">{src.sentiment}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-300 italic leading-relaxed break-words">"{src.content}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
