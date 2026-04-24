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
import Notifications from '../pages/Notifications';
import Login from '../pages/Login';
import OAuthCallback from '../pages/OAuthCallback';
import ProtectedRoute from './ProtectedRoute';
import { RoleType } from '../types/User';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
      <Route path="/resources/create" element={<ProtectedRoute><CreateResource /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      <Route path="/bookings/create" element={<ProtectedRoute><CreateBooking /></ProtectedRoute>} />
      <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
      <Route path="/tickets/create" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
      <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute role={RoleType.ADMIN}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/tickets" element={<ProtectedRoute role={RoleType.ADMIN}><ManageTickets /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role={RoleType.ADMIN}><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/resources" element={<ProtectedRoute role={RoleType.ADMIN}><CreateResource /></ProtectedRoute>} />
    </Routes>
  );
}