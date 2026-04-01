import { requireApprovedUser } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import WarehouseFilters from "./WarehouseFilters";

export const dynamic = "force-dynamic";

export default async function FindWarehousePage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;

await requireApprovedUser();

  const supabase = await supabaseServer();
let region = params.region;
let kommun = params.kommun;
let cold = params.cold;

  // Pobieramy profile magazynów
let query = supabase
  .from("warehouse_profiles")
  .select(`
    id,
    user_id,
    company_name,
    operating_region,
    operating_kommuner,
    city,
    description,
    has_cold_storage,
    contact_email,
    org_number
  `);

if (region) {
  query = query.eq("operating_region", region);
}

if (kommun) {
  query = query.contains("operating_kommuner", [kommun]);
}

if (cold === "true") {
  query = query.eq("has_cold_storage", true);
}

const { data: warehouses } = await query;

// 🔽 fetch images for all warehouses
let imagesMap: Record<string, string> = {};

if (warehouses && warehouses.length > 0) {
  const userIds = warehouses.map((w) => w.user_id);

  const { data: images } = await supabase
    .from("warehouse_images")
    .select("user_id, public_url")
    .in("user_id", userIds);

  images?.forEach((img) => {
    if (!imagesMap[img.user_id]) {
      imagesMap[img.user_id] = img.public_url;
    }
  });
}


return (
  <main className="min-h-screen bg-gray-50">

<header className="bg-white border-b">
  <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Find a warehouse
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Select a warehouse and send a storage inquiry
      </p>
    </div>

  </div>
</header>

<section className="max-w-7xl mx-auto px-6 py-10">
<div className="mb-6">
  <WarehouseFilters />
</div>

  {warehouses && warehouses.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{warehouses.map((w) => (
  <div
    key={w.id}
    className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition"
  >
    {/* IMAGE */}
    {imagesMap[w.user_id] && (
      <img
        src={imagesMap[w.user_id]}
        className="w-full h-40 object-cover"
      />
    )}

    <div className="p-6">

<h3 className="font-semibold text-gray-900 text-lg">
  {w.company_name}
</h3>

<p className="text-sm text-gray-600 mt-2">
  {w.city}, {w.operating_region}
</p>

<p className="text-sm text-gray-600">
  Kommuner: {(w.operating_kommuner || []).join(", ")}
</p>

<p className="text-sm text-gray-600">
  Cold storage: {w.has_cold_storage ? "Yes" : "No"}
</p>

{w.org_number && (
  <p className="text-sm text-gray-600">
    Org number: {w.org_number}
  </p>
)}

{w.contact_email && (
  <p className="text-sm text-gray-600">
    Email: {w.contact_email}
  </p>
)}

{w.description && (
  <p className="text-sm text-gray-500 mt-2">
    {w.description}
  </p>
)}

<div className="mt-4 flex gap-3">
  <a
    href={`/farmer/find-warehouse/contact/${w.user_id}`}
    className="inline-block px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 transition"
  >
    Contact warehouse
  </a>

  <a
href={`/profiles/${w.user_id}?from=/farmer/find-warehouse`}

    className="inline-block px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition"
  >
    Check profile
  </a>
</div>
</div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No warehouses available yet.</p>
  )}
</section>

    </main>
  );
}
