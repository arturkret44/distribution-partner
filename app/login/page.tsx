"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, verification_status")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setError(`Profile fetch error: ${profileError.message}`);
        return;
      }

      if (!profile) {
        setError("Profile not found for this user. Please contact support.");
        return;
      }

      if (profile.verification_status === "incomplete") {
        window.location.href = `/${profile.role}/profile`;
        return;
      }

      if (profile.verification_status === "pending") {
        window.location.href = "/waiting";
        return;
      }

      if (profile.role === "admin") {
        window.location.href = "/admin";
      } else if (profile.role === "farmer") {
        window.location.href = "/farmer";
      } else if (profile.role === "buyer") {
        window.location.href = "/buyer";
      } else if (profile.role === "transport") {
        window.location.href = "/transport";
      } else if (profile.role === "warehouse") {
        window.location.href = "/warehouse";
      } else {
        window.location.href = "/";
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 px-6 py-10">

      {/* BACK */}
      <div className="max-w-5xl mx-auto mb-6">
        <a
          href="/"
          className="inline-block px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm"
        >
          ← Back
        </a>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-100/70 px-3 py-1 rounded-full">
            Welcome back
          </div>

          <h1 className="mt-5 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Sign in to your account
          </h1>

          <p className="mt-4 text-gray-600 max-w-md">
            Access your dashboard, manage offers, and connect with partners across the agricultural supply chain.
          </p>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="bg-white/90 backdrop-blur rounded-2xl border shadow-sm p-8">

          <h2 className="text-xl font-semibold text-gray-900">
            Login
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Enter your credentials
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 input"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                className="mt-1 input"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <a href="/register" className="text-green-700 hover:underline">
              Register
            </a>
          </p>
        </div>

      </div>
    </main>
  );
}
