"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/guards";

export async function sendWarehouseReply(formData: FormData) {
  const supabase = await supabaseServer();
  const { user } = await requireRole("warehouse");

  const request_id = formData.get("request_id") as string;
  const message = formData.get("message") as string;

  if (!request_id || !message) return;

  // ✅ upewnij się, że request należy do tego warehouse
  const { data: req, error: reqErr } = await supabase
    .from("warehouse_requests")
    .select("id, warehouse_user_id, archived_by_farmer")
    .eq("id", request_id)
    .single();

  if (reqErr || !req || req.warehouse_user_id !== user.id) {
    redirect("/warehouse/requests");
  }

  if (req.archived_by_farmer) {
    redirect(`/warehouse/requests/${request_id}`);
  }

  const { error: insertError } = await supabase
    .from("request_messages")
    .insert({
      request_type: "warehouse",
      request_id,
      sender_id: user.id,
      message,
    });

  if (insertError) {
    throw new Error(insertError.message);
  }

  // status -> in_progress
  await supabase
    .from("warehouse_requests")
    .update({ status: "in_progress" })
    .eq("id", request_id)
    .eq("warehouse_user_id", user.id)
    .eq("status", "new");

  revalidatePath(`/warehouse/requests/${request_id}`);
  revalidatePath(`/warehouse/requests`);

  redirect(`/warehouse/requests/${request_id}`);
}

export async function updateWarehouseFinalStatus(formData: FormData) {
  const supabase = await supabaseServer();
  const { user } = await requireRole("warehouse");

  const request_id = formData.get("request_id") as string;
  const status = formData.get("status") as string;

  if (!request_id || !status) return;
  if (!["rejected", "closed"].includes(status)) return;

const updateData: any = { status };

// 👉 NOWE (najważniejsze)
if (status === "closed") {
  updateData.closed_at = new Date().toISOString();
}

const { error } = await supabase
  .from("warehouse_requests")
  .update(updateData)
  .eq("id", request_id)
  .eq("warehouse_user_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath(`/warehouse/requests/${request_id}`);
  revalidatePath(`/warehouse/requests`);

  redirect(`/warehouse/requests/${request_id}`);
}
export async function sendStorageForm(formData: FormData) {
  const supabase = await supabaseServer();
  const { user } = await requireRole("warehouse");

  const request_id = formData.get("request_id") as string;

  if (!request_id) return;

  const { error } = await supabase
    .from("warehouse_requests")
    .update({
      form_status: "pending",
    })
    .eq("id", request_id)
    .eq("warehouse_user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/warehouse/requests/${request_id}`);

  redirect(`/warehouse/requests/${request_id}`);
}
