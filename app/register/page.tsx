"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const companyName = formData.get("company_name") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          company_name: companyName,
          email,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/waiting";
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

        {/* LEFT SIDE (branding jak homepage) */}
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-100/70 px-3 py-1 rounded-full">
            Join the platform
          </div>

          <h1 className="mt-5 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Start selling your agricultural products
          </h1>

          <p className="mt-4 text-gray-600 max-w-md">
            Create your account and connect with buyers, logistics providers and partners across the supply chain.
          </p>
        </div>

        {/* RIGHT SIDE (form card) */}
        <div className="bg-white/90 backdrop-blur rounded-2xl border shadow-sm p-8">
          
          <h2 className="text-xl font-semibold text-gray-900">
            Create account
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            It takes less than a minute
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

            <div>
              <label className="text-sm text-gray-700">Role</label>
              <select
                name="role"
                required
                className="mt-1 input"
              >
                <option value="">Select role</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="transport">Transport company</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700">Company name</label>
              <input
                type="text"
                name="company_name"
                required
                className="mt-1 input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-red-600">
              {message}
            </p>
          )}

          <p className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-green-700 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
