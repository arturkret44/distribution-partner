"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveTransportProfile(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const company_name = formData.get("company_name") as string;
  const phone = formData.get("phone") as string;
  const website = formData.get("website") as string;
  const address = formData.get("address") as string;
  const country = formData.get("country") as string;
  const operating_region = formData.get("operating_region") as string;
  const contact_email = formData.get("contact_email") as string;
  const org_number = formData.get("org_number") as string;
  const has_refrigerated = formData.get("has_refrigerated") === "on";
  const description = formData.get("description") as string;
  const city = formData.get("city") as string;

  const operating_kommuner = formData.getAll("operating_kommuner") as string[];

  // 🔎 check if exists
  const { data: existing } = await supabase
    .from("transport_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // update transport profile
    await supabase
      .from("transport_profiles")
      .update({
        company_name,
        operating_region,
        operating_kommuner,
        has_refrigerated,
        description,
        city,
        contact_email,
        org_number,
      })
      .eq("user_id", user.id);
  } else {
    // insert new
    await supabase.from("transport_profiles").insert({
      user_id: user.id,
      company_name,
      operating_region,
      operating_kommuner,
      has_refrigerated,
      description,
      city,
      contact_email,
      org_number,
    });
  }

  // 🔁 UPDATE GLOBAL PROFILE
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      company_name,
      phone,
      website,
      address,
      country,
      city,
      verification_status: "pending", // 🔥 re-approval
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("PROFILE UPDATE ERROR:", profileError.message);
    throw new Error(profileError.message);
  }

  // 🔁 REFRESH CACHE
  revalidatePath("/transport/profile");

  // 🔁 REDIRECT NA KONIEC
  redirect("/transport/profile");
}
