export default function WarehousesPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            For warehouse providers
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
  Fill your storage capacity and support stable agricultural supply flows
</h1>
<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
  Distribution Partner connects you with farmers and buyers who need reliable storage when timing is critical. 
  Offer your available capacity, communicate directly with clients and help maintain product quality 
  without intermediaries taking control of your contracts or pricing.
</p>

        <a
          href="/register"
          className="inline-block mt-8 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
        >
          Join the platform
        </a>
      </section>

      {/* HOW YOU USE */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
<h2 className="text-2xl md:text-3xl font-bold text-gray-900">
  How it works for warehouses
</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div>
<h3 className="font-semibold text-gray-800">
  Receive storage requests
</h3>
<p className="mt-2 text-gray-600 text-sm">
  Get requests linked to real agricultural supply that requires temporary or short-term storage.
</p>

            </div>

            <div>
<h3 className="font-semibold text-gray-800">
  Agree terms directly with clients
</h3>
<p className="mt-2 text-gray-600 text-sm">
  Discuss capacity, storage conditions, duration and pricing directly with farmers or buyers.
</p>

            </div>

            <div>
<h3 className="font-semibold text-gray-800">
  Maintain quality and timing
</h3>
<p className="mt-2 text-gray-600 text-sm">
  Help preserve product quality and stabilise delivery timelines across the supply chain.
</p>

            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
<h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
  Why warehouses choose Distribution Partner
</h2>
<ul className="mt-8 max-w-2xl mx-auto space-y-4 text-gray-700">
  <li>✔ Access new storage demand from active agricultural supply flows</li>
  <li>✔ Increase utilisation of your available capacity</li>
  <li>✔ Work directly with farmers and buyers — no intermediaries managing your agreements</li>
  <li>✔ Build long-term partnerships with recurring clients</li>
  <li>✔ Contribute to reducing food waste and improving supply chain stability</li>
</ul>

      </section>

      {/* FINAL CTA */}
      <section className="bg-green-600 text-white text-center py-16">
<h2 className="text-2xl md:text-3xl font-bold">
  Start offering your storage capacity and grow your network
</h2>

        <a
          href="/register"
          className="inline-block mt-6 px-6 py-3 bg-white text-green-700 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Join the platform
        </a>
      </section>

    </main>
  );
}
