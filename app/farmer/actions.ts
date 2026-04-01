"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function markNotificationAsReadAndGo(
  formData: FormData
) {
  const notificationId = formData.get("notification_id") as string;
  const announcementId = formData.get("announcement_id") as string;

  const supabase = await supabaseServer();

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId);

  revalidatePath("/farmer");

  redirect(`/announcements/${announcementId}`);
}

export async function markAllNotificationsAsRead() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("farmer_id", user.id)
    .is("read_at", null);

  redirect("/farmer");
}
