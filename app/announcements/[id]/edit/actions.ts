"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function updateAnnouncement(formData: FormData) {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const id = formData.get("id") as string;

  // 🔍 pobierz ogłoszenie
  const { data: existing } = await supabase
    .from("announcements")
    .select("farmer_id, quantity, quantity_available")
    .eq("id", id)
    .single();

  if (!existing) {
    throw new Error("Announcement not found");
  }

  // 🔒 SECURITY
  if (existing.farmer_id !== user.id) {
    throw new Error("Unauthorized");
  }

  const newQuantity = Number(formData.get("quantity"));

  let newAvailable = existing.quantity_available;

  // 🧠 jeśli farmer zwiększył ilość → dodaj do available
  if (newQuantity > existing.quantity) {
    newAvailable += newQuantity - existing.quantity;
  }

  // 🧠 jeśli zmniejszył → nie pozwól zejść poniżej zarezerwowanych
  if (newQuantity < existing.quantity) {
    const reserved = existing.quantity - existing.quantity_available;

    if (newQuantity < reserved) {
      throw new Error("Cannot reduce below reserved quantity");
    }

    newAvailable = newQuantity - reserved;
  }

  const { error } = await supabase
    .from("announcements")
    .update({
      product_name: formData.get("product_name"),
      quantity: newQuantity,
      quantity_available: newAvailable,
      price: Number(formData.get("price")),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/farmer/announcements");
}
