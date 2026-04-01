export default function BuyersPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            For buyers
          </span>

          <a
            href="/"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            ← Back to home
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
<h1 className="text-3xl md:text-4xl font-bold text-gray-900">
  Source agricultural products faster and more directly
</h1>
<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
  Distribution Partner gives you direct access to verified farmers with available supply. 
  Discover products in real time, connect directly with producers and organise transport or storage 
  when needed — without unnecessary intermediaries slowing down your sourcing process.
</p>

        <a
          href="/register"
          className="inline-block mt-8 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
        >
          Create account
        </a>
      </section>

      {/* HOW YOU USE */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
<h2 className="text-2xl md:text-3xl font-bold text-gray-900">
  How it works for buyers
</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div>
<h3 className="font-semibold text-gray-800">
  Discover available supply
</h3>
<p className="mt-2 text-gray-600 text-sm">
  Browse current listings from verified farmers with details on quantity, quality and timing.
</p>

            </div>

            <div>
<h3 className="font-semibold text-gray-800">
  Connect directly with producers
</h3>
<p className="mt-2 text-gray-600 text-sm">
  Contact farmers directly, discuss terms and agree on conditions without intermediaries.
</p>

            </div>

            <div>
<h3 className="font-semibold text-gray-800">
  Organise delivery when needed
</h3>
<p className="mt-2 text-gray-600 text-sm">
  Coordinate transport and storage support when volume, distance or timing requires it.
</p>

            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
<h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
  Why buyers choose Distribution Partner
</h2>
<ul className="mt-8 max-w-2xl mx-auto space-y-4 text-gray-700">
  <li>✔ Direct access to verified farmers and real supply</li>
  <li>✔ Faster sourcing without multiple intermediaries</li>
  <li>✔ Greater transparency in product quality and availability</li>
  <li>✔ Flexible logistics support when needed</li>
  <li>✔ Build long-term relationships with trusted producers</li>
</ul>

      </section>

      {/* FINAL CTA */}
      <section className="bg-green-600 text-white text-center py-16">
<h2 className="text-2xl md:text-3xl font-bold">
  Find reliable agricultural supply and build direct partnerships
</h2>

        <a
          href="/register"
          className="inline-block mt-6 px-6 py-3 bg-white text-green-700 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Create account
        </a>
      </section>

    </main>
  );
}
