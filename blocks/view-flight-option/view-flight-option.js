const PREVIEW_RESULT = {
  arguments: {
    search_context_id: 'srch-yyc-yyz-example',
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

const TITLE = 'Flight options from your search';
const BOOKING_NOTE = 'Choose your fare and enter traveller details in WestJet\'s booking flow.';
const EMPTY_TEXT = 'No flight options came back for this search. Ask in chat to search again.';
const LOADING_TEXT = 'Loading flight options';
const BOOK_LABEL = 'Continue to booking';
const BOOK_ERROR = 'Couldn\'t open booking. Try again or ask in chat.';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function hasText(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function connected(bridge) {
  return Boolean(bridge && bridge.isConnected);
}

let instance = 0;

function buildHeader(countText, titleId) {
  const header = el('header', 'options-header');
  const title = el('h2', 'options-title', TITLE);
  if (titleId) title.id = titleId;
  header.append(title);
  if (hasText(countText)) header.append(el('p', 'options-count', countText));
  return header;
}

function bookingPrompt(record, args) {
  const label = hasText(record.name) ? record.name : 'this flight option';
  const parts = [`flight_option_id: ${record.id}`];
  if (args && hasText(args.search_context_id)) {
    parts.push(`search_context_id: ${args.search_context_id}`);
  }
  return `${BOOK_LABEL} with ${label} (${parts.join(', ')})`;
}

function buildCard(record, args, bridge) {
  const card = el('li', 'option-card');
  if (hasText(record.id)) card.dataset.id = String(record.id);

  const body = el('div', 'option-body');
  if (hasText(record.name)) body.append(el('h3', 'option-name', record.name));
  if (hasText(record.description)) body.append(el('p', 'option-description', record.description));
  const features = Array.isArray(record.features) ? record.features.filter(hasText) : [];
  if (features.length) {
    const list = el('ul', 'feature-list');
    list.setAttribute('aria-label', 'Features');
    features.forEach((feature) => list.append(el('li', 'feature-badge', feature)));
    body.append(list);
  }
  card.append(body);

  if (hasText(record.id)) {
    const stub = el('div', 'option-stub');
    const button = el('button', 'book-button', BOOK_LABEL);
    button.type = 'button';
    button.dataset.flightOptionId = String(record.id);
    button.setAttribute('aria-label', hasText(record.name) ? `${BOOK_LABEL}: ${record.name}` : BOOK_LABEL);
    stub.append(button);
    const error = el('p', 'book-error', BOOK_ERROR);
    error.setAttribute('role', 'status');
    error.hidden = true;
    stub.append(error);
    button.addEventListener('click', async () => {
      if (!connected(bridge)) return;
      error.hidden = true;
      try {
        await bridge.sendMessage(bookingPrompt(record, args));
      } catch (e) {
        error.hidden = false;
      }
    });
    card.append(stub);
  }
  return card;
}

function render(block, result, bridge) {
  const records = Array.isArray(result?.records) ? result.records.filter((r) => r && typeof r === 'object') : [];
  const args = result?.arguments && typeof result.arguments === 'object' ? result.arguments : {};

  const section = el('section', 'flight-options');
  instance += 1;
  const titleId = `view-flight-option-title-${instance}`;
  section.setAttribute('aria-labelledby', titleId);

  if (!records.length) {
    section.append(buildHeader(EMPTY_TEXT, titleId));
    block.replaceChildren(section);
    return;
  }

  const count = `${records.length} ${records.length === 1 ? 'option' : 'options'}. ${BOOKING_NOTE}`;
  section.append(buildHeader(count, titleId));

  const track = el('ul', 'option-track');
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Flight options, scroll sideways for more');
  track.tabIndex = 0;
  records.forEach((record) => track.append(buildCard(record, args, bridge)));
  section.append(track);
  block.replaceChildren(section);
}

function applyTheme(block, context) {
  const theme = context?.theme;
  if (theme === 'light' || theme === 'dark') block.dataset.theme = theme;
}

export default async function decorate(block, bridge) {
  const live = connected(bridge) && bridge.hostContext?.preview !== true;
  if (connected(bridge)) {
    applyTheme(block, bridge.hostContext);
    if (typeof bridge.onContextChange === 'function') {
      bridge.onContextChange((context) => applyTheme(block, context));
    }
  }

  let result = PREVIEW_RESULT;
  if (live) {
    const loading = el('section', 'flight-options');
    loading.append(buildHeader(LOADING_TEXT));
    block.replaceChildren(loading);
    const toolResult = await bridge.toolResult;
    result = toolResult?.structuredContent || { records: [] };
  }

  render(block, result, bridge);
  if (connected(bridge) && typeof bridge.autoResize === 'function') bridge.autoResize(block);
}
