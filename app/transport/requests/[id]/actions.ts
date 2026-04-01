"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function sendTransportReply(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("NO USER");
    return;
  }

  const request_id = formData.get("request_id") as string;
  const message = formData.get("message") as string;

  console.log("USER:", user);
  console.log("FORM DATA:", { request_id, message });

  if (!request_id || !message) {
    console.log("MISSING DATA");
    return;
  }

const result = await supabase
  .from("request_messages")
  .insert({
    request_type: "transport",
    request_id,
    sender_id: user.id,
    message,
  });
// ustaw status na in_progress (jeśli jeszcze jest new)
await supabase
  .from("transport_requests")
  .update({ status: "in_progress" })
  .eq("id", request_id)
  .in("status", ["new", null]);

  console.log("INSERT RESULT:", result);

  revalidatePath(`/transport/requests/${request_id}`);
}
export async function updateTransportFinalStatus(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const request_id = formData.get("request_id") as string;
  const status = formData.get("status") as string;

  if (!request_id || !status) return;

  // zabezpieczenie – tylko dozwolone statusy
  if (!["rejected", "closed"].includes(status)) return;

  await supabase
    .from("transport_requests")
  .update({
    status,
    ...(status === "closed" && {
      closed_at: new Date().toISOString(),
    }),
  })
    .eq("id", request_id)
    .eq("transport_user_id", user.id);

  revalidatePath(`/transport/requests/${request_id}`);
}
export async function archiveTransportRequest(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const request_id = formData.get("request_id") as string;

  if (!request_id) return;

  await supabase
    .from("transport_requests")
    .update({ archived_by_transport: true })
    .eq("id", request_id)
    .eq("transport_user_id", user.id);

  // po usunięciu wracamy do listy
  return redirect("/transport/requests");
}
export async function sendTransportForm(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const request_id = formData.get("request_id") as string;

  if (!request_id) return;

  const { error } = await supabase
    .from("transport_requests")
    .update({
      form_status: "pending",
    })
    .eq("id", request_id)
    .eq("transport_user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/transport/requests/${request_id}`);

  redirect(`/transport/requests/${request_id}`);
}
