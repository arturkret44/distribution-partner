import { getPublicAnnouncementsPreview } from "@/app/announcements/preview/actions";
import AnnouncementPreviewCard from "@/components/AnnouncementPreviewCard";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPreviewPage() {
  const announcements = await getPublicAnnouncementsPreview(24);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Available offers
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Public preview of current agricultural supply offers
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              ← Back to homepage
            </a>

            <a
              href="/register"
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            >
              Create account
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {announcements.length === 0 ? (
          <div className="text-gray-500 text-sm">
            No published offers yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {announcements.map((a) => (
              <AnnouncementPreviewCard key={a.id} announcement={a} />
            ))}
          </div>
        )}

        {/* info note */}
        <div className="mt-8 p-4 rounded-xl bg-yellow-50 border text-sm text-gray-600">
          This is a limited preview of available offers. Full details and direct
          contact with farmers are available only for registered and verified
          users.
        </div>
      </section>
    </main>
  );
}
