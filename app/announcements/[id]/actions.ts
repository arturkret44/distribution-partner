"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updateInterestStatus(
  interestId: string,
  announcementId: string,
  status: "contacted" | "agreed" | "rejected"
) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase
.from("interests")
.update({
  status: status,
  read_at: null,
})
.eq("id", interestId)

  if (error) {
    throw new Error(error.message);
  }

redirect(`/announcements/${announcementId}`);

}
