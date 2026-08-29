'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShieldCheck, UserCheck, Eye, UserPlus, ShieldAlert, Loader2, X } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const currentUser = session?.user as any;

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'ANALYST' | 'VIEWER'>('ANALYST');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/members');
      if (!res.ok) throw new Error('Failed to load workspace members');
      const data = await res.json();
      setMembers(data || []);
    } catch (err: any) {
      setError(err.message || 'Error loading members');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password || 'LoopUser@2026', role }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add team member');
      }

      setIsInviteModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      fetchMembers();
    } catch (err: any) {
      setError(err.message || 'Invite error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
        );
      }
    } catch (err) {
      console.error('Failed to change role:', err);
    }
  };

  const getRoleIcon = (r: string) => {
    switch (r) {
      case 'ADMIN':
        return <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />;
      case 'ANALYST':
        return <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Eye className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      {/* Header Toolbar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Workspace Team & Access Control (RBAC)</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Tenant isolation ensures only members of workspace <strong className="text-slate-200">{currentUser?.workspaceName}</strong> have access.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          ⚠️ You are currently logged in as {currentUser?.role}. Only Workspace ADMIN accounts can add new members or modify permissions.
        </div>
      )}

      {/* Members Table */}
      <div className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden">
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace Members</h3>
          <span className="text-[10px] text-slate-500 font-mono">{members.length} members</span>
        </div>

        {loading ? (
          <div className="p-8 sm:p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading team members...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {members.map((member) => (
              <div key={member.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-indigo-400 text-sm shrink-0">
                    {member.name?.[0] || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{member.name}</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 truncate">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 sm:pt-0 border-t border-slate-800/40 sm:border-t-0 shrink-0">
                  {isAdmin ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="ADMIN">🛡️ ADMIN</option>
                      <option value="ANALYST">⚡ ANALYST</option>
                      <option value="VIEWER">👁️ VIEWER</option>
                    </select>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      {getRoleIcon(member.role)} {member.role}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-md rounded-2xl p-4 sm:p-6 border border-slate-800/90 space-y-4 max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-white">Add Workspace Team Member</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivers"
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-base sm:text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-base sm:text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-base sm:text-xs text-white"
                >
                  <option value="ADMIN">ADMIN (Full management & ingestion access)</option>
                  <option value="ANALYST">ANALYST (Ingest & triage feedback)</option>
                  <option value="VIEWER">VIEWER (Read-only access)</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 flex items-center justify-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
