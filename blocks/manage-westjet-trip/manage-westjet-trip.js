const PREVIEW_RESULT = {
  arguments: {
    reservation_code: 'QX7K2P',
    last_name: 'Tremblay',
  },
  records: [
    {
      id: 'manage-trip-1',
      name: 'Manage your trip',
      description: 'Upgrade your seats, manage guest details and more.',
      features: [],
      price: null,
      image_url: null,
      source_url: 'https://www.westjet.com/en-ca/manage',
      category: 'Manage Trips',
      cta_label: 'Manage trips',
      cta_url: 'https://www.westjet.com/en-ca/manage',
    },
    {
      id: 'manage-trip-2',
      name: 'Changes',
      description: "Find your options for changing your flight. Changes must be made more than 2 hours before your flight's departure time.",
      features: [
        "You can change your flight within 24 hours of booking for no fee, as long as your flight isn't leaving within the next 24 hours. A fare difference may still apply.",
        'Change fees are charged per direction, per person, except for flights to and from Europe and Asia, where fees are charged per transaction, per person.',
        'UltraBasic fares: Changes are not allowed.',
        'Econo, Premium, Business, and Member Exclusive fares: Change for a fee. Difference in fare price applies.',
        'EconoFlex, PremiumFlex, and BusinessFlex fares: Change for no fee. Difference in fare price applies.',
        'There is no change fee for Gold and Platinum members for same-day changes (excludes Ultra Basic fares).',
      ],
      price: null,
      image_url: 'https://www.westjet.com/content/dam/westjet/images/aircraft/exterior/737-max-8/landscape-16-9/230502-WestJet-MAX8-Runway-768x432.jpg',
      source_url: 'https://www.westjet.com/en-ca/manage/change-cancel#changes',
      category: 'Change/Cancel',
      cta_label: 'Manage Trips',
      cta_url: 'https://www.westjet.com/en-ca/manage',
    },
    {
      id: 'manage-trip-3',
      name: 'Cancellations',
      description: "Find your options for cancelling your flight. Cancellations must be made more than 2 hours before your flight's departure time.",
      features: [
        "You can cancel your flight within 24 hours of booking for no fee, as long as your flight isn't leaving within the next 24 hours.",
        'Cancel fees are charged per direction, per person, except for flights to and from Europe and Asia, where fees are charged per transaction, per person.',
        'UltraBasic fares: No refund or future travel credit.',
        'EconoFlex fares: Cancel for no fee. Credit issued as Travel Bank.',
        'Econo, Premium, Business, and Member Exclusive fares: Cancel for a fee. Credit issued as Travel Bank.',
        'PremiumFlex and BusinessFlex fares: Cancel for no fee. Refund back to original form of payment.',
        'Cancellation fees are waived when a flexible change/cancel policy is in effect under a travel advisory.',
      ],
      price: null,
      image_url: 'https://www.westjet.com/content/dam/westjet/images/aircraft/exterior/737-max-8/landscape-16-9/230502-WestJet-MAX8-Runway-768x432.jpg',
      source_url: 'https://www.westjet.com/en-ca/manage/change-cancel#cancellations',
      category: 'Change/Cancel',
      cta_label: 'Manage Trips',
      cta_url: 'https://www.westjet.com/en-ca/manage',
    },
    {
      id: 'manage-trip-4',
      name: 'Cancel For Any Reason',
      description: 'Cancel For Any Reason provided by HTS (Hopper Technology Solutions) is an option that allows you to cancel your trip for any reason and receive an 80% or 100% refund to your original form of payment.',
      features: [
        "Total flexibility. Cancel your flight for any reason up to 24 hours before your flight's departure time.",
        'Customizable coverage. Choose between 80% or 100% refund options to fit your budget.',
        'Easy refunds. Get refunded to your original form of payment.',
        'Simple, self-serve cancellation. If your travel plans change, manage your booking online and cancel instantly with no questions asked.',
      ],
      price: null,
      image_url: null,
      source_url: 'https://www.westjet.com/en-ca/manage/change-cancel#cancel-for-any-reason',
      category: 'Change/Cancel',
      cta_label: 'Manage Trips',
      cta_url: 'https://www.westjet.com/en-ca/manage',
    },
    {
      id: 'manage-trip-5',
      name: 'Extended Comfort',
      description: 'Get extra legroom, early overhead bin access and a complimentary alcoholic beverage with Extended Comfort seating in Economy cabin.',
      features: [
        'Extra legroom',
        'Early access to overhead bins',
        'Priority boarding',
        'Quicker exit upon arrival',
        'Priority security',
        'A complimentary alcoholic beverage',
      ],
      price: null,
      image_url: 'https://www.westjet.com/content/dam/westjet/images/aircraft/cabin/042306-Extended-Comofort-768x432.jpg',
      source_url: 'https://www.westjet.com/en-ca/manage/extended-comfort',
      category: 'Seats and upgrades',
      cta_label: 'Select your seat',
      cta_url: 'https://www.westjet.com/en-ca/manage?i_cid=wj:extended-comfort:banner:manage:seat-selection',
    },
    {
      id: 'manage-trip-6',
      name: 'Premium cabin',
      description: 'Enjoy spacious seats, exclusive inflight dining, priority boarding and more* in Premium cabin.',
      features: [
        'Priority check-in and boarding',
        'More seat comfort with extra leg and elbow room',
        'Complimentary bottled water when you board',
        'Restaurant-style dining on most flights over one hour',
        'Exclusive snacks and beverages',
      ],
      price: null,
      image_url: 'https://www.westjet.com/content/dam/westjet/images/aircraft/cabin/042306-Premium-Two-Guests-Premium-Cabin-Meals-768x432.jpg',
      source_url: 'https://www.westjet.com/en-ca/inflight/premium-cabin',
      category: 'Upgrades',
      cta_label: 'Explore Premium',
      cta_url: 'https://www.westjet.com/en-ca/inflight/premium-cabin',
    },
    {
      id: 'manage-trip-7',
      name: 'Business cabin',
      description: 'Recline and relax with lie-flat seats, privacy screens, exclusive inflight dining, premium beverages and priority services.',
      features: [
        '2 checked bags',
        'Skip the lines with priority check-in, security, boarding, and baggage',
        'Relax in the lounge before your flight (where available)',
        'Contemporary Canadian inspired restaurant-style dining',
        'Exceptional comfort in spacious pods with fully extendable privacy screens',
      ],
      price: null,
      image_url: 'https://www.westjet.com/content/dam/westjet/images/aircraft/cabin/042306-Business-cabin-cozy-pod-768x432.jpg',
      source_url: 'https://www.westjet.com/en-ca/inflight/business-cabin',
      category: 'Upgrades',
      cta_label: 'Explore Business',
      cta_url: 'https://www.westjet.com/en-ca/inflight/business-cabin',
    },
    {
      id: 'manage-trip-8',
      name: 'Before check-in',
      description: 'Submit an offer for Premium or Business cabin between the time of booking and 54 hours before departure. Or lock in your Premium or Business cabin seat with an instant upgrade purchase, available 10 days before your flight.',
      features: [
        'Enter your reservation code and last name and click "Place an offer" to see if you are eligible.',
        'Making an offer is free; payment is processed only if your offer is accepted.',
        'Offers can be modified or cancelled up to 54 hours before departure.',
        "Not available on Ultrabasic fares, codeshare flights, other airlines' tickets, or for unaccompanied minors.",
      ],
      price: null,
      image_url: 'https://www.westjet.com/content/dam/westjet/images/aircraft/cabin/042426-Women-in-business-cabin-meal-768x432.jpg',
      source_url: 'https://www.westjet.com/en-ca/manage/upgrade/offers',
      category: 'Ways to upgrade',
      cta_label: 'Place an offer',
      cta_url: 'https://www.westjet.com/en-ca/manage/upgrade/offers',
    },
    {
      id: 'manage-trip-9',
      name: 'At check-in',
      description: 'Find Business or Premium cabin seats for purchase when you check in for your flight starting 24 hours before departure (subject to availability).',
      features: [],
      price: null,
      image_url: 'https://www.westjet.com/content/dam/westjet/images/aircraft/cabin/042426-Family-in-premuim-768x432.jpg',
      source_url: 'https://www.westjet.com/en-ca/manage/upgrade',
      category: 'Ways to upgrade',
      cta_label: 'Upgrade now',
      cta_url: 'https://www.westjet.com/en-ca/manage/check-in',
    },
    {
      id: 'manage-trip-10',
      name: 'After check-in',
      description: 'Bid for the chance to get a last-minute upgrade to Business or Premium 24 hours before departure through a real-time auction.',
      features: [
        'Auctions open 24 hours before departure.',
        "There's no fee to join the auction – you only pay if your bid wins.",
        "You can bid for up to 6 guests if they're on the same reservation.",
        "Once submitted, bids can't be cancelled during a live auction.",
      ],
      price: null,
      image_url: 'https://www.westjet.com/content/dam/westjet/images/aircraft/cabin/042426-Women-in-Premium-wine-768x432.jpg',
      source_url: 'https://www.westjet.com/en-ca/manage/upgrade/bidding',
      category: 'Ways to upgrade',
      cta_label: 'Place a bid',
      cta_url: 'https://www.westjet.com/en-ca/manage/upgrade/bidding',
    },
  ],
};
const TITLE = 'Manage your trip options';
const EMPTY_TEXT = 'No self-service options were returned.';
const ERROR_TEXT = 'Trip options could not load. Ask again in the chat.';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function str(value) {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

function safeHref(value, allowTel = false) {
  const raw = str(value);
  if (!raw) return '';
  try {
    const url = new URL(raw);
    if (url.protocol === 'https:') return url.href;
    if (allowTel && url.protocol === 'tel:') return raw;
  } catch (e) {
    return '';
  }
  return '';
}

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

function bridgeReady(bridge) {
  return Boolean(bridge && bridge.isConnected);
}

function renderHeader(args, count) {
  const header = el('header', 'widget-header');
  header.append(el('h2', 'widget-title', TITLE));
  const parts = [];
  const code = str(args.reservation_code);
  const name = str(args.last_name);
  if (code) parts.push(el('span', 'lookup-code', code));
  if (name) parts.push(el('span', 'lookup-name', name));
  if (count > 0) parts.push(el('span', 'lookup-count', plural(count, 'option', 'options')));
  if (parts.length) {
    const line = el('p', 'widget-lookup');
    parts.forEach((part, index) => {
      if (index > 0) {
        const sep = el('span', 'lookup-sep', '·');
        sep.setAttribute('aria-hidden', 'true');
        line.append(sep);
      }
      line.append(part);
    });
    header.append(line);
  }
  return header;
}

function emptyImage() {
  const tile = el('div', 'item-image item-image-empty');
  tile.setAttribute('role', 'img');
  tile.setAttribute('aria-label', 'No image available');
  tile.append(el('span', '', 'No image'));
  return tile;
}

function renderImage(record, name) {
  const src = safeHref(record.image_url);
  if (!src) return emptyImage();
  const img = el('img', 'item-image');
  img.src = src;
  img.alt = name;
  img.decoding = 'async';
  img.addEventListener('error', () => img.replaceWith(emptyImage()), { once: true });
  return img;
}

function bindLink(anchor, bridge) {
  anchor.addEventListener('click', (event) => {
    if (!bridgeReady(bridge) || !anchor.href.startsWith('https:')) return;
    event.preventDefault();
    bridge.openLink(anchor.href);
  });
}

function renderItem(record, index, total, bridge) {
  const name = str(record.name);
  const item = el('li', 'item');
  item.dataset.index = String(index);
  item.setAttribute('aria-label', name ? `${index + 1} of ${total}: ${name}` : `${index + 1} of ${total}`);

  const head = el('div', 'item-head');
  head.append(renderImage(record, name));
  const heading = el('div', 'item-heading');
  const category = str(record.category);
  if (category) heading.append(el('span', 'badge', category));
  if (name) heading.append(el('h3', 'item-name', name));
  head.append(heading);
  item.append(head);

  const description = str(record.description);
  if (description) item.append(el('p', 'item-description', description));

  const features = Array.isArray(record.features)
    ? record.features.map(str).filter(Boolean)
    : [];
  if (features.length) {
    const details = el('details', 'item-details');
    details.append(el('summary', 'details-summary', plural(features.length, 'detail', 'details')));
    const list = el('ul', 'details-list');
    list.tabIndex = 0;
    list.setAttribute('aria-label', name ? `${name} details` : 'Details');
    features.forEach((feature) => list.append(el('li', '', feature)));
    details.append(list);
    item.append(details);
  }

  const foot = el('div', 'item-foot');
  const href = safeHref(record.cta_url, true);
  const label = str(record.cta_label);
  if (href && label) {
    const link = el('a', 'item-link', label);
    link.href = href;
    if (href.startsWith('https:')) {
      link.target = '_blank';
      link.rel = 'noopener';
      bindLink(link, bridge);
    }
    foot.append(link);
  }
  const position = el('span', 'item-position', `${index + 1} of ${total}`);
  position.setAttribute('aria-hidden', 'true');
  foot.append(position);
  item.append(foot);
  return item;
}

function renderRail(records, items, track) {
  const groups = [];
  const byName = new Map();
  records.forEach((record, index) => {
    const category = str(record.category);
    if (!category) return;
    if (!byName.has(category)) {
      const group = { category, count: 0, first: index };
      byName.set(category, group);
      groups.push(group);
    }
    byName.get(category).count += 1;
  });
  if (!groups.length) return null;

  const nav = el('nav', 'rail');
  nav.setAttribute('aria-label', 'Option categories');
  const list = el('ol', 'rail-list');
  groups.forEach((group) => {
    const stop = el('li', 'rail-stop');
    const link = el('a', 'rail-link');
    link.href = `#opt-${group.first + 1}`;
    const dot = el('span', 'rail-dot', String(group.count));
    dot.setAttribute('aria-hidden', 'true');
    link.append(dot, el('span', 'rail-label', group.category));
    link.append(el('span', 'visually-hidden', `, ${plural(group.count, 'option', 'options')}`));
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = items[group.first];
      items.forEach((node) => node.classList.remove('is-target'));
      target.classList.add('is-target');
      const inset = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      track.scrollTo({ left: Math.max(0, target.offsetLeft - inset), behavior: 'smooth' });
    });
    stop.append(link);
    list.append(stop);
  });
  nav.append(list);
  return nav;
}

function renderActions(args, bridge) {
  const footer = el('footer', 'widget-actions');
  const code = str(args.reservation_code);
  const name = str(args.last_name);
  const ticket = str(args.ticket_number);

  const primary = el('button', 'button-primary', 'Check in');
  primary.type = 'button';
  if (code) {
    primary.append(' ', el('span', 'button-meta', code));
  }
  primary.addEventListener('click', () => {
    if (!bridgeReady(bridge)) return;
    const details = [];
    if (code) details.push(`reservation code ${code}`);
    if (ticket) details.push(`ticket number ${ticket}`);
    if (name) details.push(`last name ${name}`);
    const prompt = details.length
      ? `Check in for my WestJet flight with ${details.join(', ')}.`
      : 'Check in for my WestJet flight.';
    bridge.sendMessage(prompt);
  });

  const secondary = el('button', 'button-secondary', 'Check flight status');
  secondary.type = 'button';
  secondary.addEventListener('click', () => {
    if (!bridgeReady(bridge)) return;
    bridge.sendMessage('Check my WestJet flight status.');
  });

  footer.append(primary, secondary);
  return footer;
}

function renderResult(block, result, bridge) {
  if (!result || typeof result !== 'object' || !Array.isArray(result.records)) {
    block.replaceChildren(renderHeader({}, 0), el('p', 'widget-message', ERROR_TEXT));
    return;
  }
  const args = result.arguments && typeof result.arguments === 'object' ? result.arguments : {};
  const records = result.records.filter((record) => record && typeof record === 'object');
  const nodes = [renderHeader(args, records.length)];

  if (!records.length) {
    nodes.push(el('p', 'widget-message', EMPTY_TEXT));
  } else {
    const section = el('section', 'carousel');
    section.setAttribute('aria-label', 'Self-service options');
    const track = el('ol', 'carousel-track');
    track.tabIndex = 0;
    track.setAttribute('aria-label', 'Self-service options, scroll sideways for more');
    const items = records.map((record, index) => {
      const item = renderItem(record, index, records.length, bridge);
      item.id = `opt-${index + 1}`;
      return item;
    });
    track.append(...items);
    section.append(track);
    const rail = renderRail(records, items, track);
    if (rail) nodes.push(rail);
    nodes.push(section);
  }
  nodes.push(renderActions(args, bridge));
  block.replaceChildren(...nodes);
}

function renderLoading(block) {
  const skeleton = el('div', 'skeleton');
  skeleton.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 3; i += 1) skeleton.append(el('div', 'skeleton-card'));
  block.replaceChildren(renderHeader({}, 0), skeleton);
  block.setAttribute('aria-busy', 'true');
}

function applyTheme(block, context) {
  const theme = context && context.theme;
  if (theme === 'light' || theme === 'dark') block.dataset.theme = theme;
}

export default async function decorate(block, bridge) {
  const connected = bridgeReady(bridge);
  const preview = connected && bridge.hostContext && bridge.hostContext.preview === true;

  if (connected) {
    applyTheme(block, bridge.hostContext);
    bridge.onContextChange((context) => applyTheme(block, context));
  }

  if (connected && !preview) {
    renderLoading(block);
    bridge.autoResize(block);
    let result = null;
    try {
      const toolResult = await bridge.toolResult;
      result = toolResult ? toolResult.structuredContent : null;
    } catch (e) {
      result = null;
    }
    block.removeAttribute('aria-busy');
    renderResult(block, result, bridge);
  } else {
    renderResult(block, PREVIEW_RESULT, bridge);
    if (connected) bridge.autoResize(block);
  }
}
