import { requireApprovedUser } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { createTestimonial } from "./actions";

export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  // 🔎 pobierz profil żeby znać rolę
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;

  const dashboardPath =
    role === "farmer"
      ? "/farmer"
      : role === "buyer"
      ? "/buyer"
      : role === "transport"
      ? "/transport"
      : role === "warehouse"
      ? "/warehouse"
      : "/";

  // 🔎 Sprawdź czy już istnieje opinia
  const { data: existing } = await supabase
    .from("testimonials")
    .select("id, status")
    .eq("author_user_id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <a
          href={dashboardPath}
          className="inline-block mb-6 text-sm text-green-700 font-medium hover:underline"
        >
          ← Back to dashboard
        </a>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Share your experience
        </h1>

        {/* Jeśli już istnieje opinia */}
        {existing ? (
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <p className="text-gray-700">
              You have already submitted feedback from this profile.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Current status:{" "}
              <span className="font-medium">{existing.status}</span>
            </p>

            <div className="mt-6">
              <a
                href={dashboardPath}
                className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Return to dashboard
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <form action={createTestimonial} className="space-y-6">

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>

                <select
                  name="rating"
                  required
                  className="mt-1 w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select rating</option>
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Good</option>
                  <option value="3">⭐⭐⭐ Average</option>
                  <option value="2">⭐⭐ Poor</option>
                  <option value="1">⭐ Very poor</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your opinion
                </label>

                <textarea
                  name="content"
                  required
                  rows={5}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                  placeholder="Describe your experience with the platform..."
                />
              </div>

              {/* Submit */}
              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  Submit feedback
                </button>

                <a
                  href={dashboardPath}
                  className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </a>
              </div>

            </form>
          </div>
        )}

      </div>
    </main>
  );
}
