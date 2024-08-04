const http = require('http');

http.createServer(function (req, res) {
  res.write('Hi from node app');
  res.end();
}).listen(3000)

console.log('Server on port 3000')
