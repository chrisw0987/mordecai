import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Dashboard from "./Dashboard";
import DashboardSkeleton from "../Components/DashboardSkeleton";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const ownerId = import.meta.env.VITE_DASHBOARD_OWNER_ID?.trim().toLowerCase();
const supabase = url && key && ownerId ? createClient(url, key, { auth: { detectSessionInUrl: false } }) : null;
const button = "rounded-lg bg-violet-300 px-4 py-2 font-semibold text-zinc-950 disabled:opacity-50";
const input = "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white";

export default function DashboardAccess() {
  const [session, setSession] = useState(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) throw signInError;
      setPassword("");
    } catch {
      setError("Couldn't sign in. Check your email and password and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setError("");
    const { error: signOutError } = await supabase.auth.signOut({ scope: "global" });
    if (signOutError) setError("Couldn’t sign out. Try again.");
  }

  if (supabase && session === undefined) return <DashboardSkeleton />;

  if (supabase && session?.user.id === ownerId) {
    return <Dashboard client={supabase} onSignOut={signOut} signOutError={error} />;
  }

  return (
    <main className="grid min-h-screen place-items-center dark-pattern px-4 py-10 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-2xl font-bold">Mordecai Dashboard</h1>
        {!supabase ? (
          <p className="mt-3 text-zinc-300">Dashboard sign-in hasn’t been configured.</p>
        ) : session === undefined ? (
          <p role="status" className="mt-3 text-zinc-300">Checking your session…</p>
        ) : session ? (
          <div className="mt-3 space-y-4">
            <p>This account does not have dashboard access.</p>
            <button type="button" onClick={signOut} className={button}>Sign out</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="block text-sm">Owner email address
              <input className={input} type="email" autoComplete="username" required
                value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="block text-sm">Password
              <input className={input} type="password" autoComplete="current-password" required
                value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <button type="submit" disabled={busy} className={button}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
      </div>
    </main>
  );
}
