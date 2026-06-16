(function () {
  'use strict';

  window.catalogDataSource = {
    load: function () {
      return fetch('catalog.json', { cache: 'no-store' })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('catalog.json HTTP ' + response.status);
          }
          return response.json();
        })
        .catch(function () {
          if (window.CATALOG_FALLBACK) {
            return window.CATALOG_FALLBACK;
          }
          throw new Error('Tuotekatalogia ei voitu ladata.');
        });
    }
  };
}());
