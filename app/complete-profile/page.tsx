export default function CompleteProfilePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">
          Complete your profile
        </h1>

        <p className="text-gray-600 mb-6">
          To use the platform features you must first complete your company profile.
        </p>

        <a
          href="/buyer/profile"
          className="inline-block px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
        >
          Go to profile →
        </a>
      </div>
    </main>
  );
}
