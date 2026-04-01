import { supabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/guards";
import UploadForm from "./UploadForm";
import { deleteWarehouseImage } from "./actions";

export default async function WarehouseImagesPage() {
  const { user } = await requireRole("warehouse");
  const supabase = await supabaseServer();

  const { data: images } = await supabase
    .from("warehouse_images")
    .select("*")
    .eq("user_id", user.id);

  const count = images?.length || 0;

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">
        Warehouse photos
      </h1>

      {count < 5 && <UploadForm currentCount={count} />}

      <div className="grid grid-cols-3 gap-4 mt-6">
        {images?.map((img) => (
          <div key={img.id}>
            <img src={img.public_url} className="h-32 w-full object-cover" />

            <form action={deleteWarehouseImage}>
              <input type="hidden" name="image_id" value={img.id} />
              <input type="hidden" name="file_path" value={img.file_path} />

              <button className="text-red-600 text-sm">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
