import { requireApprovedUser } from "@/lib/guards";
import { CreateAnnouncementForm } from "./form";

export const dynamic = "force-dynamic";

export default async function NewAnnouncementPage() {
  await requireApprovedUser();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Create announcement
          </h1>
          <p className="text-sm text-gray-500">
            Add a new product offer
          </p>
        </div>

        <a
          href="/farmer/announcements"
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          ← Back to announcements
        </a>
      </div>

{/* Layout: form + sidebar */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

  {/* LEFT – FORM */}
  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-8">
    <CreateAnnouncementForm />
  </div>

  {/* RIGHT – SIDEBAR */}
  <div className="space-y-6">

    {/* Tips */}
<div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
<h3 className="font-semibold text-green-800 text-lg">

        Tips for better offers
      </h3>

      <ul className="mt-4 space-y-2 text-sm text-gray-600">
        <li>• Be specific about quantity and quality</li>
        <li>• Add realistic sell-by date</li>
        <li>• Mark surplus if time is critical</li>
        <li>• Add images after publishing</li>
        <li>• Clear info = faster buyer response</li>
      </ul>
    </div>

    {/* Example card */}
<div className="bg-green-50/50 border border-green-200 rounded-xl p-6 shadow-sm">

<h3 className="font-semibold text-green-800 text-lg">

        Example offer
      </h3>

<div className="mt-4 border border-green-100 rounded-lg p-4 bg-white">

        <p className="font-medium text-gray-800">
          Wheat (Feed quality)
        </p>
        <p className="text-sm text-gray-600 mt-1">
          10 000 kg
        </p>
        <p className="text-sm text-gray-600">
          Skåne, Ängelholm
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Sell by: 12 Oct
        </p>
      </div>
    </div>

    {/* Image / visual */}
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <img
        src="/field.jpg"
        alt="Agriculture"
        className="w-full h-40 object-cover"
      />
      <div className="p-4 text-sm text-gray-600">
        Well described offers receive more interest from buyers.
      </div>
    </div>

  </div>

</div>

    </main>
  );
}
