/*
 * Vercel serverless proxy for My McHale machine details.
 *
 * Route:
 *   /api/mchale-machine-details?serialNumber=1006868
 */
'use strict';

var MCHALE_API_URL = 'https://my.mchale.net/api/MachineDetails/GetMachineDetails';

function sanitizeSerial(value) {
  return String(value || '').trim().replace(/\s+/g, '');
}

function isAcceptableSerial(serial) {
  return !!serial && /^[A-Za-z0-9_.-]{3,50}$/.test(serial);
}

module.exports = async function handler(request, response) {
  var serial;
  var upstreamUrl;
  var upstreamResponse;
  var payload;

  if (request.method !== 'GET') {
    response.status(405).json({
      error: 'METHOD_NOT_ALLOWED',
      message: 'Only GET is supported.'
    });
    return;
  }

  serial = sanitizeSerial(request.query.serialNumber);

  if (!isAcceptableSerial(serial)) {
    response.status(400).json({
      error: 'INVALID_SERIAL',
      message: 'Anna kelvollinen McHale-sarjanumero.'
    });
    return;
  }

  upstreamUrl = MCHALE_API_URL + '?serialNumber=' + encodeURIComponent(serial);

  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Contrans-Varaosaportaali-Prototype/0.14.0'
      },
      cache: 'no-store'
    });

    if (!upstreamResponse.ok) {
      response.status(502).json({
        error: 'MCHALE_LOOKUP_FAILED',
        message: 'My McHale upstream HTTP ' + upstreamResponse.status
      });
      return;
    }

    payload = await upstreamResponse.json();

    response.setHeader('Cache-Control', 'no-store');
    response.status(200).json(payload);
  } catch (error) {
    response.status(502).json({
      error: 'MCHALE_LOOKUP_FAILED',
      message: error && error.message ? error.message : 'My McHale -haku epäonnistui.'
    });
  }
};
