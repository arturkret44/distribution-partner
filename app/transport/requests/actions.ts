"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireApprovedUser } from "@/lib/guards";


export async function updateRequestStatus(formData: FormData) {
  const supabase = await supabaseServer();

const { user } = await requireApprovedUser();

  const request_id = formData.get("request_id") as string;
  const status = formData.get("status") as string;

  await supabase
    .from("transport_requests")
    .update({ status })
    .eq("id", request_id);

  revalidatePath("/transport/requests");
}
