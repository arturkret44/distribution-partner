"use client";

import { useState, useTransition } from "react";

export default function WarehouseInterestButton({
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

    // 💥 OPTIMISTIC UPDATE
    setOptimistic(true);

    startTransition(async () => {
      await action(formData);
    });
  };

  if (optimistic) {
    return (
      <div className="text-green-700 font-medium">
        ✓ You are interested in storing this product
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition"
    >
      {isPending ? "Sending..." : "Interested in storing this product? Send your contact details to the farmer."}
    </button>
  );
}
