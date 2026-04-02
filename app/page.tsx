import { getPublicAnnouncementsPreview } from "@/app/announcements/preview/actions";
import AnnouncementPreviewCard from "@/components/AnnouncementPreviewCard";
import AutoScrollRow from "@/components/AutoScrollRow";
import { getApprovedTestimonials } from "@/app/testimonials/actions";
import TestimonialsSection from "@/components/TestimonialsSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const announcements = await getPublicAnnouncementsPreview(8);
  const testimonials = await getApprovedTestimonials(6);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
<a href="/" className="flex items-center gap-2">
  <img
    src="/logo.png"
    alt="Distribution Partner"
    className="h-14 w-auto"
  />
</a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="/about" className="hover:text-green-700 transition">
              About
            </a>
            <a href="/contact" className="hover:text-green-700 transition">
              Contact
            </a>
            <a href="/announcements-preview" className="hover:text-green-700 transition">
              Live offers
            </a>
          </nav>

          <div className="flex gap-3">
            <a
              href="/login"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
            >
              Start selling
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-12 md:pt-20 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-4 py-1.5 text-sm font-medium">
              Built for faster agricultural sales
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Sell your agricultural products faster
              <span className="block text-green-700">
                without middlemen
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
              Reach verified buyers, publish offers in minutes, and coordinate
              delivery, storage and follow-up from one platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/register"
                className="px-7 py-3.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition text-center shadow-sm"
              >
                Publish your first offer
              </a>

              <a
                href="/announcements-preview"
                className="px-7 py-3.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-center font-medium"
              >
                View live offers
              </a>
            </div>

<div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">

  <div className="rounded-2xl bg-gray-50 p-6 shadow-[0_6px_25px_rgba(0,0,0,0.06)] text-center">
    <div className="text-2xl font-bold text-gray-900">1</div>
    <p className="mt-2 text-sm text-gray-600">
      Place to publish and manage offers
    </p>
  </div>

  <div className="rounded-2xl bg-gray-50 p-6 shadow-[0_6px_25px_rgba(0,0,0,0.06)] text-center">
    <div className="text-2xl font-bold text-gray-900">0</div>
    <p className="mt-2 text-sm text-gray-600">
      Middlemen required to get started
    </p>
  </div>

  <div className="rounded-2xl bg-gray-50 p-6 shadow-[0_6px_25px_rgba(0,0,0,0.06)] text-center">
    <div className="text-2xl font-bold text-gray-900">24/7</div>
    <p className="mt-2 text-sm text-gray-600">
      Visibility for farmers and buyers
    </p>
  </div>

</div>
          </div>

<div className="relative overflow-hidden">

  {/* BLUR EDGE LAYER */}
  <div className="absolute inset-0 scale-110 blur-2xl opacity-40">
    <img
      src="/farmer_wife.webp"
      className="w-full h-full object-cover"
      alt=""
    />
  </div>

  {/*  GŁÓWNY OBRAZ */}
  <img
    src="/farmer_wife.png"
    alt="Agriculture"
    className="relative w-full h-[340px] md:h-[460px] object-cover rounded-[2rem]"
  />

  {/*  SOFT FADE OVERLAY */}
  <div className="pointer-events-none absolute inset-0 
    bg-gradient-to-t from-white via-transparent to-white/40" 
  />

  {/* overlay content */}
  <div className="absolute inset-x-0 bottom-0 p-5">
    <div className="rounded-2xl bg-white/80 backdrop-blur-md p-4">
      <p className="text-sm font-semibold text-gray-900">
        From field to buyer
      </p>
      <p className="mt-1 text-sm text-gray-600">
        Publish supply, attract interest, and keep the process moving.
      </p>
    </div>
  </div>

</div>
        </div>
      </section>

      {/* Problem / Value */}
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="rounded-[2rem] bg-gray-950 text-white overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-green-300 font-semibold">
                The problem
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
                Farmers lose time and margin across fragmented channels
              </h2>
              <p className="mt-5 text-gray-300 text-base md:text-lg max-w-2xl">
                Finding buyers, transport and storage still often means emails,
                calls, trade fairs, intermediaries and slow coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-sm font-semibold text-white">
                  Before
                </div>
                <p className="mt-2 text-sm text-gray-300">
                  Multiple contacts, slower response, lower transparency and
                  less control over the process.
                </p>
              </div>

              <div className="rounded-2xl bg-green-500/10 border border-green-400/20 p-5">
                <div className="text-sm font-semibold text-green-200">
                  With Distribution Partner
                </div>
                <p className="mt-2 text-sm text-gray-200">
                  One place to publish offers, attract buyers and coordinate the
                  next steps faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live offers */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="bg-white/90 backdrop-blur rounded-[2rem] border shadow-sm p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                Live marketplace activity
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
                Farmers are already publishing offers on the platform
              </h2>
              <p className="mt-3 text-gray-600 max-w-2xl">
                Real products published by farmers. Buyers can browse supply and
                registered users can unlock more details and direct contact.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <a
                href="/announcements-preview"
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Browse all offers
              </a>
              <a
                href="/register"
                className="px-4 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
              >
                Join now
              </a>
            </div>
          </div>

          <div className="mt-8">
            {announcements.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-sm text-gray-500 bg-gray-50">
                No published offers yet.
              </div>
            ) : (
              <AutoScrollRow>
                {announcements.map((a) => (
                  <AnnouncementPreviewCard key={a.id} announcement={a} />
                ))}
              </AutoScrollRow>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Limited preview only. Full details and direct access are available
            for registered users.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
            How it works
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            From offer to deal flow in three steps
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Built to help farmers move faster and help buyers discover supply
            without unnecessary friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-3xl border p-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold">
              1
            </div>
            <h3 className="mt-5 text-xl font-semibold text-gray-900">
              Publish your offer in minutes
            </h3>
            <p className="mt-3 text-gray-600">
              Add product, quantity, region and timing so your supply becomes
              visible fast.
            </p>
          </div>

          <div className="bg-white rounded-3xl border p-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold">
              2
            </div>
            <h3 className="mt-5 text-xl font-semibold text-gray-900">
              Get discovered by buyers
            </h3>
            <p className="mt-3 text-gray-600">
              Verified buyers browse listings and connect when supply matches
              their needs.
            </p>
          </div>

          <div className="bg-white rounded-3xl border p-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold">
              3
            </div>
            <h3 className="mt-5 text-xl font-semibold text-gray-900">
              Coordinate the next steps faster
            </h3>
            <p className="mt-3 text-gray-600">
              Keep visibility around transport, warehousing and progress without
              turning the platform into a payment intermediary.
            </p>
          </div>
        </div>
      </section>

      {/* Core value */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
            Built for execution
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Everything you need to move a deal forward
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Start with selling. Add logistics and storage only when the deal
            needs it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-3xl border p-6 shadow-sm">
            <div className="w-full h-44 rounded-2xl overflow-hidden">
              <img
                src="/supply.jpg"
                alt="Supply coordination"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-gray-900">
              Sell supply faster
            </h3>
            <p className="mt-3 text-gray-600">
              Make your products visible to buyers without depending entirely on
              calls, brokers or slow manual outreach.
            </p>
          </div>

          <div className="bg-white rounded-3xl border p-6 shadow-sm">
            <div className="w-full h-44 rounded-2xl overflow-hidden">
              <img
                src="/transport.jpg"
                alt="Transport coordination"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-gray-900">
              Find transport when you need it
            </h3>
            <p className="mt-3 text-gray-600">
              Bring in logistics support once there is active demand and timing
              becomes critical.
            </p>
          </div>

          <div className="bg-white rounded-3xl border p-6 shadow-sm">
            <div className="w-full h-44 rounded-2xl overflow-hidden">
              <img
                src="/warehouse.jpg"
                alt="Warehouse coordination"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-gray-900">
              Secure storage when needed
            </h3>
            <p className="mt-3 text-gray-600">
              Add warehousing support when immediate pickup, sale or delivery is
              not possible.
            </p>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
            Who it is for
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Start with farmers and buyers. Expand naturally from there.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <a
            href="/for-farmers"
            className="group bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition hover:-translate-y-1"
          >
            <div className="h-44 overflow-hidden">
              <img
                src="/farmer1.webp"
                alt="Farmers"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-700">
                Farmers
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                Publish products, attract buyers and create momentum around real
                supply.
              </p>
              <div className="mt-4 text-sm font-medium text-green-700">
                Learn more →
              </div>
            </div>
          </a>

          <a
            href="/for-buyers"
            className="group bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition hover:-translate-y-1"
          >
            <div className="h-44 overflow-hidden">
              <img
                src="/buyer1.webp"
                alt="Buyers"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-700">
                Buyers
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                Discover verified agricultural supply and connect directly when
                there is a match.
              </p>
              <div className="mt-4 text-sm font-medium text-green-700">
                Learn more →
              </div>
            </div>
          </a>

          <a
            href="/for-transport"
            className="group bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition hover:-translate-y-1"
          >
            <div className="h-44 overflow-hidden">
              <img
                src="/transport1.webp"
                alt="Transport providers"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-700">
                Transport providers
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                Join supply flows that already have real movement and active
                demand.
              </p>
              <div className="mt-4 text-sm font-medium text-green-700">
                Learn more →
              </div>
            </div>
          </a>

          <a
            href="/for-warehouses"
            className="group bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition hover:-translate-y-1"
          >
            <div className="h-44 overflow-hidden">
              <img
                src="/warehouse1.webp"
                alt="Warehouses"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-700">
                Warehouses
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                Support stable deal execution when storage becomes part of the
                process.
              </p>
              <div className="mt-4 text-sm font-medium text-green-700">
                Learn more →
              </div>
            </div>
          </a>
        </div>
      </section>

{/* ===== TRUSTED PARTNERS ===== */}
<section className="max-w-7xl mx-auto px-6 py-14">
  <div className="bg-white/90 backdrop-blur rounded-[2rem] border shadow-sm p-6 md:p-10">

    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
        Market context
      </p>

      <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
        Trusted patterns across leading buyers
      </h2>

      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Large food buyers and supply chain operators already rely on similar
        coordination models across procurement and logistics.
      </p>
    </div>

    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { src: "/ica1.jpg", alt: "ICA" },
        { src: "/axfood.jpeg", alt: "Axfood" },
        { src: "/coop.webp", alt: "Coop" },
        { src: "/Willys.webp", alt: "Willys" },
      ].map((logo) => (
        <div
          key={logo.alt}
          className="group bg-gray-50 rounded-3xl border p-6 flex items-center justify-center 
                     hover:shadow-md transition"
        >
          <img
            src={logo.src}
            alt={logo.alt}
            className="h-12 md:h-14 w-auto object-contain opacity-70 
                       group-hover:opacity-100 transition duration-300"
          />
        </div>
      ))}
    </div>

  </div>
</section>

      {/* Trust / philosophy */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
              Why it works
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
              Built as a coordination layer, not a middleman
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              The platform helps people connect and move the process forward.
              Agreements, pricing and payments remain between the parties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 rounded-2xl border p-5 bg-gray-50">
              <div className="text-green-600 text-xl">✓</div>
              <p className="text-gray-700">Direct buyer and farmer connection</p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border p-5 bg-gray-50">
              <div className="text-green-600 text-xl">✓</div>
              <p className="text-gray-700">No payment handling in early stage</p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border p-5 bg-gray-50">
              <div className="text-green-600 text-xl">✓</div>
              <p className="text-gray-700">Transparent deal flow and visibility</p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border p-5 bg-gray-50">
              <div className="text-green-600 text-xl">✓</div>
              <p className="text-gray-700">Logistics support when needed, not forced</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Final CTA */}
      <section className="bg-green-600">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-100">
            Ready to grow?
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">
            Start selling with more visibility
          </h2>

          <p className="mt-4 text-green-100 max-w-2xl mx-auto text-base md:text-lg">
            Join the platform, publish your supply and make it easier for buyers
            to find you.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-block px-8 py-3.5 rounded-xl bg-white text-green-700 font-semibold hover:bg-gray-100 transition"
            >
              Create account
            </a>

            <a
              href="/announcements-preview"
              className="inline-block px-8 py-3.5 rounded-xl border border-white/40 text-white font-medium hover:bg-white/10 transition"
            >
              See live offers
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
          <div>
<div className="flex items-center gap-2">
  <img
    src="/logo.png"
    alt="Agri Coordination"
    className="h-12 w-auto object-contain"
  />
</div>
          </div>

          <div>
            <div className="font-semibold text-gray-900">Platform</div>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/" className="hover:text-green-700 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-green-700 transition">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-green-700 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-gray-900">Legal</div>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/privacy" className="hover:text-green-700 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-green-700 transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pb-6">
          © {new Date().getFullYear()} Distribution Partner Scandinavia. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
