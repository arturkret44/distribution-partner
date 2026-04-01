import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import BuyerProfileForm from "./BuyerProfileForm";
import { saveBuyerProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function BuyerProfilePage() {
  const { user } = await requireRole("buyer");

  const supabase = await supabaseServer();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-xl font-bold text-yellow-800">
            My buyer profile
          </h1>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <BuyerProfileForm
            profile={profile}
            userEmail={user.email}
            saveAction={saveBuyerProfile}
          />
        </div>
<div className="mt-6 flex gap-3 flex-wrap">

  <a
    href="/buyer/profile/images"
    className="px-4 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
  >
     Manage company images
  </a>

  <a
    href={`/profiles/${user.id}?from=/buyer/profile`}
    target="_blank"
    className="px-4 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
  >
     View public profile
  </a>

</div>
        <div className="mt-6">
          <a href="/buyer" className="text-yellow-700">
            ← Back to dashboard
          </a>
        </div>
      </section>
    </main>
  );
}
