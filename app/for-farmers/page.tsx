export default function FarmersPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            For farmers
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
  Sell your harvest with more control and less pressure
</h1>
<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
  When you have products ready and time is limited, you need fast access to real buyers. 
  Distribution Partner helps you publish your available supply, connect directly with verified buyers 
  and organise transport or storage when needed — without giving up control over your price or agreements.
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
  How it works for farmers
</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div>
<h3 className="font-semibold text-gray-800">
  Publish your available products
</h3>
<p className="mt-2 text-gray-600 text-sm">
  Create a simple listing with product type, quantity, quality and time window. No complicated forms.
</p>

            </div>

            <div>
<h3 className="font-semibold text-gray-800">
  Get contacted by verified buyers
</h3>
<p className="mt-2 text-gray-600 text-sm">
  Buyers express interest and contact you directly. You decide who to work with and on what terms.
</p>

            </div>

            <div>
<h3 className="font-semibold text-gray-800">
  Organise transport or storage if needed
</h3>
<p className="mt-2 text-gray-600 text-sm">
  When timing is critical, you can coordinate logistics support and track the progress of your delivery.
</p>

            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
<h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
  Why farmers choose Distribution Partner
</h2>

<ul className="mt-8 max-w-2xl mx-auto space-y-4 text-gray-700">
  <li>✔ Reach serious, verified buyers in one place</li>
  <li>✔ Reduce pressure to sell quickly at a lower price</li>
  <li>✔ Stay in full control of your price, conditions and agreements</li>
  <li>✔ Get help coordinating transport and storage when timing matters</li>
  <li>✔ Keep your business relationships direct — we don’t take over your deals</li>
</ul>

      </section>

      {/* FINAL CTA */}
      <section className="bg-green-600 text-white text-center py-16">
<h2 className="text-2xl md:text-3xl font-bold">
  Start selling your available products with confidence
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
