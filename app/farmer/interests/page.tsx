import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { updateInterestStatus } from "./actions";
import InventorySection from "./InventorySection";
import TabsSection from "./TabsSection";
import InterestedBuyersSection from "./InterestedBuyersSection";
import { hasUserReviewed, createReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, React.CSSProperties> = {
    new: { background: "#e0f2fe", color: "#0369a1" },
    contacted: { background: "#fef9c3", color: "#854d0e" },
    agreed: { background: "#dcfce7", color: "#166534" },
    rejected: { background: "#fee2e2", color: "#991b1b" },
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        ...(styles[status] ?? { background: "#e5e7eb" }),
      }}
    >
      {status}
    </span>
  );
}

export default async function FarmerInterestsPage() {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();
  const th = {
    padding: "10px",
    textAlign: "left" as const,
    fontWeight: 600,
  };

  const td = {
    padding: "10px",
  };
  const { data: interests, error } = await supabase.rpc(
    "get_farmer_interests",
    { p_farmer_id: user.id }
  );
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, product_name, product_category, quantity, quantity_available")
    .eq("farmer_id", user.id);
const announcementIds = announcements?.map((a) => a.id) ?? [];

const { data: announcementsForDeals } = await supabase
  .from("announcements")
  .select("id, product_name, price");

// ===== CLOSED DEALS =====

const announcementsMap = Object.fromEntries(
  announcementsForDeals?.map((a) => [a.id, a]) ?? []
);

const closedDeals =
  interests?.filter((i: any) => i.status?.trim() === "closed") ?? [];

//  CHECK REVIEWS (dla każdego closed deal)
const reviewStatusMap: Record<string, boolean> = {};

if (closedDeals) {
  for (const deal of closedDeals) {
    const reviewed = await hasUserReviewed(
      user.id,
      "interest",
      deal.interest_id
    );
    reviewStatusMap[deal.interest_id] = reviewed;
  }
}

  const inventoryByCategory = announcements?.reduce((acc: any, a) => {
    const th = {
  padding: "10px",
  textAlign: "left" as const,
  fontWeight: 600,
};

const td = {
  padding: "10px",
};
    const related = interests?.filter((i: any) => i.announcement_id === a.id);

    const reserved =
      related?.reduce(
        (sum: number, i: any) =>
          i.status === "pending"
            ? sum + (i.requested_quantity || 0)
            : sum,
        0
      ) ?? 0;

const sold =
  related?.reduce(
    (sum: number, i: any) =>
      i.status === "agreed" || i.status === "closed"
        ? sum + (i.requested_quantity || 0)
        : sum,
    0
  ) ?? 0;
    const category = a.product_category || "Other";

    if (!acc[category]) {
      acc[category] = [];
    }

acc[category].push({
  id: a.id,
  product_name: a.product_name,
  total: a.quantity,
  available: a.quantity_available,
  reserved,
  sold,
  buyers: related || [],
});
    return acc;
  }, {});

  const inventoryView = (
    <InventorySection
      inventoryByCategory={inventoryByCategory || {}}
      th={th}
      td={td}
    />
  );

  // ===== GROUP INTERESTS BY STATUS (UI only) =====
  const grouped = {
    pending: interests?.filter((i: any) => i.status === "pending") ?? [],
    contacted: interests?.filter((i: any) => i.status === "contacted") ?? [],
    agreed: interests?.filter((i: any) => i.status === "agreed") ?? [],
    rejected: interests?.filter((i: any) => i.status === "rejected") ?? [],
    closed: interests?.filter((i: any) => i.status === "closed") ?? [],
  };


  const buyersView = (

   <>
<h1 className="text-xl font-semibold mb-4">
        Interested buyers
      </h1>

      {error && (
<p className="text-red-600 mt-3">
          {error.message}
        </p>
      )}

      {!interests || interests.length === 0 ? (
<p className="mt-5 text-gray-500">
          No buyers have shown interest yet.
        </p>
      ) : (
<table className="w-full mt-5 text-sm">
          <thead>
             <tr className="bg-gray-50 text-gray-600">
<th className="text-left py-2 px-3 font-medium">Product</th>
<th className="text-left py-2 px-3 font-medium">Price</th>
<th className="text-left py-2 px-3 font-medium">Buyer</th>
<th className="text-left py-2 px-3 font-medium">Offer</th>
<th className="text-left py-2 px-3 font-medium">Status</th>
<th className="text-left py-2 px-3 font-medium">Date</th>
            </tr>
          </thead>
<InterestedBuyersSection
  grouped={grouped}
/>
        </table>
      )}
    </>
  );
const closedDealsView = (

<>
<h1 className="text-xl font-semibold mb-4">
Closed deals
</h1>

{!closedDeals || closedDeals.length === 0 ? (

<p className="mt-5 text-gray-500">
No deals closed yet.
</p>

) : (

<table className="w-full mt-5 text-sm">
<thead>
<tr className="bg-gray-50 text-gray-600">
<th className="text-left py-2 px-3 font-medium">Product</th>
<th className="text-left py-2 px-3 font-medium">Buyer</th>
<th className="text-left py-2 px-3 font-medium">Quantity</th>
<th className="text-left py-2 px-3 font-medium">Price</th>
<th className="text-left py-2 px-3 font-medium">Closed</th>
<th className="text-left py-2 px-3 font-medium">Review</th>
</tr>
</thead>

<tbody>

{closedDeals.map((d: any) => (

<tr key={d.interest_id} className="border-b hover:bg-gray-50 transition">

<td className="py-2 px-3">
{announcementsMap[d.announcement_id]?.product_name ?? "—"}
</td>
<td className="py-2 px-3">
{d.buyer_company_name ?? "—"}
</td>

<td className="py-2 px-3">
{d.requested_quantity ?? "—"}
</td>

<td className="py-2 px-3">
{d.offered_price
  ? `${d.offered_price} SEK`
  : `${announcementsMap[d.announcement_id]?.price ?? "—"} SEK`}
</td>

<td className="py-2 px-3">
{d.closed_at
  ? new Date(d.closed_at).toLocaleDateString()
  : "—"}
</td>

<td className="py-2 px-3">
  {reviewStatusMap[d.interest_id] ? (
<span className="text-green-600 font-medium">
      ✅ Reviewed
    </span>
  ) : (
<form action={createReview} className="flex gap-2 items-center">
  <input type="hidden" name="context_type" value="interest" />
  <input type="hidden" name="context_id" value={d.interest_id} />
  <input type="hidden" name="reviewed_user_id" value={d.buyer_id} />

  <select name="rating" required className="border border-gray-200 rounded-md px-2 py-1 text-xs">
    <option value="">⭐</option>
    <option value="5">5</option>
    <option value="4">4</option>
    <option value="3">3</option>
    <option value="2">2</option>
    <option value="1">1</option>
  </select>

  <input
    name="comment"
    placeholder="Comment"
    className="border border-gray-200 rounded-md px-2 py-1 text-xs w-32"
  />

  <button
    type="submit"
className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1 text-xs transition"
>
    Save
  </button>
</form>
  )}
</td>
</tr>

))}

</tbody>
</table>

)}

</>
);
  return (
<main className="p-6 md:p-10">
<div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
<div className="mb-6">
  <h1 className="text-2xl font-semibold">
    🤝 Sales pipeline
  </h1>
  <p className="text-sm text-gray-500 mt-1">
    Manage buyers, offers and closed deals
  </p>
</div>
<TabsSection
  inventory={inventoryView}
  buyers={buyersView}
  closed={closedDealsView}
  newCount={grouped.pending.length}
/>
      </div>
    </main>
  );
}

