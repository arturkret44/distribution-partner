"use server";

import { supabaseServer } from "@/lib/supabase/server";

export type ApprovedTestimonial = {
  id: string;
  author_company_name: string | null;
  author_role: string;
  rating: number;
  content: string;
  created_at: string;
};

export async function getApprovedTestimonials(
  limit: number = 6
): Promise<ApprovedTestimonial[]> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author_company_name, author_role, rating, content, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getApprovedTestimonials error:", error.message);
    return [];
  }

  return (data ?? []) as ApprovedTestimonial[];
}

