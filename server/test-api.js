const http = require('http');

const data = JSON.stringify({
  email: 'orgadmin@example.com',
  password: 'pass'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    console.log("LOGIN:", json);
    if (!json.token) return;

    const req2 = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/organizations/' + json.user.orgId,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + json.token
      }
    }, res2 => {
      let body2 = '';
      res2.on('data', d => body2 += d);
      res2.on('end', () => {
        console.log("ORG STATUS:", res2.statusCode);
        console.log("ORG BODY:", body2);
      });
    });
    req2.end();
  });
});

req.write(data);
req.end();
