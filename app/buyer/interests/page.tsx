import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { closeDealByBuyer } from "./actions";
import CloseDealButton from "./CloseDealButton";
import Link from "next/link";
import { getUserReview, createReview } from "@/lib/reviews";
import React from "react";
export const dynamic = "force-dynamic";

export default async function BuyerInterestsPage() {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const { data: interests, error } = await supabase
    .from("interests")
    .select(`
      id,
      status,
      created_at,
      offered_price,
      read_at,
      announcement:announcements (
        id,
        product_name,
        quantity,
        price,
        unit,
        location,
        farmer:profiles!announcements_farmer_id_fkey (
          id,
          company_name,
          phone,
          contact_email,
          website
        )
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  // 🔥 oznacz jako przeczytane
  await supabase
    .from("interests")
    .update({ read_at: new Date().toISOString() })
    .eq("buyer_id", user.id)
    .is("read_at", null)
    .select();

  // 🔥 CLOSED DEALS (dla review)
  const closedDeals = interests?.filter((i) => i.status === "closed") ?? [];

const reviewMap: Record<
  string,
  { rating: number; comment: string | null } | null
> = {};

for (const deal of closedDeals) {
  const review = await getUserReview(user.id, "interest", deal.id);
  reviewMap[deal.id] = review;
}
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-700 font-bold text-lg">
            ⭐ My interests
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <p className="text-red-600">
            Failed to load interests: {error.message}
          </p>
        )}

        {!interests || interests.length === 0 ? (
          <p className="text-gray-600">
            You haven’t shown interest in any announcements yet.
          </p>
        ) : (
<div className="space-y-6">
            {["pending", "contacted", "agreed", "closed", "rejected", "expired"].map(
              (statusGroup) => {
                const items = interests
                  .filter((i) => i.status === statusGroup)
                  .sort((a, b) => {
                    if (a.read_at === null && b.read_at !== null) return -1;
                    if (a.read_at !== null && b.read_at === null) return 1;
                    return (
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                    );
                  });

                if (items.length === 0) return null;

                const labels: Record<string, string> = {
                  pending: "⏳ Pending",
                  contacted: "📞 Contacted",
                  agreed: "✅ Accepted",
                  rejected: "❌ Rejected",
                  expired: "Expired",
                  closed: "Closed",
                };
const statusDescriptions: Record<string, string> = {
  pending: "Waiting for farmer response",
  contacted: "Farmer contacted you",
  agreed: "Offer accepted – ready to close",
  closed: "Completed deals and reviews",
  rejected: "Offers that were declined",
  expired: "No longer active interests",
};
                return (
<details
  key={statusGroup}
  className="group bg-white/80 backdrop-blur rounded-xl border border-gray-200 p-4"
  open={statusGroup === "agreed"} // domyślnie otwarte
>
                    {/* HEADER */}
<summary className="cursor-pointer mb-3 list-none">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
<span className="text-gray-400 transition group-open:rotate-90">
  ▶
</span>
      <div>
        <h2 className="font-semibold text-gray-800">
          {labels[statusGroup]}
        </h2>

        <p className="text-xs text-gray-500">
          {statusDescriptions[statusGroup]}
        </p>
      </div>
    </div>

    <span className="text-xs text-gray-500">
      {items.length} items
    </span>
  </div>
</summary>
                    {/* LIST */}
<div className="overflow-x-auto">
  <table className="w-full text-sm">

    {/* HEADER */}
    <thead className="text-left text-xs text-gray-500 border-b">
      <tr>
        <th className="py-2">Product</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Date</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {items.map((interest) => {
  const ann = interest.announcement?.[0];
  const farmer = ann?.farmer?.[0];

  return (
<React.Fragment key={interest.id}>
          {/* MAIN ROW */}
          <tr
            className={`border-b hover:bg-gray-50 ${
              interest.read_at === null ? "bg-yellow-50" : ""
            }`}
          >
            <td className="py-3">
              <Link
                href={`/announcements/${ann?.id}?from=interests`}
                className="font-medium text-gray-900 hover:underline"
              >
                {ann?.product_name}
              </Link>
            </td>

            <td>
              {ann?.quantity}
              {ann?.unit}
            </td>

            <td className="text-green-700 font-medium">
              {interest.offered_price
                ? `${interest.offered_price} SEK`
                : `${ann?.price} SEK`}
            </td>

            <td className="text-gray-500">
              {new Date(interest.created_at).toLocaleDateString()}
            </td>

            <td>
              <StatusBadge status={interest.status} />
            </td>

            <td>
              {interest.status === "agreed" && (
                <form action={closeDealByBuyer}>
                  <input
                    type="hidden"
                    name="interest_id"
                    value={interest.id}
                  />
                  <button className="text-xs bg-green-600 text-white px-3 py-1 rounded">
                    Close
                  </button>
                </form>
              )}
            </td>
          </tr>

          {/* DETAILS ROW */}
          {(interest.status === "agreed" ||
            interest.status === "closed") && (
            <tr className="bg-gray-50">
              <td colSpan={6} className="p-4">

                {/* AGREED */}
                {interest.status === "agreed" && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-green-800 font-medium text-sm">
                      ✅ Your offer was accepted
                    </p>

                    <div className="text-xs text-gray-700 mt-2 space-y-1">
                      <p>
                        🏢{" "}
                        <a
                          href={`/profiles/${farmer?.id}?from=/buyer/interests`}
                          className="text-green-700 font-semibold hover:underline"
                        >
                          {
                            farmer?.company_name
                          }
                        </a>
                      </p>

                      {farmer?.phone && (
                        <p>📞 {farmer.phone}</p>
                      )}

                      {farmer?.contact_email && (
                        <p>
                          ✉️{" "}
                          {
                            farmer.contact_email
                          }
                        </p>
                      )}

                      {farmer?.website && (
                        <p>
                          🌐{" "}
                          <a
                            href={
                              farmer.website
                            }
                            target="_blank"
                            className="text-green-700 underline"
                          >
                            {
                              farmer.website
                            }
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* CLOSED */}
                {interest.status === "closed" && (
<div className="bg-blue-50 border border-blue-200 rounded-md p-3 w-fit">
                    <div className="mt-3">
{reviewMap[interest.id] ? (
  <div className="text-sm">
    <span className="text-green-700 font-medium">
      ✅ Reviewed
    </span>

    <div className="text-gray-700 text-xs mt-1">
      ⭐ {reviewMap[interest.id]?.rating}
      {reviewMap[interest.id]?.comment && (
        <span className="ml-2 italic">
          "{reviewMap[interest.id]?.comment}"
        </span>
      )}
    </div>
  </div>
) : (
                        <form
                          action={createReview}
                          className="flex gap-2 mt-2"
                        >
                          <input
                            type="hidden"
                            name="context_type"
                            value="interest"
                          />
                          <input
                            type="hidden"
                            name="context_id"
                            value={interest.id}
                          />
                          <input
                            type="hidden"
                            name="reviewed_user_id"
                            value={
                              interest.announcement?.farmer?.id
                            }
                          />

<div className="flex flex-col items-center">
  <select
    name="rating"
    required
    className="text-sm border rounded px-2 py-1"
  >
    <option value="">⭐</option>
    <option value="5">5</option>
    <option value="4">4</option>
    <option value="3">3</option>
    <option value="2">2</option>
    <option value="1">1</option>
  </select>

  <span className="text-[10px] text-gray-500 mt-1">
    Rating
  </span>
</div>
<textarea
  name="comment"
  placeholder="How was your experience?"
  rows={3}
  className="text-sm border rounded px-3 py-2 w-full max-w-xs resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
/>
                          <button
                            type="submit"
                            className="text-sm bg-green-600 text-white px-3 rounded"
                          >
                            Save
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          )}
</React.Fragment>
      );
})}
    </tbody>
  </table>
</div>
  </details>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}

/* ===== Status badge ===== */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    contacted: "bg-blue-100 text-blue-800",
    agreed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-gray-200 text-gray-700",
  };
  return (
    <span
      className={`text-[10px] font-medium px-2 py-1 rounded-full ${
        styles[status] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
