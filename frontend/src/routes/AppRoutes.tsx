import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Resources from '../pages/Resources';
import CreateResource from '../pages/CreateResource';
import Bookings from '../pages/Bookings';
import CreateBooking from '../pages/CreateBooking';
import Tickets from '../pages/Tickets';
import CreateTicket from '../pages/CreateTicket';
import TicketDetails from '../pages/TicketDetails';
import ManageTickets from '../pages/ManageTickets';
import ManageUsers from '../pages/ManageUsers';
import AdminDashboard from '../pages/AdminDashboard';
import AdminResources from '../pages/AdminResources';
import AdminManageTickets from '../pages/AdminManageTickets';
import AdminManageUsers from '../pages/AdminManageUsers';
import AdminManageBookings from '../pages/AdminManageBookings';
import Notifications from '../pages/Notifications';
import Login from '../pages/Login';
import OAuthCallback from '../pages/OAuthCallback';
import ProtectedRoute from './ProtectedRoute';
import { RoleType } from '../types/User';
import EditResource from '../pages/EditResource';
import BookingDetails from '../pages/BookingDetails';
import EditBooking from '../pages/EditBooking';
import StaffDashboard from '../pages/StaffDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - NO AUTH NEEDED */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      
      {/* Public ticket view (accessed via QR scan) */}
      <Route path="/tickets/public/:id" element={<TicketDetails />} />
      
      {/* Create ticket with pre-filled resource (via QR scan) - PUBLIC */}
      <Route path="/tickets/create" element={<CreateTicket />} />

      {/* Protected routes - AUTH REQUIRED */}
      <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
      <Route path="/resources/create" element={<ProtectedRoute><CreateResource /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      <Route path="/bookings/create" element={<ProtectedRoute><CreateBooking /></ProtectedRoute>} />
      <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
      <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
      <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      
      {/* Staff routes */}
      <Route path="/staff/dashboard" element={<ProtectedRoute role={RoleType.TECHNICIAN}><StaffDashboard /></ProtectedRoute>} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute role={RoleType.ADMIN}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/resources" element={<ProtectedRoute role={RoleType.ADMIN}><AdminResources /></ProtectedRoute>} />
      <Route path="/admin/tickets" element={<ProtectedRoute role={RoleType.ADMIN}><AdminManageTickets /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role={RoleType.ADMIN}><AdminManageUsers /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute role={RoleType.ADMIN}><AdminManageBookings /></ProtectedRoute>} />
      <Route path="/resources/edit/:id" element={<ProtectedRoute role={RoleType.ADMIN}><EditResource /></ProtectedRoute>} />
      <Route path="/bookings/edit/:id" element={<ProtectedRoute><EditBooking /></ProtectedRoute>} />
    </Routes>
  );
}