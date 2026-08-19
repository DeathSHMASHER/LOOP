"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
type FeedbackStatus = "NEW" | "REVIEWED" | "ACTIONED";
type Sentiment = "Positive" | "Neutral" | "Negative";

type FeedbackItem = {
    id: number;
    customer: string;
    channel: string;
    sentiment: Sentiment;
    status: FeedbackStatus;
    content: string;
    theme: string;
    time: string;
};

const volumeData = [
    { date: "Mon", feedback: 34 },
    { date: "Tue", feedback: 48 },
    { date: "Wed", feedback: 62 },
    { date: "Thu", feedback: 55 },
    { date: "Fri", feedback: 74 },
    { date: "Sat", feedback: 41 },
    { date: "Sun", feedback: 68 },
];

const sentimentData = [
    { name: "Positive", value: 61 },
    { name: "Neutral", value: 24 },
    { name: "Negative", value: 15 },
];

const themeData = [
    { theme: "Onboarding", count: 84 },
    { theme: "Performance", count: 71 },
    { theme: "Billing", count: 58 },
    { theme: "Mobile UX", count: 46 },
    { theme: "Support", count: 39 },
];

const feedbackItems: FeedbackItem[] = [
    {
        id: 1,
        customer: "Acme Inc.",
        channel: "Support",
        sentiment: "Negative",
        status: "NEW",
        content: "The onboarding process is confusing and takes too long.",
        theme: "Onboarding",
        time: "8 min ago",
    },
    {
        id: 2,
        customer: "Nova Labs",
        channel: "App Store",
        sentiment: "Positive",
        status: "REVIEWED",
        content: "The new dashboard is much faster and easier to use.",
        theme: "Performance",
        time: "24 min ago",
    },
    {
        id: 3,
        customer: "CloudPeak",
        channel: "NPS Survey",
        sentiment: "Neutral",
        status: "ACTIONED",
        content: "The product is useful but mobile navigation needs improvement.",
        theme: "Mobile UX",
        time: "1 hr ago",
    },
    {
        id: 4,
        customer: "Vertex AI",
        channel: "Sales Note",
        sentiment: "Negative",
        status: "NEW",
        content: "Customer is asking for better enterprise billing controls.",
        theme: "Billing",
        time: "2 hrs ago",
    },
    {
        id: 5,
        customer: "BrightDesk",
        channel: "Community",
        sentiment: "Positive",
        status: "REVIEWED",
        content: "Support response times have improved a lot recently.",
        theme: "Support",
        time: "3 hrs ago",
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

export default function AnalystDashboard() {
    const [activeSection, setActiveSection] = useState("Overview");
    const router = useRouter();
    const [dateRange, setDateRange] = useState("7D");
    const [sentimentFilter, setSentimentFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedFeedback, setSelectedFeedback] =
        useState<FeedbackItem | null>(null);

    const [feedbackList, setFeedbackList] =
        useState<FeedbackItem[]>(feedbackItems);

    const filteredFeedback = useMemo(() => {
        return feedbackList.filter((item) => {
            const matchesSentiment =
                sentimentFilter === "All" ||
                item.sentiment === sentimentFilter;

            const matchesStatus =
                statusFilter === "All" ||
                item.status === statusFilter;

            const matchesSearch =
                item.content.toLowerCase().includes(search.toLowerCase()) ||
                item.customer.toLowerCase().includes(search.toLowerCase()) ||
                item.theme.toLowerCase().includes(search.toLowerCase());

            return matchesSentiment && matchesStatus && matchesSearch;
        });
    }, [feedbackList, sentimentFilter, statusFilter, search]);

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
                            <p className="text-xs text-slate-400">Analyst Workspace</p>
                        </div>
                    </div>

                    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Current role
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-semibold">Analyst</span>

                            <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-300">
                                ANALYST
                            </span>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {[
                            "Overview",
                            "Feedback Inbox",
                            "Trends",
                            "Ask LOOP",
                            "Reports",
                        ].map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => {
                                    if (item === "Feedback Inbox") {
                                        document
                                            .getElementById("feedback-inbox")
                                            ?.scrollIntoView({ behavior: "smooth" });

                                        setActiveSection(item);
                                        return;
                                    }

                                    if (item === "Trends") {
                                        router.push("/dashboard/analyst/trends");
                                        return;
                                    }
                                    if (item === "Ask LOOP") {
                                        router.push("/dashboard/analyst/ask-loop");
                                        return;
                                    }
                                    if (item === "Reports") {
                                        router.push("/dashboard/analyst/reports");
                                        return;
                                    }

                                    setActiveSection(item);
                                }}
                                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${activeSection === item
                                    ? "bg-emerald-400 text-slate-950"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold text-white">
                            Analyst focus
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            Review incoming feedback, identify patterns and take action on
                            important customer signals.
                        </p>

                        <button
                            type="button"
                            onClick={() => setActiveSection("Feedback Inbox")}
                            className="mt-3 w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-900 hover:bg-slate-200"
                        >
                            Open inbox
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <section className="flex-1 p-4 sm:p-6 lg:p-8">

                    {/* HEADER */}
                    <header className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                                    Analyst Workspace
                                </p>

                                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                                    Feedback intelligence
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                    Analyse customer feedback, monitor sentiment, discover
                                    themes and triage important signals.
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


                            </div>
                        </div>
                    </header>

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
                            label="Needs review"
                            value="128"
                            change="+7.2%"
                            description="new or unreviewed"
                            icon="🔎"
                        />

                        <StatCard
                            label="Negative feedback"
                            value="15%"
                            change="-3.4%"
                            description="sentiment improved"
                            icon="⚠️"
                        />

                        <StatCard
                            label="Actioned"
                            value="76%"
                            change="+9.1%"
                            description="triaged successfully"
                            icon="✓"
                        />
                    </section>

                    {/* CHART AREA */}
                    <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">

                        {/* VOLUME */}
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
                                        Feedback received over {dateRange}
                                    </p>
                                </div>

                                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                    +12.8%
                                </span>
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
                                Feedback health
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

                    {/* THEMES */}
                    <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-end justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Theme analysis
                                </p>

                                <h2 className="mt-2 text-xl font-black">
                                    Top customer themes
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Identify the areas customers talk about most.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setActiveSection("Trends")}
                                className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
                            >
                                Explore trends →
                            </button>
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
                                        fill="#10b981"
                                        radius={[0, 8, 8, 0]}
                                        barSize={20}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* INBOX */}
                    <section id="feedback-inbox" className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Feedback inbox
                                </p>

                                <h2 className="mt-2 text-xl font-black">
                                    Triage customer feedback
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Search, filter and update feedback status.
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

                            <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

                            {["All", "NEW", "REVIEWED", "ACTIONED"].map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setStatusFilter(filter)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold ${statusFilter === filter
                                        ? "bg-emerald-500 text-slate-950"
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
                                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">

                                        <div className="min-w-0 flex-1">
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

                                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                                                {item.content}
                                            </p>

                                            <p className="mt-2 text-xs text-slate-400">
                                                {item.time}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[item.status]}`}
                                            >
                                                {item.status}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => setSelectedFeedback(item)}
                                                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredFeedback.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                                    <p className="font-bold text-slate-700">
                                        No feedback found
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Try changing your search or filters.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* QUICK ACTIONS */}
                    <section className="mt-6 grid gap-4 md:grid-cols-3">
                        <ActionCard
                            icon="↑"
                            title="Import CSV"
                            description="Bulk import customer feedback and review failed rows."
                            button="Import feedback"
                            onClick={() => router.push("/dashboard/analyst/import-csv")}
                        />

                        <ActionCard
                            icon="◎"
                            title="Simulate channel"
                            description="Add realistic seed feedback from a simulated source."
                            button="Simulate source"
                            onClick={() => router.push("/dashboard/analyst/simulate-source")}
                        />

                        <ActionCard
                            icon="✦"
                            title="Ask LOOP"
                            description="Ask questions about customer sentiment and themes."
                            button="Open Ask LOOP"
                            onClick={() => router.push("/dashboard/analyst/ask-loop")}
                        />
                    </section>

                    <footer className="mt-8 pb-6 text-center text-xs text-slate-400">
                        LOOP Analyst Dashboard · Demo data · Backend integration pending
                    </footer>
                    {selectedFeedback && (
                        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-sm">
                            <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl">

                                {/* PANEL HEADER */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                                            Feedback Details
                                        </p>

                                        <h2 className="mt-2 text-2xl font-black text-slate-900">
                                            {selectedFeedback.customer}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {selectedFeedback.channel} · {selectedFeedback.time}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedFeedback(null)}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-600 hover:bg-slate-200"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* TAGS */}
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <span
                                        className="rounded-full px-3 py-1.5 text-xs font-bold"
                                        style={{
                                            backgroundColor: `${sentimentColors[selectedFeedback.sentiment]}18`,
                                            color: sentimentColors[selectedFeedback.sentiment],
                                        }}
                                    >
                                        {selectedFeedback.sentiment}
                                    </span>

                                    <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                                        {selectedFeedback.theme}
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[selectedFeedback.status]}`}
                                    >
                                        {selectedFeedback.status}
                                    </span>
                                </div>

                                {/* FEEDBACK */}
                                <div className="mt-8">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Customer feedback
                                    </p>

                                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-sm leading-7 text-slate-700">
                                            {selectedFeedback.content}
                                        </p>
                                    </div>
                                </div>

                                {/* ANALYSIS */}
                                <div className="mt-8">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Analysis
                                    </p>

                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Sentiment
                                            </p>

                                            <p className="mt-1 font-black text-slate-900">
                                                {selectedFeedback.sentiment}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Theme
                                            </p>

                                            <p className="mt-1 font-black text-slate-900">
                                                {selectedFeedback.theme}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* STATUS WORKFLOW */}
                                <div className="mt-8">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Workflow
                                    </p>

                                    <div className="mt-4 flex items-center gap-2">
                                        {["NEW", "REVIEWED", "ACTIONED"].map((status, index) => {
                                            const isActive =
                                                selectedFeedback.status === status;

                                            return (
                                                <div
                                                    key={status}
                                                    className="flex flex-1 items-center gap-2"
                                                >
                                                    <div
                                                        className={`flex h-9 w-full items-center justify-center rounded-xl text-xs font-bold ${isActive
                                                            ? "bg-emerald-500 text-slate-950"
                                                            : "bg-slate-100 text-slate-400"
                                                            }`}
                                                    >
                                                        {status}
                                                    </div>

                                                    {index < 2 && (
                                                        <span className="text-slate-300">
                                                            →
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="mt-8 flex gap-3">

                                    {selectedFeedback.status === "NEW" && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFeedbackList((current) =>
                                                    current.map((feedback) =>
                                                        feedback.id === selectedFeedback.id
                                                            ? {
                                                                ...feedback,
                                                                status: "REVIEWED",
                                                            }
                                                            : feedback
                                                    )
                                                );

                                                setSelectedFeedback({
                                                    ...selectedFeedback,
                                                    status: "REVIEWED",
                                                });
                                            }}
                                            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400"
                                        >
                                            Mark as Reviewed
                                        </button>
                                    )}

                                    {selectedFeedback.status === "REVIEWED" && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFeedbackList((current) =>
                                                    current.map((feedback) =>
                                                        feedback.id === selectedFeedback.id
                                                            ? {
                                                                ...feedback,
                                                                status: "ACTIONED",
                                                            }
                                                            : feedback
                                                    )
                                                );

                                                setSelectedFeedback({
                                                    ...selectedFeedback,
                                                    status: "ACTIONED",
                                                });
                                            }}
                                            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400"
                                        >
                                            Mark as Actioned
                                        </button>
                                    )}

                                    {selectedFeedback.status === "ACTIONED" && (
                                        <div className="flex-1 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700">
                                            ✓ Feedback actioned
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setSelectedFeedback(null)}
                                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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

function ActionCard({
    icon,
    title,
    description,
    button,
    onClick,
}: {
    icon: string;
    title: string;
    description: string;
    button: string;
    onClick?: () => void;
}) {
    return (
        <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-black text-emerald-700">
                {icon}
            </div>

            <h3 className="mt-4 font-black">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
            </p>

            <button
                type="button"
                onClick={onClick}
                className="mt-4 text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
                {button} →
            </button>
        </div>
    );
}