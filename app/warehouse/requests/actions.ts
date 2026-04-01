"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { requireApprovedUser } from "@/lib/guards";

export async function markRequestAsRead(formData: FormData) {
  const supabase = await supabaseServer();

const { user } = await requireApprovedUser()

  const requestId = formData.get("request_id") as string;

  await supabase
    .from("warehouse_requests")
    .update({ read_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("warehouse_user_id", user.id);

  redirect("/warehouse/requests");
}
