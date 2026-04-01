"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function updateTestimonialStatus(formData: FormData) {
  await requireApprovedUser(); // później zmienimy na requireAdmin

  const supabase = await supabaseServer();

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!id || !status) return;

  const { error } = await supabase
    .from("testimonials")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/testimonials");
}
