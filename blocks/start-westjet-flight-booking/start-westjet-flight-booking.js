const PREVIEW_RESULT = {
  arguments: {
    flight_option_id: 'placeholder-1',
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

const ARG_KEYS = ['flight_option_id', 'fare_id', 'search_context_id', 'westjet_rewards_id'];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function asText(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value.trim() ? value : '';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function featureList(record) {
  const raw = record && record.features;
  let list = [];
  if (Array.isArray(raw)) list = raw;
  else if (raw !== undefined && raw !== null) list = [raw];
  return list.map(asText).filter(Boolean);
}

function radioMark(on) {
  const mark = el('span', on ? 'radio-mark is-on' : 'radio-mark');
  mark.setAttribute('aria-hidden', 'true');
  return mark;
}

function sameId(a, b) {
  const x = asText(a);
  const y = asText(b);
  return Boolean(x) && Boolean(y) && x.toLowerCase() === y.toLowerCase();
}

function normalize(result) {
  const data = result && typeof result === 'object' ? result : {};
  const args = data.arguments && typeof data.arguments === 'object' ? data.arguments : {};
  const records = Array.isArray(data.records)
    ? data.records.filter((r) => r && typeof r === 'object')
    : [];
  return { args, records };
}

function buildPrompt(record, args) {
  const name = asText(record.name);
  const parts = [];
  const id = asText(record.id);
  if (id) parts.push(`flight option ${id}`);
  const fare = asText(args.fare_id);
  if (fare) parts.push(`fare ${fare}`);
  const ctx = asText(args.search_context_id);
  if (ctx) parts.push(`search context ${ctx}`);
  const rewards = asText(args.westjet_rewards_id);
  if (rewards) parts.push(`WestJet Rewards ID ${rewards}`);
  const label = name ? `Continue booking ${name} with WestJet` : 'Continue booking this flight option with WestJet';
  return parts.length ? `${label} (${parts.join(', ')})` : label;
}

let instance = 0;

function render(root, result, bridge) {
  instance += 1;
  const titleId = `westjet-handoff-title-${instance}`;
  const railId = `westjet-rail-title-${instance}`;
  const { args } = normalize(result);
  const knownArgs = {};
  ARG_KEYS.forEach((key) => {
    if (args[key] !== undefined && args[key] !== null) knownArgs[key] = args[key];
  });
  const { records } = normalize(result);
  const argMatch = records.findIndex((r) => sameId(r.id, knownArgs.flight_option_id));
  const state = { index: argMatch >= 0 ? argMatch : 0, picked: argMatch >= 0 };

  const wrap = el('div', 'booking-handoff');
  wrap.setAttribute('role', 'region');
  wrap.setAttribute('aria-labelledby', titleId);

  const head = el('header', 'handoff-head');
  const title = el('h1', 'handoff-title', 'Continue your booking with WestJet');
  title.id = titleId;
  head.append(title, el('p', 'handoff-sub', "You'll choose a fare, enter traveller details and confirm payment in WestJet's booking flow."));
  wrap.append(head);

  if (!records.length) {
    wrap.append(el('p', 'empty-state', "No flight option to continue. Tell me which flight you'd like to book."));
    root.replaceChildren(wrap);
    return;
  }

  const lead = el('section', 'selected-option');
  lead.setAttribute('aria-label', 'Selected flight option');
  const others = el('section', 'other-options');
  others.setAttribute('aria-labelledby', railId);
  const foot = el('footer', 'handoff-foot');
  const fine = el('p', 'fine-print', asText(knownArgs.fare_id)
    ? "Your chosen fare will be prefilled in WestJet's booking flow."
    : "No fare is selected yet. You'll pick one at WestJet.");
  const primary = el('button', 'button-primary');
  primary.type = 'button';
  foot.append(fine, primary);

  function fillBody(body, record, isLead) {
    const name = asText(record.name);
    const desc = asText(record.description);
    const features = featureList(record);
    if (isLead) {
      const top = el('div', 'option-top');
      if (name) top.append(el('h2', 'option-name', name));
      if (state.picked) top.append(el('span', 'badge-highlight', 'Selected'));
      if (top.childNodes.length) body.append(top);
      if (desc) body.append(el('p', 'option-desc', desc));
      if (features.length) {
        const ul = el('ul', 'feature-list');
        ul.setAttribute('aria-label', 'Features');
        features.forEach((f) => ul.append(el('li', 'badge', f)));
        body.append(ul);
      }
    } else {
      if (name) body.append(el('span', 'option-name', name));
      if (desc) body.append(el('span', 'option-desc', desc));
      if (features.length) {
        const list = el('span', 'feature-list');
        features.forEach((f) => list.append(el('span', 'badge', f)));
        body.append(list);
      }
      body.append(el('span', 'switch-hint', 'Switch to this option'));
    }
  }

  function update() {
    const current = records[state.index];
    lead.replaceChildren();
    const leadId = asText(current.id);
    if (leadId) lead.dataset.optionId = leadId;
    lead.append(radioMark(true));
    const leadBody = el('div', 'option-body');
    fillBody(leadBody, current, true);
    lead.append(leadBody);

    const rest = records.map((r, i) => ({ r, i })).filter((x) => x.i !== state.index);
    others.replaceChildren();
    others.hidden = rest.length === 0;
    if (rest.length) {
      const railHead = el('div', 'rail-head');
      const railTitle = el('h2', 'rail-title', 'Other flight options');
      railTitle.id = railId;
      railHead.append(railTitle, el('span', 'rail-count', `${rest.length} more`));
      const rail = el('ul', 'option-rail');
      rail.setAttribute('aria-label', 'Other flight options');
      rest.forEach(({ r, i }) => {
        const li = el('li');
        const card = el('button', 'option-card');
        card.type = 'button';
        card.setAttribute('aria-pressed', 'false');
        const cardId = asText(r.id);
        if (cardId) card.dataset.optionId = cardId;
        card.append(radioMark(false));
        const body = el('span', 'option-body');
        fillBody(body, r, false);
        card.append(body);
        card.addEventListener('click', () => {
          state.index = i;
          state.picked = true;
          update();
          primary.focus();
        });
        li.append(card);
        rail.append(li);
      });
      others.append(railHead, rail);
    }

    const name = asText(current.name);
    primary.textContent = name ? `Continue with ${name}` : 'Continue with this option';
    if (leadId) primary.dataset.optionId = leadId;
  }

  primary.addEventListener('click', () => {
    if (!bridge || !bridge.isConnected) return;
    bridge.sendMessage(buildPrompt(records[state.index], knownArgs));
  });

  update();
  wrap.append(lead, others, foot);
  root.replaceChildren(wrap);
}

export default async function decorate(block, bridge) {
  const connected = Boolean(bridge && bridge.isConnected);
  const preview = Boolean(connected && bridge.hostContext && bridge.hostContext.preview === true);

  if (connected) {
    const theme = bridge.hostContext && bridge.hostContext.theme;
    if (theme) block.dataset.theme = theme;
    if (typeof bridge.onContextChange === 'function') {
      bridge.onContextChange((ctx) => {
        if (ctx && ctx.theme) block.dataset.theme = ctx.theme;
      });
    }
  }

  let result = PREVIEW_RESULT;
  if (connected && !preview) {
    try {
      const toolResult = await bridge.toolResult;
      result = (toolResult && toolResult.structuredContent) || { arguments: {}, records: [] };
    } catch (e) {
      const wrap = el('div', 'booking-handoff');
      wrap.append(el('p', 'empty-state', "Couldn't load this flight option. Ask again in chat to retry."));
      block.replaceChildren(wrap);
      if (typeof bridge.autoResize === 'function') bridge.autoResize(block);
      return;
    }
  }

  render(block, result, bridge);
  if (connected && typeof bridge.autoResize === 'function') bridge.autoResize(block);
}
