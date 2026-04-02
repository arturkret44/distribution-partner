import { supabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/guards";
import { uploadTransportImage, deleteTransportImage } from "./actions";
import UploadForm from "./UploadForm";

export default async function TransportImagesPage() {
  const { user } = await requireRole("transport");
  const supabase = await supabaseServer();

  const { data: images } = await supabase
    .from("transport_images")
    .select("*")
    .eq("user_id", user.id);

  const imageCount = images?.length || 0;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          Fleet photos
        </h1>

        <a href="/transport/profile" className="text-sm text-green-700 underline">
          ← Back to profile
        </a>

        {imageCount < 5 ? (
          <UploadForm 
  announcementId={user.id}
  currentCount={imageCount} 
/>
        ) : (
          <p className="mt-6 text-sm text-orange-600">
            Maximum 5 images uploaded.
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {images?.map((img) => (
            <div key={img.id} className="border rounded p-2 bg-white">
              <img
                src={img.public_url}
                className="w-full h-40 object-cover rounded"
              />

              <form action={deleteTransportImage} className="mt-2">
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
