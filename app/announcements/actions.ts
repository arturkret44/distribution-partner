"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";

export async function createInterest(formData: FormData) {
  const supabase = await supabaseServer();
  const { user } = await requireApprovedUser();

//  ONLY BUYER CAN CREATE INTEREST
const { data: roleRow } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (roleRow?.role !== "buyer") {
  throw new Error("Only buyers can send interest");
}

  const announcementId = formData.get("announcement_id") as string;
  const offeredPriceRaw = formData.get("offered_price");

  const requestedQuantityRaw = formData.get("requested_quantity");
  const requestedQuantity =
    requestedQuantityRaw && requestedQuantityRaw !== ""
      ? Number(requestedQuantityRaw)
      : null;

  const offeredPrice =
    offeredPriceRaw && offeredPriceRaw !== ""
      ? Number(offeredPriceRaw)
      : null;

  //  sprawdzamy profil kupującego
  const { data: profile } = await supabase
    .from("profiles")
    .select("company_name, phone, country, city")
    .eq("id", user.id)
    .single();

  const profileComplete = !!(
    profile?.company_name &&
    profile?.phone &&
    profile?.country &&
    profile?.city
  );

  if (!profileComplete) {
    redirect("/buyer/profile");
  }

  //  pobieramy ogłoszenie
  const { data: announcement } = await supabase
    .from("announcements")
    .select(
      "price_negotiable, farmer_id, quantity_available, min_order_quantity, unit"
    )
    .eq("id", announcementId)
    .single();

  //  FIX
if (!announcement) {
  throw new Error("Announcement not found");
}

  //  jeśli negocjowalne → cena wymagana
  if (announcement?.price_negotiable && !offeredPrice) {
    throw new Error("Offer price is required for negotiable listings");
  }

  //  WALIDACJA ILOŚCI
  if (!requestedQuantity || requestedQuantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

if (
  announcement &&
  announcement.min_order_quantity &&
  requestedQuantity < announcement.min_order_quantity
) {
    throw new Error(
      `Minimum order is ${announcement.min_order_quantity} ${announcement.unit}`
    );
  }

if (
  announcement &&
  requestedQuantity > announcement.quantity_available
) {
    throw new Error("Not enough quantity available");
  }

  //  REZERWACJA ILOŚCI
  const newAvailable =
    announcement.quantity_available - requestedQuantity;

  const { error: updateError } = await supabase
    .from("announcements")
    .update({ quantity_available: newAvailable })
    .eq("id", announcementId)
    .select();

  if (updateError) {
    throw new Error(updateError.message);
  }

  //  48h ważności rezerwacji
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  //  zapis interest
  const { error } = await supabase.from("interests").insert({
    announcement_id: announcementId,
    buyer_id: user.id,
    offered_price: offeredPrice,
    requested_quantity: requestedQuantity,
    expires_at: expiresAt.toISOString(),
    reservation_active: true,
  });

  if (error) {
    // jeśli user już wysłał interest → ignorujemy
    if (error.code === "23505") {
      redirect("/announcements");
    }
    throw new Error(error.message);
  }

  //  notification do farmera
  if (announcement?.farmer_id) {
    await supabase.from("notifications").insert({
      farmer_id: announcement.farmer_id,
      announcement_id: announcementId,
      type: "interest_created",
    });
  }

  redirect("/announcements");
}
export async function addTransportInterest(formData: FormData) {
  const supabase = await supabaseServer();
  const { user } = await requireApprovedUser();

  const announcementId = formData.get("announcement_id") as string;

  if (!announcementId) return;

  //  tylko transport może kliknąć
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "transport") return;

  //  zapis (unikalność ogarnia DB)
  await supabase.from("transport_interests").insert({
    announcement_id: announcementId,
    transport_user_id: user.id,
  });
}
export async function addWarehouseInterest(formData: FormData) {
  const supabase = await supabaseServer();
  const { user } = await requireApprovedUser();

  const announcementId = formData.get("announcement_id") as string;

  if (!announcementId) return;

  //  tylko warehouse
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "warehouse") return;

  await supabase.from("warehouse_interests").insert({
    announcement_id: announcementId,
    warehouse_user_id: user.id,
  });
}
