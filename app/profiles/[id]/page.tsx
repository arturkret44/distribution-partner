import { supabaseServer } from "@/lib/supabase/server";
import { requireViewer } from "@/lib/guards";
import { getUserReviewsSummary, getUserReviews } from "@/lib/reviews";
import ReviewsSection from "./ReviewsSection";

export const dynamic = "force-dynamic";

export default async function ProfileViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;

  await requireViewer();

  const supabase = await supabaseServer();

  const reviews = await getUserReviews(id);
  const reviewsSummary = await getUserReviewsSummary(id);
  const { avgRating, totalReviews } = reviewsSummary;

  const { data: baseProfile, error } = await supabase
    .from("profiles")
    .select(
      "company_name, role, phone, contact_email, website, address, country, city, verification_status"
    )
    .eq("id", id)
    .single();

  if (error || !baseProfile) {

    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 px-6 py-10">
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-2xl border shadow-sm p-8">
          <h1 className="text-2xl font-bold text-red-700">
            Access denied or profile not found
          </h1>

          <p className="text-gray-600 mt-3">
            You do not have permission to view this profile.
          </p>

          <a
            href={from || "/announcements"}
            className="inline-block mt-6 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            ← Back
          </a>
        </div>
      </main>
    );
  }

  let details: any = {};

  if (baseProfile.role === "transport") {
    const { data } = await supabase
      .from("transport_profiles")
      .select("*")
      .eq("user_id", id)
      .single();

    details = data || {};
  }

  if (baseProfile.role === "warehouse") {
    const { data } = await supabase
      .from("warehouse_profiles")
      .select("*")
      .eq("user_id", id)
      .single();

    details = data || {};
  }

  if (baseProfile.role === "buyer") {
    const { data } = await supabase
      .from("buyer_profiles")
      .select("*")
      .eq("user_id", id)
      .single();

    details = data || {};
  }

  if (baseProfile.role === "farmer") {
    const { data } = await supabase
      .from("farmer_profiles")
      .select("*")
      .eq("user_id", id)
      .single();

    details = data || {};
  }

  let images: any[] = [];

  if (baseProfile.role === "transport") {
    const { data } = await supabase
      .from("transport_images")
      .select("*")
      .eq("user_id", id);

    images = data || [];
  }

  if (baseProfile.role === "warehouse") {
    const { data } = await supabase
      .from("warehouse_images")
      .select("*")
      .eq("user_id", id);

    images = data || [];
  }

  if (baseProfile.role === "buyer") {
    const { data } = await supabase
      .from("buyer_images")
      .select("*")
      .eq("user_id", id);

    images = data || [];
  }

  if (baseProfile.role === "farmer") {
    const { data } = await supabase
      .from("farmer_images")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: true });

    images = data || [];
  }

  const profileName = details.company_name || baseProfile.company_name || "Profile";
  const heroImage = images.length > 0 ? images[0].public_url : "/farmer_wife.png";
const latestReview = reviews[0];

const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
  star,
  count: reviews.filter((r) => r.rating === star).length,
}));
  const badgeClass =
    "inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium";

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-14">
        <a
          href={from || "/announcements"}
          className="inline-block mb-6 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          ← Back
        </a>

        <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] gap-8 items-start">
          <div>
            <div className="relative overflow-hidden rounded-[2rem] shadow-xl">
              <div className="absolute inset-0 scale-110 blur-2xl opacity-40">
                <img
                  src={heroImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <img
                src={heroImage}
                alt={profileName}
                className="relative w-full h-[360px] md:h-[460px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

              <div className="absolute left-0 right-0 bottom-0 p-6 md:p-8">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md text-white px-4 py-1.5 text-sm font-medium border border-white/20">
                    Public business profile
                  </div>

                  <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white leading-tight">
                    {profileName}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/95">
                    <span className="rounded-full bg-black/25 backdrop-blur px-3 py-1.5">
                      ⭐ {avgRating} ({totalReviews} reviews)
                    </span>

                    <span className="rounded-full bg-black/25 backdrop-blur px-3 py-1.5 capitalize">
                      {baseProfile.role}
                    </span>

                    {(details.country || baseProfile.country) && (
                      <span className="rounded-full bg-black/25 backdrop-blur px-3 py-1.5">
                        📍 {details.country || baseProfile.country}
                      </span>
                    )}
                  </div>

                  {baseProfile.verification_status === "approved" && (
                    <div className="mt-4">
                      <span className="inline-flex items-center rounded-full bg-green-600 text-white px-4 py-1.5 text-sm font-medium shadow-sm">
                        ✔ Verified supplier
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white/90 backdrop-blur border shadow-sm p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500 font-semibold">
                  Country
                </p>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {details.country || baseProfile.country || "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/90 backdrop-blur border shadow-sm p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500 font-semibold">
                  City
                </p>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {details.city || baseProfile.city || "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/90 backdrop-blur border shadow-sm p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500 font-semibold">
                  Phone
                </p>
                <p className="mt-2 text-base font-semibold text-gray-900 break-words">
                  {details.phone || baseProfile.phone || "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/90 backdrop-blur border shadow-sm p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500 font-semibold">
                  Website
                </p>
                {details.website || baseProfile.website ? (
                  <a
                    href={details.website || baseProfile.website}
                    target="_blank"
                    className="mt-2 block text-base font-semibold text-green-700 hover:underline break-all"
                  >
                    {details.website || baseProfile.website}
                  </a>
                ) : (
                  <p className="mt-2 text-base font-semibold text-gray-900">—</p>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <section className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                      Gallery
                    </p>
                    <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
                      Photos from the business
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.slice(1, 5).map((img) => (
                    <div
                      key={img.id}
                      className="group overflow-hidden rounded-2xl bg-white border shadow-sm"
                    >
                      <img
                        src={img.public_url}
                        alt=""
                        className="w-full h-40 object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-8">
              <div className="rounded-[2rem] bg-white/90 backdrop-blur border shadow-sm p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                  Business profile
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
                  Company information
                </h2>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-500">Contact email</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900 break-words">
                      {details.contact_email || baseProfile.contact_email || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {details.address || baseProfile.address || "—"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="mt-2 text-gray-700 whitespace-pre-line leading-7">
                      {details.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {baseProfile.role === "farmer" && (
              <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-[2rem] bg-white/90 backdrop-blur border shadow-sm p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                    Farm details
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    Production overview
                  </h2>

                  <div className="mt-8 space-y-6">
                    <div>
                      <p className="text-sm text-gray-500">Farm name</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {details.farm_name || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Years in business</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {details.years_in_business ?? "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Company type</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {details.company_type || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-gray-950 text-white shadow-xl overflow-hidden">
                  <div className="p-6 md:p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-300">
                      Certifications
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">
                      Compliance & trust
                    </h2>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {details.registered_livsmedelsverket && (
                        <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">
                          Livsmedelsverket
                        </span>
                      )}
                      {details.inspected_jordbruksverket && (
                        <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">
                          Jordbruksverket
                        </span>
                      )}
                      {details.is_krav_certified && (
                        <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">
                          KRAV
                        </span>
                      )}
                      {details.is_eu_organic && (
                        <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">
                          EU Organic
                        </span>
                      )}
                      {details.is_global_gap && (
                        <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">
                          Global G.A.P
                        </span>
                      )}
                      {details.is_ip_sigill && (
                        <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">
                          IP Sigill
                        </span>
                      )}
                      {details.has_haccp && (
                        <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">
                          HACCP
                        </span>
                      )}
                      {details.has_traceability && (
                        <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">
                          Traceability
                        </span>
                      )}

                      {!details.registered_livsmedelsverket &&
                        !details.inspected_jordbruksverket &&
                        !details.is_krav_certified &&
                        !details.is_eu_organic &&
                        !details.is_global_gap &&
                        !details.is_ip_sigill &&
                        !details.has_haccp &&
                        !details.has_traceability && (
                          <p className="text-sm text-gray-300">
                            No certifications provided.
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {baseProfile.role === "farmer" && (
              <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-[2rem] bg-white/90 backdrop-blur border shadow-sm p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                    Delivery & logistics
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    Operational setup
                  </h2>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Delivery scope</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {details.delivery_scope || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Incoterms</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {details.incoterms || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Max delivery distance</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {details.max_delivery_distance_km
                          ? `${details.max_delivery_distance_km} km`
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Own transport</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {details.has_own_transport ? "Yes" : "No"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Needs transport</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {details.needs_transport ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white/90 backdrop-blur border shadow-sm p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                    Export & payment
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    Commercial terms
                  </h2>

                  <div className="mt-8 space-y-6">
                    <div>
                      <p className="text-sm text-gray-500">Can export</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {details.can_export ? "Yes" : "No"}
                      </p>
                    </div>

                    {details.export_countries && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Export countries
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {details.export_countries
                            .split(",")
                            .map((c: string) => c.trim())
                            .filter(Boolean)
                            .map((c: string) => (
                              <span
                                key={c}
                                className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium"
                              >
                                {c}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Payment terms</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {details.payment_terms_days
                            ? `${details.payment_terms_days} days`
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Credit limit</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {details.credit_limit_sek
                            ? `${details.credit_limit_sek} SEK`
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Prepayment accepted
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {details.accepts_prepayment ? "Yes" : "No"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Factoring accepted
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {details.accepts_factoring ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

<ReviewsSection
  reviews={reviews}
  avgRating={avgRating}
  totalReviews={totalReviews}
/>
</div>
          <aside className="xl:sticky xl:top-8">
            <div className="rounded-[2rem] bg-gray-950 text-white shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-300">
                  Quick summary
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Why this profile matters
                </h2>

                <p className="mt-4 text-gray-300 leading-7">
                  Review the company details, gallery, logistics setup and
                  commercial information before making contact.
                </p>

<div className="mt-8 space-y-4">

  {/* COMPANY NAME */}
  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
    <p className="text-sm text-gray-400">Company</p>
    <p className="mt-1 font-semibold text-white">
      {profileName}
    </p>
  </div>

  {/* WEBSITE */}
  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
    <p className="text-sm text-gray-400">Website</p>
    {details.website || baseProfile.website ? (
      <a
        href={details.website || baseProfile.website}
        target="_blank"
        className="mt-1 font-semibold text-green-300 hover:underline break-all"
      >
        {details.website || baseProfile.website}
      </a>
    ) : (
      <p className="mt-1 text-white">—</p>
    )}
  </div>

  {/* CERTIFICATIONS */}
  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
    <p className="text-sm text-gray-400 mb-2">Certifications</p>

    <div className="flex flex-wrap gap-2">

      {details.registered_livsmedelsverket && (
        <span className="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10">
          Livsmedelsverket
        </span>
      )}

      {details.inspected_jordbruksverket && (
        <span className="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10">
          Jordbruksverket
        </span>
      )}

      {details.is_krav_certified && (
        <span className="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10">
          KRAV
        </span>
      )}

      {details.is_eu_organic && (
        <span className="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10">
          EU Organic
        </span>
      )}

      {details.is_global_gap && (
        <span className="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10">
          Global G.A.P
        </span>
      )}

      {details.is_ip_sigill && (
        <span className="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10">
          IP Sigill
        </span>
      )}

      {details.has_haccp && (
        <span className="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10">
          HACCP
        </span>
      )}

      {details.has_traceability && (
        <span className="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10">
          Traceability
        </span>
      )}

      {!details.registered_livsmedelsverket &&
        !details.inspected_jordbruksverket &&
        !details.is_krav_certified &&
        !details.is_eu_organic &&
        !details.is_global_gap &&
        !details.is_ip_sigill &&
        !details.has_haccp &&
        !details.has_traceability && (
          <p className="text-sm text-gray-400">
            No certifications
          </p>
        )}
    </div>
  </div>

</div>
                <div className="mt-8 rounded-2xl bg-green-500/10 border border-green-400/20 p-4">
                  <p className="text-sm font-medium text-green-200">
                    Contact readiness
                  </p>
                  <p className="mt-2 text-sm text-gray-200">
                    Use the public information here to assess fit before moving
                    into direct discussions.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
