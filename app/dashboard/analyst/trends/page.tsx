"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const volumeData = [
  { day: "Mon", feedback: 34 },
  { day: "Tue", feedback: 48 },
  { day: "Wed", feedback: 62 },
  { day: "Thu", feedback: 55 },
  { day: "Fri", feedback: 74 },
  { day: "Sat", feedback: 41 },
  { day: "Sun", feedback: 68 },
];

const sentimentData = [
  { day: "Mon", positive: 58, neutral: 28, negative: 14 },
  { day: "Tue", positive: 61, neutral: 25, negative: 14 },
  { day: "Wed", positive: 64, neutral: 23, negative: 13 },
  { day: "Thu", positive: 60, neutral: 25, negative: 15 },
  { day: "Fri", positive: 67, neutral: 21, negative: 12 },
  { day: "Sat", positive: 63, neutral: 24, negative: 13 },
  { day: "Sun", positive: 69, neutral: 20, negative: 11 },
];

const themeData = [
  { theme: "Onboarding", current: 84, previous: 68 },
  { theme: "Performance", current: 72, previous: 61 },
  { theme: "Billing", current: 59, previous: 64 },
  { theme: "Mobile UX", current: 46, previous: 38 },
  { theme: "Support", current: 41, previous: 45 },
];

export default function TrendsPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fb] p-6 md:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7890b2]">
            Analyst
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#071b3a]">
            Trends
          </h1>

          <p className="mt-2 text-sm text-[#60789d]">
            Track how customer feedback, sentiment and themes change over time.
          </p>
        </div>

        {/* Date filters */}
        <div className="flex w-fit rounded-xl border border-[#dce5ef] bg-white p-1 shadow-sm">
          <button className="rounded-lg bg-[#071b3a] px-4 py-2 text-sm font-semibold text-white">
            7D
          </button>

          <button className="rounded-lg px-4 py-2 text-sm font-semibold text-[#60789d] hover:bg-[#f1f5f9]">
            30D
          </button>

          <button className="rounded-lg px-4 py-2 text-sm font-semibold text-[#60789d] hover:bg-[#f1f5f9]">
            90D
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#dce5ef] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7890b2]">Feedback Volume</p>
          <div className="mt-2 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-[#071b3a]">382</h2>
            <span className="rounded-full bg-[#e8faf3] px-3 py-1 text-xs font-semibold text-[#00a878]">
              +12.8%
            </span>
          </div>
          <p className="mt-2 text-xs text-[#7890b2]">vs previous period</p>
        </div>

        <div className="rounded-2xl border border-[#dce5ef] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7890b2]">Positive Sentiment</p>
          <div className="mt-2 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-[#071b3a]">69%</h2>
            <span className="rounded-full bg-[#e8faf3] px-3 py-1 text-xs font-semibold text-[#00a878]">
              +5.4%
            </span>
          </div>
          <p className="mt-2 text-xs text-[#7890b2]">sentiment improved</p>
        </div>

        <div className="rounded-2xl border border-[#dce5ef] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7890b2]">Negative Sentiment</p>
          <div className="mt-2 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-[#071b3a]">11%</h2>
            <span className="rounded-full bg-[#e8faf3] px-3 py-1 text-xs font-semibold text-[#00a878]">
              -3.4%
            </span>
          </div>
          <p className="mt-2 text-xs text-[#7890b2]">vs previous period</p>
        </div>

        <div className="rounded-2xl border border-[#dce5ef] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7890b2]">Top Growing Theme</p>
          <div className="mt-2 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-[#071b3a]">Mobile UX</h2>
            <span className="rounded-full bg-[#e8faf3] px-3 py-1 text-xs font-semibold text-[#00a878]">
              +21%
            </span>
          </div>
          <p className="mt-2 text-xs text-[#7890b2]">more mentions</p>
        </div>
      </section>

      {/* Feedback Volume */}
      <section className="mt-6 rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7890b2]">
            Feedback activity
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#071b3a]">
            Feedback volume trend
          </h2>

          <p className="mt-1 text-sm text-[#60789d]">
            Number of feedback items received each day.
          </p>
        </div>

        <div style={{ height: "320px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5ebf2"
              />

              <XAxis
                dataKey="day"
                tick={{ fill: "#7890b2", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#7890b2", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="feedback"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Sentiment Trend */}
      <section className="mt-6 rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7890b2]">
            Sentiment
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#071b3a]">
            Sentiment movement
          </h2>

          <p className="mt-1 text-sm text-[#60789d]">
            Monitor positive, neutral and negative feedback over time.
          </p>
        </div>

        <div style={{ height: "320px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5ebf2"
              />

              <XAxis
                dataKey="day"
                tick={{ fill: "#7890b2", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: "#7890b2", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip formatter={(value) => `${value}%`} />

              <Legend />

              <Line
                type="monotone"
                dataKey="positive"
                name="Positive"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="neutral"
                name="Neutral"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="negative"
                name="Negative"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Theme Comparison */}
      <section className="mt-6 rounded-2xl border border-[#dce5ef] bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7890b2]">
            Customer themes
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#071b3a]">
            Theme movement
          </h2>

          <p className="mt-1 text-sm text-[#60789d]">
            Compare current theme mentions with the previous period.
          </p>
        </div>

        <div style={{ height: "340px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={themeData}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5ebf2"
              />

              <XAxis
                type="number"
                tick={{ fill: "#7890b2", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="theme"
                width={100}
                tick={{ fill: "#60789d", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="current"
                name="Current period"
                fill="#10b981"
                radius={[0, 6, 6, 0]}
              />

              <Bar
                dataKey="previous"
                name="Previous period"
                fill="#cbd5e1"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Insights */}
      <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#dce5ef] bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#00a878]">
            Positive signal
          </span>

          <h3 className="mt-3 text-lg font-bold text-[#071b3a]">
            Sentiment is improving
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#60789d]">
            Positive feedback has increased consistently across the
            selected period.
          </p>
        </div>

        <div className="rounded-2xl border border-[#dce5ef] bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#f59e0b]">
            Watch
          </span>

          <h3 className="mt-3 text-lg font-bold text-[#071b3a]">
            Mobile UX is growing
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#60789d]">
            Mobile UX mentions have increased compared with the previous
            period and may need deeper review.
          </p>
        </div>

        <div className="rounded-2xl border border-[#dce5ef] bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
            Observation
          </span>

          <h3 className="mt-3 text-lg font-bold text-[#071b3a]">
            Billing mentions are declining
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#60789d]">
            Billing-related feedback is lower than the previous period,
            indicating fewer recurring concerns.
          </p>
        </div>
      </section>
    </main>
  );
}