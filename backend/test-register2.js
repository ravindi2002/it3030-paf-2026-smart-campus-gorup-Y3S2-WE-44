const http = require('http');

const data = JSON.stringify({
  email: 'test4@example.com',
  password: 'password',
  fullName: 'Test User',
  role: 'STUDENT'
});

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/users/register',
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
