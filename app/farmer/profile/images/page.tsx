import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import UploadForm from "./UploadForm";
import { uploadFarmerImage, deleteFarmerImage } from "./actions";
export default async function FarmerImagesPage() {
  const { user } = await requireRole("farmer");

  const supabase = await supabaseServer();

  const { data: images } = await supabase
    .from("farmer_images")
    .select("*")
    .eq("user_id", user.id);

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 text-green-800">
          Farm images
        </h1>

        <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
          <UploadForm uploadAction={uploadFarmerImage} />
        </div>

        {images && images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
<div key={img.id} className="relative">
  <img
    src={img.public_url}
    className="w-full h-40 object-cover rounded-lg"
  />

<form action={deleteFarmerImage}>
  <input type="hidden" name="image_id" value={img.id} />
  <input type="hidden" name="file_path" value={img.file_path} />

  <button
    type="submit"
    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
  >
    Delete
  </button>
</form>
</div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No images uploaded yet.</p>
        )}

      </div>
    </main>
  );
}
