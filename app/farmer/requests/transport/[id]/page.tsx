import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { sendReply } from "./reply";
import ScrollToBottom from "@/components/ScrollToBottom";
import TransportForm from "./TransportForm";

export const dynamic = "force-dynamic";

export default async function TransportThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user } = await requireRole("farmer");
  const supabase = await supabaseServer();

  // Pobierz request
  const { data: request } = await supabase
    .from("transport_requests")
    .select("*")
    .eq("id", id)
    .single();

const { data: transportProfile } = await supabase
  .from("transport_profiles")
  .select("company_name, operating_region")
  .eq("user_id", request.transport_user_id)
  .single();

  if (!request || request.farmer_id !== user.id) {
    return <p className="p-6 text-red-600">Access denied</p>;
  }

// 1️⃣ najpierw pobierz wiadomości
const { data: messages } = await supabase
  .from("request_messages")
  .select("*")
  .eq("request_type", "transport")
  .eq("request_id", id)
  .order("created_at", { ascending: true });

// 2️⃣ dopiero po pobraniu oznacz jako przeczytane
await supabase
  .from("request_messages")
  .update({ read_at: new Date().toISOString() })
  .eq("request_type", "transport")
  .eq("request_id", id)
  .neq("sender_id", user.id)
  .is("read_at", null);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">

        <a
          href="/farmer/requests"
          className="inline-block mb-6 text-sm text-green-700 hover:underline"
        >
          ← Back to requests
        </a>

<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold">
      🚚 {transportProfile?.company_name || "Transport company"}
    </h1>

    {transportProfile?.operating_region && (
      <p className="text-sm text-gray-500">
        {transportProfile.operating_region}
      </p>
    )}
  </div>

  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
    request.status === "new"
      ? "bg-blue-100 text-blue-700"
      : request.status === "in_progress"
      ? "bg-yellow-100 text-yellow-700"
      : request.status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700"
  }`}>
    {request.status}
  </span>
</div>
{request.form_status === "pending" && (
  <div className="bg-white border rounded-xl p-5 shadow-sm mb-6">
    <TransportForm requestId={id} />
  </div>
)}
<div className="bg-white rounded-xl shadow-sm border p-6 space-y-4 max-h-[500px] overflow-y-auto">

  {messages?.map((m) => {
    const isMine = m.sender_id === user.id;
    const isUnread = !m.read_at && !isMine;

    return (
<div
  key={m.id}
  className={`p-4 rounded-lg max-w-[75%] ${
    isMine
      ? "ml-auto bg-green-100 text-green-900"
      : isUnread
      ? "bg-gray-100 border border-green-300 text-gray-900"
      : "bg-gray-100 text-gray-800"
  }`}
>

        {isUnread && (
          <div className="text-[10px] font-semibold text-green-700 mb-1">
            NEW MESSAGE
          </div>
        )}

        <p className="text-sm">{m.message}</p>

        <p className="text-xs text-gray-500 mt-2">
          {new Date(m.created_at).toLocaleString("sv-SE")}
        </p>
      </div>
    );
  })}

  {(!messages || messages.length === 0) && (
    <p className="text-gray-500">No messages yet.</p>
  )}
<ScrollToBottom />

</div>

        {/* Reply form */}
<form action={sendReply} className="mt-6 space-y-4">
          <input type="hidden" name="request_type" value="transport" />
          <input type="hidden" name="request_id" value={id} />

          <textarea
            name="message"
            required
            rows={4}
            placeholder="Write your reply..."
            className="w-full border rounded-md p-3"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Send reply
          </button>
        </form>
      </div>
    </main>
  );
}
