'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Cpu, ShieldAlert } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return { title: 'Executive Dashboard', subtitle: 'Real-time customer feedback analytics & sentiment trends' };
      case '/inbox':
        return { title: 'Feedback Inbox', subtitle: 'Ingest, triage, filter, and manage customer feedback' };
      case '/trends':
        return { title: 'Theme Clustering & Trends', subtitle: 'Identify emerging issues, volume shifts, and theme clusters' };
      case '/ask':
        return { title: 'Ask LOOP AI (RAG)', subtitle: 'Evidence-grounded Q&A over customer feedback' };
      case '/reports':
        return { title: 'Voice of Customer (VoC) Reports', subtitle: 'Generate and review executive digest reports' };
      case '/settings':
        return { title: 'Team & RBAC Management', subtitle: 'Manage workspace members, roles, and access controls' };
      default:
        return { title: 'Project LOOP', subtitle: 'AI Customer Feedback Intelligence Platform' };
    }
  };

  const { title, subtitle } = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 glass-panel border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h2>
        <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* AI Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
          <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>AI Intelligence Engine</span>
        </div>

        {/* Security Isolation Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Tenant Isolated</span>
        </div>
      </div>
    </header>
  );
}
