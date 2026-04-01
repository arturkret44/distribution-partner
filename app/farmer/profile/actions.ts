"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function saveFarmerProfile(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const org_number = formData.get("org_number") as string;
  const company_name = formData.get("company_name") as string;
  const phone = formData.get("phone") as string;
  const contact_email = formData.get("contact_email") as string;
  const country = formData.get("country") as string;
  const city = formData.get("city") as string;
  const address = formData.get("address") as string;
  const description = formData.get("description") as string;
  const website = formData.get("website") as string;

  // --- FARM DETAILS ---
  const farm_name = formData.get("farm_name") as string;
  const years_in_business_raw = formData.get("years_in_business") as string;
  const company_type = formData.get("company_type") as string;

  let years_in_business: number | null = null;
  if (years_in_business_raw) {
    const parsed = parseInt(years_in_business_raw, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      years_in_business = parsed;
    }
  }

  // --- CERTIFICATIONS ---
  const registered_livsmedelsverket = formData.get("registered_livsmedelsverket") === "on";
  const inspected_jordbruksverket = formData.get("inspected_jordbruksverket") === "on";
  const is_krav_certified = formData.get("is_krav_certified") === "on";
  const is_eu_organic = formData.get("is_eu_organic") === "on";
  const is_global_gap = formData.get("is_global_gap") === "on";
  const is_ip_sigill = formData.get("is_ip_sigill") === "on";
  const has_haccp = formData.get("has_haccp") === "on";
  const has_traceability = formData.get("has_traceability") === "on";

  // --- LOGISTICS & DELIVERY ---
  const delivery_scope = formData.get("delivery_scope") as string;
  const incoterms = formData.get("incoterms") as string;

  const max_delivery_distance = Math.max(
    0,
    Number(formData.get("max_delivery_distance_km") || 0)
  );

  const payment_terms_days = Math.max(
    0,
    Number(formData.get("payment_terms_days") || 0)
  );

  // 🔧 ZMIENIONE NAZWY
  const credit_limit = Math.max(
    0,
    Number(formData.get("credit_limit") || 0)
  );

  const has_own_transport = formData.get("has_own_transport") === "on";
  const needs_transport = formData.get("needs_transport") === "on";

  const can_export = formData.get("can_export") === "on";

  const accepts_prepayment = formData.get("accepts_prepayment") === "on";
  const accepts_factoring = formData.get("accepts_factoring") === "on";

  // export countries
  const exportCountriesArr = formData.getAll("export_countries") as string[];
  const export_countries = exportCountriesArr.join(",");

  // --- UPDATE PROFILE ---
  await supabase
    .from("profiles")
    .update({
      first_name,
      last_name,
      org_number,
      company_name,
      phone,
      country,
      city,
      address,
      description,
      website,
      contact_email,
      verification_status: "pending",
    })
    .eq("id", user.id);

  // --- UPSERT farmer_profiles ---
  await supabase
    .from("farmer_profiles")
    .upsert(
      {
        user_id: user.id,

        // --- BASIC ---
        farm_name,
        years_in_business,
        company_type,

        // --- CERTIFICATIONS ---
        registered_livsmedelsverket,
        inspected_jordbruksverket,
        is_krav_certified,
        is_eu_organic,
        is_global_gap,
        is_ip_sigill,
        has_haccp,
        has_traceability,

        // --- DELIVERY / LOGISTICS ---
        delivery_scope,
        incoterms,
        max_delivery_distance_km: max_delivery_distance,
        has_own_transport,
        needs_transport,

        // --- EXPORT ---
        export_countries,
        can_export,

        // --- PAYMENT ---
        payment_terms_days,
        credit_limit,
        accepts_prepayment,
        accepts_factoring,
      },
      { onConflict: "user_id" }
    );

  redirect("/farmer/profile");
}
