import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BuyerContractsPage() {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const { data: contracts, error: contractsError } = await supabase
    .from("interests")
    .select(`
      id,
      requested_quantity,
      offered_price,
      closed_at,
      announcement:announcements (
        id,
        product_name,
        unit,
        price,
        farmer_id
      )
    `)
    .eq("buyer_id", user.id)
    .eq("status", "closed")
    .order("closed_at", { ascending: false });

  const farmerIds = [
    ...new Set(
      (contracts ?? [])
        .map((c) => c.announcement?.farmer_id)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  let farmersMap: Record<string, { company_name: string | null }> = {};
  let farmersErrorMessage: string | null = null;

  if (farmerIds.length > 0) {
    const { data: farmers, error: farmersError } = await supabase
      .from("profiles")
      .select("id, company_name")
      .in("id", farmerIds);

    if (farmersError) {
      farmersErrorMessage = farmersError.message;
    }

    if (farmers) {
farmersMap = Object.fromEntries(
  farmers.map((f) => [
    f.id,
    { id: f.id, company_name: f.company_name }
  ])
);
    }
  }

  return (
<main className="p-6 md:p-10 max-w-5xl mx-auto">

  {/* HEADER */}
  <div className="mb-8">
    <h1 className="text-3xl font-semibold">
      📄 Contracts & purchases
    </h1>
    <p className="text-gray-500 text-sm mt-1">
      Overview of your completed deals
    </p>
  </div>
      {contractsError && (
        <p className="mb-4 text-red-600">
          Failed to load contracts: {contractsError.message}
        </p>
      )}

      {farmersErrorMessage && (
        <p className="mb-4 text-red-600">
          Failed to load suppliers: {farmersErrorMessage}
        </p>
      )}

      {!contracts || contracts.length === 0 ? (
        <p>No completed deals yet.</p>
      ) : (
<div className="bg-white rounded-2xl border shadow-sm overflow-auto max-h-[500px]">
  <table className="w-full text-sm">

    {/* HEADER */}
    <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
      <tr>
        <th className="text-left px-4 py-3 font-medium">Product</th>
        <th className="text-left px-4 py-3 font-medium">Quantity</th>
        <th className="text-left px-4 py-3 font-medium">Supplier</th>
        <th className="text-left px-4 py-3 font-medium">Price</th>
        <th className="text-left px-4 py-3 font-medium">Closed</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {contracts.map((c) => {
        const farmerId = c.announcement?.farmer_id ?? null;
        const farmer = farmerId ? farmersMap[farmerId] : null;

        return (
          <tr
            key={c.id}
            className="border-t hover:bg-gray-50 transition"
          >
            {/* PRODUCT */}
            <td className="px-4 py-3 font-medium text-gray-800">
              {c.announcement?.product_name ?? "—"}
            </td>

            {/* QUANTITY */}
            <td className="px-4 py-3 text-gray-600">
              {c.requested_quantity ?? "-"} {c.announcement?.unit ?? ""}
            </td>

            {/* FARMER */}
            <td className="px-4 py-3">
              {farmer ? (
                <Link
                  href={`/profiles/${farmer.id}?from=/buyer/contracts`}
                  className="text-green-700 hover:underline"
                >
                  {farmer.company_name}
                </Link>
              ) : (
                "—"
              )}
            </td>

            {/* PRICE */}
            <td className="px-4 py-3 font-semibold text-green-700">
              {c.offered_price ?? c.announcement?.price ?? "-"} SEK
            </td>

            {/* DATE */}
            <td className="px-4 py-3 text-gray-500 text-xs">
              {c.closed_at
                ? new Date(c.closed_at).toLocaleDateString()
                : "—"}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
      )}
    </main>
  );
}
