import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Resources from '../pages/Resources';
import CreateResource from '../pages/CreateResource';
import EditResource from '../pages/EditResource';
import Bookings from '../pages/Bookings';
import CreateBooking from '../pages/CreateBooking';
import Tickets from '../pages/Tickets';
import CreateTicket from '../pages/CreateTicket';
import TicketDetails from '../pages/TicketDetails';
import ManageTickets from '../pages/ManageTickets';
import Notifications from '../pages/Notifications';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import OAuthCallback from '../pages/OAuthCallback';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/create" element={<CreateResource />} />
      <Route path="/resources/edit/:id" element={<EditResource />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/bookings/create" element={<CreateBooking />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/tickets/create" element={<CreateTicket />} />
      <Route path="/tickets/:id" element={<TicketDetails />} />
      <Route path="/tickets/manage" element={<ProtectedRoute><ManageTickets /></ProtectedRoute>} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
    </Routes>
  );
}