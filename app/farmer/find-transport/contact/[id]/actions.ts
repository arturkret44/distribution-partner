"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendTransportRequest(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const transport_user_id = formData.get("transport_user_id") as string;
  const message = formData.get("message") as string;

  // 1️⃣ utwórz request
  const { data: request, error } = await supabase
    .from("transport_requests")
    .insert({
      farmer_id: user.id,
      transport_user_id,
      message,
    })
    .select("id")
    .single();

  if (error || !request) {
    throw new Error("Failed to create transport request");
  }

  // 2️⃣ zapisz pierwszą wiadomość w threadzie
  await supabase.from("request_messages").insert({
    request_type: "transport",
    request_id: request.id,
    sender_id: user.id,
    message,
  });

  redirect("/farmer/requests");
}
