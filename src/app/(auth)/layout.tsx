/**
 * Auth Layout - wrapper for login and signup pages
 * Provides centered card layout with PetCare branding
 * Mobile-responsive design
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <span className="text-3xl">🐾</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PetCare</h1>
          <p className="text-gray-600 mt-2">Premium pet care at your doorstep</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">{children}</div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2024 PetCare. All rights reserved.
        </p>
      </div>
    </div>
  );
}
