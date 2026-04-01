"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadImage(formData: FormData) {
  const supabase = await supabaseServer();

  const announcementId = formData.get("announcement_id") as string;
const fileValue = formData.get("file");

console.log("DEBUG fileValue:", fileValue);

if (!fileValue || !(fileValue instanceof File)) {
  throw new Error("No valid file provided");
}

const file = fileValue as File;

  // Pobierz aktualną liczbę zdjęć
  const { data: existing } = await supabase
    .from("announcement_images")
    .select("id")
    .eq("announcement_id", announcementId);

  const position = (existing?.length || 0) + 1;

  if (position > 5) {
    throw new Error("Maximum 5 images allowed");
  }

  // Upload do storage
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${announcementId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("announcement-images")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Pobierz publiczny URL
  const { data: urlData } = supabase.storage
    .from("announcement-images")
    .getPublicUrl(filePath);

  // Zapisz w bazie
  await supabase.from("announcement_images").insert({
    announcement_id: announcementId,
    file_path: filePath,
    public_url: urlData.publicUrl,
    position,
  });

  revalidatePath(`/announcements/${announcementId}/images`);
}

export async function deleteImage(formData: FormData) {
  const supabase = await supabaseServer();

  const imageId = formData.get("image_id") as string;
  const filePath = formData.get("file_path") as string;

  // Usuń z storage
  await supabase.storage
    .from("announcement-images")
    .remove([filePath]);

  // Usuń z bazy
  await supabase
    .from("announcement_images")
    .delete()
    .eq("id", imageId);

  revalidatePath("/");
}
