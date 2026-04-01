"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUserReviewsSummary(userId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("reviewed_user_id", userId);

  if (error) {
    console.error("getUserReviewsSummary error:", error.message);
    return {
      avgRating: 0,
      totalReviews: 0,
    };
  }

  if (!data || data.length === 0) {
    return {
      avgRating: 0,
      totalReviews: 0,
    };
  }

  const totalReviews = data.length;

  const sum = data.reduce((acc, r) => acc + r.rating, 0);
  const avgRating = sum / totalReviews;

  return {
    avgRating: Number(avgRating.toFixed(1)), // np. 4.7
    totalReviews,
  };
}
export async function hasUserReviewed(
  userId: string,
  contextType: "interest" | "transport" | "warehouse",
  contextId: string
) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("reviews")
    .select("id")
    .eq("reviewer_id", userId)
    .eq("context_type", contextType)
    .eq("context_id", contextId)
    .maybeSingle();

  if (error) {
    console.error("hasUserReviewed error:", error.message);
    return false;
  }

  return !!data;
}
export async function createReview(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const rating = Number(formData.get("rating"));
  const comment = (formData.get("comment") as string)?.trim();

  const contextType = formData.get("context_type") as
    | "interest"
    | "transport"
    | "warehouse";

  const contextId = formData.get("context_id") as string;
  const reviewedUserId = formData.get("reviewed_user_id") as string;

  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Invalid rating");
  }

  if (!contextType || !contextId || !reviewedUserId) {
    throw new Error("Missing data");
  }

  // 🔒 sprawdź czy już ocenił
  const already = await hasUserReviewed(user.id, contextType, contextId);
// 🔒 SECURITY: sprawdź czy user brał udział w transakcji

if (contextType === "interest") {
  const { data: interest } = await supabase
    .from("interests")
    .select("buyer_id, announcement_id")
    .eq("id", contextId)
    .single();

  if (!interest) {
    throw new Error("Invalid context");
  }

  const { data: announcement } = await supabase
    .from("announcements")
    .select("farmer_id")
    .eq("id", interest.announcement_id)
    .single();

  if (!announcement) {
    throw new Error("Invalid announcement");
  }

  const isBuyer = interest.buyer_id === user.id;
  const isFarmer = announcement.farmer_id === user.id;

  if (!isBuyer && !isFarmer) {
    throw new Error("Unauthorized review");
  }
}
  if (already) {
    throw new Error("Already reviewed");
  }

  // 🔍 pobierz role
  const { data: reviewerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: reviewedProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", reviewedUserId)
    .single();

  const { error } = await supabase.from("reviews").insert({
    reviewer_id: user.id,
    reviewed_user_id: reviewedUserId,
    rating,
    comment,
    context_type: contextType,
    context_id: contextId,
    reviewer_role: reviewerProfile?.role,
    reviewed_role: reviewedProfile?.role,
  });

  if (error) {
    throw new Error(error.message);
  }
revalidatePath("/buyer/interests");
revalidatePath("/farmer/interests");
}
export async function getUserReviews(userId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      reviewer_role
    `)
    .eq("reviewed_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getUserReviews error:", error.message);
    return [];
  }

  return data ?? [];
}
export async function getUserReview(
  userId: string,
  contextType: "interest" | "transport" | "warehouse",
  contextId: string
) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("reviews")
    .select("rating, comment")
    .eq("reviewer_id", userId)
    .eq("context_type", contextType)
    .eq("context_id", contextId)
    .maybeSingle();

  if (error) {
    console.error("getUserReview error:", error.message);
    return null;
  }

  return data;
}
