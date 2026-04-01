"use client";

import { useState, useTransition } from "react";

export default function TransportInterestButton({
  announcementId,
  action,
  alreadyInterested,
}: {
  announcementId: string;
  action: (formData: FormData) => Promise<void>;
  alreadyInterested: boolean;
}) {
  const [optimistic, setOptimistic] = useState(alreadyInterested);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const formData = new FormData();
    formData.append("announcement_id", announcementId);

    // 💥 optimistic update
    setOptimistic(true);

    startTransition(async () => {
      await action(formData);
    });
  };

  if (optimistic) {
    return (
      <div className="text-green-700 font-medium">
        ✓ You are interested in transporting this product
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
    >
      {isPending ? "Sending..." : "I can transport this"}
    </button>
  );
}
