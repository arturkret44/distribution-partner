"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateInterestStatus(formData: FormData) {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const interestId = formData.get("interest_id") as string;
  const newStatus = formData.get("status") as string;

  // 🔒 walidacja wejścia NA POCZĄTKU
  if (!interestId || !newStatus) return;

  // 🔍 pobierz interest
  const { data: interest } = await supabase
    .from("interests")
    .select("id, announcement_id, requested_quantity, status")
    .eq("id", interestId)
    .single();

  if (!interest) return;

  // 🔍 pobierz ogłoszenie (i sprawdź czy należy do farmera)
  const { data: announcement } = await supabase
    .from("announcements")
    .select("id, quantity_available, farmer_id")
    .eq("id", interest.announcement_id)
    .single();

  if (!announcement) return;

  // 🔒 SECURITY: tylko właściciel ogłoszenia może zmienić status
  if (announcement.farmer_id !== user.id) {
    return;
  }

  // 📦 logika magazynowa
  if (interest.status === "pending" && newStatus === "rejected") {
    const restored =
      announcement.quantity_available + interest.requested_quantity;

    await supabase
      .from("announcements")
      .update({ quantity_available: restored })
      .eq("id", announcement.id);
  }

  // ✏️ update statusu
  const { error } = await supabase
    .from("interests")
    .update({
      status: newStatus,
      read_at: null,
    })
    .eq("id", interestId);

  if (error) {
    console.error(error);
  }

revalidatePath("/farmer/interests");

}
export async function closeDeal(formData: FormData) {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const interestId = formData.get("interest_id") as string;

  if (!interestId) return;

  // pobierz interest
  const { data: interest } = await supabase
    .from("interests")
    .select("id, announcement_id")
    .eq("id", interestId)
    .single();

  if (!interest) return;

  // pobierz ogłoszenie aby sprawdzić właściciela
  const { data: announcement } = await supabase
    .from("announcements")
    .select("farmer_id")
    .eq("id", interest.announcement_id)
    .single();

  if (!announcement) return;

  // security check
  if (announcement.farmer_id !== user.id) {
    return;
  }

  // zamknij deal
  await supabase
    .from("interests")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
    })
    .eq("id", interestId);

revalidatePath("/farmer/interests");
}
