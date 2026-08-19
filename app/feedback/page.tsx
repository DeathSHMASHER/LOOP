"use client";

import Link from "next/link";
import { useState } from "react";

export default function FeedbackPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        category: "General",
        rating: 5,
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === "rating" ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen bg-[#f5f7f5] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Feedback</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Share your thoughts</h1>
                    </div>
                    <Link
                        href="/dashboard"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        Back to dashboard
                    </Link>
                </div>

                <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-8">
                    {submitted ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Thanks!</p>
                            <h2 className="mt-3 text-2xl font-black">Your feedback has been submitted.</h2>
                            <p className="mt-2 text-slate-600">
                                We appreciate the time you took to help improve LOOP.
                            </p>
                            <Link
                                href="/dashboard"
                                className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                                Return to dashboard
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                    >
                                        <option>General</option>
                                        <option>Bug</option>
                                        <option>UI/UX</option>
                                        <option>Feature request</option>
                                        <option>Performance</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Experience rating</label>
                                    <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${form.rating >= value
                                                        ? "bg-amber-400 text-amber-950"
                                                        : "bg-white text-slate-400"
                                                    }`}
                                                aria-label={`Rate ${value} out of 5`}
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                    placeholder="Tell us what went well, what needs improvement, or what you want to see next."
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                                >
                                    Submit feedback
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </div>
        </main>
    );
}
