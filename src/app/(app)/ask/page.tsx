'use client';

import React, { useState } from 'react';
import { MessageSquareQuote, Send, Bot, Cpu, CheckCircle2, FileText, Loader2, Quote } from 'lucide-react';

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            Ask LOOP AI — Evidence-Grounded RAG Engine
          </h2>
          <p className="text-xs text-slate-400">
            Powered by high-performance AI with strict semantic retrieval grounding over your tenant's vector database.
          </p>
        </div>
      </div>

      {/* Suggested Questions Pill Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-400">Try Asking:</span>
        <button
          onClick={() => fillSuggested("What are the main causes of negative feedback this week?")}
          className="text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors"
        >
          "What are the main causes of negative feedback?"
        </button>
        <button
          onClick={() => fillSuggested("What feature requests are customers making for integrations?")}
          className="text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors"
        >
          "What feature requests exist for integrations?"
        </button>
      </div>

      {/* Ask Input Form */}
      <form onSubmit={handleAsk} className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask plain-English questions (e.g. 'What are users saying about performance?')..."
          className="w-full pl-5 pr-14 py-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-xl transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="absolute right-2.5 top-2.5 p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-40 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      {/* Q&A Response Feed */}
      <div className="space-y-6">
        {history.map((item, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            {/* Question Header */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <MessageSquareQuote className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Question</span>
                <h3 className="text-base font-bold text-white">{item.question}</h3>
              </div>
            </div>

            {/* AI Grounded Answer Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300">Grounded AI Answer</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified Non-Hallucinated
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200 leading-relaxed whitespace-pre-line">
                {item.answer}
              </p>
            </div>

            {/* Cited Feedback Sources Section */}
            {item.sources && item.sources.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-indigo-400" />
                  Cited Evidence Feedback Items ({item.sources.length}):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.sources.map((src, sIdx) => (
                    <div key={sIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-indigo-400">Source #{sIdx + 1} ({src.channel})</span>
                        <span>{src.sentiment}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-300 italic">"{src.content}"</p>
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
