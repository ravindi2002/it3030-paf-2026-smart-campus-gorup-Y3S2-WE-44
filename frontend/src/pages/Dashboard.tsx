import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const heroImages = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
];

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Promise.all([
      api.get('/resources'),
      api.get('/bookings'),
      api.get('/tickets'),
    ]).then(([resources, bookings, tickets]) => {
      setStats({
        resources: resources.data.length || 0,
        bookings: bookings.data.length || 0,
        tickets: tickets.data.length || 0,
      });
    }).catch(() => {});
  }, [isAuthenticated]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative rounded-2xl overflow-hidden mb-8" style={{ height: '320px' }}>
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url('${img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col justify-center px-10 text-white h-full">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 animate-fadeIn">
            Smart Uni
          </h1>
          <p className="text-lg opacity-90 max-w-xl mb-6">
            Manage resources, bookings, and maintenance efficiently in one place.
          </p>
          <div className="flex gap-4">
            <Link
              to="/resources"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
            >
              Explore Resources
            </Link>
            <Link
              to="/tickets/create"
              className="border border-white px-5 py-2 rounded-lg hover:bg-white hover:text-black transition"
            >
              Report Issue
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.6s', opacity: 0 }}>
        <h2 className="text-2xl font-bold mb-3">About Smart Campus</h2>
        <p className="text-gray-600 leading-relaxed">
          Smart Campus Operations Hub is a web-based system designed to manage 
          university resources, bookings, and maintenance requests efficiently. 
          It provides role-based access, real-time notifications, and streamlined workflows 
          for students, staff, and administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition transform hover:-translate-y-1 animate-fadeInUp" style={{ animationDelay: '0.7s', opacity: 0 }}>
          <h3 className="text-gray-500 text-sm uppercase">Resources</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.resources}</p>
          <Link to="/resources" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
            View all →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition transform hover:-translate-y-1 animate-fadeInUp" style={{ animationDelay: '0.8s', opacity: 0 }}>
          <h3 className="text-gray-500 text-sm uppercase">Bookings</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.bookings}</p>
          <Link to="/bookings" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
            View all →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition transform hover:-translate-y-1 animate-fadeInUp" style={{ animationDelay: '0.9s', opacity: 0 }}>
          <h3 className="text-gray-500 text-sm uppercase">Tickets</h3>
          <p className="text-4xl font-bold text-orange-600 mt-2">{stats.tickets}</p>
          <Link to="/tickets" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
            View all →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6 animate-fadeInLeft" style={{ animationDelay: '1s', opacity: 0 }}>
          <h3 className="font-semibold mb-4 text-lg">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/tickets/create"
              className="flex items-center gap-3 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition"
            >
              <span className="text-2xl">🚨</span>
              <span className="font-medium">Report an Issue</span>
            </Link>
            <Link
              to="/bookings/create"
              className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition"
            >
              <span className="text-2xl">📅</span>
              <span className="font-medium">Book a Resource</span>
            </Link>
            <Link
              to="/resources"
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              <span className="text-2xl">📦</span>
              <span className="font-medium">View Resources</span>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '1.1s', opacity: 0 }}>
          <h3 className="font-semibold mb-4 text-lg">Recent Activity</h3>
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      </div>
    </div>
  );
}