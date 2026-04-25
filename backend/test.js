const http = require('http');

http.get('http://localhost:8081/api/admin/resources', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.error("Error: " + err.message);
});
