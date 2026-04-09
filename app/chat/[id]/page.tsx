import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";
import { sendMessage } from "../actions";
import BackButton from "@/components/BackButton";
export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  //  chat
  const { data: chat } = await supabase
    .from("chats")
    .select("*")
    .eq("id", id)
    .single();

  if (!chat) {
    return <p className="p-6">Chat not found</p>;
  }

  //  access
  if (user.id !== chat.farmer_id && user.id !== chat.buyer_id) {
    return <p className="p-6">Access denied</p>;
  }

//  oznacz wiadomości jako przeczytane
if (user.id === chat.buyer_id) {
  await supabase
    .from("chats")
    .update({ buyer_last_read_at: new Date().toISOString() })
    .eq("id", id);
}

if (user.id === chat.farmer_id) {
  await supabase
    .from("chats")
    .update({ farmer_last_read_at: new Date().toISOString() })
    .eq("id", id);
}

  //  OTHER USER (ważne UX)
  const otherUserId =
    chat.buyer_id === user.id ? chat.farmer_id : chat.buyer_id;

  const { data: otherUser } = await supabase
    .from("profiles")
    .select("company_name")
    .eq("id", otherUserId)
    .single();

  //  messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", id)
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">

<BackButton />
        {/* HEADER */}
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Conversation with</p>
            <h2 className="text-lg font-semibold text-gray-900">
              {otherUser?.company_name ?? "User"}
            </h2>
          </div>

          <div className="text-xs text-gray-400">
            💬 Active chat
          </div>
        </div>

        {/* CHAT BOX */}
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-5 h-[420px] overflow-y-auto shadow-sm flex flex-col gap-3">

          {messages?.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-10">
              No messages yet
            </p>
          )}

          {messages?.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender_id === user.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-sm ${
                  m.sender_id === user.id
                    ? "bg-green-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* FORM */}
        <form action={sendMessage} className="flex gap-3 mt-4">
          <input type="hidden" name="chat_id" value={id} />

          <input
            name="content"
            required
            placeholder="Write message..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button className="px-5 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-sm">
            Send
          </button>
        </form>

      </div>
    </main>
  );
}
