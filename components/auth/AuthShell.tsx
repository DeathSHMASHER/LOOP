import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

const pulseItems = [
  { label: "Design review", value: "Ready", color: "bg-emerald-500" },
  { label: "OAuth session", value: "Secure", color: "bg-sky-500" },
  { label: "Workspace sync", value: "Live", color: "bg-amber-500" },
];

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f7f7f2] px-5 py-6 text-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-400 text-base font-black text-slate-950">
                LP
              </div>
              <div>
                <p className="text-lg font-bold tracking-[0.22em]">LOOP</p>
                <p className="text-xs font-medium text-slate-400">
                  Workspace access
                </p>
              </div>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-emerald-200">
              Secure
            </span>
          </div>

          <div className="my-12">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Team flow
            </p>
            <h2 className="max-w-md text-5xl font-black leading-[1.02]">
              Enter the workspace with one clean sign in.
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/20">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Workspace pulse
                </p>
                <p className="text-xs text-slate-400">Today</p>
              </div>
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
              </div>
            </div>

            <div className="space-y-3">
              {pulseItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl bg-white/[0.07] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium text-slate-100">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-300">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-base font-black text-white">
                LP
              </div>
              <p className="text-sm font-bold tracking-[0.22em] text-emerald-700">
                LOOP
              </p>
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              {eyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight text-slate-950">
              {title}
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-500">
              {subtitle}
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
