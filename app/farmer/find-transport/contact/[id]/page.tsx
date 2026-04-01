import { requireApprovedUser } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { sendTransportRequest } from "./actions";

export const dynamic = "force-dynamic";

export default async function ContactTransportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await requireApprovedUser();
  const supabase = await supabaseServer();

  const { data: transporter } = await supabase
    .from("transport_profiles")
    .select("user_id, company_name")
    .eq("user_id", id)
    .single();

  if (!transporter) {
    return <p>Transport company not found.</p>;
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">

      {/* HEADER */}
      <div className="mb-6">
        <p className="text-sm text-gray-400">🚚 Contact transport provider</p>
        <h1 className="text-2xl font-semibold mt-1">
          {transporter.company_name}
        </h1>
      </div>

      {/* COMPANY CARD */}
      <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
        <p className="font-medium">{transporter.company_name}</p>
        <p className="text-sm text-gray-500">
          Transport services for agricultural goods
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
        <form action={sendTransportRequest}>

          <input type="hidden" name="transport_user_id" value={id} />

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Your message
            </label>

            <textarea
              name="message"
              required
              className="input h-32"
              placeholder="Describe what you need transported (type of goods, quantity, location, timing...)"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
          >
            Send request
          </button>
        </form>
      </div>

      {/* BACK */}
      <div className="mt-6">
        <a
          href="/farmer/find-transport"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          ← Back to transport list
        </a>
      </div>

    </main>
  );
}
