'use client';

import React, { useEffect } from 'react';
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
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;

  // Auto-close mobile drawer when pathname changes
  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
  }, [pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    <>
      {/* Mobile Backdrop Blur Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-label="Close menu backdrop"
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden transition-opacity animate-fade-in"
        />
      )}

      {/* Sidebar Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/90 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:sticky lg:top-0 lg:w-64 lg:min-h-screen lg:h-screen lg:translate-x-0 lg:z-30 lg:bg-slate-950/80 lg:shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-5 overflow-y-auto">
          {/* Workspace Brand Logo Header + Close Button */}
          <div className="flex items-center justify-between px-1 py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-extrabold text-lg text-white tracking-wide flex items-center gap-1.5 truncate">
                  Project LOOP
                </h1>
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 truncate">
                  <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span className="truncate">{user?.workspaceName || 'Workspace'}</span>
                </p>
              </div>
            </div>

            {/* Close button on mobile */}
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close navigation drawer"
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Workspace Selector Indicator */}
          <div className="px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Active Tenant</span>
            {getRoleBadge(user?.role || 'ADMIN')}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 active:scale-[0.98] ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/20 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card & Logout Button */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3 shrink-0 pb-safe">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="truncate min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign out"
              aria-label="Sign out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
