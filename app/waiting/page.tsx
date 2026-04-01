export default function WaitingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-6 py-10">
      
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE (branding) */}
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-100/70 px-3 py-1 rounded-full">
            Account created
          </div>

          <h1 className="mt-5 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Your account is almost ready
          </h1>

          <p className="mt-4 text-gray-600 max-w-md">
            Complete your profile and get approved to start connecting with buyers,
            managing offers and coordinating logistics across the platform.
          </p>
        </div>

        {/* RIGHT SIDE (card) */}
        <div className="bg-white/90 backdrop-blur rounded-2xl border shadow-sm p-8 text-center">

          {/* LOGO */}
          <div className="mb-5 flex justify-center">
            <img
              src="/logo.png"
              alt=""
              className="h-14 w-auto object-contain opacity-90"
            />
          </div>


          <p className="mt-4 text-gray-600">
            Thank you for creating your account.
          </p>

          <p className="mt-2 text-gray-600">
            Log in and complete your profile to continue.
          </p>

          <p className="mt-2 text-gray-600">
            Your account will be reviewed and approved by the platform administrator.
          </p>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            
            <a
              href="/login"
              className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition text-center"
            >
              Go to login
            </a>

            <a
              href="/"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-center"
            >
              Back to homepage
            </a>
          </div>

          {/* FOOT NOTE */}
          <p className="mt-6 text-xs text-gray-400">
            If you have any questions, please contact the platform administrator.
          </p>

        </div>

      </div>
    </main>
  );
}
