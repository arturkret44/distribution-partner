"use client";

export default function CloseDealButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        const ok = window.confirm("Are you sure you completed this deal?");
        if (!ok) {
          e.preventDefault();
        }
      }}
      className="text-xs px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
    >
      Close deal
    </button>
  );
}
