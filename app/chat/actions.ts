"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
export async function openOrCreateChat(formData: FormData) {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const interestId = formData.get("interest_id") as string;

  if (!interestId) return;

  //  pobierz interest
  const { data: interest } = await supabase
    .from("interests")
    .select("id, buyer_id, announcement:announcements(farmer_id), status")
    .eq("id", interestId)
    .single();

  if (!interest) return;

  if (interest.status !== "agreed") {
    throw new Error("Chat allowed only for agreed deals");
  }

  const announcement = Array.isArray(interest.announcement)
  ? interest.announcement[0]
  : interest.announcement;

const farmerId = announcement?.farmer_id;
  const buyerId = interest.buyer_id;

  if (!farmerId || !buyerId) return;

  //  SECURITY
  if (user.id !== farmerId && user.id !== buyerId) {
    return;
  }

  //  sprawdź czy chat istnieje
  const { data: existing } = await supabase
    .from("chats")
    .select("id")
    .eq("interest_id", interestId)
    .maybeSingle();

  if (existing) {
    redirect(`/chat/${existing.id}`);
  }

  //  create chat
  const { data: newChat, error } = await supabase
    .from("chats")
    .insert({
      interest_id: interestId,
      farmer_id: farmerId,
      buyer_id: buyerId,
    })
    .select()
    .single();

  if (error || !newChat) {
    throw new Error(error?.message || "Failed to create chat");
  }

  redirect(`/chat/${newChat.id}`);
}
export async function sendMessage(formData: FormData) {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const chatId = formData.get("chat_id") as string;
  const content = formData.get("content") as string;

  if (!chatId || !content) return;

  await supabase.from("messages").insert({
    chat_id: chatId,
    sender_id: user.id,
    content,
  });

  revalidatePath(`/chat/${chatId}`);
}
