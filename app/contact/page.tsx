export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Contact
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            If you are interested in using the platform, partnering with us or
            learning more about the project, feel free to get in touch.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 items-start">
          
          {/* LEFT: Contact info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Get in touch
            </h2>

            <p className="mt-4 text-gray-600">
              We are open to conversations with farmers, buyers, logistics
              providers and organisations interested in improving agricultural
              supply coordination.
            </p>

            <div className="mt-6 space-y-3 text-gray-700">
              <p>
                <span className="font-medium">Email:</span>{" "}
                contact@distributionpartner.com
              </p>

              <p>
                <span className="font-medium">Region:</span> Europe / Sweden
              </p>

              <p>
                <span className="font-medium">Topics:</span> Partnerships,
                logistics, supply coordination, investment
              </p>
            </div>
          </div>

          {/* RIGHT: Simple form */}
          <div className="bg-gray-50 border rounded-2xl p-6 shadow-sm">
            <form className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition"
              >
                Send message
              </button>

            </form>
          </div>

        </div>

      </section>
    </main>
  );
}
