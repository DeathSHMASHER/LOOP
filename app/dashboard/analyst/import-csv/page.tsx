"use client";

import Link from "next/link";
import { useState } from "react";

export default function ImportCsvPage() {
    const [fileName, setFileName] = useState("");

    return (
        <main className="min-h-screen bg-[#f5f7f6] p-6 text-slate-900 md:p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                            Analyst
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight">
                            Import CSV
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Upload customer feedback in CSV format for review and analysis.
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
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                        <p className="text-lg font-black">Choose a CSV file</p>
                        <p className="mt-2 text-sm text-slate-500">
                            Use a file containing customer feedback records.
                        </p>

                        <label className="mt-6 inline-flex cursor-pointer rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
                            Select CSV file
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                className="sr-only"
                                onChange={(event) =>
                                    setFileName(event.target.files?.[0]?.name ?? "")
                                }
                            />
                        </label>

                        {fileName && (
                            <p className="mt-4 text-sm font-semibold text-emerald-700">
                                Selected: {fileName}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/dashboard/analyst"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            disabled={!fileName}
                            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Start import
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}
