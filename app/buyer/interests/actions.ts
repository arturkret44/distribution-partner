"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { revalidatePath } from "next/cache";

export async function closeDealByBuyer(formData: FormData) {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const interestId = formData.get("interest_id") as string;

  if (!interestId) return;

  // 🔍 pobierz interest
  const { data: interest } = await supabase
    .from("interests")
    .select("id, buyer_id, status")
    .eq("id", interestId)
    .single();

  if (!interest) return;

  // 🔒 security
  if (interest.buyer_id !== user.id) return;

  // 🛑 tylko agreed
  if (interest.status !== "agreed") return;

  // ✅ zamknij
  await supabase
    .from("interests")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
    })
    .eq("id", interestId);

  revalidatePath("/buyer/interests");
}
