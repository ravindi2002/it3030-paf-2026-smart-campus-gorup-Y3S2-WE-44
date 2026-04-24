const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Mock data
const mockBookings = [
  {
    id: 1,
    userId: 1,
    userName: "John Doe",
    resourceId: 1,
    resourceName: "Lecture Hall A",
    startTime: "2024-04-25T10:00:00",
    endTime: "2024-04-25T12:00:00",
    purpose: "Programming Lecture",
    expectedAttendees: 50,
    status: "PENDING",
    rejectionReason: null,
    createdAt: "2024-04-24T10:00:00",
    updatedAt: "2024-04-24T10:00:00",
    approvedBy: null
  },
  {
    id: 2,
    userId: 2,
    userName: "Jane Smith",
    resourceId: 2,
    resourceName: "Computer Lab 101",
    startTime: "2024-04-26T14:00:00",
    endTime: "2024-04-26T16:00:00",
    purpose: "Lab Session",
    expectedAttendees: 30,
    status: "APPROVED",
    rejectionReason: null,
    createdAt: "2024-04-24T11:00:00",
    updatedAt: "2024-04-24T12:00:00",
    approvedBy: 1
  },
  {
    id: 3,
    userId: 1,
    userName: "John Doe",
    resourceId: 3,
    resourceName: "Meeting Room B",
    startTime: "2024-04-27T09:00:00",
    endTime: "2024-04-27T11:00:00",
    purpose: "Team Meeting",
    expectedAttendees: 12,
    status: "REJECTED",
    rejectionReason: "Time slot already booked",
    createdAt: "2024-04-24T09:00:00",
    updatedAt: "2024-04-24T10:00:00",
    approvedBy: 1
  }
];

let bookings = [...mockBookings];
let nextId = 4;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/bookings', (req, res) => {
  console.log('GET /api/bookings');
  const { userId, resourceId, status, startDate, endDate } = req.query;
  
  let filteredBookings = bookings;
  
  if (userId) {
    filteredBookings = filteredBookings.filter(b => b.userId === parseInt(userId));
  }
  if (resourceId) {
    filteredBookings = filteredBookings.filter(b => b.resourceId === parseInt(resourceId));
  }
  if (status) {
    filteredBookings = filteredBookings.filter(b => b.status === status);
  }
  
  res.json(filteredBookings);
});

app.get('/api/bookings/:id', (req, res) => {
  console.log(`GET /api/bookings/${req.params.id}`);
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  res.json(booking);
});

app.post('/api/bookings', (req, res) => {
  console.log('POST /api/bookings', req.body);
  const newBooking = {
    id: nextId++,
    ...req.body,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    approvedBy: null,
    rejectionReason: null
  };
  
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

app.put('/api/bookings/:id', (req, res) => {
  console.log(`PUT /api/bookings/${req.params.id}`, req.body);
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  bookings[index] = { ...bookings[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(bookings[index]);
});

app.put('/api/bookings/:id/approve', (req, res) => {
  console.log(`PUT /api/bookings/${req.params.id}/approve`);
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  bookings[index] = { 
    ...bookings[index], 
    status: 'APPROVED', 
    approvedBy: req.query.approvedById || 1,
    updatedAt: new Date().toISOString() 
  };
  res.json(bookings[index]);
});

app.put('/api/bookings/:id/reject', (req, res) => {
  console.log(`PUT /api/bookings/${req.params.id}/reject`);
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  bookings[index] = { 
    ...bookings[index], 
    status: 'REJECTED', 
    approvedBy: req.query.approvedById || 1,
    rejectionReason: req.query.reason || 'Rejected by admin',
    updatedAt: new Date().toISOString() 
  };
  res.json(bookings[index]);
});

app.put('/api/bookings/:id/cancel', (req, res) => {
  console.log(`PUT /api/bookings/${req.params.id}/cancel`);
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  bookings[index] = { 
    ...bookings[index], 
    status: 'CANCELLED', 
    updatedAt: new Date().toISOString() 
  };
  res.json(bookings[index]);
});

app.delete('/api/bookings/:id', (req, res) => {
  console.log(`DELETE /api/bookings/${req.params.id}`);
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  bookings.splice(index, 1);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log('📊 Available endpoints:');
  console.log('  GET    /api/bookings');
  console.log('  GET    /api/bookings/:id');
  console.log('  POST   /api/bookings');
  console.log('  PUT    /api/bookings/:id');
  console.log('  PUT    /api/bookings/:id/approve');
  console.log('  PUT    /api/bookings/:id/reject');
  console.log('  PUT    /api/bookings/:id/cancel');
  console.log('  DELETE /api/bookings/:id');
});
