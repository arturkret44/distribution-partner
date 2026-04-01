// app/announcements/[id]/edit/page.tsx

import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { redirect } from "next/navigation";
import { CreateAnnouncementForm } from "@/app/announcements/new/form";
export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 🔥 KLUCZOWE

  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (!announcement) {
    redirect("/farmer/announcements");
  }

  if (announcement.farmer_id !== user.id) {
    redirect("/announcements");
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Edit announcement
      </h1>


<CreateAnnouncementForm
  announcement={announcement}
  mode="edit"
/>
    </main>
  );
}
