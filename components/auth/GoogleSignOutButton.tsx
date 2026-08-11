"use client";

import { signOut } from "next-auth/react";

export default function GoogleSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      Sign out
    </button>
  );
}
