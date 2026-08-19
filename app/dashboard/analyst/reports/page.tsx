import Link from "next/link";

const reports = [
    {
        title: "Weekly feedback summary",
        description: "A concise view of volume, sentiment and key customer themes.",
        period: "This week",
    },
    {
        title: "Sentiment health report",
        description: "Track positive, neutral and negative feedback across channels.",
        period: "Last 30 days",
    },
    {
        title: "Theme movement report",
        description: "Compare growing and declining customer themes over time.",
        period: "Last 90 days",
    },
];

export default function ReportsPage() {
    return (
        <main className="min-h-screen bg-[#f5f7f6] p-6 text-slate-900 md:p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                            Analyst
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight">Reports</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Review prepared summaries and customer feedback insights.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/analyst"
                        className="inline-flex w-fit rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        Back to dashboard
                    </Link>
                </div>

                <section className="grid gap-5 md:grid-cols-3">
                    {reports.map((report) => (
                        <article
                            key={report.title}
                            className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                                {report.period}
                            </span>
                            <h2 className="mt-3 text-lg font-black">{report.title}</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {report.description}
                            </p>
                            <button
                                type="button"
                                className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                            >
                                Open report
                            </button>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}
