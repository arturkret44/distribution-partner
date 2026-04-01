type AnnouncementPreview = {
  id: string;
  product_name: string;
  pickup_region: string | null;
  type: string;
  price: number | null;
  price_negotiable: boolean;
  announcement_images?: { public_url: string; position: number }[] | null;
};

export default function AnnouncementPreviewCard({
  announcement,
}: {
  announcement: AnnouncementPreview;
}) {
  const image =
    announcement.announcement_images &&
    announcement.announcement_images.length > 0
      ? announcement.announcement_images[0].public_url
      : null;

  // price display logic
  let priceLabel = "Price on request";

  if (announcement.price && !announcement.price_negotiable) {
    priceLabel = `${announcement.price} SEK`;
  }

  if (announcement.price_negotiable) {
    priceLabel = "Price negotiable";
  }

  return (
    <a
      href="/register"
      className="block min-w-[260px] max-w-[260px] bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
    >
      {/* image */}
      {image ? (
        <img
          src={image}
          alt={announcement.product_name}
          className="w-full h-36 object-cover"
        />
      ) : (
        <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}

      {/* content */}
      <div className="p-4">
        {/* product + badge */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-sm">
            {announcement.product_name}
          </h3>

          {announcement.type === "surplus" && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-orange-100 text-orange-800 font-semibold">
              SURPLUS
            </span>
          )}
        </div>

        {/* region */}
        {announcement.pickup_region && (
          <p className="text-xs text-gray-600 mt-2">
            {announcement.pickup_region}
          </p>
        )}

        {/* price */}
        <p className="text-sm font-medium text-green-700 mt-2">
          {priceLabel}
        </p>

        {/* CTA hint */}
        <p className="text-xs text-gray-400 mt-3">
          Sign up to view details →
        </p>
      </div>
    </a>
  );
}
