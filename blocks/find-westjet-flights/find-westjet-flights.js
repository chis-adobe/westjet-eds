const PREVIEW_RESULT = {
  arguments: {
    origin: 'YYC',
    destination: 'YYZ',
    departure_date: '2026-11-12',
    return_date: '2026-11-16',
    trip_type: 'round trip',
    adult_count: 2,
  },
  records: [
    {
      id: 'placeholder-1',
      name: 'Placeholder name 1',
      description: 'Placeholder description 1',
      features: [
        'Placeholder feature 1',
      ],
      price: null,
      image_url: null,
      source_url: null,
    },
    {
      id: 'placeholder-2',
      name: 'Placeholder name 2',
      description: 'Placeholder description 2',
      features: [
        'Placeholder feature 2',
      ],
      price: null,
      image_url: null,
      source_url: null,
    },
    {
      id: 'placeholder-3',
      name: 'Placeholder name 3',
      description: 'Placeholder description 3',
      features: [
        'Placeholder feature 3',
      ],
      price: null,
      image_url: null,
      source_url: null,
    },
  ],
};

const SVG_NS = 'http://www.w3.org/2000/svg';
let instanceCount = 0;
const NBSP = '\u00a0';

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
  const card = el('li', 'option-card');
  const nameId = `${uid}-option-name-${index + 1}`;

  if (hasText(record.id)) {
    const stub = el('div', 'option-stub');
    stub.append(el('span', 'stub-label', 'Option'), el('span', 'option-code', record.id));
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
  const features = Array.isArray(record.features) ? record.features.filter(hasText) : [];
  if (features.length) {
    const list = el('ul', 'option-features');
    list.setAttribute('aria-label', 'Features');
    features.forEach((feature) => {
      const item = el('li', 'option-feature');
      item.append(icon('feature-icon', 'M3.5 8.5l3 3 6-7'), el('span', '', feature));
      list.append(item);
    });
    body.append(list);
  }
  card.append(body);

  const actions = el('div', 'option-actions');
  const button = el('button', 'button-primary', 'View option');
  button.type = 'button';
  if (hasText(record.id)) button.dataset.optionId = String(record.id);
  const label = hasText(record.name) ? record.name : record.id;
  if (hasText(label)) button.setAttribute('aria-label', `View option ${label}`);
  button.addEventListener('click', () => {
    if (!bridge?.isConnected) return;
    const parts = [];
    if (hasText(record.name)) parts.push(record.name);
    if (hasText(record.id)) parts.push(`(option ${record.id})`);
    bridge.sendMessage(`View flight option ${parts.join(' ')}`.trim());
  });
  actions.append(button);
  card.append(actions);
  return card;
}

function render(block, data, bridge, uid) {
  const args = data && typeof data.arguments === 'object' && data.arguments ? data.arguments : {};
  const records = Array.isArray(data?.records) ? data.records.filter((r) => r && typeof r === 'object') : [];

  const root = el('div', 'flight-results');
  root.setAttribute('role', 'region');
  root.setAttribute('aria-labelledby', `${uid}-route-title`);
  root.append(buildRecap(args, uid));

  const section = el('section', 'results');
  section.setAttribute('aria-labelledby', `${uid}-results-count`);
  const head = el('div', 'results-head');
  const count = el('p', 'results-count');
  count.id = `${uid}-results-count`;
  head.append(count);
  section.append(head);

  if (!records.length) {
    count.textContent = 'No options';
    section.append(el('p', 'empty-state', 'No flight options came back for this search.'));
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
  root.append(section);
  block.replaceChildren(root);
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

  let data = PREVIEW_RESULT;
  if (live) {
    const result = await bridge.toolResult;
    data = result?.structuredContent ?? { arguments: {}, records: [] };
  }
  instanceCount += 1;
  render(block, data, bridge, `fwf${instanceCount}`);

  if (connected && typeof bridge.autoResize === 'function') {
    bridge.autoResize(block);
  }
}
