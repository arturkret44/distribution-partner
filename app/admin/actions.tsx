"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function ApproveRejectButtons({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string;
}) {
  async function approve() {
    await supabase.rpc("approve_profile", {
      target_user_id: userId,
    });

    window.location.reload();
  }

  async function reject() {
    await supabase.rpc("reject_profile", {
      target_user_id: userId,
    });

    window.location.reload();
  }

  if (currentStatus === "approved") {
    return <span>Approved</span>;
  }

  return (
    <>
      <button onClick={approve}>Approve</button>{" "}
      <button onClick={reject}>Reject</button>
    </>
  );
}
