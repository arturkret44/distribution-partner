export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* TEXT */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Distribution Parter
            </h1>

            <div className="mt-6 space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Agriculture does not only depend on production — it depends on
                timing, logistics and the ability to connect the right people
                at the right moment.
              </p>

              <p>
                Every season, valuable products are lost or sold below value
                simply because coordination between farmers, buyers, transport
                and storage is fragmented.
              </p>

              <p>
                Distribution Partner was created to change that.
              </p>

              <p>
                The platform does not replace relationships, negotiations or
                agreements. Instead, it provides a neutral environment where all
                parties can find each other, communicate and coordinate the
                process in a transparent way.
              </p>

              <p>
                By simplifying how supply flows are organised, we aim to reduce
                waste, improve efficiency and support a more resilient
                agricultural system across Europe.
              </p>

              <p className="font-medium">
                This is not a marketplace. It is a coordination layer for
                real-world agricultural trade.
              </p>

              <p className="text-gray-600">
                Built with a long-term vision of creating a more connected and
                sustainable food system.
              </p>
            </div>
          </div>

          {/* IMAGE */}
          <div className="relative">
            <div className="absolute -inset-4 bg-green-100/50 rounded-3xl blur-xl" />
            <div className="relative overflow-hidden rounded-3xl border">
              <img
                src="/about.jpg"
                alt="Agriculture"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
