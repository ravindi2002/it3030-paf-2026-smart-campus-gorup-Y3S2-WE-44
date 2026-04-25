import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-24 px-8 md:px-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Smart Campus Management System
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
            Streamline your campus operations with our all-in-one platform. 
            Manage resources, book facilities, and report maintenance issues — all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/login" 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started →
            </Link>
            <Link 
              to="/tickets/create" 
              className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-300 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🚨 Report Issue
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-8 md:px-16 bg-white">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-1 border border-blue-100">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Resource Management</h3>
            <p className="text-gray-600 leading-relaxed">
              Browse lecture halls, computer labs, and equipment with real-time availability status.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-1 border border-green-100">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Booking</h3>
            <p className="text-gray-600 leading-relaxed">
              Book campus resources with conflict-free scheduling.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-1 border border-orange-100">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Report Issues</h3>
            <p className="text-gray-600 leading-relaxed">
              Submit tickets with photos and track progress in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* More Features */}
      <section className="py-16 px-8 md:px-16 bg-gray-50">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Based Access</h3>
            <p className="text-gray-600">
              Secure authentication with JWT tokens.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Notifications</h3>
            <p className="text-gray-600">
              Stay informed in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-8 md:px-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands who use Smart Campus every day.
        </p>
        <Link 
          to="/login" 
          className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg"
        >
          Login to Continue →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-8 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Smart Campus. All rights reserved.</p>
          <p className="text-sm">IT3030 - PAF Assignment | Semester 1</p>
        </div>
      </footer>
    </div>
  );
}