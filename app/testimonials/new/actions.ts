"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function createTestimonial(formData: FormData) {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const rating = Number(formData.get("rating"));
  const content = (formData.get("content") as string)?.trim();

  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Invalid rating");
  }

  if (!content || content.length < 10) {
    throw new Error("Opinion must be at least 10 characters");
  }

  // 🔥 pobierz profil użytkownika
const { data: existing } = await supabase
  .from("testimonials")
  .select("id")
  .eq("author_user_id", user.id)
  .maybeSingle();

if (existing) {
  redirect("/?testimonial=already-exists");
}

const { data: profile } = await supabase
  .from("profiles")
  .select("company_name, role")
  .eq("id", user.id)
  .single();

const { error } = await supabase.from("testimonials").insert({
  author_user_id: user.id,
  author_company_name: profile?.company_name || "Unknown company",
  author_role: profile?.role || null,
  rating,
  content,
  status: "pending",
});

if (error) {
  throw new Error(error.message);
}

redirect("/?testimonial=sent");
}
