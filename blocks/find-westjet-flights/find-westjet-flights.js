// FLYR lowest-fares table (xCheck v2 Tables API). Open CORS (ACAO: *), no key.
// It is a fixed deals table, not a live shopping API, so only origin/destination
// can filter it — dates, pax, points and trip type are display-only context.
const FLYR_BASE = 'https://westjet-api.xcheck.co';
const FLYR_TABLE_ID = '13664f55-01cb-4ed2-a752-d83228e33207';
const FLYR_URL = `${FLYR_BASE}/v2/tables/${FLYR_TABLE_ID}`;

const SVG_NS = 'http://www.w3.org/2000/svg';
let instanceCount = 0;
const NBSP = ' ';

// Default search used for the direct-web/preview path (no LLM conversation to
// supply arguments). Dates are computed at render time so they always sit in the
// near future. Toronto (YYZ) -> Cancun (CUN) is a route the fares table serves.
function iso(date) {
  return date.toISOString().slice(0, 10);
}

function defaultArgs() {
  const now = new Date();
  const depart = new Date(now);
  depart.setUTCDate(depart.getUTCDate() + 14);
  const back = new Date(now);
  back.setUTCDate(back.getUTCDate() + 28);
  return {
    origin: 'YYZ',
    destination: 'CUN',
    departure_date: iso(depart),
    return_date: iso(back),
    trip_type: 'round trip',
    adult_count: 2,
    use_points: false,
  };
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function icon(className, d) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', className);
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.append(path);
  return svg;
}

function hasText(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function formatDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!match) return String(value);
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (Number.isNaN(date.getTime())) return String(value);
  const weekday = date.toLocaleDateString('en-CA', { weekday: 'short', timeZone: 'UTC' });
  const month = date.toLocaleDateString('en-CA', { month: 'short', timeZone: 'UTC' }).replace('.', '');
  return `${weekday}, ${month} ${date.getUTCDate()}`;
}

function timeEl(value) {
  const node = el('time', '', formatDate(value));
  node.setAttribute('datetime', String(value));
  return node;
}

function hidden(text) {
  return el('span', 'visually-hidden', text);
}

function capitalize(value) {
  const text = String(value).trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// --- FLYR fetch + mapping -------------------------------------------------

function codesFromDeeplink(url) {
  try {
    const u = new URL(url, FLYR_BASE);
    return {
      origin: (u.searchParams.get('origin') || '').trim().toUpperCase(),
      destination: (u.searchParams.get('destination') || '').trim().toUpperCase(),
    };
  } catch (err) {
    return { origin: '', destination: '' };
  }
}

function decodeEntities(value) {
  if (!hasText(value)) return '';
  const txt = el('textarea');
  txt.innerHTML = String(value);
  return txt.value;
}

// Map one raw FLYR row into the record shape the card renderer expects, keeping
// the IATA codes/cities around so we can filter without a second API call.
function mapRow(row, index) {
  const fromCity = decodeEntities(row.web_1);
  const toCity = decodeEntities(row.web_2);
  const dates = decodeEntities(row.web_3);
  const codes = codesFromDeeplink(row.deeplink);
  const code = codes.origin && codes.destination ? `${codes.origin}–${codes.destination}` : '';
  return {
    id: code || `fare-${index + 1}`,
    name: fromCity && toCity ? `${fromCity} → ${toCity}` : fromCity || toCity,
    description: dates,
    price: hasText(row.price) ? decodeEntities(row.price) : null,
    source_url: hasText(row.deeplink) ? String(row.deeplink) : null,
    originCode: codes.origin,
    destCode: codes.destination,
    originCity: fromCity,
    destCity: toCity,
  };
}

async function fetchFlyrRecords() {
  const response = await fetch(FLYR_URL, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`FLYR responded ${response.status}`);
  const body = await response.json();
  const rows = Array.isArray(body?.data) ? body.data : [];
  return rows.map(mapRow);
}

// Lower-case and strip diacritics so "Cancun" matches "Cancún", etc.
function normalize(value) {
  return String(value).trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function matchLocation(arg, code, city) {
  if (!hasText(arg)) return true;
  const a = normalize(arg);
  if (code && a === code.toLowerCase()) return true;
  return Boolean(city) && normalize(city).includes(a);
}

function filterRecords(records, args) {
  return records.filter((r) => matchLocation(args.origin, r.originCode, r.originCity)
    && matchLocation(args.destination, r.destCode, r.destCity));
}

// --- Rendering ------------------------------------------------------------

function buildRecap(args, uid) {
  const header = el('header', 'search-recap');
  const title = el('h1', 'route-title');
  title.id = `${uid}-route-title`;
  title.append(el('span', '', 'Flights'));
  const hasOrigin = hasText(args.origin);
  const hasDestination = hasText(args.destination);
  if (hasOrigin || hasDestination) {
    const pair = el('span', 'route-pair');
    if (hasOrigin) pair.append(el('span', '', args.origin));
    if (hasOrigin && hasDestination) {
      pair.append(icon('route-arrow', 'M2 8h11M9 4l4 4-4 4'));
      pair.append(hidden('to'));
    } else if (hasDestination) {
      pair.append(el('span', '', 'to'));
    }
    if (hasDestination) pair.append(el('span', '', args.destination));
    title.append(pair);
  }
  header.append(title);

  const chips = el('ul', 'recap-chips');
  chips.setAttribute('aria-label', 'Your search');
  if (hasText(args.departure_date) || hasText(args.return_date)) {
    const chip = el('li', 'recap-chip');
    if (hasText(args.departure_date)) {
      chip.append(hidden(`Departing${NBSP}`), timeEl(args.departure_date));
    }
    if (hasText(args.departure_date) && hasText(args.return_date)) {
      chip.append(document.createTextNode(`${NBSP}–${NBSP}`));
    }
    if (hasText(args.return_date)) {
      chip.append(hidden(`returning${NBSP}`), timeEl(args.return_date));
    }
    chips.append(chip);
  }
  if (hasText(args.trip_type)) {
    const chip = el('li', 'recap-chip');
    chip.append(el('span', 'chip-strong', capitalize(args.trip_type)));
    chips.append(chip);
  }
  const adults = Number(args.adult_count);
  if (args.adult_count !== undefined && args.adult_count !== null && Number.isFinite(adults)) {
    const chip = el('li', 'recap-chip');
    chip.append(el('span', 'chip-strong', `${adults} ${adults === 1 ? 'adult' : 'adults'}`));
    chips.append(chip);
  }
  if (args.use_points === true) {
    const chip = el('li', 'recap-chip');
    chip.append(el('span', 'chip-strong', 'Points'));
    chips.append(chip);
  }
  if (chips.children.length) header.append(chips);
  return header;
}

function buildCard(record, index, bridge, uid) {
  const connected = Boolean(bridge?.isConnected);
  const card = el('li', 'option-card');
  const nameId = `${uid}-option-name-${index + 1}`;

  const stub = el('div', 'option-stub');
  if (hasText(record.id)) {
    stub.append(el('span', 'stub-label', 'Route'), el('span', 'option-code', record.id));
  }
  if (hasText(record.price)) {
    const price = el('span', 'option-price');
    price.append(hidden('Lowest fare '), el('span', '', record.price));
    stub.append(price);
  }
  if (stub.children.length) {
    card.append(stub);
    const perf = el('div', 'option-perf');
    perf.setAttribute('aria-hidden', 'true');
    card.append(perf);
  }

  const body = el('div', 'option-body');
  if (hasText(record.name)) {
    const name = el('h2', 'option-name', record.name);
    name.id = nameId;
    body.append(name);
    card.setAttribute('aria-labelledby', nameId);
  }
  if (hasText(record.description)) {
    body.append(el('p', 'option-description', record.description));
  }
  card.append(body);

  const actions = el('div', 'option-actions');
  if (hasText(record.source_url)) {
    const link = el('a', 'button-primary', 'Book on WestJet');
    link.href = record.source_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const label = hasText(record.name) ? record.name : record.id;
    if (hasText(label)) link.setAttribute('aria-label', `Book ${label} on WestJet`);
    actions.append(link);
  }
  // Inside the LLM host, also offer a drill-in that continues the conversation.
  if (connected) {
    const button = el('button', 'button-secondary', 'View details');
    button.type = 'button';
    if (hasText(record.id)) button.dataset.optionId = String(record.id);
    const label = hasText(record.name) ? record.name : record.id;
    if (hasText(label)) button.setAttribute('aria-label', `View option ${label}`);
    button.addEventListener('click', () => {
      if (!bridge?.isConnected) return;
      const parts = [];
      if (hasText(record.name)) parts.push(record.name);
      if (hasText(record.id)) parts.push(`(${record.id})`);
      bridge.sendMessage(`View flight option ${parts.join(' ')}`.trim());
    });
    actions.append(button);
  }
  if (actions.children.length) card.append(actions);
  return card;
}

function renderResults(container, args, records, uid, bridge) {
  const section = el('section', 'results');
  section.setAttribute('aria-labelledby', `${uid}-results-count`);
  const head = el('div', 'results-head');
  const count = el('p', 'results-count');
  count.id = `${uid}-results-count`;
  head.append(count);
  section.append(head);

  if (!records.length) {
    count.textContent = 'No options';
    const hasRoute = hasText(args.origin) && hasText(args.destination);
    const message = hasRoute
      ? `WestJet doesn’t serve ${args.origin} → ${args.destination}. Try a different route.`
      : 'No flight options came back for this search.';
    section.append(el('p', 'empty-state', message));
  } else {
    count.textContent = `${records.length} ${records.length === 1 ? 'option' : 'options'}`;
    if (records.length > 1) {
      const hint = el('p', 'scroll-hint', 'Scroll for more options');
      hint.setAttribute('aria-hidden', 'true');
      head.append(hint);
    }
    const carousel = el('ul', 'option-carousel');
    carousel.tabIndex = 0;
    carousel.setAttribute('aria-label', 'Flight options, scroll horizontally');
    records.forEach((record, index) => carousel.append(buildCard(record, index, bridge, uid)));
    section.append(carousel);
  }
  container.replaceChildren(section);
}

// --- Web search form ------------------------------------------------------

function field(labelText, control) {
  const wrap = el('label', 'form-field');
  wrap.append(el('span', 'field-label', labelText), control);
  return wrap;
}

function buildForm(args, onSubmit) {
  const form = el('form', 'search-form');
  form.setAttribute('aria-label', 'Search WestJet flights');

  const origin = el('input');
  origin.type = 'text';
  origin.name = 'origin';
  origin.value = args.origin || '';
  origin.placeholder = 'e.g. YYZ or Toronto';
  origin.autocomplete = 'off';

  const destination = el('input');
  destination.type = 'text';
  destination.name = 'destination';
  destination.value = args.destination || '';
  destination.placeholder = 'e.g. CUN or Cancun';
  destination.autocomplete = 'off';

  const depart = el('input');
  depart.type = 'date';
  depart.name = 'departure_date';
  depart.value = args.departure_date || '';

  const back = el('input');
  back.type = 'date';
  back.name = 'return_date';
  back.value = args.return_date || '';

  const trip = el('select');
  trip.name = 'trip_type';
  [['round trip', 'Round trip'], ['one way', 'One way']].forEach(([value, text]) => {
    const option = el('option', '', text);
    option.value = value;
    if ((args.trip_type || 'round trip') === value) option.selected = true;
    trip.append(option);
  });

  const adults = el('input');
  adults.type = 'number';
  adults.name = 'adult_count';
  adults.min = '1';
  adults.max = '9';
  adults.value = String(args.adult_count || 1);

  const points = el('input');
  points.type = 'checkbox';
  points.name = 'use_points';
  points.checked = args.use_points === true;
  const pointsField = el('label', 'form-field form-field-inline');
  pointsField.append(points, el('span', 'field-label', 'Use points'));

  const grid = el('div', 'form-grid');
  grid.append(
    field('From', origin),
    field('To', destination),
    field('Departure', depart),
    field('Return', back),
    field('Trip type', trip),
    field('Adults', adults),
    pointsField,
  );

  const submit = el('button', 'button-primary', 'Search flights');
  submit.type = 'submit';
  const formActions = el('div', 'form-actions');
  formActions.append(submit);

  form.append(grid, formActions);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onSubmit({
      origin: origin.value.trim(),
      destination: destination.value.trim(),
      departure_date: depart.value,
      return_date: back.value,
      trip_type: trip.value,
      adult_count: Number(adults.value) || 1,
      use_points: points.checked,
    });
  });
  return form;
}

// --- Orchestration --------------------------------------------------------

async function runSearch(resultsHost, args, uid, bridge) {
  resultsHost.replaceChildren(el('p', 'results-status', 'Searching WestJet fares…'));
  try {
    const all = await fetchFlyrRecords();
    const matched = filterRecords(all, args);
    renderResults(resultsHost, args, matched, uid, bridge);
  } catch (err) {
    resultsHost.replaceChildren(
      el('p', 'empty-state', 'We couldn’t reach WestJet fares right now. Please try again.'),
    );
  }
}

export default async function decorate(block, bridge) {
  const connected = Boolean(bridge?.isConnected);
  const live = connected && bridge.hostContext?.preview !== true;

  if (connected && bridge.hostContext?.theme) {
    block.dataset.theme = bridge.hostContext.theme;
  }
  if (connected && typeof bridge.onContextChange === 'function') {
    bridge.onContextChange((context) => {
      if (context?.theme) block.dataset.theme = context.theme;
    });
  }

  instanceCount += 1;
  const uid = `fwf${instanceCount}`;

  const root = el('div', 'flight-results');
  root.setAttribute('role', 'region');
  root.setAttribute('aria-labelledby', `${uid}-route-title`);
  const resultsHost = el('div', 'results-host');

  if (live) {
    // LLM path: the action fetches FLYR server-side and returns mapped records,
    // so the widget renders without needing its own (CSP/sandbox-limited) fetch.
    const toolResult = await bridge.toolResult;
    const structured = toolResult?.structuredContent || {};
    const args = structured.arguments || {};
    root.append(buildRecap(args, uid), resultsHost);
    block.replaceChildren(root);
    if (Array.isArray(structured.records)) {
      renderResults(resultsHost, args, structured.records, uid, bridge);
    } else {
      // Action omitted records (e.g. it couldn't reach FLYR) — retry here.
      await runSearch(resultsHost, args, uid, bridge);
    }
  } else {
    // Direct web / preview path: show a form seeded with sensible defaults and
    // run that search immediately so the widget isn't empty.
    const args = defaultArgs();
    const recapHost = el('div', 'recap-host');
    const rerender = (nextArgs) => {
      recapHost.replaceChildren(buildRecap(nextArgs, uid));
      runSearch(resultsHost, nextArgs, uid, bridge);
    };
    const form = buildForm(args, rerender);
    recapHost.append(buildRecap(args, uid));
    root.append(form, recapHost, resultsHost);
    block.replaceChildren(root);
    await runSearch(resultsHost, args, uid, bridge);
  }

  if (connected && typeof bridge.autoResize === 'function') {
    bridge.autoResize(block);
  }
}
