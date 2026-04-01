import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { updateTestimonialStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  await requireApprovedUser(); // później możesz zrobić requireAdmin()

  const supabase = await supabaseServer();

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select(`
      id,
      content,
      rating,
      status,
      created_at,
      user:profiles (
        company_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-600">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Testimonials moderation
        </h1>

        {testimonials.length === 0 ? (
          <p className="text-gray-500">No testimonials yet.</p>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t: any) => (
              <div
                key={t.id}
                className="bg-white border rounded-xl p-5 shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-500">
                    {new Date(t.created_at).toLocaleString()}
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-gray-200">
                    {t.status}
                  </span>
                </div>

                {/* Company */}
                <div className="font-semibold text-gray-800">
                  {t.user?.company_name || "Unknown company"}
                </div>

                {/* Rating */}
                <div className="text-yellow-500 text-sm mt-1">
                  {"⭐".repeat(t.rating)}
                </div>

                {/* Content */}
                <p className="mt-3 text-gray-700 whitespace-pre-line">
                  {t.content}
                </p>

                {/* Actions */}
                {t.status === "pending" && (
                  <div className="mt-4 flex gap-2">

                    {/* APPROVE */}
                    <form action={updateTestimonialStatus}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="status" value="approved" />

                      <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
                        Approve
                      </button>
                    </form>

                    {/* REJECT */}
                    <form action={updateTestimonialStatus}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="status" value="rejected" />

                      <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">
                        Reject
                      </button>
                    </form>

                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
