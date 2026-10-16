const PREVIEW_RESULT = {
  arguments: {
    flight_date: '2026-10-16',
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

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function hasText(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function countLabel(n) {
  return `${n} status ${n === 1 ? 'record' : 'records'}`;
}

function buildHeader(args, n) {
  const head = el('header', 'status-head');
  head.append(el('h1', 'status-title', 'Flight status'));
  const meta = el('p', 'status-meta');
  const date = args && hasText(args.flight_date) ? String(args.flight_date) : '';
  if (date) {
    meta.append('Flight date ');
    const time = el('time', null, date);
    time.setAttribute('datetime', date);
    meta.append(time);
    const sep = el('span', 'meta-sep', '\u00b7');
    sep.setAttribute('aria-hidden', 'true');
    meta.append(sep);
  }
  meta.append(el('span', 'meta-count', countLabel(n)));
  head.append(meta);
  return head;
}

function buildCard(record, index, total) {
  const card = el('li', 'status-card');
  card.setAttribute('aria-label', `${index + 1} of ${total}`);
  const top = el('div', 'card-top');
  if (hasText(record.name)) top.append(el('h2', 'card-name', record.name));
  const pos = el('span', 'card-pos', `${index + 1} of ${total}`);
  pos.setAttribute('aria-hidden', 'true');
  top.append(pos);
  card.append(top);
  if (hasText(record.description)) card.append(el('p', 'card-desc', record.description));
  const features = Array.isArray(record.features) ? record.features.filter(hasText) : [];
  if (features.length) {
    const list = el('ul', 'card-features');
    list.setAttribute('aria-label', 'Features');
    features.forEach((feature) => list.append(el('li', 'badge', feature)));
    card.append(list);
  }
  return card;
}

function trackInset(track) {
  return parseFloat(getComputedStyle(track).paddingLeft) || 0;
}

function render(block, result) {
  const data = result && typeof result === 'object' ? result : {};
  const args = data.arguments && typeof data.arguments === 'object' ? data.arguments : {};
  const records = Array.isArray(data.records)
    ? data.records.filter((r) => r && typeof r === 'object')
    : [];
  const n = records.length;

  const nodes = [buildHeader(args, n)];

  if (!n) {
    nodes.push(el('p', 'answer-note', 'No flight status records came back for this date.'));
    block.replaceChildren(...nodes);
    return;
  }

  nodes.push(el('p', 'answer-note', 'These records don\u2019t include a departure time or a flight status yet.'));

  const track = el('ol', 'status-track');
  track.tabIndex = 0;
  track.setAttribute('aria-label', 'Status records, scroll sideways for more');
  const cards = records.map((record, i) => buildCard(record, i, n));
  track.append(...cards);

  const chips = [];
  let pinned = -1;
  let arrived = false;
  if (n > 1) {
    const nav = el('nav', 'record-index');
    nav.setAttribute('aria-label', 'Status records');
    const list = el('ol');
    records.forEach((record, i) => {
      const item = el('li');
      const chip = el('button', 'index-chip');
      chip.type = 'button';
      const num = el('span', 'chip-num', i + 1);
      num.setAttribute('aria-hidden', 'true');
      chip.append(num, hasText(record.name) ? String(record.name) : `Record ${i + 1}`);
      if (i === 0) chip.setAttribute('aria-current', 'true');
      chip.addEventListener('click', () => {
        const card = cards[i];
        pinned = i;
        arrived = false;
        track.scrollTo({ left: card.offsetLeft - trackInset(track) });
        chips.forEach((c, j) => {
          if (j === i) c.setAttribute('aria-current', 'true');
          else c.removeAttribute('aria-current');
        });
      });
      chips.push(chip);
      item.append(chip);
      list.append(item);
    });
    nav.append(list);
    nodes.push(nav);

    let frame = 0;
    track.addEventListener('scroll', () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const left = track.scrollLeft;
        const max = track.scrollWidth - track.clientWidth;
        let nearest = 0;
        let best = Infinity;
        cards.forEach((card, j) => {
          const d = Math.abs(card.offsetLeft - trackInset(track) - left);
          if (d < best) {
            best = d;
            nearest = j;
          }
        });
        if (left >= max - 1) nearest = cards.length - 1;
        let current = nearest;
        if (pinned >= 0) {
          const target = Math.min(cards[pinned].offsetLeft - trackInset(track), max);
          const atTarget = Math.abs(left - target) < 2;
          if (atTarget) arrived = true;
          if (atTarget || !arrived) current = pinned;
          else pinned = -1;
        }
        chips.forEach((c, j) => {
          if (j === current) c.setAttribute('aria-current', 'true');
          else c.removeAttribute('aria-current');
        });
      });
    }, { passive: true });
  }

  nodes.push(track);
  block.replaceChildren(...nodes);
}

export default async function decorate(block, bridge) {
  const connected = Boolean(bridge?.isConnected);
  const preview = bridge?.hostContext?.preview === true;

  if (connected) {
    const theme = bridge.hostContext?.theme;
    if (theme) block.dataset.theme = theme;
    if (typeof bridge.onContextChange === 'function') {
      bridge.onContextChange((ctx) => {
        if (ctx?.theme) block.dataset.theme = ctx.theme;
      });
    }
  }

  let result = PREVIEW_RESULT;
  if (connected && !preview) {
    const toolResult = await bridge.toolResult;
    result = toolResult?.structuredContent ?? { arguments: {}, records: [] };
  }

  render(block, result);

  if (connected && typeof bridge.autoResize === 'function') {
    bridge.autoResize(block);
  }
}
