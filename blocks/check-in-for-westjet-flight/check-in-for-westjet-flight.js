const PREVIEW_RESULT = {
  arguments: {
    reservation_code: 'QX7T2M',
    last_name: 'Tremblay',
  },
  records: [
    {
      id: 'check-in-for-flight-1',
      name: 'Online check-in',
      description: 'You can check in online using either your six-letter reservation code or ticket number along with your last name, or by signing in to your WestJet Rewards account.',
      features: [
        'Check-in opens 24 hours before departure for most flights',
        'Reservation code (6 characters) or ticket number (13 digits)',
        'Last name, or sign in to your WestJet Rewards account',
      ],
      price: null,
      image_url: null,
      source_url: 'https://checkin.westjet.com',
    },
    {
      id: 'check-in-for-flight-2',
      name: 'WestJet app',
      description: 'The WestJet app is the easiest way to check in and manage your trip.',
      features: [
        'Check in and verify travel documents',
        'Add checked baggage',
        'Upgrade or change seats',
        'Access your boarding pass anytime',
      ],
      price: null,
      image_url: null,
      source_url: 'https://www.westjet.com/en-ca/manage/mobile-app',
    },
    {
      id: 'check-in-for-flight-3',
      name: 'Email',
      description: 'You may also receive an email when check-in opens with a direct link to check in. This link takes you to the same online check-in experience.',
      features: [],
      price: null,
      image_url: null,
      source_url: 'https://www.westjet.com/en-ca/manage/check-in',
    },
    {
      id: 'check-in-for-flight-4',
      name: 'Airport check-in counters',
      description: 'If online check-in is not available, wait until airport check-in opens within three hours of departure. Our airport agents can help complete check-in when you arrive.',
      features: [
        'Open 3 hours before departure for most flights',
        'Open 4 hours before departure for flights departing from: Barcelona, Dublin, Edinburgh, London Heathrow, Paris, and Rome',
      ],
      price: null,
      image_url: null,
      source_url: 'https://www.westjet.com/en-ca/manage/check-in',
    },
    {
      id: 'check-in-for-flight-5',
      name: 'Airport kiosks',
      description: 'Airport kiosks do not support check-in. They are available to print bag tags and boarding passes only. Please check in online or in the WestJet app before arriving to the airport.',
      features: [
        'Print bag tags',
        'Print boarding passes',
      ],
      price: null,
      image_url: null,
      source_url: 'https://www.westjet.com/en-ca/manage/check-in',
    },
    {
      id: 'check-in-for-flight-6',
      name: 'Bookings that require agent check-in',
      description: 'Some bookings require to check in with a WestJet agent earlier than standard check-in times.',
      features: [
        'Requesting wheelchair assistance',
        'Travelling with oversized or overweight baggage',
        'Travelling with a pet in the cabin',
        'Travelling with a pet in checked baggage',
        'Travelling as an unaccompanied minor',
        'Domestic: 1 hour 30 minutes (90 minutes) before departure.',
        'U.S. & International: 1 hour 30 minutes (90 minutes) before departure.',
        'Flying out of Calgary, Edmonton, Toronto, and Vancouver: Arrive 1 hour 45 minutes (105 minutes) earlier than standard check-in times.',
      ],
      price: null,
      image_url: null,
      source_url: 'https://www.westjet.com/en-ca/manage/check-in',
    },
  ],
};

const DETAIL_FIELDS = [
  ['reservation_code', 'Reservation code'],
  ['ticket_number', 'Ticket number'],
  ['last_name', 'Last name'],
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function hasValue(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
}

function safeUrl(value) {
  if (!hasValue(value) || typeof value !== 'string') return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol === 'https:' || url.protocol === 'tel:') return url;
  } catch (e) {
    return null;
  }
  return null;
}

function isOnlineCheckin(url) {
  return Boolean(url && url.protocol === 'https:' && url.hostname.startsWith('checkin.'));
}

function linkLabel(url) {
  if (isOnlineCheckin(url)) return 'Go to online check-in';
  if (url.protocol === 'https:' && /\/mobile-app\/?$/.test(url.pathname)) return 'WestJet app page';
  if (url.protocol === 'https:' && (url.hostname === 'westjet.com' || url.hostname.endsWith('.westjet.com'))) {
    return 'Check-in page on westjet.com';
  }
  return 'More details';
}

function externalIcon() {
  const icon = el('span', 'link-icon');
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function wireLink(anchor, bridge) {
  anchor.addEventListener('click', (event) => {
    if (!bridge?.isConnected) return;
    const href = anchor.getAttribute('href') || '';
    if (!href.startsWith('https:')) return;
    event.preventDefault();
    bridge.openLink(href);
  });
}

function externalLink(url, className, label, bridge) {
  const a = el('a', className, label);
  a.href = url.href;
  if (url.protocol === 'https:') {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  wireLink(a, bridge);
  return a;
}

function renderDetails(args) {
  const rows = DETAIL_FIELDS.filter(([key]) => hasValue(args[key]));
  if (!rows.length) return null;
  const dl = el('dl', 'your-details');
  dl.append(el('span', 'details-label', 'Your details'));
  rows.forEach(([key, label]) => {
    dl.append(el('dt', '', label), el('dd', '', args[key]));
  });
  return dl;
}

function watchOverflow(list, name) {
  const update = () => {
    if (list.scrollHeight > list.clientHeight + 1) {
      list.tabIndex = 0;
      list.setAttribute('aria-label', `${name}: list scrolls`);
    } else {
      list.removeAttribute('tabindex');
      list.removeAttribute('aria-label');
    }
  };
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(update).observe(list);
  }
  requestAnimationFrame(update);
}

function renderCard(record, index, args, bridge, uid) {
  const num = index + 1;
  const card = el('li', 'method-card');
  card.id = `${uid}-card-${num}`;
  const nameId = `${uid}-name-${num}`;
  const url = safeUrl(record.source_url);

  const head = el('div', 'card-head');
  const badge = el('span', 'card-num', num);
  badge.setAttribute('aria-hidden', 'true');
  head.append(badge);
  if (hasValue(record.name)) {
    const h = el('h3', 'method-name', record.name);
    h.id = nameId;
    head.append(h);
    card.setAttribute('aria-labelledby', nameId);
  }
  card.append(head);

  if (hasValue(record.description)) card.append(el('p', 'method-desc', record.description));

  if (isOnlineCheckin(url)) {
    const details = renderDetails(args);
    if (details) card.append(details);
  }

  const features = Array.isArray(record.features) ? record.features.filter(hasValue) : [];
  if (features.length) {
    const ul = el('ul', 'method-features');
    features.forEach((f) => ul.append(el('li', '', f)));
    card.append(ul);
    watchOverflow(ul, hasValue(record.name) ? record.name : `Option ${num}`);
  }

  if (url) {
    const link = externalLink(url, 'method-link', linkLabel(url), bridge);
    link.append(externalIcon());
    card.append(link);
  }
  return card;
}

function render(block, result, bridge) {
  const args = result && typeof result.arguments === 'object' && result.arguments ? result.arguments : {};
  const records = Array.isArray(result?.records)
    ? result.records.filter((r) => r && typeof r === 'object')
    : [];
  const uid = `cwf-${Math.random().toString(36).slice(2, 8)}`;

  const root = el('section', 'checkin-widget');
  const titleId = `${uid}-title`;
  root.setAttribute('aria-labelledby', titleId);

  const header = el('header', 'widget-head');
  let title = 'Ways to check in with WestJet';
  if (records.length === 1) title = '1 way to check in with WestJet';
  if (records.length > 1) title = `${records.length} ways to check in with WestJet`;
  const h = el('h2', 'widget-title', title);
  h.id = titleId;
  header.append(h);
  root.append(header);

  if (!records.length) {
    root.append(el('p', 'widget-meta widget-empty', 'No check-in options were returned. Ask in the chat to try again.'));
  }

  const rail = el('ol', 'method-rail');
  const cards = records.map((record, i) => renderCard(record, i, args, bridge, uid));

  if (records.length > 1) {
    const nav = el('nav', 'method-index');
    nav.setAttribute('aria-label', 'Check-in options');
    const ol = el('ol');
    records.forEach((record, i) => {
      const li = el('li');
      const a = el('a', 'index-link');
      a.href = `#${cards[i].id}`;
      a.append(el('span', 'index-num', i + 1));
      a.append(document.createTextNode(hasValue(record.name) ? String(record.name) : `Option ${i + 1}`));
      a.addEventListener('click', (event) => {
        event.preventDefault();
        const card = cards[i];
        cards.forEach((c) => c.classList.toggle('is-target', c === card));
        const offset = card.getBoundingClientRect().left - rail.getBoundingClientRect().left;
        rail.scrollTo({ left: Math.max(0, rail.scrollLeft + offset - 16) });
      });
      li.append(a);
      ol.append(li);
    });
    nav.append(ol);
    root.append(nav);
  }

  if (cards.length) {
    rail.tabIndex = 0;
    rail.setAttribute('aria-label', 'Check-in options, scroll sideways for more');
    rail.append(...cards);
    root.append(rail);
  }

  const footer = el('footer', 'widget-actions');
  const status = el('button', 'btn btn-primary', 'Check flight status');
  status.type = 'button';
  status.addEventListener('click', () => {
    if (!bridge?.isConnected) return;
    const code = hasValue(args.reservation_code) ? ` for reservation ${args.reservation_code}` : '';
    bridge.sendMessage(`Check flight status for my WestJet flight${code}`);
  });
  footer.append(status);
  const online = records.map((r) => safeUrl(r.source_url)).find((u) => isOnlineCheckin(u));
  if (online) footer.append(externalLink(online, 'btn btn-secondary', 'Check in online', bridge));
  root.append(footer);

  block.replaceChildren(root);
}

function applyTheme(block, theme) {
  if (theme === 'dark' || theme === 'light') block.dataset.theme = theme;
}

export default async function decorate(block, bridge) {
  const connected = Boolean(bridge?.isConnected);
  let result = PREVIEW_RESULT;
  if (connected && bridge.hostContext?.preview !== true) {
    const toolResult = await bridge.toolResult;
    result = toolResult?.structuredContent ?? { arguments: {}, records: [] };
  }
  render(block, result, bridge);
  if (connected) {
    applyTheme(block, bridge.hostContext?.theme);
    bridge.onContextChange?.((ctx) => applyTheme(block, ctx?.theme ?? bridge.hostContext?.theme));
    bridge.autoResize(block);
  }
}
