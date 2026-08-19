"use client";

import Link from "next/link";
import { useState } from "react";

const sources = ["Support inbox", "App Store", "NPS survey", "Community"];

export default function SimulateSourcePage() {
    const [source, setSource] = useState(sources[0]);
    const [volume, setVolume] = useState("10");
    const [started, setStarted] = useState(false);

    return (
        <main className="min-h-screen bg-[#f5f7f6] p-6 text-slate-900 md:p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                            Analyst
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight">
                            Simulate source
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Add realistic sample feedback to test your analysis workflow.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/analyst"
                        className="inline-flex w-fit rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        Back to dashboard
                    </Link>
                </div>

                <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="source"
                                className="mb-2 block text-sm font-bold text-slate-700"
                            >
                                Feedback source
                            </label>
                            <select
                                id="source"
                                value={source}
                                onChange={(event) => setSource(event.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            >
                                {sources.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="volume"
                                className="mb-2 block text-sm font-bold text-slate-700"
                            >
                                Number of records
                            </label>
                            <input
                                id="volume"
                                type="number"
                                min="1"
                                max="100"
                                value={volume}
                                onChange={(event) => setVolume(event.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            />
                        </div>
                    </div>

                    {started && (
                        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                            {volume} sample feedback records are ready from {source}.
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/dashboard/analyst"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={() => setStarted(true)}
                            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                        >
                            Generate sample feedback
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}
