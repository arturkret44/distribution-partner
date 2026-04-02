import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import FarmerProfileForm from "./FarmerProfileForm";
import { saveFarmerProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function FarmerProfilePage() {
  const { user } = await requireRole("farmer");
  const supabase = await supabaseServer();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: images } = await supabase
    .from("farmer_images")
    .select("*")
    .eq("user_id", user.id);

  const imageCount = images?.length || 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 px-6 py-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            My farmer profile
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your company information, images and public presence.
          </p>
        </div>

        {/* PROFILE FORM */}
        <div className="bg-white/90 backdrop-blur rounded-2xl border shadow-sm p-6 mb-8">
          <FarmerProfileForm
            profile={profile}
            userEmail={user.email ?? ""}
            saveAction={saveFarmerProfile}
          />
        </div>

        {/* IMAGES SECTION 🔥 */}
        <div className="bg-white/90 backdrop-blur rounded-2xl border shadow-sm p-6 mb-8">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Farm images
              </h2>
              <p className="text-sm text-gray-500">
                {imageCount}/5 images uploaded
              </p>
            </div>

            <a
              href="/farmer/profile/images"
              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Manage images
            </a>
          </div>

          {/* PREVIEW GRID */}
          {imageCount > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {images.slice(0, 3).map((img) => (
                <img
                  key={img.id}
                  src={img.public_url}
                  className="h-24 w-full object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 bg-gray-50 border rounded-lg p-4 text-center">
              No images yet. Add photos to build trust with buyers.
            </div>
          )}

        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-4 items-center justify-between">

          <a
            href={`/profiles/${user.id}?from=/farmer/profile`}
            target="_blank"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            View public profile
          </a>

          <a
            href="/farmer"
            className="text-green-700 hover:underline"
          >
            ← Back to dashboard
          </a>

        </div>

      </div>
    </main>
  );
}
