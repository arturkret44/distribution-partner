"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function uploadFarmerImage(formData: FormData) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const fileValue = formData.get("file");

  if (!fileValue || !(fileValue instanceof File)) {
    throw new Error("No valid file provided");
  }

  const file = fileValue as File;

  // limit 5 zdjęć
  const { data: existing } = await supabase
    .from("farmer_images")
    .select("id")
    .eq("user_id", user.id);

  const count = existing?.length || 0;

  if (count >= 5) {
    throw new Error("Maximum 5 images allowed");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("farmer-images")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: urlData } = supabase.storage
    .from("farmer-images")
    .getPublicUrl(filePath);

  await supabase.from("farmer_images").insert({
    user_id: user.id,
    file_path: filePath,
    public_url: urlData.publicUrl,
  });

  revalidatePath("/farmer/profile/images");
}
export async function deleteFarmerImage(formData: FormData) {
  const supabase = await supabaseServer();

  const imageId = formData.get("image_id") as string;
  const filePath = formData.get("file_path") as string;

  await supabase.storage
    .from("farmer-images")
    .remove([filePath]);

  await supabase
    .from("farmer_images")
    .delete()
    .eq("id", imageId);

  revalidatePath("/farmer/profile/images");
}
