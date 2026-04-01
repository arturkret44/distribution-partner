"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addExternalCompany(formData: FormData) {
  const supabase = await supabaseServer();

  const company_name = formData.get("company_name") as string;
  const region = formData.get("region") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const website = formData.get("website") as string;
  const description = formData.get("description") as string;

  const has_refrigerated = formData.get("has_refrigerated") === "on";

  const kommunerRaw = formData.get("kommuner") as string;

  const kommuner = kommunerRaw
    ? kommunerRaw.split(",").map((k) => k.trim())
    : [];

  await supabase.from("external_transport_companies").insert({
    company_name,
    region,
    kommuner,
    has_refrigerated,
    phone,
    email,
    website,
    description,
  });

  revalidatePath("/admin/external-transport");
}
