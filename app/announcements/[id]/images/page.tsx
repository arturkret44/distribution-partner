import { supabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/guards";
import { uploadImage, deleteImage } from "./actions";
import UploadForm from "./UploadForm";

export default async function AnnouncementImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

const { user } = await requireRole("farmer");
  const supabase = await supabaseServer();

  // Pobierz ogłoszenie – sprawdzamy czy należy do tego farmera
  const { data: announcement } = await supabase
    .from("announcements")
    .select("id, farmer_id, product_name")
    .eq("id", id)
    .single();

  if (!announcement || announcement.farmer_id !== user.id) {
    return <p className="p-6 text-red-600">Access denied</p>;
  }

  // Pobierz zdjęcia
  const { data: images } = await supabase
    .from("announcement_images")
    .select("*")
    .eq("announcement_id", id)
    .order("position");

  const imageCount = images?.length || 0;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          Images for: {announcement.product_name}
        </h1>

        <a
          href={`/announcements/${id}`}
          className="text-sm text-green-700 underline"
        >
          ← Back to announcement
        </a>

{/* Upload section */}
{imageCount < 5 ? (
  <UploadForm
    announcementId={id}
    currentCount={imageCount}
  />
) : (
  <p className="mt-6 text-sm text-orange-600">
    Maximum 5 images uploaded.
  </p>
)}

        {/* List of images */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {images?.map((img) => (
            <div key={img.id} className="border rounded p-2 bg-white">
              <img
                src={img.public_url}
                className="w-full h-40 object-cover rounded"
              />

              <form action={deleteImage} className="mt-2">
                <input type="hidden" name="image_id" value={img.id} />
                <input type="hidden" name="file_path" value={img.file_path} />

                <button className="text-sm text-red-600 underline">
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
