"use client";

import { useState } from "react";

const suggestedQuestions = [
  "What are the main complaints this week?",
  "Why is negative sentiment increasing?",
  "Which customer theme needs attention?",
  "What are the most common product issues?",
];

const recentQuestions = [
  {
    question: "What are the main complaints this week?",
    time: "Today, 10:42 AM",
  },
  {
    question: "Which customer theme needs attention?",
    time: "Yesterday, 4:18 PM",
  },
  {
    question: "What are the most common product issues?",
    time: "Yesterday, 11:06 AM",
  },
];

export default function AskLoopPage() {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");

  const handleAsk = () => {
    if (!question.trim()) return;

    setSubmittedQuestion(question);
  };

  const handleSuggestedQuestion = (item: string) => {
    setQuestion(item);
  };

  return (
    <main className="min-h-screen bg-[#f7f9fb] p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7890b2]">
          Analyst
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-[#071b3a]">
          Ask LOOP
        </h1>

        <p className="mt-2 text-sm text-[#60789d]">
          Ask questions about customer feedback and get actionable insights.
        </p>
      </div>

      {/* Ask Box */}
      <section className="rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#071b3a]">
            What would you like to know?
          </h2>

          <p className="mt-1 text-sm text-[#60789d]">
            Ask LOOP about feedback, sentiment, themes or customer issues.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
            placeholder="e.g. What are the main complaints this week?"
            className="flex-1 rounded-xl border border-[#dce5ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#071b3a] outline-none transition placeholder:text-[#94a3b8] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />

          <button
            type="button"
            onClick={handleAsk}
            disabled={!question.trim()}
            className="rounded-xl bg-[#071b3a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102d52] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ask LOOP
          </button>
        </div>
      </section>

      {/* Suggested Questions */}
      <section className="mt-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#071b3a]">
            Suggested questions
          </h2>

          <p className="mt-1 text-sm text-[#60789d]">
            Start with one of these common analyst questions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {suggestedQuestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSuggestedQuestion(item)}
              className="rounded-2xl border border-[#dce5ef] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
            >
              <span className="text-sm font-medium text-[#071b3a]">
                {item}
              </span>

              <span className="mt-2 block text-xs text-[#7890b2]">
                Click to ask LOOP
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Answer */}
      {submittedQuestion && (
        <section className="mt-6 rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7890b2]">
                Your question
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#071b3a]">
                {submittedQuestion}
              </h2>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              LOOP Insight
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-[#f8fafc] p-5">
            <p className="text-sm leading-7 text-[#4f6688]">
              LOOP will analyze the available feedback and provide a
              structured insight here. This section is ready to be connected
              to the AI classification and Ask LOOP API.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#e5ebf2] bg-white p-4">
              <p className="text-xs text-[#7890b2]">Sentiment</p>
              <p className="mt-1 font-semibold text-[#071b3a]">
                Awaiting analysis
              </p>
            </div>

            <div className="rounded-xl border border-[#e5ebf2] bg-white p-4">
              <p className="text-xs text-[#7890b2]">Key Theme</p>
              <p className="mt-1 font-semibold text-[#071b3a]">
                Awaiting analysis
              </p>
            </div>

            <div className="rounded-xl border border-[#e5ebf2] bg-white p-4">
              <p className="text-xs text-[#7890b2]">Priority</p>
              <p className="mt-1 font-semibold text-[#071b3a]">
                Awaiting analysis
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Recent Questions */}
      <section className="mt-6 rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#071b3a]">
            Recent questions
          </h2>

          <p className="mt-1 text-sm text-[#60789d]">
            Your recently asked questions.
          </p>
        </div>

        <div className="divide-y divide-[#edf1f5]">
          {recentQuestions.map((item) => (
            <button
              key={item.question}
              type="button"
              onClick={() => setQuestion(item.question)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left first:pt-0 last:pb-0"
            >
              <span className="text-sm font-medium text-[#071b3a]">
                {item.question}
              </span>

              <span className="shrink-0 text-xs text-[#94a3b8]">
                {item.time}
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}