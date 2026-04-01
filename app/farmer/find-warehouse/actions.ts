"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { requireApprovedUser } from "@/lib/guards";

export async function sendWarehouseRequest(formData: FormData) {
  const supabase = await supabaseServer();

const { user } = await requireApprovedUser()

  const warehouse_user_id = formData.get("warehouse_user_id") as string;
  const announcement_id = formData.get("announcement_id") as string;
  const message = formData.get("message") as string;

  // 1️⃣ utwórz request
  const { data: request, error } = await supabase
    .from("warehouse_requests")
    .insert({
      farmer_id: user.id,
      warehouse_user_id,
      announcement_id: announcement_id || null,
      message,
    })
    .select("id")
    .single();

  if (error || !request) {
    throw new Error("Failed to create warehouse request");
  }

  // 2️⃣ zapisz pierwszą wiadomość w threadzie
  await supabase.from("request_messages").insert({
    request_type: "warehouse",
    request_id: request.id,
    sender_id: user.id,
    message,
  });

  redirect("/farmer/requests");
}
