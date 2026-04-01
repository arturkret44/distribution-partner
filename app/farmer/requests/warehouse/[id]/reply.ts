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
export async function submitStorageForm(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const request_id = formData.get("request_id") as string;

  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const quantity = formData.get("quantity") as string;
  const notes = formData.get("notes") as string;
  const storage_unit = formData.get("storage_unit") as string;
const packaging_type = formData.get("packaging_type") as string;
const storage_type = formData.get("storage_type") as string;

  const { error } = await supabase
    .from("warehouse_requests")
.update({
  form_status: "submitted",
  storage_start_date: start_date,
  storage_end_date: end_date,
  storage_quantity: quantity,
  storage_unit: storage_unit,
  packaging_type: packaging_type,
  storage_type: storage_type,
  storage_notes: notes,
  form_submitted_at: new Date().toISOString(),
})

    .eq("id", request_id)
    .eq("farmer_id", user.id);

  if (error) throw new Error(error.message);

  redirect(`/farmer/requests/warehouse/${request_id}`);
}
