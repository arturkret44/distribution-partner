"use client";

import { useState } from "react";

export default function ReviewsSection({
  reviews,
  avgRating,
  totalReviews,
}: {
  reviews: any[];
  avgRating: number;
  totalReviews: number;
}) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const filteredReviews = selectedRating
    ? reviews.filter((r) => r.rating === selectedRating)
    : reviews;

  const latestReview = filteredReviews[0];

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const safeTotal = totalReviews || 1;

  return (
    <section className="mt-8">
      <div className="rounded-[2rem] bg-white/90 backdrop-blur border shadow-sm p-6 md:p-8">

        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
          Reviews
        </p>

        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
          What others say
        </h2>

        {/* SUMMARY */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-gray-900">
              {avgRating}
            </div>
            <div className="text-sm text-gray-600">
              {totalReviews} reviews
            </div>
          </div>

          {/* RIGHT — CLICKABLE FILTER */}
          <div className="space-y-2">
            {ratingCounts.map(({ star, count }) => (
              <button
                key={star}
                onClick={() =>
                  setSelectedRating(star === selectedRating ? null : star)
                }
                className={`w-full flex items-center gap-2 text-sm transition ${
                  selectedRating === star
                    ? "bg-green-100 rounded px-2 py-1"
                    : "hover:bg-gray-100 rounded px-2 py-1"
                }`}
              >
                <span className="w-6">{star}★</span>

                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-yellow-400 rounded"
                    style={{
                      width: `${(count / safeTotal) * 100}%`,
                    }}
                  />
                </div>

                <span className="w-6 text-right">{count}</span>
              </button>
            ))}
          </div>

        </div>

        {/* ACTIVE FILTER */}
        {selectedRating && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {selectedRating}★ reviews
            <button
              onClick={() => setSelectedRating(null)}
              className="ml-2 text-green-700 underline"
            >
              clear
            </button>
          </div>
        )}

{/* REVIEWS */}

{filteredReviews.length === 0 ? (
  <p className="mt-6 text-gray-500 text-sm">
    No reviews for this rating.
  </p>
) : !selectedRating ? (
  <>
    {/* 🔥 NAJNOWSZA */}
    <div className="mt-6 border rounded-2xl p-5 bg-gray-50">
      <div className="flex justify-between mb-2">
        <div className="text-yellow-500">
          {"★".repeat(filteredReviews[0].rating)}
          {"☆".repeat(5 - filteredReviews[0].rating)}
        </div>

        <span className="text-xs text-gray-500">
          {filteredReviews[0].reviewer_role}
        </span>
      </div>

      {filteredReviews[0].comment && (
        <p className="text-gray-700">
          {filteredReviews[0].comment}
        </p>
      )}

      <p className="text-xs text-gray-400 mt-2">
        {new Date(filteredReviews[0].created_at).toLocaleDateString()}
      </p>
    </div>

    {/* 🔽 RESZTA */}
    {filteredReviews.length > 1 && (
      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-green-700 font-medium">
          Show all reviews
        </summary>

        <div className="mt-4 space-y-4">
          {filteredReviews.slice(1).map((r) => (
            <div key={r.id} className="border rounded-lg p-4 bg-gray-50">

              <div className="flex justify-between mb-2">
                <div className="text-yellow-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>

                <span className="text-xs text-gray-500">
                  {r.reviewer_role}
                </span>
              </div>

              {r.comment && (
                <p className="text-sm text-gray-700">
                  {r.comment}
                </p>
              )}

            </div>
          ))}
        </div>
      </details>
    )}
  </>
) : (
  /* 🔥 TRYB FILTRA → lista */
  <div className="mt-6 space-y-4">
    {filteredReviews.map((r) => (
      <div key={r.id} className="border rounded-lg p-4 bg-gray-50">

        <div className="flex justify-between mb-2">
          <div className="text-yellow-500">
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </div>

          <span className="text-xs text-gray-500">
            {r.reviewer_role}
          </span>
        </div>

        {r.comment && (
          <p className="text-sm text-gray-700">
            {r.comment}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-2">
          {new Date(r.created_at).toLocaleDateString()}
        </p>

      </div>
    ))}
  </div>
)}
      </div>
    </section>
  );
}
