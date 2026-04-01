"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function markAllAsRead() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("transport_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("transport_user_id", user.id)
    .is("read_at", null);

  redirect("/transport/notifications");
}
