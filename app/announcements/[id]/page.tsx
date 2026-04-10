import { supabaseServer } from "@/lib/supabase/server";
import TransportInterestButton from "@/components/TransportInterestButton";
import WarehouseInterestButton from "@/components/WarehouseInterestButton";
import { addTransportInterest,addWarehouseInterest } from "@/app/announcements/actions";
import { requireApprovedUser } from "@/lib/guards";
import { updateInterestStatus } from "./actions";
import { createInterest } from "@/app/announcements/actions";
import { requireLoggedUser } from "@/lib/guards";
import {
  PRODUCT_CATEGORIES,
  PRODUCTION_METHODS,
  PACKAGING_TYPES,
  PRICE_TYPES,
  HARVEST_PERIODS,
  getLabel,
} from "@/lib/options";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    agreed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    published: "bg-green-100 text-green-700",
    draft: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default async function AnnouncementDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notification?: string; from?: string }>;
}) {
  const { id } = await params;

  await requireLoggedUser();

  const supabase = await supabaseServer();

  const resolvedSearchParams = await searchParams;
  const notificationId = resolvedSearchParams?.notification;
  const from = resolvedSearchParams?.from;
const backHref = from || "/announcements";
  if (notificationId) {
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, verification_status")
    .eq("id", user?.id)
    .single();

  const isApproved = profile?.verification_status === "approved";
  const userRole = profile?.role;

  //  UPDATED SELECT WITH NEW FIELDS
  const { data: announcement, error: announcementError } = await supabase
    .from("announcements")
    .select(`
      id,
      product_name,
      quantity,
      quantity_available,
      unit,
      status,
      farmer_id,
      price,
      price_negotiable,
      product_category,
      variety,
      harvest_period,
      production_method,
      packaging_type,
      min_order_quantity,
      expiration_date,
      origin_country,
      price_type,
      announcement_images (
        id,
        public_url,
        position
      )
    `)
    .eq("id", id)
    .single();

  if (announcementError || !announcement) {
    return (
      <main className="p-10">
        <h1 className="text-xl font-bold">Announcement not found</h1>
      </main>
    );
  }

  const isOwner = announcement.farmer_id === user?.id;

  let buyerProfileComplete = true;

  if (!isOwner) {
    const { data: buyerProfile } = await supabase
      .from("profiles")
      .select("company_name, phone, country, city")
      .eq("id", user?.id)
      .single();

    buyerProfileComplete = !!(
      buyerProfile?.company_name &&
      buyerProfile?.phone &&
      buyerProfile?.country &&
      buyerProfile?.city
    );
  }

  let existingInterest = null;
let existingTransportInterest = null;

if (userRole === "transport" && user) {
  const { data } = await supabase
    .from("transport_interests")
    .select("id")
    .eq("announcement_id", id)
    .eq("transport_user_id", user.id)
    .maybeSingle();

  existingTransportInterest = data;
}
let existingWarehouseInterest = null;

if (userRole === "warehouse" && user) {
  const { data } = await supabase
    .from("warehouse_interests")
    .select("id")
    .eq("announcement_id", id)
    .eq("warehouse_user_id", user.id)
    .maybeSingle();

  existingWarehouseInterest = data;
}
  if (!isOwner && user) {
    const { data } = await supabase
      .from("interests")
      .select("id, status")
      .eq("announcement_id", id)
      .eq("buyer_id", user.id)
      .maybeSingle();

    existingInterest = data;
  }

  const { data: interests, error: interestsError } = await supabase.rpc(
    "get_announcement_interests",
    {
      p_announcement_id: id,
    }
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* BACK BUTTON */}

<a
  href={backHref}
  className="inline-block mb-6 text-sm text-gray-600 font-medium hover:underline"
>
  ← Back
</a>
{/* MAIN CARD */}
<div className="bg-white rounded-xl shadow-sm border p-6">

  {/* HEADER */}
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-800">
      {announcement.product_name}
    </h1>

    <StatusBadge status={announcement.status} />
  </div>

  {/* GRID */}
  <div className="grid md:grid-cols-2 gap-8 mt-6">

    {/* LEFT: IMAGES */}
    <div>
      {announcement.announcement_images?.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3">
            Product images
          </h2>

          <div className="space-y-4">
            {announcement.announcement_images
              .sort((a: any, b: any) => a.position - b.position)
              .map((img: any) => (
                <img
                  key={img.id}
                  src={img.public_url}
                  className="w-full h-56 object-cover rounded-lg border"
                  alt="Announcement image"
                />
              ))}
          </div>
        </>
      )}
    </div>

    {/* RIGHT: ALL INFO */}
    <div className="space-y-5">

      {/* PRICE */}
      <div>
        <p className="text-sm text-gray-500">Price</p>
        <p className="font-semibold text-lg">
          {announcement.price} SEK
          {announcement.price_negotiable && (
            <span className="ml-2 text-sm text-green-700">
              (negotiable)
            </span>
          )}
        </p>
      </div>

      {/* QUANTITY */}
      <div>
        <p className="text-sm text-gray-500">Quantity</p>

        <p className="font-semibold">
          Total: {announcement.quantity} {announcement.unit}
        </p>

        <p className="text-sm text-green-700">
          Available: {announcement.quantity_available} {announcement.unit}
        </p>

        {announcement.quantity_available === 0 && (
          <p className="text-red-600 font-semibold mt-2">
            ❌ Sold out
          </p>
        )}
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 gap-4 text-sm">

        {announcement.product_category && (
          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-medium">
              {getLabel(PRODUCT_CATEGORIES, announcement.product_category)}
            </p>
          </div>
        )}

        {announcement.variety && (
          <div>
            <p className="text-gray-500">Variety / breed</p>
            <p className="font-medium">{announcement.variety}</p>
          </div>
        )}

        {announcement.harvest_period && (
          <div>
            <p className="text-gray-500">Harvest period</p>
            <p className="font-medium">
              {getLabel(HARVEST_PERIODS, announcement.harvest_period)}
            </p>
          </div>
        )}

        {announcement.production_method && (
          <div>
            <p className="text-gray-500">Production method</p>
            <p className="font-medium">
              {getLabel(PRODUCTION_METHODS, announcement.production_method)}
            </p>
          </div>
        )}

        {announcement.packaging_type && (
          <div>
            <p className="text-gray-500">Packaging</p>
            <p className="font-medium">
              {getLabel(PACKAGING_TYPES, announcement.packaging_type)}
            </p>
          </div>
        )}

        {announcement.origin_country && (
          <div>
            <p className="text-gray-500">Country of origin</p>
            <p className="font-medium">
              {announcement.origin_country}
            </p>
          </div>
        )}

        {announcement.min_order_quantity && (
          <div>
            <p className="text-gray-500">Minimum order</p>
            <p className="font-medium">
              {announcement.min_order_quantity} {announcement.unit}
            </p>
          </div>
        )}

        {announcement.expiration_date && (
          <div>
            <p className="text-gray-500">Best before</p>
            <p className="font-medium">
              {announcement.expiration_date}
            </p>
          </div>
        )}

        {announcement.price_type && (
          <div>
            <p className="text-gray-500">Price type</p>
            <p className="font-medium">
              {getLabel(PRICE_TYPES, announcement.price_type)}
            </p>
          </div>
        )}

      </div>
    </div>
  </div>
</div>
        {/*  INTEREST FORM */}
        {!isOwner &&
          isApproved &&
          userRole === "buyer" &&
          buyerProfileComplete &&
          !existingInterest && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Interested in this product?
              </h2>

              <form action={createInterest} className="space-y-4">
                <input
                  type="hidden"
                  name="announcement_id"
                  value={announcement.id}
                />

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Quantity you want to buy
                  </label>

                  <input
                    type="number"
                    name="requested_quantity"
                    min={announcement.min_order_quantity || 1}
                    max={announcement.quantity_available}
                    disabled={
                      announcement.quantity_available === 0
                    }
                    required
                    className="w-full border rounded-md px-3 py-2"
                    placeholder={`e.g. ${
                      announcement.min_order_quantity || 1
                    }`}
                  />

                  {announcement.min_order_quantity && (
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum order:{" "}
                      {announcement.min_order_quantity}{" "}
                      {announcement.unit}
                    </p>
                  )}
                </div>

                {announcement.price_negotiable && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Your offer price (SEK)
                    </label>

<input
  type="number"
  name="offered_price"
  step="0.01"
  min="0.01"
  inputMode="decimal"
  required
  className="w-full border rounded-md px-3 py-2"
  placeholder="Enter your offer"
/>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    announcement.quantity_available === 0
                  }
                  className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition"
                >
                  Send interest
                </button>
              </form>
            </div>
          )}
{/* TRANSPORT INTEREST */}
{!isOwner && isApproved && userRole === "transport" && (
  <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">

    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Transport availability
    </h2>

    {existingTransportInterest ? (
      <div className="text-green-700 font-medium">
        ✓ You are interested in transporting this product
      </div>
    ) : (
<TransportInterestButton
  announcementId={announcement.id}
  action={addTransportInterest}
  alreadyInterested={!!existingTransportInterest}
/>
)}
  </div>
)}
{/* WAREHOUSE INTEREST */}
{!isOwner && isApproved && userRole === "warehouse" && (
  <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">

    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Storage availability
    </h2>

<WarehouseInterestButton
  announcementId={announcement.id}
  action={addWarehouseInterest}
  alreadyInterested={!!existingWarehouseInterest}
/>
  </div>
)}
      </div>
    </main>
  );
}
