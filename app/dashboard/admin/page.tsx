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

type Role = "ADMIN" | "ANALYST" | "VIEWER";

type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Invited";
};

type FeedbackItem = {
  id: number;
  customer: string;
  channel: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  status: "NEW" | "REVIEWED" | "ACTIONED";
  content: string;
  time: string;
};

const volumeData = [
  { date: "Mon", feedback: 42 },
  { date: "Tue", feedback: 58 },
  { date: "Wed", feedback: 71 },
  { date: "Thu", feedback: 63 },
  { date: "Fri", feedback: 86 },
  { date: "Sat", feedback: 49 },
  { date: "Sun", feedback: 77 },
];

const sentimentData = [
  { name: "Positive", value: 58 },
  { name: "Neutral", value: 27 },
  { name: "Negative", value: 15 },
];

const themeData = [
  { theme: "Onboarding", count: 124 },
  { theme: "Performance", count: 96 },
  { theme: "Billing", count: 78 },
  { theme: "Mobile UX", count: 64 },
  { theme: "Support", count: 52 },
];

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Nandni Sharma",
    email: "nandni@loop.com",
    role: "ADMIN",
    status: "Active",
  },
  {
    id: 2,
    name: "Aarav Mehta",
    email: "aarav@loop.com",
    role: "ANALYST",
    status: "Active",
  },
  {
    id: 3,
    name: "Priya Singh",
    email: "priya@loop.com",
    role: "ANALYST",
    status: "Active",
  },
  {
    id: 4,
    name: "Rahul Verma",
    email: "rahul@loop.com",
    role: "VIEWER",
    status: "Invited",
  },
];

const feedbackItems: FeedbackItem[] = [
  {
    id: 1,
    customer: "Acme Inc.",
    channel: "Support",
    sentiment: "Negative",
    status: "NEW",
    content: "The onboarding flow is confusing and takes too long.",
    time: "8 min ago",
  },
  {
    id: 2,
    customer: "Nova Labs",
    channel: "App Store",
    sentiment: "Positive",
    status: "REVIEWED",
    content: "The new dashboard is much faster and easier to use.",
    time: "25 min ago",
  },
  {
    id: 3,
    customer: "CloudPeak",
    channel: "NPS Survey",
    sentiment: "Neutral",
    status: "ACTIONED",
    content: "The product works well but mobile navigation needs work.",
    time: "1 hr ago",
  },
  {
    id: 4,
    customer: "Vertex AI",
    channel: "Sales Note",
    sentiment: "Negative",
    status: "NEW",
    content: "Customer needs SSO before moving to enterprise plan.",
    time: "2 hrs ago",
  },
];

const sentimentColors = {
  Positive: "#10b981",
  Neutral: "#94a3b8",
  Negative: "#ef4444",
};

const roleStyles = {
  ADMIN: "bg-violet-50 text-violet-700",
  ANALYST: "bg-emerald-50 text-emerald-700",
  VIEWER: "bg-slate-100 text-slate-700",
};

const statusStyles = {
  NEW: "bg-amber-50 text-amber-700",
  REVIEWED: "bg-blue-50 text-blue-700",
  ACTIONED: "bg-emerald-50 text-emerald-700",
};

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("7D");
  const [activeSection, setActiveSection] = useState("Overview");
  const [feedbackFilter, setFeedbackFilter] = useState("All");

  const filteredFeedback = useMemo(() => {
    if (feedbackFilter === "All") {
      return feedbackItems;
    }

    return feedbackItems.filter(
      (item) => item.sentiment === feedbackFilter
    );
  }, [feedbackFilter]);

  const totalFeedback = 1842;
  const negativePercentage = 15;
  const newThisWeek = 426;
  const teamCount = teamMembers.length;

  return (
    <main className="min-h-screen bg-[#f5f7f6] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">

        {/* SIDEBAR */}
        <aside className="hidden w-[250px] flex-col border-r border-slate-200 bg-[#0b1220] p-5 text-white lg:flex">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-lg font-black text-slate-950">
              L
            </div>

            <div>
              <p className="text-sm font-black tracking-widest">LOOP</p>
              <p className="text-xs text-slate-400">Feedback Intelligence</p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Current workspace
            </p>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold">Acme Workspace</span>

              <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-300">
                ADMIN
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
              "Team",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveSection(item)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  activeSection === item
                    ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold text-white">Need insights?</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Ask LOOP questions about your customer feedback.
            </p>

            <button
              type="button"
              onClick={() => setActiveSection("Ask LOOP")}
              className="mt-3 w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-900 transition hover:bg-slate-200"
            >
              Ask LOOP
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <section className="flex-1 p-4 sm:p-6 lg:p-8">

          {/* HEADER */}
          <header className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                  Admin Workspace
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Feedback overview
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Monitor customer feedback, team activity, sentiment and
                  emerging themes across your workspace.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {["7D", "30D", "90D"].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setDateRange(range)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      dateRange === range
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {range}
                  </button>
                ))}

                <button
                  type="button"
                  className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                >
                  + Add feedback
                </button>
              </div>
            </div>
          </header>

          {/* KPI CARDS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total feedback"
              value={totalFeedback.toLocaleString()}
              change="+12.8%"
              description="vs previous period"
              icon="💬"
            />

            <StatCard
              label="Negative feedback"
              value={`${negativePercentage}%`}
              change="-3.4%"
              description="improving sentiment"
              icon="⚠️"
            />

            <StatCard
              label="New this week"
              value={newThisWeek.toString()}
              change="+18.2%"
              description="incoming feedback"
              icon="✨"
            />

            <StatCard
              label="Team members"
              value={teamCount.toString()}
              change="+2"
              description="active workspace users"
              icon="👥"
            />
          </section>

          {/* CHARTS */}
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">

            {/* VOLUME CHART */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Feedback volume
                  </p>

                  <h2 className="mt-2 text-xl font-black">
                    Incoming feedback
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Showing activity for {dateRange}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  +12.8%
                </span>
              </div>

              <div className="h-[300px]">
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
                        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="feedback"
                      stroke="#10b981"
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        fill: "#10b981",
                        strokeWidth: 2,
                        stroke: "#ffffff",
                      }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SENTIMENT CHART */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Sentiment
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Overall sentiment
                </h2>
              </div>

              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
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

              <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Positive sentiment
                  </span>

                  <span className="font-black text-emerald-600">
                    58%
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* THEMES */}
          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  AI themes
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Top customer themes
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Most frequently discussed areas in customer feedback.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveSection("Trends")}
                className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
              >
                View trends →
              </button>
            </div>

            <div className="h-[320px]">
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
                    axisLine={false}
                    tickLine={false}
                    width={95}
                    tick={{ fill: "#475569", fontSize: 12 }}
                  />

                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid #e2e8f0",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="#10b981"
                    radius={[0, 8, 8, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* FEEDBACK + TEAM */}
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

            {/* RECENT FEEDBACK */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Recent feedback
                  </p>

                  <h2 className="mt-2 text-xl font-black">
                    Latest customer signals
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["All", "Positive", "Neutral", "Negative"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setFeedbackFilter(filter)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        feedbackFilter === filter
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {feedback.customer}
                          </span>

                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                            {feedback.channel}
                          </span>

                          <span
                            className="rounded-full px-2 py-1 text-[10px] font-bold"
                            style={{
                              backgroundColor: `${sentimentColors[feedback.sentiment]}18`,
                              color: sentimentColors[feedback.sentiment],
                            }}
                          >
                            {feedback.sentiment}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {feedback.content}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {feedback.time}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[feedback.status]}`}
                      >
                        {feedback.status}
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
                      Try another filter.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* TEAM */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Workspace
                  </p>

                  <h2 className="mt-2 text-xl font-black">
                    Team members
                  </h2>
                </div>

                <button
                  type="button"
                  className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  + Invite
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-700">
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {member.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {member.email}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${roleStyles[member.role]}`}
                        >
                          {member.role}
                        </span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            member.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ADMIN QUICK ACTIONS */}
          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <QuickAction
              title="Manage team"
              description="Invite users and update workspace roles."
              action="Open team"
            />

            <QuickAction
              title="Generate report"
              description="Create a Voice-of-Customer report for leadership."
              action="View reports"
            />

            <QuickAction
              title="Ask LOOP"
              description="Ask questions and explore customer feedback."
              action="Ask LOOP"
            />
          </section>

          <footer className="mt-8 pb-6 text-center text-xs text-slate-400">
            LOOP Admin Dashboard · Demo data · Backend integration pending
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
    <div className="group rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
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

      <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function QuickAction({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <p className="font-black text-slate-900">{title}</p>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <button
        type="button"
        className="mt-4 text-sm font-bold text-emerald-700 hover:text-emerald-800"
      >
        {action} →
      </button>
    </div>
  );
}