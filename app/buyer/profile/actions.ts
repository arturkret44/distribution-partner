"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function saveBuyerProfile(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

const company_name = formData.get("company_name") as string;
const phone = formData.get("phone") as string;
const org_number = formData.get("org_number") as string;
const contact_email = formData.get("contact_email") as string;
const country = formData.get("country") as string;
const city = formData.get("city") as string;
const address = formData.get("address") as string;
const description = formData.get("description") as string;
const website = formData.get("website") as string;

await supabase
  .from("profiles")
  .update({
    company_name,
    phone,
    country,
    city,
    address,
    description,
    website,
    contact_email,
    org_number,
    verification_status: "pending"
  })
  .eq("id", user.id);

redirect("/waiting");

}
