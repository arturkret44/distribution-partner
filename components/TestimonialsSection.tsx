type Testimonial = {
  id: string;
  author_company_name: string | null;
  author_role: string;
  rating: number;
  content: string;
  created_at: string;
};

function Stars({ rating }: { rating: number }) {
  const safe = Math.max(1, Math.min(5, rating || 0));
  return (
    <span aria-label={`${safe} out of 5 stars`} className="text-sm">
      {"★★★★★".slice(0, safe)}
      <span className="text-gray-300">{"★★★★★".slice(safe)}</span>
    </span>
  );
}

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            What users say
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Testimonials are reviewed by administrators before publication.
          </p>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <div className="mt-8 bg-white/80 backdrop-blur rounded-2xl border p-6 text-gray-600">
          No testimonials published yet.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <Stars rating={t.rating} />
                <span className="text-xs text-gray-400">
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="mt-4 text-gray-700 whitespace-pre-line">
                {t.content}
              </p>

              <div className="mt-5 pt-4 border-t">
                <div className="text-sm font-semibold text-gray-900">
                  {t.author_company_name || "Verified user"}
                </div>
                <div className="text-xs text-gray-500">{t.author_role}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
