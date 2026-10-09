
// Encode/Decode Tool JavaScript
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const toolActions = document.getElementById('toolActions');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const swapBtn = document.getElementById('swapBtn');
const currentToolName = document.getElementById('currentToolName');
const toolItems = document.querySelectorAll('.tool-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchTools = document.getElementById('searchTools');
const searchToolsClear = document.getElementById('searchToolsClear');
const searchSuggestions = document.getElementById('searchSuggestions');
const inputOptions = document.getElementById('inputOptions');
const outputOptions = document.getElementById('outputOptions');

let currentTool = null;
let currentCategory = 'all';

// ---------- Per-tool action config ----------
// mode: 'both' (Encode + Decode buttons), 'encode' (single button running encode()),
// 'decode' (single button running decode())
const TOOL_CONFIG = {
  base64:            { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  base64url:         { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  base32:            { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  base58:            { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  base62:            { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  base85:            { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  base91:            { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  hex:               { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  binary:            { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  octal:             { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  decimal:           { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  hexdump:           { mode: 'encode', encode: 'Generate Dump' },
  urlencode:         { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  'urlencode-full':  { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  punycode:          { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  'quoted-printable':{ mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  uuencode:          { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  xxencode:          { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  'html-entity':     { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  'html-escape':     { mode: 'both',   encode: 'Escape',  decode: 'Unescape' },
  unicode:           { mode: 'both',   encode: 'Escape',  decode: 'Unescape' },
  'json-escape':     { mode: 'encode', encode: 'Escape' },
  jwt:               { mode: 'decode', decode: 'Decode' },
  saml:              { mode: 'decode', decode: 'Decode' },
  rot13:             { mode: 'encode', encode: 'Apply ROT13' },
  caesar:            { mode: 'both',   encode: 'Encrypt', decode: 'Decrypt' },
  atbash:            { mode: 'encode', encode: 'Apply Atbash' },
  morse:             { mode: 'both',   encode: 'Encode',  decode: 'Decode' },
  reverse:           { mode: 'encode', encode: 'Reverse' },
  'case-upper':      { mode: 'encode', encode: 'Convert' },
  'case-lower':      { mode: 'encode', encode: 'Convert' },
  'case-title':      { mode: 'encode', encode: 'Convert' },
  'base64-image':    { mode: 'decode', decode: 'Show Image' }
};
const DEFAULT_CONFIG = { mode: 'both', encode: 'Encode', decode: 'Decode' };

function getToolConfig(toolName) {
  return TOOL_CONFIG[toolName] || DEFAULT_CONFIG;
}

// Past-tense label for toasts/history, e.g. "Encode" -> "Encoded", "Generate Dump" -> "Generated Dump"
const PAST_TENSE = {
  Encode: 'Encoded', Decode: 'Decoded', Encrypt: 'Encrypted', Decrypt: 'Decrypted',
  Escape: 'Escaped', Unescape: 'Unescaped', Reverse: 'Reversed', Convert: 'Converted',
  Apply: 'Applied', Generate: 'Generated', Show: 'Displayed'
};
function pastTense(label) {
  const words = label.split(' ');
  words[0] = PAST_TENSE[words[0]] || (words[0] + 'ed');
  return words.join(' ');
}

// Apply a tool's button configuration to the UI
function applyToolButtons(toolName) {
  const config = getToolConfig(toolName);
  if (config.mode === 'both') {
    encodeBtn.hidden = false;
    decodeBtn.hidden = false;
    encodeBtn.textContent = config.encode + ' →';
    decodeBtn.textContent = '← ' + config.decode;
    toolActions.classList.remove('single-action');
  } else if (config.mode === 'encode') {
    encodeBtn.hidden = false;
    decodeBtn.hidden = true;
    encodeBtn.textContent = config.encode;
    toolActions.classList.add('single-action');
  } else {
    encodeBtn.hidden = true;
    decodeBtn.hidden = false;
    decodeBtn.textContent = config.decode;
    toolActions.classList.add('single-action');
  }
}

// Tool Selection
toolItems.forEach(item => {
  item.addEventListener('click', () => {
    const toolName = item.getAttribute('data-tool');
    selectTool(toolName);
    
    // Update active state
    toolItems.forEach(t => t.classList.remove('active'));
    item.classList.add('active');
    
    // Scroll to tool card
    document.querySelector('.tool-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Category Filter
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentCategory = btn.getAttribute('data-category');
    
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    filterTools();
  });
});

// Search Functionality
searchTools.addEventListener('input', (e) => {
  const term = e.target.value;
  filterTools(term.toLowerCase());
  renderSuggestions(term.trim());
  searchToolsClear.hidden = !term;
});
searchToolsClear.addEventListener('click', () => {
  searchTools.value = '';
  filterTools('');
  hideSuggestions();
  searchToolsClear.hidden = true;
  searchTools.focus();
});
searchTools.addEventListener('focus', () => renderSuggestions(searchTools.value.trim()));
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-box')) hideSuggestions();
});
searchTools.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { hideSuggestions(); searchTools.blur(); }
});

function hideSuggestions() {
  searchSuggestions.hidden = true;
  searchSuggestions.innerHTML = '';
}

function renderSuggestions(term) {
  if (!term) { hideSuggestions(); return; }
  const q = term.toLowerCase();
  const matches = Array.from(toolItems).filter(item => {
    const name = item.querySelector('h3').textContent.toLowerCase();
    const desc = item.querySelector('p').textContent.toLowerCase();
    return name.includes(q) || desc.includes(q);
  }).slice(0, 6);

  if (!matches.length) {
    searchSuggestions.innerHTML = '<div class="suggestion-empty">No matching tools</div>';
    searchSuggestions.hidden = false;
    return;
  }

  searchSuggestions.innerHTML = matches.map(item => {
    const icon = item.querySelector('.tool-icon').textContent;
    const name = item.querySelector('h3').textContent;
    const desc = item.querySelector('p').textContent;
    const tool = item.getAttribute('data-tool');
    return `<button type="button" class="suggestion-item" data-tool="${tool}">
      <span class="suggestion-icon">${icon}</span>
      <span class="suggestion-text"><span class="name">${name}</span><span class="desc">${desc}</span></span>
    </button>`;
  }).join('');
  searchSuggestions.hidden = false;
}

searchSuggestions.addEventListener('click', (e) => {
  const btn = e.target.closest('.suggestion-item');
  if (!btn) return;
  const toolName = btn.getAttribute('data-tool');
  const item = document.querySelector(`.tool-item[data-tool="${toolName}"]`);
  if (!item) return;
  selectTool(toolName);
  toolItems.forEach(t => t.classList.remove('active'));
  item.classList.add('active');
  searchTools.value = '';
  searchToolsClear.hidden = true;
  filterTools('');
  hideSuggestions();
  document.querySelector('.tool-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function filterTools(searchTerm = '') {
  toolItems.forEach(item => {
    const category = item.getAttribute('data-category');
    const toolName = item.querySelector('h3').textContent.toLowerCase();
    const toolDesc = item.querySelector('p').textContent.toLowerCase();
    
    const matchesCategory = currentCategory === 'all' || category === currentCategory;
    const matchesSearch = searchTerm === '' || 
                         toolName.includes(searchTerm) || 
                         toolDesc.includes(searchTerm);
    
    if (matchesCategory && matchesSearch) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

// Tool Selection Handler
function selectTool(toolName) {
  currentTool = toolName;
  currentToolName.textContent = getToolDisplayName(toolName);
  applyToolButtons(toolName);
  
  // Clear previous options
  inputOptions.innerHTML = '';
  outputOptions.innerHTML = '';
  
  // Add tool-specific options
  addToolOptions(toolName);
  
  // Clear inputs
  inputText.value = '';
  outputText.value = '';
}

function getToolDisplayName(toolName) {
  const names = {
    'base64': 'Base64 Encode/Decode',
    'base64url': 'Base64 URL Safe',
    'base32': 'Base32 Encode/Decode',
    'base58': 'Base58 Encode/Decode',
    'base62': 'Base62 Encode/Decode',
    'base85': 'Base85 / Ascii85',
    'base91': 'Base91 Encode/Decode',
    'hex': 'Text ⇄ Hexadecimal',
    'binary': 'Text ⇄ Binary',
    'octal': 'Text ⇄ Octal',
    'decimal': 'Text ⇄ Decimal (ASCII)',
    'hexdump': 'Hexdump Generator',
    'urlencode': 'URL Encode',
    'urlencode-full': 'URL Encode (Full)',
    'punycode': 'Punycode Encode/Decode',
    'quoted-printable': 'Quoted-Printable',
    'uuencode': 'UUEncode/Decode',
    'xxencode': 'XXEncode/Decode',
    'html-entity': 'HTML Entity Encode/Decode',
    'html-escape': 'HTML Escape/Unescape',
    'unicode': 'Unicode Escape',
    'json-escape': 'JSON Escape',
    'jwt': 'JWT Decode',
    'saml': 'SAML Decode',
    'rot13': 'ROT13 Cipher',
    'caesar': 'Caesar Cipher',
    'atbash': 'Atbash Cipher',
    'morse': 'Morse Code',
    'reverse': 'Reverse Text',
    'case-upper': 'Convert to UPPERCASE',
    'case-lower': 'Convert to lowercase',
    'case-title': 'Convert to Title Case',
    'base64-image': 'Image ⇄ Base64'
  };
  return names[toolName] || 'Unknown Tool';
}

function addToolOptions(toolName) {
  if (toolName === 'caesar') {
    inputOptions.innerHTML = `
      <div class="tool-option">
        <label>Shift amount:</label>
        <input type="number" id="caesarShift" value="13" min="1" max="25" />
      </div>
    `;
  } else if (toolName === 'base64-image') {
    inputOptions.innerHTML = `
      <div class="file-upload-area" id="imageUploadArea">
        <input type="file" id="imageInput" accept="image/*" />
        <div class="upload-icon">📁</div>
        <div class="upload-text">Click to upload or drag & drop</div>
        <div class="upload-hint">Supports: JPG, PNG, GIF, WebP</div>
      </div>
      <img id="imagePreview" class="image-preview" />
    `;
    
    const uploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    
    uploadArea.addEventListener('click', () => imageInput.click());
    
    imageInput.addEventListener('change', (e) => {
      handleImageUpload(e.target.files[0]);
    });
    
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      handleImageUpload(e.dataTransfer.files[0]);
    });
  }
}

function handleImageUpload(file) {
  if (!file || !file.type.startsWith('image/')) {
    showMessage('Please upload a valid image file', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    inputText.value = base64;
    
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = base64;
    imagePreview.classList.add('show');
    
    showMessage('Image uploaded successfully!', 'success');
  };
  reader.readAsDataURL(file);
}

// Encode Button
encodeBtn.addEventListener('click', () => {
  if (!currentTool) {
    showMessage('Please select a tool first', 'error');
    return;
  }
  
  const input = inputText.value;
  if (!input) {
    showMessage('Please enter some text', 'error');
    return;
  }
  
  const label = getToolConfig(currentTool).encode;
  try {
    const result = encode(currentTool, input);
    outputText.value = result;
    showMessage(pastTense(label) + '!', 'success');
    saveEncHistory(label, input, result);
  } catch (err) {
    outputText.value = '';
    showMessage(label + ' error: ' + err.message, 'error');
  }
});

// Decode Button
decodeBtn.addEventListener('click', () => {
  if (!currentTool) {
    showMessage('Please select a tool first', 'error');
    return;
  }
  
  const input = inputText.value;
  if (!input) {
    showMessage('Please enter some text', 'error');
    return;
  }
  
  const label = getToolConfig(currentTool).decode;
  try {
    const result = decode(currentTool, input);
    outputText.value = result;
    showMessage(pastTense(label) + '!', 'success');
    saveEncHistory(label, input, result);
  } catch (err) {
    outputText.value = '';
    showMessage(label + ' error: ' + err.message, 'error');
  }
});

// Swap Button
swapBtn.addEventListener('click', () => {
  const temp = inputText.value;
  inputText.value = outputText.value;
  outputText.value = temp;
  if (navigator.vibrate) navigator.vibrate(15);
});

// Copy Button
copyBtn.addEventListener('click', async () => {
  if (!outputText.value) {
    showMessage('Nothing to copy', 'error');
    return;
  }
  const ok = await copyToClipboard(outputText.value);
  if (ok) {
    if (navigator.vibrate) navigator.vibrate(20);
    copyBtn.classList.add('is-copied');
    clearTimeout(copyBtn._t);
    copyBtn._t = setTimeout(() => copyBtn.classList.remove('is-copied'), 1500);
    showMessage('Copied to clipboard!', 'success');
  } else {
    showMessage("Couldn't copy — select the text manually", 'error');
  }
});

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) { /* fall through */ }
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  ta.remove();
  return ok;
}

// Download Button — saves the output as a .txt file
downloadBtn.addEventListener('click', () => {
  if (!outputText.value) {
    showMessage('Nothing to download', 'error');
    return;
  }
  const blob = new Blob([outputText.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = (currentTool || 'output').replace(/[^a-z0-9]+/gi, '-');
  a.href = url;
  a.download = `${slug}-output.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showMessage('Download started', 'success');
});

// Clear Button
clearBtn.addEventListener('click', () => {
  inputText.value = '';
  outputText.value = '';
  showMessage('Cleared!', 'success');
});

// ---------- Toast (top-right) ----------
const toastStack = document.getElementById('toastStack');
const TOAST_ICONS = {
  success: '<svg viewBox="0 -960 960 960"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',
  error: '<svg viewBox="0 -960 960 960"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
  info: '<svg viewBox="0 -960 960 960"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>'
};
function showMessage(text, type = 'success') {
  const el = document.createElement('div');
  el.className = `enc-toast ${type}`;
  el.innerHTML = `${TOAST_ICONS[type] || TOAST_ICONS.info}<span>${escapeHtml(text)}</span>`;
  toastStack.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, 2400);
}
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---------- History ----------
const ENC_HISTORY_KEY = 'encryptHistory';
const ENC_HISTORY_LIMIT = 50;
const historyToggle = document.getElementById('historyToggle');
const historyModal = document.getElementById('historyModal');
const closeHistoryModal = document.getElementById('closeHistoryModal');
const encHistoryList = document.getElementById('encHistoryList');
const clearEncHistory = document.getElementById('clearEncHistory');

function readEncHistory() {
  try {
    const v = JSON.parse(localStorage.getItem(ENC_HISTORY_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch (e) { return []; }
}
function writeEncHistory(list) {
  try { localStorage.setItem(ENC_HISTORY_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
}
function truncate(text, max) {
  const t = String(text == null ? '' : text);
  return t.length > max ? t.slice(0, max) + '…' : t;
}
function saveEncHistory(action, input, output) {
  if (!currentTool) return;
  const MAX_STORE = 20000; // keep localStorage usage sane for very large inputs (e.g. images)
  const list = readEncHistory();
  list.push({
    tool: currentTool,
    toolLabel: getToolDisplayName(currentTool),
    action,
    input: truncate(input, MAX_STORE),
    output: truncate(output, MAX_STORE),
    time: Date.now()
  });
  while (list.length > ENC_HISTORY_LIMIT) list.shift();
  writeEncHistory(list);
}
function relativeTime(ts) {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 45) return 'Just now';
  if (seconds < 3600) return Math.max(1, Math.round(seconds / 60)) + ' min ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + ' h ago';
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function renderEncHistory() {
  const list = readEncHistory();
  clearEncHistory.disabled = list.length === 0;
  if (!list.length) {
    encHistoryList.innerHTML = '<div class="enc-history-empty">No history yet — encode or decode something first.</div>';
    return;
  }
  encHistoryList.innerHTML = list.map((it, i) => `
    <div class="enc-history-item">
      <div class="enc-history-top">
        <span class="enc-history-tool">${escapeHtml(it.toolLabel)}</span>
        <span class="enc-history-action">${escapeHtml(it.action)}</span>
        <span class="enc-history-time">${escapeHtml(relativeTime(it.time))}</span>
        <div class="enc-history-actions">
          <button type="button" data-act="restore" data-i="${i}" title="Restore" aria-label="Restore">
            <svg viewBox="0 -960 960 960"><path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Z"/></svg>
          </button>
          <button type="button" data-act="copy" data-i="${i}" title="Copy output" aria-label="Copy output">
            <svg viewBox="0 -960 960 960"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
          </button>
          <button type="button" class="danger" data-act="delete" data-i="${i}" title="Delete" aria-label="Delete">
            <svg viewBox="0 -960 960 960"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>
          </button>
        </div>
      </div>
      <div class="enc-history-row"><span class="k">In</span><span class="v">${escapeHtml(truncate(it.input, 90))}</span></div>
      <div class="enc-history-row"><span class="k">Out</span><span class="v">${escapeHtml(truncate(it.output, 90))}</span></div>
    </div>
  `).reverse().join('');
}

function openHistoryModal() {
  renderEncHistory();
  historyModal.classList.add('active');
  document.body.classList.add('modal-open');
}
function closeHistoryModalFn() {
  historyModal.classList.remove('active');
  document.body.classList.remove('modal-open');
}
historyToggle.addEventListener('click', openHistoryModal);
closeHistoryModal.addEventListener('click', closeHistoryModalFn);
historyModal.addEventListener('click', (e) => { if (e.target === historyModal) closeHistoryModalFn(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && historyModal.classList.contains('active') && !document.getElementById('confirmModal').classList.contains('show')) closeHistoryModalFn();
});

encHistoryList.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const list = readEncHistory();
  const index = list.length - 1 - Number(btn.dataset.i); // list is rendered reversed
  const item = list[index];
  if (!item) return;

  if (btn.dataset.act === 'copy') {
    const ok = await copyToClipboard(item.output);
    if (navigator.vibrate) navigator.vibrate(20);
    showMessage(ok ? 'Copied to clipboard!' : "Couldn't copy", ok ? 'success' : 'error');
  } else if (btn.dataset.act === 'delete') {
    list.splice(index, 1);
    writeEncHistory(list);
    renderEncHistory();
  } else if (btn.dataset.act === 'restore') {
    const toolItem = document.querySelector(`.tool-item[data-tool="${item.tool}"]`);
    if (toolItem) {
      selectTool(item.tool);
      toolItems.forEach(t => t.classList.remove('active'));
      toolItem.classList.add('active');
    }
    inputText.value = item.input;
    outputText.value = item.output;
    closeHistoryModalFn();
    document.querySelector('.tool-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showMessage('Restored from history', 'success');
  }
});

clearEncHistory.addEventListener('click', () => {
  if (clearEncHistory.disabled) return;
  showEncConfirm('Clear all history?', 'This will delete all saved encode/decode history. This action cannot be undone.', () => {
    writeEncHistory([]);
    renderEncHistory();
  });
});

// ---------- Confirm modal (shared .confirm-modal styles from style.css) ----------
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmTitleEl = confirmModal.querySelector('.confirm-title');
const cancelClearHistory = document.getElementById('cancelClearHistory');
const confirmClearHistory = document.getElementById('confirmClearHistory');
let pendingConfirmAction = null;

function showEncConfirm(title, message, onConfirm) {
  confirmTitleEl.textContent = title;
  confirmMessage.textContent = message;
  pendingConfirmAction = onConfirm;
  confirmModal.classList.add('show');
}
function hideEncConfirm() {
  confirmModal.classList.remove('show');
  pendingConfirmAction = null;
}
cancelClearHistory.addEventListener('click', hideEncConfirm);
confirmClearHistory.addEventListener('click', () => {
  const action = pendingConfirmAction;
  hideEncConfirm();
  if (action) action();
});
confirmModal.addEventListener('click', (e) => { if (e.target === confirmModal) hideEncConfirm(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && confirmModal.classList.contains('show')) hideEncConfirm();
});


// ENCODING/DECODING FUNCTIONS
function encode(tool, input) {
  switch(tool) {
    // Base Encodings
    case 'base64':
      return btoa(unescape(encodeURIComponent(input)));
    
    case 'base64url':
      return btoa(unescape(encodeURIComponent(input)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    
    case 'base32':
      return base32Encode(input);
    
    case 'base58':
      return base58Encode(input);
    
    case 'base62':
      return base62Encode(input);
    
    case 'base85':
      return ascii85Encode(input);
    
    case 'base91':
      return base91Encode(input);
    
    // ASCII & Numbers
    case 'hex':
      return textToHex(input);
    
    case 'binary':
      return textToBinary(input);
    
    case 'octal':
      return textToOctal(input);
    
    case 'decimal':
      return textToDecimal(input);
    
    case 'hexdump':
      return hexdump(input);
    
    // URL & Network
    case 'urlencode':
      return encodeURIComponent(input);
    
    case 'urlencode-full':
      return encodeURIComponent(input).replace(/[!'()*]/g, c => 
        '%' + c.charCodeAt(0).toString(16).toUpperCase()
      );
    
    case 'punycode':
      return punycodeEncode(input);
    
    case 'quoted-printable':
      return quotedPrintableEncode(input);
    
    case 'uuencode':
      return uuencode(input);
    
    case 'xxencode':
      return xxencode(input);
    
    // Data Format
    case 'html-entity':
      return htmlEntityEncode(input);
    
    case 'html-escape':
      return htmlEscape(input);
    
    case 'unicode':
      return unicodeEscape(input);
    
    case 'json-escape':
      return JSON.stringify(input).slice(1, -1);
    
    // Ciphers
    case 'rot13':
      return rot13(input);
    
    case 'caesar':
      const shift = parseInt(document.getElementById('caesarShift')?.value || 13);
      return caesarCipher(input, shift);
    
    case 'atbash':
      return atbash(input);
    
    case 'morse':
      return textToMorse(input);
    
    // Utilities
    case 'reverse':
      return input.split('').reverse().join('');
    
    case 'case-upper':
      return input.toUpperCase();
    
    case 'case-lower':
      return input.toLowerCase();
    
    case 'case-title':
      return input.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    
    default:
      throw new Error('Tool not implemented yet');
  }
}

function decode(tool, input) {
  switch(tool) {
    // Base Encodings
    case 'base64':
    case 'base64url':
      let b64 = input.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      return decodeURIComponent(escape(atob(b64)));
    
    case 'base32':
      return base32Decode(input);
    
    case 'base58':
      return base58Decode(input);
    
    case 'base62':
      return base62Decode(input);
    
    case 'base85':
      return ascii85Decode(input);
    
    case 'base91':
      return base91Decode(input);
    
    // ASCII & Numbers
    case 'hex':
      return hexToText(input);
    
    case 'binary':
      return binaryToText(input);
    
    case 'octal':
      return octalToText(input);
    
    case 'decimal':
      return decimalToText(input);
    
    // URL & Network
    case 'urlencode':
    case 'urlencode-full':
      return decodeURIComponent(input);
    
    case 'punycode':
      return punycodeDecode(input);
    
    case 'quoted-printable':
      return quotedPrintableDecode(input);
    
    case 'uuencode':
      return uudecode(input);
    
    case 'xxencode':
      return xxdecode(input);
    
    // Data Format
    case 'html-entity':
      return htmlEntityDecode(input);
    
    case 'html-escape':
      return htmlUnescape(input);
    
    case 'unicode':
      return unicodeUnescape(input);
    
    case 'jwt':
      return jwtDecode(input);
    
    case 'saml':
      return samlDecode(input);
    
    // Ciphers (most are bidirectional)
    case 'rot13':
      return rot13(input);
    
    case 'caesar':
      const shift = parseInt(document.getElementById('caesarShift')?.value || 13);
      return caesarCipher(input, -shift);
    
    case 'atbash':
      return atbash(input);
    
    case 'morse':
      return morseToText(input);
    
    // Image Base64
    case 'base64-image':
      const imagePreview = document.getElementById('imagePreview');
      if (imagePreview) {
        imagePreview.src = input;
        imagePreview.classList.add('show');
      }
      return 'Image displayed above';
    
    default:
      throw new Error('Decode not implemented for this tool');
  }
}

// HELPER FUNCTIONS - BASE ENCODINGS
function base32Encode(input) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (let i = 0; i < input.length; i++) {
    bits += input.charCodeAt(i).toString(2).padStart(8, '0');
  }
  
  let result = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substr(i, 5).padEnd(5, '0');
    result += alphabet[parseInt(chunk, 2)];
  }
  
  while (result.length % 8 !== 0) result += '=';
  return result;
}

function base32Decode(input) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  input = input.replace(/=/g, '');
  let bits = '';
  
  for (let i = 0; i < input.length; i++) {
    const val = alphabet.indexOf(input[i].toUpperCase());
    if (val === -1) throw new Error('Invalid Base32 character');
    bits += val.toString(2).padStart(5, '0');
  }
  
  let result = '';
  for (let i = 0; i < bits.length; i += 8) {
    if (bits.substr(i, 8).length === 8) {
      result += String.fromCharCode(parseInt(bits.substr(i, 8), 2));
    }
  }
  return result;
}

function base58Encode(input) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = BigInt(0);
  
  for (let i = 0; i < input.length; i++) {
    num = num * BigInt(256) + BigInt(input.charCodeAt(i));
  }
  
  let result = '';
  while (num > 0) {
    result = alphabet[Number(num % BigInt(58))] + result;
    num = num / BigInt(58);
  }
  
  // Handle leading zeros
  for (let i = 0; i < input.length && input.charCodeAt(i) === 0; i++) {
    result = '1' + result;
  }
  
  return result || '1';
}

function base58Decode(input) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = BigInt(0);
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const val = alphabet.indexOf(char);
    if (val === -1) throw new Error('Invalid Base58 character');
    num = num * BigInt(58) + BigInt(val);
  }
  
  let result = '';
  while (num > 0) {
    result = String.fromCharCode(Number(num % BigInt(256))) + result;
    num = num / BigInt(256);
  }
  
  // Handle leading '1's
for (let i = 0; i < input.length && input[i] === '1'; i++) {
    result = '\x00' + result;
  }
  
  return result;
}

function base62Encode(input) {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let num = BigInt(0);
  
  for (let i = 0; i < input.length; i++) {
    num = num * BigInt(256) + BigInt(input.charCodeAt(i));
  }
  
  if (num === BigInt(0)) return '0';
  
  let result = '';
  while (num > 0) {
    result = alphabet[Number(num % BigInt(62))] + result;
    num = num / BigInt(62);
  }
  
  return result;
}

function base62Decode(input) {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let num = BigInt(0);
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const val = alphabet.indexOf(char);
    if (val === -1) throw new Error('Invalid Base62 character');
    num = num * BigInt(62) + BigInt(val);
  }
  
  if (num === BigInt(0)) return '\x00';
  
  let result = '';
  while (num > 0) {
    result = String.fromCharCode(Number(num % BigInt(256))) + result;
    num = num / BigInt(256);
  }
  
  return result;
}

function ascii85Encode(input) {
  let result = '';
  let padding = (4 - (input.length % 4)) % 4;
  input += '\x00'.repeat(padding);
  
  for (let i = 0; i < input.length; i += 4) {
    let value = 0;
    for (let j = 0; j < 4; j++) {
      value = value * 256 + input.charCodeAt(i + j);
    }
    
    if (value === 0) {
      result += 'z';
    } else {
      let encoded = '';
      for (let j = 0; j < 5; j++) {
        encoded = String.fromCharCode(33 + (value % 85)) + encoded;
        value = Math.floor(value / 85);
      }
      result += encoded;
    }
  }
  
  return '<~' + result.slice(0, result.length - padding) + '~>';
}

function ascii85Decode(input) {
  input = input.replace(/^<~|~>$/g, '').replace(/\s/g, '');
  let result = '';
  
  for (let i = 0; i < input.length;) {
    if (input[i] === 'z') {
      result += '\x00\x00\x00\x00';
      i++;
      continue;
    }
    
    let value = 0;
    let count = 0;
    for (let j = 0; j < 5 && i < input.length; j++, i++) {
      value = value * 85 + (input.charCodeAt(i) - 33);
      count++;
    }
    
    for (let j = count; j < 5; j++) {
      value = value * 85 + 84;
    }
    
    for (let j = 3; j >= 0; j--) {
      if (j < count - 1) {
        result += String.fromCharCode((value >> (j * 8)) & 0xFF);
      }
    }
  }
  
  return result;
}

function base91Encode(input) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';
  let result = '';
  let ebq = 0;
  let en = 0;
  
  for (let i = 0; i < input.length; i++) {
    const byte = input.charCodeAt(i);
    ebq |= byte << en;
    en += 8;
    
    if (en > 13) {
      let ev = ebq & 8191;
      
      if (ev > 88) {
        ebq >>= 13;
        en -= 13;
      } else {
        ev = ebq & 16383;
        ebq >>= 14;
        en -= 14;
      }
      
      result += alphabet[ev % 91] + alphabet[Math.floor(ev / 91)];
    }
  }
  
  if (en > 0) {
    result += alphabet[ebq % 91];
    if (en > 7 || ebq > 90) {
      result += alphabet[Math.floor(ebq / 91)];
    }
  }
  
  return result;
}

function base91Decode(input) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';
  let result = '';
  let dbq = 0;
  let dn = 0;
  let dv = -1;
  
  for (let i = 0; i < input.length; i++) {
    const c = alphabet.indexOf(input[i]);
    if (c === -1) continue;
    
    if (dv === -1) {
      dv = c;
    } else {
      dv += c * 91;
      dbq |= dv << dn;
      dn += (dv & 8191) > 88 ? 13 : 14;
      
      do {
        result += String.fromCharCode(dbq & 0xFF);
        dbq >>= 8;
        dn -= 8;
      } while (dn > 7);
      
      dv = -1;
    }
  }
  
  if (dv !== -1) {
    result += String.fromCharCode((dbq | dv << dn) & 0xFF);
  }
  
  return result;
}

// HELPER FUNCTIONS - ASCII & NUMBERS
function textToHex(input) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += input.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return result;
}

function hexToText(input) {
  input = input.replace(/\s/g, '');
  let result = '';
  for (let i = 0; i < input.length; i += 2) {
    result += String.fromCharCode(parseInt(input.substr(i, 2), 16));
  }
  return result;
}

function textToBinary(input) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += input.charCodeAt(i).toString(2).padStart(8, '0') + ' ';
  }
  return result.trim();
}

function binaryToText(input) {
  const bytes = input.replace(/\s/g, '').match(/.{1,8}/g);
  if (!bytes) throw new Error('Invalid binary format');
  
  let result = '';
  for (let byte of bytes) {
    result += String.fromCharCode(parseInt(byte, 2));
  }
  return result;
}

function textToOctal(input) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += input.charCodeAt(i).toString(8).padStart(3, '0') + ' ';
  }
  return result.trim();
}

function octalToText(input) {
  const octals = input.trim().split(/\s+/);
  let result = '';
  for (let oct of octals) {
    result += String.fromCharCode(parseInt(oct, 8));
  }
  return result;
}

function textToDecimal(input) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += input.charCodeAt(i) + ' ';
  }
  return result.trim();
}

function decimalToText(input) {
  const decimals = input.trim().split(/\s+/);
  let result = '';
  for (let dec of decimals) {
    result += String.fromCharCode(parseInt(dec, 10));
  }
  return result;
}

function hexdump(input) {
  let result = '';
  for (let i = 0; i < input.length; i += 16) {
    const offset = i.toString(16).padStart(8, '0');
    let hexPart = '';
    let asciiPart = '';
    
    for (let j = 0; j < 16; j++) {
      if (i + j < input.length) {
        const byte = input.charCodeAt(i + j);
        hexPart += byte.toString(16).padStart(2, '0') + ' ';
        asciiPart += (byte >= 32 && byte <= 126) ? input[i + j] : '.';
      } else {
        hexPart += '   ';
        asciiPart += ' ';
      }
      
      if (j === 7) hexPart += ' ';
    }
    
    result += `${offset}  ${hexPart} |${asciiPart}|\n`;
  }
  return result;
}

// HELPER FUNCTIONS - URL & NETWORK
function punycodeEncode(input) {
  try {
    // Simple punycode implementation for domain names
    if (!/[^\x00-\x7F]/.test(input)) return input;
    
    const parts = input.split('.');
    return parts.map(part => {
      if (!/[^\x00-\x7F]/.test(part)) return part;
      
      let output = 'xn--';
      const basic = part.replace(/[^\x00-\x7F]/g, '');
      if (basic) output += basic + '-';
      
      const nonBasic = [...part].filter(c => c.charCodeAt(0) > 127);
      const codes = nonBasic.map(c => c.charCodeAt(0)).sort((a, b) => a - b);
      
      let bias = 72;
      let delta = 0;
      let n = 128;
      let h = basic.length;
      
      for (let code of codes) {
        delta += (code - n) * (h + 1);
        n = code;
        
        let q = delta;
        for (let k = 36; ; k += 36) {
          const t = k <= bias ? 1 : k >= bias + 26 ? 26 : k - bias;
          if (q < t) break;
          
          const digit = t + ((q - t) % (36 - t));
          output += digit < 26 ? String.fromCharCode(97 + digit) : String.fromCharCode(22 + digit);
          q = Math.floor((q - t) / (36 - t));
        }
        
        output += q < 26 ? String.fromCharCode(97 + q) : String.fromCharCode(22 + q);
        h++;
      }
      
      return output;
    }).join('.');
  } catch (e) {
    throw new Error('Punycode encoding failed');
  }
}

function punycodeDecode(input) {
  try {
    const parts = input.split('.');
    return parts.map(part => {
      if (!part.startsWith('xn--')) return part;
      
      part = part.slice(4);
      const delimiterPos = part.lastIndexOf('-');
      
      let output = delimiterPos > 0 ? part.slice(0, delimiterPos) : '';
      const encoded = delimiterPos >= 0 ? part.slice(delimiterPos + 1) : part;
      
      let n = 128;
      let i = 0;
      let bias = 72;
      
      for (let j = 0; j < encoded.length;) {
        const oldi = i;
        let w = 1;
        
        for (let k = 36; ; k += 36) {
          const digit = encoded.charCodeAt(j++) - 22;
          const t = k <= bias ? 1 : k >= bias + 26 ? 26 : k - bias;
          
          if (digit < t) {
            i += digit * w;
            break;
          }
          
          w *= 36 - t;
        }
        
        const length = output.length + 1;
        bias = Math.floor((i - oldi) / length);
        n += Math.floor(i / length);
        i %= length;
        
        output = output.slice(0, i) + String.fromCharCode(n) + output.slice(i);
        i++;
      }
      
      return output;
    }).join('.');
  } catch (e) {
    throw new Error('Punycode decoding failed');
  }
}

function quotedPrintableEncode(input) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const code = char.charCodeAt(0);
    
    if (code === 32) {
      result += char;
    } else if ((code >= 33 && code <= 60) || (code >= 62 && code <= 126)) {
      result += char;
    } else {
      result += '=' + code.toString(16).toUpperCase().padStart(2, '0');
    }
    
    if ((i + 1) % 76 === 0) result += '=\r\n';
  }
  return result;
}

function quotedPrintableDecode(input) {
  return input
    .replace(/=\r?\n/g, '')
    .replace(/=([0-9A-F]{2})/gi, (match, hex) => 
      String.fromCharCode(parseInt(hex, 16))
    );
}

function uuencode(input) {
  let result = 'begin 644 file.txt\n';
  
  for (let i = 0; i < input.length; i += 45) {
    const chunk = input.slice(i, i + 45);
    const len = chunk.length;
    result += String.fromCharCode(32 + len);
    
    for (let j = 0; j < len; j += 3) {
      const b1 = chunk.charCodeAt(j) || 0;
      const b2 = chunk.charCodeAt(j + 1) || 0;
      const b3 = chunk.charCodeAt(j + 2) || 0;
      
      result += String.fromCharCode(32 + ((b1 >> 2) & 0x3F));
      result += String.fromCharCode(32 + (((b1 << 4) | (b2 >> 4)) & 0x3F));
      result += String.fromCharCode(32 + (((b2 << 2) | (b3 >> 6)) & 0x3F));
      result += String.fromCharCode(32 + (b3 & 0x3F));
    }
    result += '\n';
  }
  
  result += '`\nend\n';
  return result;
}

function uudecode(input) {
  const lines = input.split('\n').filter(line => 
    line && !line.startsWith('begin') && !line.startsWith('end')
  );
  
  let result = '';
  for (let line of lines) {
    if (!line || line === '`') continue;
    
    const len = line.charCodeAt(0) - 32;
    line = line.slice(1);
    
    for (let i = 0; i < line.length; i += 4) {
      const c1 = (line.charCodeAt(i) - 32) & 0x3F;
      const c2 = (line.charCodeAt(i + 1) - 32) & 0x3F;
      const c3 = (line.charCodeAt(i + 2) - 32) & 0x3F;
      const c4 = (line.charCodeAt(i + 3) - 32) & 0x3F;
      
      result += String.fromCharCode((c1 << 2) | (c2 >> 4));
      if (result.length < len) result += String.fromCharCode(((c2 << 4) | (c3 >> 2)) & 0xFF);
      if (result.length < len) result += String.fromCharCode(((c3 << 6) | c4) & 0xFF);
    }
  }
  
  return result;
}

function xxencode(input) {
  const alphabet = '+-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = 'begin 644 file.txt\n';
  
  for (let i = 0; i < input.length; i += 45) {
    const chunk = input.slice(i, i + 45);
    const len = chunk.length;
    result += alphabet[len];
    
    for (let j = 0; j < len; j += 3) {
      const b1 = chunk.charCodeAt(j) || 0;
      const b2 = chunk.charCodeAt(j + 1) || 0;
      const b3 = chunk.charCodeAt(j + 2) || 0;
      
      result += alphabet[(b1 >> 2) & 0x3F];
      result += alphabet[((b1 << 4) | (b2 >> 4)) & 0x3F];
      result += alphabet[((b2 << 2) | (b3 >> 6)) & 0x3F];
      result += alphabet[b3 & 0x3F];
    }
    result += '\n';
  }
  
  result += alphabet[0] + '\nend\n';
  return result;
}

function xxdecode(input) {
  const alphabet = '+-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const lines = input.split('\n').filter(line => 
    line && !line.startsWith('begin') && !line.startsWith('end')
  );
  
  let result = '';
  for (let line of lines) {
    if (!line) continue;
    
    const len = alphabet.indexOf(line[0]);
    if (len === -1) continue;
    
    line = line.slice(1);
    
    for (let i = 0; i < line.length; i += 4) {
      const c1 = alphabet.indexOf(line[i]);
      const c2 = alphabet.indexOf(line[i + 1]);
      const c3 = alphabet.indexOf(line[i + 2]);
      const c4 = alphabet.indexOf(line[i + 3]);
      
      if (c1 === -1 || c2 === -1) break;
      
      result += String.fromCharCode((c1 << 2) | (c2 >> 4));
      if (c3 !== -1 && result.length < len) {
        result += String.fromCharCode(((c2 << 4) | (c3 >> 2)) & 0xFF);
      }
      if (c4 !== -1 && result.length < len) {
        result += String.fromCharCode(((c3 << 6) | c4) & 0xFF);
      }
    }
  }
  
  return result;
}

// HELPER FUNCTIONS - DATA FORMAT
function htmlEntityEncode(input) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return input.replace(/[&<>"']/g, char => entities[char] || char);
}

function htmlEntityDecode(input) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = input;
  return textarea.value;
}

function htmlEscape(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function htmlUnescape(input) {
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function unicodeEscape(input) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code > 127) {
      result += '\\u' + code.toString(16).padStart(4, '0');
    } else {
      result += input[i];
    }
  }
  return result;
}

function unicodeUnescape(input) {
  return input.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => 
    String.fromCharCode(parseInt(hex, 16))
  );
}

function jwtDecode(input) {
  try {
    const parts = input.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    return JSON.stringify({ header, payload }, null, 2);
  } catch (e) {
    throw new Error('JWT decoding failed: ' + e.message);
  }
}

function samlDecode(input) {
  try {
    // SAML is typically base64 encoded and URL encoded
    let decoded = decodeURIComponent(input);
    decoded = atob(decoded);
    return decoded;
  } catch (e) {
    // Try direct base64 decode
    try {
      return atob(input);
    } catch (e2) {
      throw new Error('SAML decoding failed');
    }
  }
}

// HELPER FUNCTIONS - CIPHERS
function rot13(input) {
  return input.replace(/[a-zA-Z]/g, char => {
    const start = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(start + (char.charCodeAt(0) - start + 13) % 26);
  });
}

function caesarCipher(input, shift) {
  shift = ((shift % 26) + 26) % 26;
  
  return input.replace(/[a-zA-Z]/g, char => {
    const start = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(start + (char.charCodeAt(0) - start + shift) % 26);
  });
}

function atbash(input) {
  return input.replace(/[a-zA-Z]/g, char => {
    if (char <= 'Z') {
      return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
    } else {
      return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
    }
  });
}

function textToMorse(input) {
  const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/'
  };
  
  return input.toUpperCase().split('').map(char => 
    morseCode[char] || char
  ).join(' ');
}

function morseToText(input) {
  const morseCode = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
    '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
    '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
    '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
    '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
    '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
    '---..': '8', '----.': '9', '/': ' '
  };
  
  return input.split(' ').map(code => 
    morseCode[code] || code
  ).join('');
}

// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

// Auto-select Base64 on load
setTimeout(() => {
  const base64Tool = document.querySelector('[data-tool="base64"]');
  if (base64Tool) {
    base64Tool.click();
  }
}, 100);
