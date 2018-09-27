const http = require('http');
const zlib = require('zlib');

/**
 * @type {http.Server}
 */
let server;

exports.init = function (zip, callback) {
  server = http.createServer((req, res) => {
    res.statusCode = 200;
    let data = [];
    req.on('data', (chunk) => {
      data.push(chunk);
    });
    req.on('end', () => {
      const body = Buffer.concat(data).toString();
      if (zip) {
        res.setHeader('Content-Encoding', 'gzip');
        const zip = zlib.createGzip();
        zip.pipe(res);
        zip.end(JSON.stringify({
          url: req.url,
          headers: req.headers,
          body
        }));
      } else {
        res.end(JSON.stringify({
          url: req.url,
          headers: req.headers,
          body
        }));
      }
    });
  });
  server.on('listening', callback);
  server.listen(80, 'localhost');
}

exports.destroy = function (callback) {
  if (server) {
    server.close(callback);
  }
}