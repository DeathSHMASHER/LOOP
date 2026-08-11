import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GoogleSignOutButton from "@/components/auth/GoogleSignOutButton";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const displayName = session.user.name ?? "LOOP User";
  const displayEmail = session.user.email ?? "Signed in";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-purple-600">LOOP</p>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <GoogleSignOutButton />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-700">
              {initial}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Welcome, {displayName}</h2>
              <p className="text-sm text-gray-500">{displayEmail}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            You are signed in successfully with NextAuth credentials or Google
            OAuth.
          </div>
        </div>
      </section>
    </main>
  );
}
