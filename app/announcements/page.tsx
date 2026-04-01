import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { createInterest } from "./actions";
import AnnouncementFilters from "@/components/AnnouncementFilters";
import { getLabel, PRODUCT_CATEGORIES } from "@/lib/options";
import Link from "next/link";

import {
  PRODUCTION_METHODS,
  QUANTITY_UNITS,
  HARVEST_PERIODS,
} from "@/lib/options";
import { swedenRegions } from "@/lib/swedenRegions";
export const dynamic = "force-dynamic";

export default async function AnnouncementsPage({
  searchParams,
}: {
searchParams?: Promise<{
  filter?: string;
  search?: string;
  sort?: string;
  category?: string;
  region?: string;
  production?: string;
  unit?: string;
  harvest?: string;
  minQty?: string;
  maxQty?: string;
}>;
}) {

const params = await searchParams;
const filter = params?.filter;
const search = params?.search;
const category = params?.category;
const region = params?.region;
const production = params?.production;
const unitParam = params?.unit;
const harvest = params?.harvest;
const minQtyRaw = params?.minQty ? Number(params.minQty) : null;
const maxQtyRaw = params?.maxQty ? Number(params.maxQty) : null;

const minQty = minQtyRaw !== null && minQtyRaw >= 0 ? minQtyRaw : null;
const maxQty = maxQtyRaw !== null && maxQtyRaw >= 0 ? maxQtyRaw : null;

  await requireApprovedUser();

  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

const { data: myInterests } = await supabase
  .from("interests")
  .select("announcement_id")
  .eq("buyer_id", user.id);
const interestedIds = new Set(
  myInterests?.map((i) => i.announcement_id)
);


  const isFarmer = profile?.role === "farmer";
const fromPath =
  profile?.role === "farmer"
    ? "/farmer/browse"
    : profile?.role === "buyer"
    ? "/buyer/browse"
    : profile?.role === "transport"
    ? "/transport/browse"
    : profile?.role === "warehouse"
    ? "/warehouse/browse"
    : "/announcements";
let query = supabase
  .from("announcements")
  .select(`
    id,
    farmer_id,
    product_name,
    product_category,
    quantity,
    unit,
    pickup_region,
    pickup_kommun,
    sell_by_date,
    status,
    type,
    created_at,
    announcement_images (
      public_url,
      position
    )
  `);

if (filter === "surplus") {
  query = query.eq("type", "surplus");
}

if (filter === "regular") {
  query = query.eq("type", "regular");
}
if (search) {
  query = query.ilike("product_name", `%${search}%`);
}
if (category) {
  if (category === "other") {
    query = query.is("product_category", null);
  } else {
    query = query.eq("product_category", category);
  }
}
if (region) {
  query = query.eq("pickup_region", region);
}
if (production) {
  query = query.eq("production_method", production);
}

if (unitParam) {
  query = query.eq("unit", unitParam);
}

if (harvest) {
  query = query.eq("harvest_period", harvest);
}

if (minQty !== null) {
  query = query.gte("quantity", minQty);
}

if (maxQty !== null) {
  query = query.lte("quantity", maxQty);
}


const { data: announcements, error } = await query
  .order("type", { ascending: false })
  .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <p className="text-red-600">{error.message}</p>
      </main>
    );
  }

const grouped = announcements?.reduce((acc, a) => {
  const key = a.product_category || "other";

  if (!acc[key]) acc[key] = [];
  acc[key].push(a);

  return acc;
}, {} as Record<string, typeof announcements>);

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* HERO */}
      <header className="border-b bg-gradient-to-b from-[#f8f8f6] to-white">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Connecting Farmers
              <br />
              with Suppliers
            </h1>

            <p className="mt-4 text-base md:text-lg text-gray-500">
              Discover products from trusted farmers in your area
            </p>

            <div className="mt-8">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-5">
                <AnnouncementFilters
                  search={search}
                  category={category}
                  region={region}
                  production={production}
                  unit={unitParam}
                  harvest={harvest}
                  minQty={minQty}
                  maxQty={maxQty}
                />
              </div>
            </div>
<div className="mt-10">
  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
    Browse by category
  </h3>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
    
    <a
      href="/announcements?category=fruits_berries"
className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition
  ${category === "fruits_berries"
    ? "bg-green-50 border-green-600"
    : "bg-white border-gray-200 hover:shadow-md"
  }
`}
    >
      <div className="text-2xl">🍓</div>
      <span className="text-sm mt-2 text-gray-700">Fruits</span>
    </a>

    <a
      href="/announcements?category=vegetables"
className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition
  ${category === "vegetables"
    ? "bg-green-50 border-green-600"
    : "bg-white border-gray-200 hover:shadow-md"
  }
`}
    >
      <div className="text-2xl">🥕</div>
      <span className="text-sm mt-2 text-gray-700">Vegetables</span>
    </a>

    <a
      href="/announcements?category=grains_oilseeds"
className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition
  ${category === "grains_oilseeds"
    ? "bg-green-50 border-green-600"
    : "bg-white border-gray-200 hover:shadow-md"
  }
`}
    >
      <div className="text-2xl">🌾</div>
      <span className="text-sm mt-2 text-gray-700">Grains</span>
    </a>

    <a
      href="/announcements?category=meat"
className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition
  ${category === "meat"
    ? "bg-green-50 border-green-600"
    : "bg-white border-gray-200 hover:shadow-md"
  }
`}
    >
      <div className="text-2xl">🥩</div>
      <span className="text-sm mt-2 text-gray-700">Meat</span>
    </a>

    <a
      href="/announcements?category=dairy"
className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition
  ${category === "dairy"
    ? "bg-green-50 border-green-600"
    : "bg-white border-gray-200 hover:shadow-md"
  }
`}
    >
      <div className="text-2xl">🥛</div>
      <span className="text-sm mt-2 text-gray-700">Dairy</span>
    </a>

  </div>
</div>
<div className="mt-10">
  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
    What are you looking for?
  </h3>

  <div className="flex flex-wrap justify-center gap-4">
    
    {/* 🔥 SURPLUS */}
    <a
      href="/announcements?filter=surplus"
      className={`px-6 py-4 rounded-2xl text-center min-w-[160px] border transition ${
        filter === "surplus"
          ? "bg-orange-500 text-white border-orange-500"
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="text-xl">🔥</div>
      <div className="font-semibold mt-1">Surplus</div>
      <div className="text-xs text-gray-500">
        Quick deals & excess stock
      </div>
    </a>

    {/* 🌱 REGULAR */}
    <a
      href="/announcements?filter=regular"
      className={`px-6 py-4 rounded-2xl text-center min-w-[160px] border transition ${
        filter === "regular"
          ? "bg-green-700 text-white border-green-700"
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="text-xl">🌱</div>
      <div className="font-semibold mt-1">Regular</div>
      <div className="text-xs text-gray-500">
        Standard listings
      </div>
    </a>

    {/* 📦 ALL */}
    <a
      href="/announcements"
      className={`px-6 py-4 rounded-2xl text-center min-w-[160px] border transition ${
        !filter
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="text-xl">📦</div>
      <div className="font-semibold mt-1">All</div>
      <div className="text-xs text-gray-500">
        Browse everything
      </div>
    </a>

  </div>
</div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {isFarmer ? (
                <>
                  <a
                    href="/farmer"
                    className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                  >
                    ← Back to dashboard
                  </a>

                  <a
                    href="/announcements/new"
                    className="px-4 py-2.5 rounded-xl bg-green-700 text-white hover:bg-green-800 transition shadow-sm"
                  >
                    + Create announcement
                  </a>
                </>
              ) : (
                <a
                  href="/buyer"
                  className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                >
                  ← Back to dashboard
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* FILTER TABS + LIST */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 mb-10">
<h2 className="text-2xl md:text-3xl font-bold text-gray-900">
  {filter === "surplus"
    ? "🔥 Surplus Deals"
    : filter === "regular"
    ? "🌱 Regular Listings"
    : "📦 All Announcements"}
</h2>
        </div>

        {announcements?.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-500">
            No announcements yet.
          </div>
        ) : (
<div className="space-y-16">
  {Object.entries(grouped || {})
  .sort(([a], [b]) => {
    const order = [
      "fruits_berries",
      "vegetables",
      "grains_oilseeds",
      "meat",
      "dairy",
      "eggs",
      "feed",
      "seeds_planting",
      "honey",
      "herbs_spices",
      "processed_food",
      "biomass",
      "other",
    ];

    return order.indexOf(a) - order.indexOf(b);
  })
  .map(([category, items]) => (
<div
  key={category}
  className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8"
>        
        {/* 🧠 CATEGORY TITLE */}
<div className="text-center mb-8">
<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
  {getLabel(PRODUCT_CATEGORIES, category) || category}
</h2>
<a
  href={`/announcements?category=${category}`}
  className="inline-block mt-2 text-sm text-green-700 font-medium hover:underline"
>
  View all
</a>
</div>
<p className="text-sm text-gray-500 text-center mb-4">
{category
  ? "Showing all listings in this category"
  : "Showing top listings in this category"}
</p>
        {/* 📦 GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
{(params?.category ? items : items.slice(0, 4)).map((a) => (
            <div
              key={a.id}
className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition duration-300 hover:shadow-lg hover:-translate-y-1 ${
                a.type === "surplus" ? "ring-2 ring-orange-200" : ""
              }`}
            >
              {a.announcement_images && a.announcement_images.length > 0 ? (
                <div className="overflow-hidden">
                  <img
                    src={a.announcement_images[0].public_url}
                    alt={a.product_name}
                    className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              ) : (
                <div className="h-52 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold text-gray-900 leading-snug">
                    {a.product_name}
                  </h3>

                  {a.type === "surplus" && (
                    <span className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold uppercase tracking-wide">
                      Surplus
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-3">
                  {a.pickup_kommun}, {a.pickup_region}
                </p>

                <p className="text-sm text-gray-700 mt-1 font-medium">
                  {a.quantity} {a.unit}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Sell by: {a.sell_by_date}
                </p>

                <div className="mt-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    {a.status}
                  </span>
                </div>

                <div className="mt-5">
<Link
  href={`/announcements/${a.id}?from=${fromPath}`}
  className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition"
>
  View
</Link>
                  {!isFarmer &&
                    a.status === "published" &&
                    a.farmer_id !== user?.id &&
                    interestedIds.has(a.id) && (
                      <div className="text-sm text-green-700 mt-3 text-center">
                        ✓ Interest sent
                      </div>
                    )}
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)}
      </section>
    </main>
  );
}
