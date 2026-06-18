/*
 * Local static server + My McHale proxy for the Contrans varaosaportaali prototype.
 *
 * Why this exists:
 * Browsers cannot call the My McHale API directly if the API does not return
 * Access-Control-Allow-Origin. A same-origin proxy avoids that browser CORS limit.
 */
(function () {
  'use strict';

  var http = require('http');
  var https = require('https');
  var fs = require('fs');
  var path = require('path');
  var url = require('url');

  var PORT = parseInt(process.env.PORT || '8000', 10);
  var ROOT_DIR = __dirname;
  var MCHALE_API_URL = 'https://my.mchale.net/api/MachineDetails/GetMachineDetails';

  var CONTENT_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8'
  };

  function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(payload));
  }

  function sanitizeSerial(value) {
    return String(value || '').trim().replace(/\s+/g, '');
  }

  function isAcceptableSerial(serial) {
    return !!serial && /^[A-Za-z0-9_.-]{3,50}$/.test(serial);
  }

  function fetchMchaleMachineDetails(serial) {
    return new Promise(function (resolve, reject) {
      var requestUrl = MCHALE_API_URL + '?serialNumber=' + encodeURIComponent(serial);
      var request = https.get(requestUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Contrans-Varaosaportaali-Prototype/0.14.0'
        },
        timeout: 10000
      }, function (upstreamResponse) {
        var chunks = [];

        upstreamResponse.on('data', function (chunk) {
          chunks.push(chunk);
        });

        upstreamResponse.on('end', function () {
          var body = Buffer.concat(chunks).toString('utf8');
          var parsed;

          if (upstreamResponse.statusCode < 200 || upstreamResponse.statusCode >= 300) {
            reject(new Error('My McHale upstream HTTP ' + upstreamResponse.statusCode));
            return;
          }

          try {
            parsed = JSON.parse(body);
          } catch (error) {
            reject(new Error('My McHale returned non-JSON response.'));
            return;
          }

          resolve(parsed);
        });
      });

      request.on('timeout', function () {
        request.destroy(new Error('My McHale request timed out.'));
      });

      request.on('error', reject);
    });
  }

  function handleMchaleProxy(request, response, parsedUrl) {
    var serial = sanitizeSerial(parsedUrl.query.serialNumber);

    if (!isAcceptableSerial(serial)) {
      sendJson(response, 400, {
        error: 'INVALID_SERIAL',
        message: 'Anna kelvollinen McHale-sarjanumero.'
      });
      return;
    }

    fetchMchaleMachineDetails(serial)
      .then(function (payload) {
        sendJson(response, 200, payload);
      })
      .catch(function (error) {
        sendJson(response, 502, {
          error: 'MCHALE_LOOKUP_FAILED',
          message: error && error.message ? error.message : 'My McHale -haku epäonnistui.'
        });
      });
  }

  function serveStaticFile(request, response, parsedUrl) {
    var requestPath = decodeURIComponent(parsedUrl.pathname || '/');
    var filePath;
    var extension;
    var stream;

    if (requestPath === '/') {
      requestPath = '/index.html';
    }

    filePath = path.normalize(path.join(ROOT_DIR, requestPath));

    if (filePath.indexOf(ROOT_DIR) !== 0) {
      response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Forbidden');
      return;
    }

    fs.stat(filePath, function (error, stats) {
      if (error || !stats.isFile()) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      extension = path.extname(filePath).toLowerCase();
      response.writeHead(200, {
        'Content-Type': CONTENT_TYPES[extension] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });

      stream = fs.createReadStream(filePath);
      stream.pipe(response);
      stream.on('error', function () {
        response.destroy();
      });
    });
  }

  var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true);

    if (request.method === 'GET' && parsedUrl.pathname === '/api/mchale-machine-details') {
      handleMchaleProxy(request, response, parsedUrl);
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Method not allowed');
      return;
    }

    serveStaticFile(request, response, parsedUrl);
  });

  server.listen(PORT, '0.0.0.0', function () {
    console.log('Contrans varaosaportaali running at http://localhost:' + PORT);
    console.log('My McHale proxy available at /api/mchale-machine-details?serialNumber=1006868');
  });
}());
