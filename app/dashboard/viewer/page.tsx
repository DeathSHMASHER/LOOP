"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Sentiment = "Positive" | "Neutral" | "Negative";

type FeedbackItem = {
  id: number;
  customer: string;
  channel: string;
  sentiment: Sentiment;
  theme: string;
  status: "NEW" | "REVIEWED" | "ACTIONED";
  content: string;
  time: string;
};

const volumeData = [
  { date: "Mon", feedback: 38 },
  { date: "Tue", feedback: 51 },
  { date: "Wed", feedback: 65 },
  { date: "Thu", feedback: 57 },
  { date: "Fri", feedback: 79 },
  { date: "Sat", feedback: 44 },
  { date: "Sun", feedback: 69 },
];

const sentimentData = [
  { name: "Positive", value: 60 },
  { name: "Neutral", value: 25 },
  { name: "Negative", value: 15 },
];

const themeData = [
  { theme: "Onboarding", count: 88 },
  { theme: "Performance", count: 74 },
  { theme: "Billing", count: 61 },
  { theme: "Mobile UX", count: 48 },
  { theme: "Support", count: 42 },
];

const feedbackItems: FeedbackItem[] = [
  {
    id: 1,
    customer: "Acme Inc.",
    channel: "Support",
    sentiment: "Negative",
    theme: "Onboarding",
    status: "NEW",
    content: "The onboarding process is confusing and takes too long.",
    time: "10 min ago",
  },
  {
    id: 2,
    customer: "Nova Labs",
    channel: "App Store",
    sentiment: "Positive",
    theme: "Performance",
    status: "REVIEWED",
    content: "The new dashboard feels faster and much easier to navigate.",
    time: "32 min ago",
  },
  {
    id: 3,
    customer: "CloudPeak",
    channel: "NPS Survey",
    sentiment: "Neutral",
    theme: "Mobile UX",
    status: "ACTIONED",
    content: "The product works well but mobile navigation could be better.",
    time: "1 hr ago",
  },
  {
    id: 4,
    customer: "Vertex AI",
    channel: "Sales Note",
    sentiment: "Negative",
    theme: "Billing",
    status: "NEW",
    content: "Enterprise customers need better invoice management.",
    time: "2 hrs ago",
  },
];

const sentimentColors = {
  Positive: "#10b981",
  Neutral: "#94a3b8",
  Negative: "#ef4444",
};

const statusStyles = {
  NEW: "bg-amber-50 text-amber-700",
  REVIEWED: "bg-blue-50 text-blue-700",
  ACTIONED: "bg-emerald-50 text-emerald-700",
};

export default function ViewerDashboard() {
  const [activeSection, setActiveSection] = useState("Overview");
  const [dateRange, setDateRange] = useState("7D");
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("All");

  const filteredFeedback = useMemo(() => {
    return feedbackItems.filter((item) => {
      const matchesSearch =
        item.customer.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase()) ||
        item.theme.toLowerCase().includes(search.toLowerCase());

      const matchesSentiment =
        sentimentFilter === "All" ||
        item.sentiment === sentimentFilter;

      return matchesSearch && matchesSentiment;
    });
  }, [search, sentimentFilter]);

  return (
    <main className="min-h-screen bg-[#f5f7f6] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">

        {/* SIDEBAR */}
        <aside className="hidden w-62.5 flex-col border-r border-slate-200 bg-[#0b1220] p-5 text-white lg:flex">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-lg font-black text-slate-950">
              L
            </div>

            <div>
              <p className="text-sm font-black tracking-widest">LOOP</p>
              <p className="text-xs text-slate-400">Viewer Workspace</p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Current role
            </p>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold">Viewer</span>

              <span className="rounded-full bg-sky-400/15 px-2 py-1 text-[10px] font-bold text-sky-300">
                VIEWER
              </span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              "Overview",
              "Feedback",
              "Analytics",
              "Trends",
              "Ask LOOP",
              "Reports",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveSection(item)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${activeSection === item
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* READ ONLY INFO */}
          <div className="mt-auto rounded-2xl border border-sky-400/10 bg-sky-400/5 p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-400/10 text-xs">
                👁
              </span>
              <p className="text-xs font-bold text-white">
                Read-only workspace
              </p>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              You can explore company feedback and insights. Editing and
              workspace management are restricted.
            </p>
          </div>
        </aside>

        {/* MAIN */}
        <section className="flex-1 p-4 sm:p-6 lg:p-8">

          {/* HEADER */}
          <header className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
                  Viewer Workspace
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Customer insights
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Explore customer feedback, sentiment, trends and reports
                  across your company workspace.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {["7D", "30D", "90D"].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setDateRange(range)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${dateRange === range
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                  >
                    {range}
                  </button>
                ))}

                <button
                  type="button"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  + Give feedback
                </button>
              </div>
            </div>
          </header>

          {/* VIEWER PERMISSION BANNER */}
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-sky-900">
                Viewer access
              </p>

              <p className="mt-1 text-xs leading-5 text-sky-700">
                You can view workspace insights and submit customer feedback.
                Administrative actions are unavailable.
              </p>
            </div>

            <span className="w-fit rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-sky-700 shadow-sm">
              Read Only
            </span>
          </div>

          {/* KPI CARDS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total feedback"
              value="1,842"
              change="+12.8%"
              description="items in workspace"
              icon="💬"
            />

            <StatCard
              label="Positive feedback"
              value="60%"
              change="+5.2%"
              description="overall sentiment"
              icon="😊"
            />

            <StatCard
              label="Negative feedback"
              value="15%"
              change="-3.4%"
              description="overall sentiment"
              icon="⚠️"
            />

            <StatCard
              label="New this week"
              value="426"
              change="+18.2%"
              description="incoming feedback"
              icon="✨"
            />
          </section>

          {/* CHARTS */}
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">

            {/* VOLUME */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Feedback activity
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Feedback volume
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Customer feedback received over {dateRange}
                </p>
              </div>

              <div className="h-75">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volumeData}>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="feedback"
                      stroke="#10b981"
                      strokeWidth={4}
                      dot={{ r: 4 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SENTIMENT */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Sentiment
              </p>

              <h2 className="mt-2 text-xl font-black">
                Sentiment overview
              </h2>

              <div className="h-62.5">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {sentimentData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={
                            sentimentColors[
                            entry.name as keyof typeof sentimentColors
                            ]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip />

                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(value) => (
                        <span className="text-xs text-slate-600">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* TOP THEMES */}
          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Customer themes
              </p>

              <h2 className="mt-2 text-xl font-black">
                What customers talk about
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Most frequently discussed topics in the workspace.
              </p>
            </div>

            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={themeData}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    horizontal={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />

                  <YAxis
                    type="category"
                    dataKey="theme"
                    width={90}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#475569", fontSize: 12 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    fill="#0ea5e9"
                    radius={[0, 8, 8, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* FEEDBACK */}
          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Feedback
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Recent customer feedback
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Read-only view of recent customer signals.
                </p>
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search feedback..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 xl:w-65"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["All", "Positive", "Neutral", "Negative"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSentimentFilter(filter)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${sentimentFilter === filter
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {filteredFeedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {item.customer}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                          {item.channel}
                        </span>

                        <span
                          className="rounded-full px-2 py-1 text-[10px] font-bold"
                          style={{
                            backgroundColor: `${sentimentColors[item.sentiment]}18`,
                            color: sentimentColors[item.sentiment],
                          }}
                        >
                          {item.sentiment}
                        </span>

                        <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">
                          {item.theme}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.content}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {item.time}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}

              {filteredFeedback.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="font-bold text-slate-700">
                    No feedback found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try another search or filter.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* GIVE FEEDBACK */}
          <section className="mt-6 rounded-[28px] border border-emerald-200 bg-linear-to-br from-emerald-50 to-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Share your feedback
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Have something to tell the company?
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Share your experience or a suggestion. Your feedback can
                  help the team identify opportunities for improvement.
                </p>
              </div>

              <button
                type="button"
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-400"
              >
                Give feedback →
              </button>
            </div>
          </section>

          {/* REPORTS */}
          <section className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Weekly report
              </p>

              <h3 className="mt-2 text-lg font-black">
                Voice of Customer
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review the latest customer themes, sentiment shifts and
                notable feedback.
              </p>

              <button
                type="button"
                className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                View report →
              </button>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Ask LOOP
              </p>

              <h3 className="mt-2 text-lg font-black">
                Explore customer insights
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ask plain-English questions about what customers are saying.
              </p>

              <button
                type="button"
                className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
              >
                Ask LOOP →
              </button>
            </div>
          </section>

          <footer className="mt-8 pb-6 text-center text-xs text-slate-400">
            LOOP Viewer Dashboard · Demo data · Backend integration pending
          </footer>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  change,
  description,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg">
          {icon}
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          {change}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}