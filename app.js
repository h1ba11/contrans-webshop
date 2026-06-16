(function () {
  'use strict';

  var state = {
    catalog: null,
    items: [],
    documentsById: {},
    cart: [],
    selectedMachineId: '',
    filters: {
      search: '',
      brand: '',
      type: 'part'
    }
  };

  var elements = {};

  function byId(id) {
    return document.getElementById(id);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function unique(values) {
    var seen = {};
    var result = [];
    values.forEach(function (value) {
      if (!value || seen[value]) return;
      seen[value] = true;
      result.push(value);
    });
    return result.sort();
  }

  function getItemById(id) {
    for (var i = 0; i < state.items.length; i += 1) {
      if (state.items[i].id === id) return state.items[i];
    }
    return null;
  }

  function getDocument(id) {
    return state.documentsById[id] || null;
  }

  function getMachines() {
    return state.items.filter(function (item) {
      return item.type === 'machine' && item.visibility === 'public';
    });
  }

  function getSelectedMachine() {
    return getItemById(state.selectedMachineId);
  }

  function getMainMachineModel(item) {
    if (!item) return '';
    if (item.compatibleModels && item.compatibleModels.length) return item.compatibleModels[0];
    return item.name || '';
  }

  function getSearchBlob(item) {
    return normalize([
      item.id,
      item.sku,
      item.name,
      item.brand,
      item.type,
      item.category,
      item.summary,
      (item.compatibleModels || []).join(' '),
      (item.searchTerms || []).join(' '),
      (item.notes || []).join(' ')
    ].join(' '));
  }

  function matchesSearch(item) {
    var query = normalize(state.filters.search);
    if (!query) return true;

    var terms = query.split(/\s+/);
    var blob = getSearchBlob(item);

    for (var i = 0; i < terms.length; i += 1) {
      if (blob.indexOf(terms[i]) === -1) return false;
    }
    return true;
  }

  function matchesSelectedMachine(item) {
    var machine = getSelectedMachine();
    var model;
    var compatible;

    if (!machine || item.type === 'machine') return true;

    model = normalize(getMainMachineModel(machine));
    compatible = normalize((item.compatibleModels || []).join(' '));

    return compatible.indexOf(model) > -1 || getSearchBlob(item).indexOf(model) > -1;
  }

  function filterItems() {
    return state.items.filter(function (item) {
      if (item.visibility !== 'public') return false;
      if (state.filters.brand && item.brand !== state.filters.brand) return false;
      if (state.filters.type && item.type !== state.filters.type) return false;
      return matchesSearch(item) && matchesSelectedMachine(item);
    });
  }

  function createTag(text, className) {
    var span = document.createElement('span');
    span.className = 'tag ' + (className || '');
    span.textContent = text;
    return span;
  }

  function appendDefinition(metaList, term, value) {
    if (!value) return;
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    dt.textContent = term;
    dd.textContent = value;
    metaList.appendChild(dt);
    metaList.appendChild(dd);
  }

  function renderDocuments(container, item) {
    var ids = item.documentIds || [];
    if (!ids.length) return;

    var title = document.createElement('h4');
    title.textContent = 'Dokumentit ja ohjeet';
    container.appendChild(title);

    var list = document.createElement('ul');
    list.className = 'link-list';

    ids.forEach(function (id) {
      var doc = getDocument(id);
      var li;
      var link;

      if (!doc) return;

      li = document.createElement('li');
      link = document.createElement('a');
      link.href = doc.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = doc.title;
      li.appendChild(link);

      if (doc.type) {
        li.appendChild(document.createTextNode(' '));
        li.appendChild(createTag(doc.type, 'small-tag'));
      }

      list.appendChild(li);
    });

    container.appendChild(list);
  }

  function renderRelationGroup(container, titleText, ids, className) {
    var filteredIds = (ids || []).filter(function (id) { return !!getItemById(id); });
    if (!filteredIds.length) return;

    var block = document.createElement('div');
    var title = document.createElement('h4');

    block.className = 'relation-group ' + (className || '');
    title.textContent = titleText;
    block.appendChild(title);

    filteredIds.forEach(function (id) {
      var relatedItem = getItemById(id);
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'relation-pill';
      button.textContent = relatedItem.name;
      button.addEventListener('click', function () {
        addToCart(id, true);
      });
      block.appendChild(button);
    });

    container.appendChild(block);
  }

  function isInCart(itemId) {
    return state.cart.some(function (entry) { return entry.id === itemId; });
  }

  function addToCart(itemId, includeRequired) {
    var item = getItemById(itemId);
    var existing;

    if (!item) return;

    existing = state.cart.filter(function (entry) { return entry.id === itemId; })[0];
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ id: itemId, qty: 1 });
    }

    if (includeRequired !== false) {
      (item.requiredTogetherIds || []).forEach(function (requiredId) {
        if (!isInCart(requiredId)) {
          state.cart.push({ id: requiredId, qty: 1, suggestedBy: itemId });
        }
      });
    }

    renderCart();
    renderCatalog();
    elements.copyStatus.textContent = 'Lisätty tiedusteluun.';
  }

  function removeFromCart(itemId) {
    state.cart = state.cart.filter(function (entry) { return entry.id !== itemId; });
    renderCart();
    renderCatalog();
  }

  function updateQty(itemId, qty) {
    var parsedQty = parseInt(qty, 10);
    if (isNaN(parsedQty) || parsedQty < 1) parsedQty = 1;
    state.cart.forEach(function (entry) {
      if (entry.id === itemId) entry.qty = parsedQty;
    });
    renderCart();
  }

  function selectMachine(machineId) {
    var machine = getItemById(machineId);
    if (!machine) return;

    state.selectedMachineId = machineId;
    elements.machineModel.value = getMainMachineModel(machine);
    state.filters.type = 'part';
    elements.typeFilter.value = 'part';

    renderSelectedMachine();
    renderMachineCards();
    renderCatalog();
    updateMailtoLink();
  }

  function clearMachine() {
    state.selectedMachineId = '';
    elements.machineModel.value = '';
    renderSelectedMachine();
    renderMachineCards();
    renderCatalog();
    updateMailtoLink();
  }

  function renderSelectedMachine() {
    var machine = getSelectedMachine();
    elements.selectedMachine.innerHTML = '';

    if (!machine) {
      elements.selectedMachine.className = 'selected-machine hidden';
      elements.clearMachineButton.className = 'button text-button hidden';
      return;
    }

    elements.selectedMachine.className = 'selected-machine';
    elements.clearMachineButton.className = 'button text-button';
    elements.selectedMachine.innerHTML = '<strong></strong><span></span>';
    elements.selectedMachine.querySelector('strong').textContent = 'Valittu kone: ' + machine.name;
    elements.selectedMachine.querySelector('span').textContent = 'Seuraavaksi näytetään tähän koneeseen sopivia demo-varaosia. Lisää sarjanumero tiedusteluun, jos se on tiedossa.';
  }

  function renderMachineCards() {
    var machines = getMachines();
    var template = byId('machineTemplate');

    elements.machineCards.innerHTML = '';

    machines.forEach(function (machine) {
      var node = template.content.firstElementChild.cloneNode(true);
      var button = node.querySelector('button');
      var image = node.querySelector('img');

      node.className = machine.id === state.selectedMachineId ? 'machine-card selected' : 'machine-card';
      image.src = machine.image || 'assets/machine-baler.svg';
      image.alt = machine.name + ' - kuvituskuva';
      node.querySelector('h3').textContent = machine.name;
      node.querySelector('.summary').textContent = machine.summary || '';
      button.textContent = machine.id === state.selectedMachineId ? 'Valittu' : 'Valitse tämä kone';
      button.addEventListener('click', function () { selectMachine(machine.id); });
      elements.machineCards.appendChild(node);
    });
  }

  function renderItemCard(item) {
    var template = byId('itemTemplate');
    var node = template.content.firstElementChild.cloneNode(true);
    var typeLabel = item.type === 'machine' ? 'Kone' : 'Varaosa';
    var image = node.querySelector('img');
    var metaList = node.querySelector('.meta-list');
    var notes = node.querySelector('.notes');
    var actions = node.querySelector('.card-actions');
    var addButton = document.createElement('button');

    image.src = item.image || (item.type === 'machine' ? 'assets/machine-baler.svg' : 'assets/part-general.svg');
    image.alt = item.name + ' - kuvituskuva';
    node.querySelector('.type-tag').textContent = typeLabel;
    node.querySelector('h3').textContent = item.name;
    node.querySelector('.sku').textContent = item.sku;
    node.querySelector('.summary').textContent = item.summary || '';

    node.querySelector('.simple-meta').textContent = 'Sopivuus: ' + ((item.compatibleModels || []).join(', ') || 'tarkistetaan tiedustelulla');

    addButton.type = 'button';
    addButton.className = 'button primary';
    addButton.textContent = isInCart(item.id) ? 'Lisää toinen kpl' : 'Kysy tätä osaa';
    addButton.addEventListener('click', function () { addToCart(item.id, true); });
    actions.appendChild(addButton);

    appendDefinition(metaList, 'Valmistaja', item.brand);
    appendDefinition(metaList, 'Ryhmä', item.category);
    appendDefinition(metaList, 'Sopivuus', (item.compatibleModels || []).join(', '));
    appendDefinition(metaList, 'Sarjanumero', item.serialNumberRequired ? 'Tarvitaan varmistukseen' : 'Ei pakollinen');

    (item.notes || []).forEach(function (note) {
      var p = document.createElement('p');
      p.textContent = note;
      notes.appendChild(p);
    });

    renderDocuments(node.querySelector('.documents'), item);
    renderRelationGroup(node.querySelector('.relations'), 'Usein samalla tarkistettavat', item.relatedIds, 'related');
    renderRelationGroup(node.querySelector('.relations'), 'Lisätään yleensä mukaan', item.requiredTogetherIds, 'required');

    return node;
  }

  function renderCatalog() {
    var items = filterItems();
    var machine = getSelectedMachine();

    elements.catalogResults.innerHTML = '';
    elements.resultCount.textContent = items.length + ' osumaa';

    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = '<h3>Ei osumia</h3><p>Kokeile lyhyempää hakusanaa tai lähetä yleinen tiedustelu. Asiantuntija voi etsiä oikean osan mallin ja sarjanumeron perusteella.</p>';
      elements.catalogResults.appendChild(empty);
      return;
    }

    if (machine) {
      var hint = document.createElement('p');
      hint.className = 'filter-hint';
      hint.textContent = 'Näytetään valittuun koneeseen sopivia demo-osia: ' + machine.name;
      elements.catalogResults.appendChild(hint);
    }

    items.forEach(function (item) {
      elements.catalogResults.appendChild(renderItemCard(item));
    });
  }

  function renderBrandOptions() {
    var brands = unique(state.items.map(function (item) { return item.brand; }));
    brands.forEach(function (brand) {
      var option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      elements.brandFilter.appendChild(option);
    });
  }

  function renderCart() {
    elements.cartCount.textContent = String(state.cart.length);
    elements.cartItems.innerHTML = '';

    if (!state.cart.length) {
      elements.cartItems.className = 'cart-items empty';
      elements.cartItems.textContent = 'Ei vielä valittuja osia.';
      updateMailtoLink();
      return;
    }

    elements.cartItems.className = 'cart-items';

    state.cart.forEach(function (entry) {
      var item = getItemById(entry.id);
      var row;
      var title;
      var qty;
      var remove;

      if (!item) return;

      row = document.createElement('div');
      row.className = 'cart-row';

      title = document.createElement('div');
      title.className = 'cart-title';
      title.innerHTML = '<strong></strong><span></span>';
      title.querySelector('strong').textContent = item.name;
      title.querySelector('span').textContent = item.sku;

      if (entry.suggestedBy) {
        var suggestedBy = getItemById(entry.suggestedBy);
        var suggested = document.createElement('small');
        suggested.textContent = suggestedBy ? 'Ehdotettu mukaan: ' + suggestedBy.name : 'Ehdotettu mukaan';
        title.appendChild(suggested);
      }

      qty = document.createElement('input');
      qty.type = 'number';
      qty.min = '1';
      qty.value = String(entry.qty);
      qty.className = 'qty-input';
      qty.setAttribute('aria-label', 'Määrä: ' + item.name);
      qty.addEventListener('change', function () { updateQty(entry.id, qty.value); });

      remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-button';
      remove.textContent = 'Poista';
      remove.addEventListener('click', function () { removeFromCart(entry.id); });

      row.appendChild(title);
      row.appendChild(qty);
      row.appendChild(remove);
      elements.cartItems.appendChild(row);
    });

    updateMailtoLink();
  }

  function buildInquiryText() {
    var machineModel = elements.machineModel.value.trim();
    var machineSerial = elements.machineSerial.value.trim();
    var customerName = elements.customerName.value.trim();
    var customerContact = elements.customerContact.value.trim();
    var note = elements.inquiryNote.value.trim();
    var lines = [];

    lines.push('Varaosatiedustelu');
    lines.push('');
    lines.push('Asiakas: ' + (customerName || '-'));
    lines.push('Yhteystieto: ' + (customerContact || '-'));
    lines.push('Koneen malli: ' + (machineModel || '-'));
    lines.push('Sarjanumero: ' + (machineSerial || '-'));
    lines.push('');
    lines.push('Tiedusteltavat osat:');

    if (!state.cart.length) {
      lines.push('- Ei tuotteita valittuna');
    } else {
      state.cart.forEach(function (entry) {
        var item = getItemById(entry.id);
        if (!item) return;
        lines.push('- ' + entry.qty + ' kpl | ' + item.sku + ' | ' + item.name);
        if (item.serialNumberRequired) {
          lines.push('  * Sopivuus varmistettava sarjanumerolla');
        }
      });
    }

    lines.push('');
    lines.push('Lisätiedot:');
    lines.push(note || '-');
    lines.push('');
    lines.push('Huom. tämä ei ole tilaus. Pyydän tarkistamaan sopivuuden, saatavuuden ja hinnat ennen tarjousta.');

    return lines.join('\n');
  }

  function updateMailtoLink() {
    var subject = 'Varaosatiedustelu';
    var body = buildInquiryText();
    elements.mailtoLink.href = 'mailto:varaosat@example.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function copyInquiry() {
    var text = buildInquiryText();
    updateMailtoLink();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        elements.copyStatus.textContent = 'Tiedustelu kopioitu leikepöydälle.';
      }).catch(function () {
        fallbackCopy(text);
      });
      return;
    }

    fallbackCopy(text);
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      elements.copyStatus.textContent = 'Tiedustelu kopioitu leikepöydälle.';
    } catch (error) {
      elements.copyStatus.textContent = 'Kopiointi ei onnistunut automaattisesti. Avaa sähköpostiin -painike toimii silti.';
    }
    document.body.removeChild(textarea);
  }

  function addUnknownPartNote() {
    var existing = elements.inquiryNote.value.trim();
    var text = 'En ole varma oikeasta osasta. Pyydän apua sopivan varaosan tunnistamiseen.';
    if (existing.indexOf(text) === -1) {
      elements.inquiryNote.value = existing ? existing + '\n' + text : text;
    }
    elements.copyStatus.textContent = 'Lisättiin viesti tiedusteluun. Täytä yhteystietosi ja lähetä.';
    updateMailtoLink();
  }

  function bindEvents() {
    elements.searchInput.addEventListener('input', function () {
      state.filters.search = elements.searchInput.value;
      renderCatalog();
    });

    elements.brandFilter.addEventListener('change', function () {
      state.filters.brand = elements.brandFilter.value;
      renderCatalog();
    });

    elements.typeFilter.addEventListener('change', function () {
      state.filters.type = elements.typeFilter.value;
      renderCatalog();
    });

    elements.clearMachineButton.addEventListener('click', clearMachine);
    elements.machineModel.addEventListener('input', updateMailtoLink);
    elements.machineSerial.addEventListener('input', updateMailtoLink);
    elements.customerName.addEventListener('input', updateMailtoLink);
    elements.customerContact.addEventListener('input', updateMailtoLink);
    elements.inquiryNote.addEventListener('input', updateMailtoLink);
    elements.copyInquiryButton.addEventListener('click', copyInquiry);
    elements.unknownPartButton.addEventListener('click', addUnknownPartNote);
  }

  function cacheElements() {
    elements.searchInput = byId('searchInput');
    elements.brandFilter = byId('brandFilter');
    elements.typeFilter = byId('typeFilter');
    elements.machineCards = byId('machineCards');
    elements.selectedMachine = byId('selectedMachine');
    elements.clearMachineButton = byId('clearMachineButton');
    elements.machineModel = byId('machineModel');
    elements.machineSerial = byId('machineSerial');
    elements.catalogResults = byId('catalogResults');
    elements.resultCount = byId('resultCount');
    elements.cartCount = byId('cartCount');
    elements.cartItems = byId('cartItems');
    elements.customerName = byId('customerName');
    elements.customerContact = byId('customerContact');
    elements.inquiryNote = byId('inquiryNote');
    elements.copyInquiryButton = byId('copyInquiryButton');
    elements.unknownPartButton = byId('unknownPartButton');
    elements.mailtoLink = byId('mailtoLink');
    elements.copyStatus = byId('copyStatus');
  }

  function indexDocuments(documents) {
    state.documentsById = {};
    (documents || []).forEach(function (doc) {
      state.documentsById[doc.id] = doc;
    });
  }

  function showLoadError(error) {
    elements.catalogResults.innerHTML = '';
    var errorBox = document.createElement('div');
    errorBox.className = 'empty-state error';
    errorBox.innerHTML = '<h3>Katalogia ei voitu ladata</h3><p></p>';
    errorBox.querySelector('p').textContent = error.message || 'Tuntematon virhe';
    elements.catalogResults.appendChild(errorBox);
  }

  function init() {
    cacheElements();
    bindEvents();

    window.catalogDataSource.load()
      .then(function (catalog) {
        state.catalog = catalog;
        state.items = catalog.items || [];
        indexDocuments(catalog.documents || []);
        renderBrandOptions();
        renderSelectedMachine();
        renderMachineCards();
        renderCatalog();
        renderCart();
      })
      .catch(showLoadError);
  }

  document.addEventListener('DOMContentLoaded', init);
}());
