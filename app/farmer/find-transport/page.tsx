import { requireApprovedUser } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import TransportFilters from "./TransportFilters";

export const dynamic = "force-dynamic";

export default async function FindTransportPage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;

await requireApprovedUser();

  const supabase = await supabaseServer();

  // Start with values from query params
  let region = params.region;
  let kommun = params.kommun;
  let refrigerated = params.refrigerated;

  // If user came from an announcement – override filters with announcement data
  if (params.announcement) {
    const { data: announcement } = await supabase
      .from("announcements")
      .select("pickup_region, pickup_kommun, requires_refrigeration")
      .eq("id", params.announcement)
      .single();

    if (announcement) {
      region = announcement.pickup_region;
      kommun = announcement.pickup_kommun;
      refrigerated = announcement.requires_refrigeration ? "true" : undefined;
    }
  }

  // Build query for registered transport companies
  let query = supabase.from("transport_profiles").select("*");

  if (region) {
    query = query.eq("operating_region", region);
  }

  if (kommun) {
    query = query.contains("operating_kommuner", [kommun]);
  }

  if (refrigerated === "true") {
    query = query.eq("has_refrigerated", true);
  }

  // Get internal companies
  const { data: internal } = await query;
  const companies = internal || [];

// 🔽 fetch images for all companies
let imagesMap: Record<string, string> = {};

if (companies.length > 0) {
  const userIds = companies.map((c) => c.user_id);

  const { data: images } = await supabase
    .from("transport_images")
    .select("user_id, public_url")
    .in("user_id", userIds);

  // mapujemy user_id -> pierwsze zdjęcie
  images?.forEach((img) => {
    if (!imagesMap[img.user_id]) {
      imagesMap[img.user_id] = img.public_url;
    }
  });
}


  // External fallback
  let externalCompanies: any[] = [];

  if (companies.length === 0 && region) {
    let extQuery = supabase
      .from("external_transport_companies")
      .select("*")
      .eq("region", region);

    if (kommun) {
      extQuery = extQuery.contains("kommuner", [kommun]);
    }

    if (refrigerated === "true") {
      extQuery = extQuery.eq("has_refrigerated", true);
    }

    const { data: ext } = await extQuery;
    externalCompanies = ext || [];
  }

return (
  <main className="min-h-screen bg-gray-50">

<header className="bg-white border-b">
  <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
    <h1 className="text-2xl font-bold text-gray-800">
      Find transport companies
    </h1>

  </div>
</header>

<section className="max-w-7xl mx-auto px-6 py-10">
  <TransportFilters />

  <div className="mt-10">

        {companies.length > 0 && (
          <>
<h3 className="text-lg font-semibold text-gray-800 mb-4">
  Registered transport companies
</h3>


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{companies.map((c) => (
  <div
    key={c.id}
    className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition"
  >

    {/* IMAGE */}
    {imagesMap[c.user_id] && (
      <img
        src={imagesMap[c.user_id]}
        className="w-full h-40 object-cover"
      />
    )}

    {/* CONTENT */}
    <div className="p-6">

      <h3 className="font-semibold text-gray-800">
        {c.company_name}
      </h3>

      <p className="text-sm text-gray-600 mt-2">
        Region: {c.operating_region}
      </p>

      <p className="text-sm text-gray-600">
        Kommuner: {(c.operating_kommuner || []).join(", ")}
      </p>

      <p className="text-sm text-gray-600">
        Refrigerated: {c.has_refrigerated ? "Yes" : "No"}
      </p>

      <p className="text-sm text-gray-500 mt-2">
        {c.description}
      </p>

      <div className="mt-4 flex gap-3">
        <a
          href={`/farmer/find-transport/contact/${c.user_id}`}
          className="inline-block px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 transition"
        >
          Contact company
        </a>

        <a
href={`/profiles/${c.user_id}?from=/farmer/find-transport`}
          className="inline-block px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition"
        >
          Check company profile
        </a>
      </div>

    </div>
  </div>
))}

</div>

          </>
        )}

        {companies.length === 0 && externalCompanies.length > 0 && (
          <>
            <h3>No registered companies found in this area.</h3>
            <p style={{ marginBottom: 10 }}>
              Here are some other available transport companies:
            </p>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {externalCompanies.map((c) => (
    <div
      key={c.id}
      className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-xl transition"
    >
      <h3 className="font-semibold text-gray-800">
        {c.company_name}
      </h3>

      <p className="text-sm text-gray-600 mt-2">
        Region: {c.region}
      </p>

      <p className="text-sm text-gray-600">
        Kommuner: {(c.kommuner || []).join(", ")}
      </p>

      <p className="text-sm text-gray-600">
        Refrigerated: {c.has_refrigerated ? "Yes" : "No"}
      </p>

      {c.phone && (
        <p className="text-sm text-gray-600 mt-2">
          Phone: {c.phone}
        </p>
      )}

      {c.email && (
        <p className="text-sm text-gray-600">
          Email: {c.email}
        </p>
      )}

      {c.website && (
        <p className="text-sm text-gray-600">
          Website:{" "}
          <a
            href={c.website}
            target="_blank"
            className="text-green-700 underline"
          >
            {c.website}
          </a>
        </p>
      )}

      <p className="text-sm text-gray-500 mt-2">
        {c.description}
      </p>
    </div>
  ))}
</div>

          </>
        )}

        {companies.length === 0 && externalCompanies.length === 0 && (
          <p>No transport companies found for selected filters.</p>
        )}

      </div>
</section>
    </main>
  );
}
