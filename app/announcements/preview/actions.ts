"use server";

import { supabaseServer } from "@/lib/supabase/server";

export type PublicAnnouncementPreview = {
  id: string;
  product_name: string;
  pickup_region: string | null;
  type: "regular" | "surplus" | string;
  price: number | null;
  price_negotiable: boolean;
  created_at: string;
  announcement_images?: { public_url: string; position: number }[] | null;
};

export async function getPublicAnnouncementsPreview(
  limit: number = 8
): Promise<PublicAnnouncementPreview[]> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("announcements")
    .select(
      `
      id,
      product_name,
      pickup_region,
      type,
      price,
      price_negotiable,
      created_at,
      announcement_images (
        public_url,
        position
      )
    `
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    // sort images so first one is the "main" one
    .order("position", { ascending: true, foreignTable: "announcement_images" })
    .limit(limit);

  if (error) {
    // For MVP: fail safe (return empty list instead of crashing homepage)
    console.error("getPublicAnnouncementsPreview error:", error.message);
    return [];
  }

  return (data ?? []) as PublicAnnouncementPreview[];
}
