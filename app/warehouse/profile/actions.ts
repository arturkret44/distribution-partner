"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveWarehouseProfile(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  // 🔹 GLOBAL
  const company_name = formData.get("company_name") as string;
  const phone = formData.get("phone") as string;
  const website = formData.get("website") as string;
  const address = formData.get("address") as string;
  const country = formData.get("country") as string;
  const city = formData.get("city") as string;

  // 🔹 WAREHOUSE
  const operating_region = formData.get("operating_region") as string;
  const contact_email = formData.get("contact_email") as string;
  const org_number = formData.get("org_number") as string;
  const has_cold_storage = formData.get("has_cold_storage") === "on";
  const description = formData.get("description") as string;
  const operating_kommuner = formData.getAll("operating_kommuner") as string[];

  const { data: existing } = await supabase
    .from("warehouse_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase
      .from("warehouse_profiles")
      .update({
        company_name,
        operating_region,
        operating_kommuner,
        has_cold_storage,
        description,
        city,
        contact_email,
        org_number,
      })
      .eq("user_id", user.id);
  } else {
    await supabase.from("warehouse_profiles").insert({
      user_id: user.id,
      company_name,
      operating_region,
      operating_kommuner,
      has_cold_storage,
      description,
      city,
      contact_email,
      org_number,
    });
  }

  // 🔁 UPDATE GLOBAL PROFILE
  await supabase
    .from("profiles")
    .update({
      company_name,
      phone,
      website,
      address,
      country,
      city,
      verification_status: "pending",
    })
    .eq("id", user.id);

  // 🔁 REFRESH CACHE
  revalidatePath("/warehouse/profile");

  // 🔁 REDIRECT
  redirect("/warehouse/profile");
}
