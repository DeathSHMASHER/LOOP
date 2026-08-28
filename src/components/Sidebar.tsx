'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Inbox,
  TrendingUp,
  MessageSquareQuote,
  FileText,
  Users,
  LogOut,
  Building2,
  Cpu,
  ShieldCheck,
  UserCheck,
  Eye,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/inbox', label: 'Feedback Inbox', icon: Inbox },
    { href: '/trends', label: 'Theme Trends', icon: TrendingUp },
    { href: '/ask', label: 'Ask LOOP AI', icon: MessageSquareQuote, badge: 'RAG AI' },
    { href: '/reports', label: 'VoC Reports', icon: FileText },
    { href: '/settings', label: 'Team & RBAC', icon: Users },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        );
      case 'ANALYST':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <UserCheck className="w-3 h-3" /> Analyst
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <Eye className="w-3 h-3" /> Viewer
          </span>
        );
    }
  };

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col justify-between p-4 min-h-screen sticky top-0 z-30">
      <div className="space-y-6">
        {/* Workspace Brand Logo Header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-wide flex items-center gap-1.5">
              Project LOOP
            </h1>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Building2 className="w-3 h-3 text-indigo-400" />
              {user?.workspaceName || 'Workspace'}
            </p>
          </div>
        </div>

        {/* Workspace Selector Indicator */}
        <div className="px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Active Tenant</span>
          {getRoleBadge(user?.role || 'ADMIN')}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card & Logout Button */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
