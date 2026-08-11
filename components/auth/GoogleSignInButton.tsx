"use client";

import { useEffect, useState } from "react";
import {
  getProviders,
  signIn,
  type ClientSafeProvider,
} from "next-auth/react";
import Button from "@/components/ui/Button";

type GoogleSignInButtonProps = {
  callbackUrl?: string;
};

export default function GoogleSignInButton({
  callbackUrl = "/dashboard",
}: GoogleSignInButtonProps) {
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getProviders()
      .then((availableProviders) => {
        if (isMounted) {
          setProviders(availableProviders);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProviders(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setProvidersLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setError("");

    if (providersLoaded && !providers?.google) {
      setError(
        "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local, then restart the dev server."
      );
      return;
    }

    setLoading(true);
    await signIn("google", { callbackUrl });
    setLoading(false);
  };

  const googleReady = providersLoaded && Boolean(providers?.google);

  return (
    <div className="space-y-3">
      <Button
        type="button"
        disabled={loading || !providersLoaded || !googleReady}
        onClick={handleGoogleSignIn}
        className="border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 text-xs font-black text-slate-700">
          G
        </span>
        {loading
          ? "Connecting..."
          : providersLoaded
            ? "Continue with Google"
            : "Checking Google..."}
      </Button>

      {(error || (providersLoaded && !googleReady)) && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-800">
          {error ||
            "Google sign-in is wired in code. Add Google OAuth credentials to enable it."}
        </p>
      )}
    </div>
  );
}
