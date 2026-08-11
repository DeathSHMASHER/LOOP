"use client";

import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Join LOOP"
      subtitle="Start from a secure workspace identity."
    >
      <GoogleSignInButton />
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
