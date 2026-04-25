const http = require('http');

const data = JSON.stringify({
  resourceId: 39,
  startTime: '2026-04-26T10:00:00',
  endTime: '2026-04-26T11:00:00',
  purpose: 'Test booking',
  expectedAttendees: 10
});

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/admin/bookings?userId=1',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => { responseData += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${responseData}`);
  });
});

req.on('error', (err) => {
  console.error("Error: " + err.message);
});

req.write(data);
req.end();
