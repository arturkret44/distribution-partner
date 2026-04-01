"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendReply(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const request_type = formData.get("request_type") as string;
  const request_id = formData.get("request_id") as string;
  const message = formData.get("message") as string;

  await supabase.from("request_messages").insert({
    request_type,
    request_id,
    sender_id: user.id,
    message,
  });

  redirect(`/farmer/requests/${request_type}/${request_id}`);
}
export async function submitTransportForm(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const request_id = formData.get("request_id") as string;

  const pickup_location = formData.get("pickup_location") as string;
  const delivery_location = formData.get("delivery_location") as string;

  const pickup_date = formData.get("pickup_date") as string;
  const delivery_date = formData.get("delivery_date") as string;

  const cargo_type = formData.get("cargo_type") as string;
  const cargo_weight = formData.get("cargo_weight") as string;
  const pallets_count = formData.get("pallets_count") as string;
  const transport_notes = formData.get("transport_notes") as string;

  const { error } = await supabase
    .from("transport_requests")
    .update({
      form_status: "submitted",
      pickup_location,
      delivery_location,
      pickup_date,
      delivery_date,
      cargo_type,
      cargo_weight,
      pallets_count,
      transport_notes,
      form_submitted_at: new Date().toISOString(),
    })
    .eq("id", request_id)
    .eq("farmer_id", user.id);

  if (error) throw new Error(error.message);

  redirect(`/farmer/requests/transport/${request_id}`);
}
