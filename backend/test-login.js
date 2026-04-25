const http = require('http');

const data = JSON.stringify({
  email: 'ravindisasanika12', // username
  password: 'admin123'
});

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/auth/login',
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
