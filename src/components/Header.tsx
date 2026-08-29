'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Cpu, ShieldAlert, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return { title: 'Executive Dashboard', subtitle: 'Real-time feedback analytics & sentiment trends' };
      case '/inbox':
        return { title: 'Feedback Inbox', subtitle: 'Ingest, triage, filter, and manage customer feedback' };
      case '/trends':
        return { title: 'Theme Trends & Spikes', subtitle: 'Identify emerging issues, volume shifts, & clusters' };
      case '/ask':
        return { title: 'Ask LOOP AI (RAG)', subtitle: 'Evidence-grounded Q&A over customer feedback' };
      case '/reports':
        return { title: 'VoC Reports', subtitle: 'Generate and review executive digest reports' };
      case '/settings':
        return { title: 'Team & RBAC Management', subtitle: 'Manage workspace members, roles, and access controls' };
      default:
        return { title: 'Project LOOP', subtitle: 'AI Customer Feedback Intelligence Platform' };
    }
  };

  const { title, subtitle } = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 glass-panel border-b border-slate-800/80 px-3.5 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 -ml-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-white tracking-tight truncate flex items-center gap-2">
            {title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate max-w-[200px] sm:max-w-md md:max-w-none">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* AI Status Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-[11px] sm:text-xs font-semibold text-indigo-300 shadow-sm">
          <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 animate-pulse shrink-0" />
          <span className="hidden xs:inline sm:inline">AI Engine</span>
        </div>

        {/* Security Isolation Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-[11px] sm:text-xs font-semibold text-emerald-400">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Tenant Isolated</span>
        </div>
      </div>
    </header>
  );
}
