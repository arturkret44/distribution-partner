export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Privacy Policy
        </h1>

        <div className="mt-6 space-y-6 text-gray-700 leading-relaxed">
          <p>
            This Privacy Policy describes how Agri Coordination collects, uses
            and protects personal data when using the platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            1. Information we collect
          </h2>
          <p>
            We collect basic account information such as name, email address,
            company details and profile information necessary to operate the
            platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            2. How we use the information
          </h2>
          <p>
            Data is used to create and manage user accounts, enable contact
            between platform participants and improve platform functionality.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            3. Data storage and security
          </h2>
          <p>
            Data is stored securely using trusted infrastructure providers. We
            take reasonable technical and organisational measures to protect
            personal data from unauthorised access.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            4. Sharing of data
          </h2>
          <p>
            The platform enables users to share information directly with other
            participants (e.g. farmers and buyers). We do not sell personal data
            to third parties.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            5. User rights
          </h2>
          <p>
            Users have the right to access, correct or delete their personal
            data. Requests can be sent to the contact email below.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            6. Contact
          </h2>
          <p>
            For any privacy-related questions, please contact:{" "}
            <span className="font-medium">contact@agriccoordination.com</span>
          </p>
        </div>
      </section>
    </main>
  );
}
