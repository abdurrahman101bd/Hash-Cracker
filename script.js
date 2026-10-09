// ---------- Shared helpers ----------
const ICONS = {
    copy: '<svg class="i-copy" viewBox="0 -960 960 960" aria-hidden="true"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg><svg class="i-check" viewBox="0 -960 960 960" aria-hidden="true"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',
    trash: '<svg viewBox="0 -960 960 960" aria-hidden="true"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>',
    history: '<svg viewBox="0 -960 960 960" aria-hidden="true"><path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/></svg>'
};

let toastTimer;
function showToast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) { /* fall through to the fallback */ }
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

function flashCopied(btn, ok) {
    if (!ok) {
        showToast("Couldn't copy. Select the text and copy it manually.");
        return;
    }
    if (navigator.vibrate) navigator.vibrate(20);
    const label = btn.querySelector('.copy-label');
    if (label && !btn.dataset.label) btn.dataset.label = label.textContent;
    btn.classList.add('is-copied');
    if (label) label.textContent = 'Copied';
    clearTimeout(btn._copyTimer);
    btn._copyTimer = setTimeout(() => {
        btn.classList.remove('is-copied');
        if (label) label.textContent = btn.dataset.label;
    }, 1500);
}

function escapeAttr(text) {
    return escapeHtml(String(text)).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Tab Switching
const tabBtns = document.querySelectorAll('.tab-btn');
const generateTab = document.getElementById('generateTab');
const verifyTab = document.getElementById('verifyTab');
const analyzeTab = document.getElementById('analyzeTab');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.tab === 'generate') {
            generateTab.classList.add('active');
            verifyTab.classList.remove('active');
            analyzeTab.classList.remove('active');
        } else if (btn.dataset.tab === 'verify') {
            verifyTab.classList.add('active');
            generateTab.classList.remove('active');
            analyzeTab.classList.remove('active');
        } else {
            analyzeTab.classList.add('active');
            generateTab.classList.remove('active');
            verifyTab.classList.remove('active');
        }
    });
});

// History Modal
const historyToggle = document.getElementById('historyToggle');
const historyModal = document.getElementById('historyModal');
const closeModal = document.getElementById('closeModal');
const historyTabs = document.querySelectorAll('.history-tab');
const HISTORY_PANES = { hash: 'hashHistoryContent', check: 'checkHistoryContent', analyze: 'analyzeHistoryContent' };
let activeHistoryTab = 'hash';
let historyReturnFocus = null;

function openHistory() {
    historyReturnFocus = document.activeElement;
    historyModal.classList.add('active');
    document.body.classList.add('modal-open');
    switchHistoryTab(activeHistoryTab);
    closeModal.focus();
}

function closeHistory() {
    historyModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    if (historyReturnFocus && historyReturnFocus.focus) historyReturnFocus.focus();
}

function switchHistoryTab(type) {
    activeHistoryTab = type;
    historyTabs.forEach(t => {
        const on = t.dataset.tab === type;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    Object.entries(HISTORY_PANES).forEach(([key, id]) => {
        document.getElementById(id).classList.toggle('active', key === type);
    });
    updateHistoryCounts();
    renderHistory(type);
    updateHistoryFooter();
}

historyToggle.addEventListener('click', openHistory);
closeModal.addEventListener('click', closeHistory);
historyTabs.forEach(tab => tab.addEventListener('click', () => switchHistoryTab(tab.dataset.tab)));

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('confirmModal').classList.contains('show')) return;
    if (historyModal.classList.contains('active')) closeHistory();
});

// Clicks inside the history dialog: backdrop, copy, delete
historyModal.addEventListener('click', async (e) => {
    if (e.target === historyModal) { closeHistory(); return; }
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const type = btn.dataset.type;
    const index = Number(btn.dataset.i);
    const list = readList(type);
    const item = list[index];
    if (!item) return;

    if (btn.dataset.action === 'copy') {
        const text = btn.dataset.field === 'password' ? item.password : item.hash;
        flashCopied(btn, await copyToClipboard(String(text || '')));
    } else if (btn.dataset.action === 'delete') {
        list.splice(index, 1);
        writeList(type, list);
        renderHistory(type);
        updateHistoryCounts();
        updateHistoryFooter();
        showToast('Entry deleted');
    }
});

// File Input Display
document.getElementById('hashFile').addEventListener('change', (e) => {
    const fileName = e.target.files[0]?.name || 'No file chosen';
    document.getElementById('hashFileName').textContent = fileName;
});

document.getElementById('wordFile').addEventListener('change', (e) => {
    const fileName = e.target.files[0]?.name || 'No file chosen';
    document.getElementById('fileName').textContent = fileName;
});

// Clear Input Buttons 

// Plain Input Clear Button
document.getElementById('clearPlainBtn').addEventListener('click', () => {
    document.getElementById('plainInput').value = '';
    document.getElementById('plainInput').focus();
});

// Target Hash Clear Button (Input + Files clear)
document.getElementById('clearHashBtn').addEventListener('click', () => {
    // Input field clear
    document.getElementById('targetHash').value = '';
    
    // Hash file clear
    const hashFileInput = document.getElementById('hashFile');
    hashFileInput.value = '';
    document.getElementById('hashFileName').textContent = 'No file chosen';
    
    // Wordlist file clear
    const wordFileInput = document.getElementById('wordFile');
    wordFileInput.value = '';
    document.getElementById('fileName').textContent = 'No file chosen';
    
    // Result clear
    setCheckState('idle');
    
    // Focus back to input
    document.getElementById('targetHash').focus();
});

// ---------- History storage ----------
const HISTORY_KEYS = { hash: 'hashHistory', check: 'checkHistory', analyze: 'analyzeHistory' };
const HISTORY_LIST_IDS = { hash: 'historyList', check: 'checkHistoryList', analyze: 'analyzeHistoryList' };
const HISTORY_NAMES = { hash: 'Generate', check: 'Crack', analyze: 'Analyze' };
const HISTORY_LIMIT = 50;

function readList(type) {
    try {
        const value = JSON.parse(localStorage.getItem(HISTORY_KEYS[type]) || '[]');
        return Array.isArray(value) ? value : [];
    } catch (e) {
        return [];
    }
}

function writeList(type, list) {
    try {
        localStorage.setItem(HISTORY_KEYS[type], JSON.stringify(list));
    } catch (e) { /* storage full or blocked */ }
}

function stamp() {
    const now = new Date();
    return {
        time: now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: now.getTime()
    };
}

function relativeTime(item) {
    if (!item.timestamp) return item.time || '';
    const seconds = Math.floor((Date.now() - item.timestamp) / 1000);
    if (seconds < 45) return 'Just now';
    if (seconds < 3600) return Math.max(1, Math.round(seconds / 60)) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' h ago';
    return item.time || new Date(item.timestamp).toLocaleDateString();
}

function fullTime(item) {
    return item.timestamp ? new Date(item.timestamp).toLocaleString() : (item.time || '');
}

function truncate(text, max) {
    const t = String(text == null ? '' : text);
    return t.length > max ? t.slice(0, max) + '…' : t;
}

// Save to History (generate)
function saveToHistory(text, algorithm, hash) {
    const list = readList('hash');
    list.push({ text, algorithm, hash, ...stamp() });
    while (list.length > HISTORY_LIMIT) list.shift();
    writeList('hash', list);
}

// Save to Check History (crack). status: 'found' | 'notfound' | 'cancelled'
function saveToCheckHistory(hash, algorithm, wordlistName, totalLines, found, password = null, status = null) {
    const list = readList('check');
    list.push({
        hash, algorithm, wordlistName, totalLines, found, password,
        status: status || (found ? 'found' : 'notfound'),
        ...stamp()
    });
    while (list.length > HISTORY_LIMIT) list.shift();
    writeList('check', list);
}

// Save to Analyze History
function saveToAnalyzeHistory(results) {
    if (!results.length) return;
    const list = readList('analyze');
    const now = stamp();
    results.forEach(r => {
        const last = list[list.length - 1];
        if (last && last.hash === r.hash) return; // don't repeat the same hash back-to-back
        list.push({ hash: r.hash, type: r.type, bitLength: r.bitLength, length: r.length, charType: r.charType, salt: r.salt, ...now });
    });
    while (list.length > HISTORY_LIMIT) list.shift();
    writeList('analyze', list);
}

// ---------- History rendering ----------
function copyBtn(type, i, label, field, text) {
    return `<button type="button" class="icon-mini${text ? ' labeled' : ''}" data-action="copy" data-type="${type}" data-i="${i}"${field ? ` data-field="${field}"` : ''} title="${label}" aria-label="${label}">${ICONS.copy}${text ? `<span>${text}</span>` : ''}</button>`;
}

function deleteBtn(type, i) {
    return `<button type="button" class="icon-mini danger" data-action="delete" data-type="${type}" data-i="${i}" title="Delete entry" aria-label="Delete entry">${ICONS.trash}</button>`;
}

function timeTag(item) {
    return `<time class="h-time" title="${escapeAttr(fullTime(item))}">${escapeHtml(relativeTime(item))}</time>`;
}

const HISTORY_RENDERERS = {
    hash: (it, i) => `
        <article class="h-item">
            <div class="h-top">
                <span class="badge badge-accent">${escapeHtml(it.algorithm)}</span>
                ${timeTag(it)}
                <div class="h-actions">${copyBtn('hash', i, 'Copy hash')}${deleteBtn('hash', i)}</div>
            </div>
            <div class="h-row"><span class="h-key">Input</span><span class="h-val">${escapeHtml(truncate(it.text, 80))}</span></div>
            <div class="h-row"><span class="h-key">Hash</span><code class="h-val">${escapeHtml(it.hash)}</code></div>
        </article>`,

    check: (it, i) => {
        const status = it.status || (it.found ? 'found' : 'notfound');
        const badge = {
            found: '<span class="badge badge-success">Match found</span>',
            notfound: '<span class="badge badge-danger">Not found</span>',
            cancelled: '<span class="badge badge-warn">Cancelled</span>'
        }[status] || '';
        const password = it.found && it.password != null
            ? `<div class="h-row"><span class="h-key">Password</span><code class="h-val found">${escapeHtml(it.password)}</code></div>` : '';
        const passwordCopy = it.found && it.password != null ? copyBtn('check', i, 'Copy password', 'password', 'Password') : '';
        return `
        <article class="h-item">
            <div class="h-top">
                ${badge}
                <span class="badge">${escapeHtml(it.algorithm)}</span>
                ${timeTag(it)}
                <div class="h-actions">${passwordCopy}${copyBtn('check', i, 'Copy hash', '', it.found && it.password != null ? 'Hash' : '')}${deleteBtn('check', i)}</div>
            </div>
            <div class="h-row"><span class="h-key">Hash</span><code class="h-val">${escapeHtml(it.hash)}</code></div>
            ${password}
            <div class="h-row"><span class="h-key">Wordlist</span><span class="h-val">${escapeHtml(it.wordlistName)} · ${Number(it.totalLines || 0).toLocaleString()} lines checked</span></div>
        </article>`;
    },

    analyze: (it, i) => {
        const parts = [];
        if (typeof it.bitLength === 'number') parts.push(it.bitLength + '-bit');
        parts.push(it.length + ' chars');
        if (it.charType) parts.push(it.charType);
        const salt = it.salt && it.salt !== 'N/A'
            ? `<div class="h-row"><span class="h-key">Salt</span><code class="h-val">${escapeHtml(it.salt)}</code></div>` : '';
        return `
        <article class="h-item">
            <div class="h-top">
                <span class="badge ${it.type === 'Unknown' ? '' : 'badge-accent'}">${escapeHtml(it.type)}</span>
                ${timeTag(it)}
                <div class="h-actions">${copyBtn('analyze', i, 'Copy hash')}${deleteBtn('analyze', i)}</div>
            </div>
            <div class="h-row"><span class="h-key">Hash</span><code class="h-val">${escapeHtml(it.hash)}</code></div>
            <div class="h-row"><span class="h-key">Details</span><span class="h-val">${escapeHtml(parts.join(' · '))}</span></div>
            ${salt}
        </article>`;
    }
};

const HISTORY_EMPTY = {
    hash: ['No generated hashes yet', 'Hashes you create in the Generate tab will show up here.'],
    check: ['No crack attempts yet', 'Runs from the Crack tab, found or not, will show up here.'],
    analyze: ['No analyzed hashes yet', 'Hashes you check in the Analyze tab will show up here.']
};

function renderHistory(type) {
    const list = readList(type);
    const el = document.getElementById(HISTORY_LIST_IDS[type]);
    if (!list.length) {
        const [title, hint] = HISTORY_EMPTY[type];
        el.innerHTML = `<div class="h-empty">${ICONS.history}<p>${title}</p><span>${hint}</span></div>`;
        return;
    }
    // newest first; the index refers to the position in the stored list
    el.innerHTML = list.map((item, i) => HISTORY_RENDERERS[type](item, i)).reverse().join('');
}

function updateHistoryCounts() {
    Object.keys(HISTORY_KEYS).forEach(type => {
        const badge = document.querySelector(`[data-count="${type}"]`);
        if (badge) badge.textContent = readList(type).length;
    });
}

function updateHistoryFooter() {
    const tabCount = readList(activeHistoryTab).length;
    const total = Object.keys(HISTORY_KEYS).reduce((sum, t) => sum + readList(t).length, 0);
    document.getElementById('clearTabHistory').disabled = tabCount === 0;
    document.getElementById('clearHistory').disabled = total === 0;
}

// Clear this list
document.getElementById('clearTabHistory').addEventListener('click', () => {
    const type = activeHistoryTab;
    showConfirm(`Clear all ${HISTORY_NAMES[type]} history? This cannot be undone.`, () => {
        writeList(type, []);
        renderHistory(type);
        updateHistoryCounts();
        updateHistoryFooter();
        showToast(`${HISTORY_NAMES[type]} history cleared`);
    });
});

// Clear everything
document.getElementById('clearHistory').addEventListener('click', () => {
    showConfirm('Clear all history (Generate, Crack and Analyze)? This cannot be undone.', () => {
        Object.keys(HISTORY_KEYS).forEach(type => writeList(type, []));
        renderHistory(activeHistoryTab);
        updateHistoryCounts();
        updateHistoryFooter();
        showToast('All history cleared');
    });
});

// Custom Confirm Modal Function
function showConfirm(message, onConfirm) {
  const modal = document.getElementById('confirmModal');
  const msg = modal.querySelector('.confirm-message');
  const confirmBtn = document.getElementById('confirmBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  msg.textContent = message;
  modal.classList.add('show');

  const closeModal = () => modal.classList.remove('show');

  cancelBtn.onclick = () => closeModal();
  confirmBtn.onclick = () => {
    closeModal();
    if (typeof onConfirm === 'function') onConfirm();
  };
}

// Escape HTML to Prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Hash Generation & Checking Logic
const $ = id => document.getElementById(id);

const plainInput = $('plainInput');
const hashBtn = $('hashBtn');
const hashOut = $('hashOut');
const algSelect = $('algSelect');
const clearBtn = $('clearBtn');

const targetHashInput = $('targetHash');
const targetAlg = $('targetAlg');
const wordFile = $('wordFile');
const startCheck = $('startCheck');
const cancelCheck = $('cancelCheck');
const checkOut = $('checkOut');

let checking = false;
let cancelRequested = false;

// ---------- Result panels ----------
const hashPanel = $('hashResult');
const hashBadge = $('hashBadge');
const hashMeta = $('hashMeta');
const copyHashBtn = $('copyHashBtn');

// state: 'empty' | 'busy' | 'ok' | 'error'
function setHashState(state, text, alg) {
    hashPanel.dataset.state = state;
    hashOut.textContent = text || '';
    copyHashBtn.disabled = state !== 'ok';
    const ok = state === 'ok';
    hashBadge.hidden = !ok;
    hashMeta.hidden = !ok;
    if (ok) {
        hashBadge.textContent = alg;
        hashMeta.textContent = `${text.length} hex characters · ${text.length * 4}-bit`;
    }
}

const checkPanel = $('checkResult');
const checkBadge = $('checkBadge');
const checkProgress = $('checkProgress');
const checkBar = $('checkProgressBar');
const copyCheckBtn = $('copyCheckBtn');
let foundPassword = null;

const CHECK_BADGES = {
    idle: 'Idle', running: 'Running', success: 'Match found', fail: 'No match',
    cancelled: 'Cancelled', warn: 'Check input', error: 'Error'
};

function setCheckProgress(pct) {
    checkBar.style.width = Math.max(0, Math.min(100, pct)) + '%';
}

// state: 'idle' | 'running' | 'success' | 'fail' | 'cancelled' | 'warn' | 'error'
function setCheckState(state, text, html) {
    checkPanel.dataset.state = state;
    checkBadge.textContent = CHECK_BADGES[state];
    if (html) checkOut.innerHTML = html;
    else checkOut.textContent = text || '';
    checkProgress.hidden = !['running', 'success', 'fail', 'cancelled'].includes(state);
    if (['idle', 'warn', 'error'].includes(state)) setCheckProgress(0);
    if (state !== 'success') foundPassword = null;
    copyCheckBtn.disabled = state !== 'success';
}

// MD5 Implementation
function md5(str) {
    function rhex(n){var s='',j; for(j=0;j<4;j++) s += ((n >> (j*8+4)) & 0xF).toString(16) + ((n >> (j*8)) & 0xF).toString(16); return s;}
    function add(x,y){var l=(x&0xFFFF)+(y&0xFFFF), m=(x>>16)+(y>>16)+(l>>16); return (m<<16)|(l&0xFFFF);}
    function rol(num, cnt){ return (num<<cnt)|(num>>>(32-cnt)); }
    function cmn(q,a,b,x,s,t){ return add(rol(add(add(a,q),add(x,t)),s),b); }
    function ff(a,b,c,d,x,s,t){ return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a,b,c,d,x,s,t){ return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a,b,c,d,x,s,t){ return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a,b,c,d,x,s,t){ return cmn(c ^ (b | (~d)), a, b, x, s, t); }
    var x = unescape(encodeURIComponent(str));
    var i, oldLen = x.length;
    var words = [];
    for (i=0;i<oldLen;i++) words[i>>2] |= (x.charCodeAt(i) & 0xFF) << ((i%4) * 8);
    words[oldLen>>2] |= 0x80 << ((oldLen%4) * 8);
    words[(((oldLen + 8) >> 6) + 1) * 16 - 2] = oldLen * 8;
    var a=1732584193, b=-271733879, c=-1732584194, d=271733878;
    for (i=0;i<words.length;i+=16) {
        var olda=a, oldb=b, oldc=c, oldd=d;
        a=ff(a,b,c,d,words[i+0],7,-680876936);
        d=ff(d,a,b,c,words[i+1],12,-389564586);
        c=ff(c,d,a,b,words[i+2],17,606105819);
        b=ff(b,c,d,a,words[i+3],22,-1044525330);
        a=ff(a,b,c,d,words[i+4],7,-176418897);
        d=ff(d,a,b,c,words[i+5],12,1200080426);
        c=ff(c,d,a,b,words[i+6],17,-1473231341);
        b=ff(b,c,d,a,words[i+7],22,-45705983);
        a=ff(a,b,c,d,words[i+8],7,1770035416);
        d=ff(d,a,b,c,words[i+9],12,-1958414417);
        c=ff(c,d,a,b,words[i+10],17,-42063);
        b=ff(b,c,d,a,words[i+11],22,-1990404162);
        a=ff(a,b,c,d,words[i+12],7,1804603682);
        d=ff(d,a,b,c,words[i+13],12,-40341101);
        c=ff(c,d,a,b,words[i+14],17,-1502002290);
        b=ff(b,c,d,a,words[i+15],22,1236535329);
        a=gg(a,b,c,d,words[i+1],5,-165796510);
        d=gg(d,a,b,c,words[i+6],9,-1069501632);
        c=gg(c,d,a,b,words[i+11],14,643717713);
        b=gg(b,c,d,a,words[i+0],20,-373897302);
        a=gg(a,b,c,d,words[i+5],5,-701558691);
        d=gg(d,a,b,c,words[i+10],9,38016083);
        c=gg(c,d,a,b,words[i+15],14,-660478335);
        b=gg(b,c,d,a,words[i+4],20,-405537848);
        a=gg(a,b,c,d,words[i+9],5,568446438);
        d=gg(d,a,b,c,words[i+14],9,-1019803690);
        c=gg(c,d,a,b,words[i+3],14,-187363961);
        b=gg(b,c,d,a,words[i+8],20,1163531501);
        a=gg(a,b,c,d,words[i+13],5,-1444681467);
        d=gg(d,a,b,c,words[i+2],9,-51403784);
        c=gg(c,d,a,b,words[i+7],14,1735328473);
        b=gg(b,c,d,a,words[i+12],20,-1926607734);
        a=hh(a,b,c,d,words[i+5],4,-378558);
        d=hh(d,a,b,c,words[i+8],11,-2022574463);
        c=hh(c,d,a,b,words[i+11],16,1839030562);
        b=hh(b,c,d,a,words[i+14],23,-35309556);
        a=hh(a,b,c,d,words[i+1],4,-1530992060);
        d=hh(d,a,b,c,words[i+4],11,1272893353);
        c=hh(c,d,a,b,words[i+7],16,-155497632);
        b=hh(b,c,d,a,words[i+10],23,-1094730640);
        a=hh(a,b,c,d,words[i+13],4,681279174);
        d=hh(d,a,b,c,words[i+0],11,-358537222);
        c=hh(c,d,a,b,words[i+3],16,-722521979);
        b=hh(b,c,d,a,words[i+6],23,76029189);
        a=hh(a,b,c,d,words[i+9],4,-640364487);
        d=hh(d,a,b,c,words[i+12],11,-421815835);
        c=hh(c,d,a,b,words[i+15],16,530742520);
        b=hh(b,c,d,a,words[i+2],23,-995338651);
        a=ii(a,b,c,d,words[i+0],6,-198630844);
        d=ii(d,a,b,c,words[i+7],10,1126891415);
        c=ii(c,d,a,b,words[i+14],15,-1416354905);
        b=ii(b,c,d,a,words[i+5],21,-57434055);
        a=ii(a,b,c,d,words[i+12],6,1700485571);
        d=ii(d,a,b,c,words[i+3],10,-1894986606);
        c=ii(c,d,a,b,words[i+10],15,-1051523);
        b=ii(b,c,d,a,words[i+1],21,-2054922799);
        a=ii(a,b,c,d,words[i+8],6,1873313359);
        d=ii(d,a,b,c,words[i+15],10,-30611744);
        c=ii(c,d,a,b,words[i+6],15,-1560198380);
        b=ii(b,c,d,a,words[i+13],21,1309151649);
        a=ii(a,b,c,d,words[i+4],6,-145523070);
        d=ii(d,a,b,c,words[i+11],10,-1120210379);
        c=ii(c,d,a,b,words[i+2],15,718787259);
        b=ii(b,c,d,a,words[i+9],21,-343485551);
        a=add(a,olda); b=add(b,oldb); c=add(c,oldc); d=add(d,oldd);
    }
    return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}

// Web Crypto Digest to Hex
async function subtleDigestHex(name, input) {
    const enc = new TextEncoder();
    const data = enc.encode(input);
    const hash = await crypto.subtle.digest(name, data);
    const bytes = new Uint8Array(hash);
    return Array.from(bytes).map(b => b.toString(16).padStart(2,'0')).join('');
}

// Compute Hash Function
async function computeHash(alg, text) {
    alg = alg.toUpperCase();
    if (alg === 'MD5') {
        return md5(text);
    } else if (alg === 'SHA-1' || alg === 'SHA-256' || alg === 'SHA-384' || alg === 'SHA-512') {
        return await subtleDigestHex(alg.replace('SHA-','SHA-'), text).catch(async err => {
            return await subtleDigestHex(alg, text);
        });
    } else {
        throw new Error('Unsupported algorithm: ' + alg);
    }
}

// Hash Button Event
hashBtn.addEventListener('click', async () => {
    const txt = plainInput.value || '';
    if (!txt) {
        setHashState('error', 'Enter some text to hash first.');
        return;
    }
    const alg = algSelect.value;
    setHashState('busy', 'Computing…');
    try {
        const h = await computeHash(alg, txt);
        setHashState('ok', h, alg);
        saveToHistory(txt, alg, h);
    } catch (err) {
        setHashState('error', 'Error: ' + (err && err.message ? err.message : err));
    }
});

// Clear Button Event
clearBtn.addEventListener('click', () => {
    plainInput.value = '';
    setHashState('empty');
});

// Wordlist Checking Logic
async function checkWordlist(targetHex, alg, file) {
    setCheckState('running', 'Reading wordlist…');
    setCheckProgress(0);
    const text = await file.text();
    const lines = text.split(/\r?\n/).map(s => s.replace(/\r/g,'')).filter(Boolean);
    const total = lines.length;
    const wordlistName = file.name;

    if (!total) {
        setCheckState('warn', 'The wordlist is empty.');
        checking = false;
        return null;
    }

    checkOut.textContent = `Loaded ${total.toLocaleString()} lines · algorithm ${alg}`;
    const batchSize = 500;
    let idx = 0;
    const start = performance.now();

    while (idx < total) {
        if (cancelRequested) {
            setCheckState('cancelled', `Stopped after ${idx.toLocaleString()} of ${total.toLocaleString()} lines.`);
            cancelRequested = false;
            checking = false;
            saveToCheckHistory(targetHex, alg, wordlistName, idx, false, null, 'cancelled');
            return null;
        }
        const end = Math.min(idx + batchSize, total);
        for (let i = idx; i < end; i++) {
            const candidate = lines[i];
            let h;
            if (alg === 'MD5') {
                h = md5(candidate);
            } else {
                h = await subtleDigestHex(alg, candidate);
            }
            if (h.toLowerCase() === targetHex.toLowerCase()) {
                const took = ((performance.now() - start)/1000).toFixed(2);
                setCheckState('success', null,
                    `<div class="found-grid">` +
                    `<span>Password</span><strong class="found-pass">${escapeHtml(candidate)}</strong>` +
                    `<span>Line</span><span>${(i + 1).toLocaleString()} of ${total.toLocaleString()}</span>` +
                    `<span>Algorithm</span><span>${escapeHtml(alg)}</span>` +
                    `<span>Time</span><span>${took}s</span></div>`);
                foundPassword = candidate;
                setCheckProgress(100);
                checking = false;
                saveToCheckHistory(targetHex, alg, wordlistName, i+1, true, candidate);
                return {line: i+1, candidate};
            }
        }
        idx = end;
        const pct = Math.floor((idx / total) * 100);
        setCheckProgress(pct);
        checkOut.textContent = `Checked ${idx.toLocaleString()} of ${total.toLocaleString()} lines (${pct}%)`;
        await new Promise(r => setTimeout(r, 0));
    }
    const took = ((performance.now() - start)/1000).toFixed(2);
    setCheckState('fail', `No match found in ${total.toLocaleString()} entries (${took}s).`);
    setCheckProgress(100);
    checking = false;
    saveToCheckHistory(targetHex, alg, wordlistName, total, false);
    return null;
}

document.getElementById('hashFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        try {
            const text = await file.text();
            const hash = text.trim().split('\n')[0].trim(); 
            document.getElementById('targetHash').value = hash;
            document.getElementById('hashFileName').textContent = file.name;
        } catch (err) {
            showToast('Failed to read the hash file');
        }
    }
});

// Start Check Button Event 
startCheck.addEventListener('click', async () => {
    if (checking) return;

    let target = targetHashInput.value.trim();

    if (!target) {
        const hashFile = document.getElementById('hashFile').files[0];
        if (hashFile) {
            try {
                const text = await hashFile.text();
                target = text.trim().split('\n')[0].trim();
                targetHashInput.value = target; 
            } catch (err) {
                setCheckState('error', 'Failed to read the hash file.');
                return;
            }
        }
    }
    
    if (!target) { 
        setCheckState('warn', 'Enter a target hash or upload a hash file first.');
        return; 
    }
    
    const alg = targetAlg.value;
    const f = wordFile.files[0];
    if (!f) { 
        setCheckState('warn', 'Select a wordlist (.txt) first.');
        return; 
    }
    checking = true;
    cancelRequested = false;
    setCheckState('running', 'Preparing…');
    try {
        await checkWordlist(target, alg, f);
    } catch (err) {
        setCheckState('error', 'Error during check: ' + (err && err.message ? err.message : err));
        checking = false;
    }
});

// Copy Hash Result
copyHashBtn.addEventListener('click', async () => {
    if (copyHashBtn.disabled) return;
    flashCopied(copyHashBtn, await copyToClipboard(hashOut.textContent.trim()));
});

// Copy found password
copyCheckBtn.addEventListener('click', async () => {
    if (!foundPassword) return;
    flashCopied(copyCheckBtn, await copyToClipboard(foundPassword));
});

// Cancel Check Button Event
cancelCheck.addEventListener('click', () => {
    if (!checking) { 
        showToast('No active check to cancel.');
        return; 
    }
    cancelRequested = true;
    checkOut.textContent = 'Stopping…';
});


// Hash Analyzer 
(function() {
    const input = document.getElementById('analyzeInput');
    const fileInput = document.getElementById('analyzeFile');
    const fileName = document.getElementById('analyzeFileName');
    const outDiv = document.getElementById('analyzeOut');

    function detectHashType(h) {
        const hash = h.trim();
        if (!hash) return null;
        const len = hash.length;
        let type = "Unknown", salt = "N/A";
        let charType = /^[0-9a-fA-F]+$/.test(hash) ? "hexadecimal" : "base64 or mixed";

        // ──────────────── Common Crypt-style Hashes ────────────────
        if (/^\$2[aby]\$/.test(hash)) type = "BCRYPT";
        else if (/^\$1\$([^$]+)\$(.+)$/.test(hash)) {
            const match = hash.match(/^\$1\$([^$]+)\$(.+)$/);
            salt = match[1];
            type = "MD5-Crypt (Unix)";
        }
        else if (/^\$5\$([^$]+)\$(.+)$/.test(hash)) {
            const match = hash.match(/^\$5\$([^$]+)\$(.+)$/);
            salt = match[1];
            type = "SHA256-Crypt (Unix)";
        }
        else if (/^\$6\$([^$]+)\$(.+)$/.test(hash)) {
            const match = hash.match(/^\$6\$([^$]+)\$(.+)$/);
            salt = match[1];
            type = "SHA512-Crypt (Unix)";
        }

        // ──────────────── PHP / MySQL / Wordpress / phpBB ────────────────
        else if (/^\$P\$/.test(hash) || /^\$H\$/.test(hash)) type = "MD5 (WordPress/phpBB)";
        else if (/^\*[0-9A-F]{40}$/i.test(hash)) type = "MySQL5 (SHA1)";
        else if (/^[0-9a-f]{16}$/i.test(hash)) type = "MySQL (Old Pre-4.1)";
        else if (/^phpass\$.+/.test(hash)) type = "PHPS / Portable PHP Hash";

        // ──────────────── Oracle / DES / BSD / NTLM ────────────────
        else if (/^[A-Z0-9]{16}$/i.test(hash)) type = "Oracle 7-10 DES";
        else if (/^[A-F0-9]{32}$/i.test(hash)) type = "NTLM or MD4/MD5";
        else if (/^[A-Z0-9\/\.]{13}$/.test(hash)) type = "DES (Unix crypt)";
        else if (/^[A-F0-9]{48}$/i.test(hash)) type = "SHA224";
        else if (/^[A-F0-9]{96}$/i.test(hash)) type = "SHA384";

        // ──────────────── SHA Family ────────────────
        else if (/^[0-9a-f]{40}$/i.test(hash)) type = "SHA1";
        else if (/^[0-9a-f]{64}$/i.test(hash)) type = "SHA256";
        else if (/^[0-9a-f]{128}$/i.test(hash)) type = "SHA512";
        else if (/^[0-9a-f]{32}$/i.test(hash)) type = "MD5 or MD4";

        // ──────────────── CRC / Whirlpool / Base64 ────────────────
        else if (/^[0-9a-f]{8}$/i.test(hash)) type = "CRC32";
        else if (/^[0-9a-f]{128}$/i.test(hash)) type = "Whirlpool";
        else if (/^[A-Za-z0-9\/+]{22,24}={0,2}$/.test(hash)) type = "Possibly Base64-encoded hash";

        return {
            hash, type,
            bitLength: /^[0-9a-fA-F]+$/.test(hash) ? len * 4 : "Unknown",
            length: len,
            charType, salt
        };
    }

    const panel = document.getElementById('analyzeResult');
    const badge = document.getElementById('analyzeBadge');
    const MAX_SHOWN = 100;   // keep the page responsive for huge files
    const MAX_SAVED = 25;    // entries added to history per run
    let lastResults = [];

    // state: 'empty' | 'warn' | 'ok'
    function setAnalyzeState(state, text) {
        panel.dataset.state = state;
        badge.hidden = state !== 'ok';
        if (text !== undefined) outDiv.textContent = text;
    }

    function cardHtml(r, i) {
        const details = [
            ['Bit length', r.bitLength === 'Unknown' ? 'Unknown' : r.bitLength + '-bit'],
            ['Length', r.length + ' characters'],
            ['Character type', r.charType],
            ['Salt', r.salt]
        ].map(([k, v]) => `<div><dt>${k}</dt><dd>${escapeHtml(String(v))}</dd></div>`).join('');

        return `<div class="analysis-card">` +
            `<div class="analysis-head"><span class="badge ${r.type === 'Unknown' ? '' : 'badge-accent'}">${escapeHtml(r.type)}</span>` +
            `<button type="button" class="icon-mini" data-copy-i="${i}" title="Copy hash" aria-label="Copy hash">${ICONS.copy}</button></div>` +
            `<code class="analysis-hash">${escapeHtml(r.hash)}</code>` +
            `<dl class="analysis-grid">${details}</dl></div>`;
    }

    document.getElementById('analyzeBtn').addEventListener('click', () => {
        const lines = input.value.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (!lines.length) {
            lastResults = [];
            setAnalyzeState('warn', 'Enter or upload a hash first.');
            return;
        }

        const shown = lines.slice(0, MAX_SHOWN);
        lastResults = shown.map(h => detectHashType(h)).filter(Boolean);
        const note = lines.length > shown.length
            ? `<div class="analysis-note">Showing the first ${MAX_SHOWN} of ${lines.length} hashes.</div>` : '';

        outDiv.innerHTML = lastResults.map(cardHtml).join('') + note;
        setAnalyzeState('ok');
        badge.textContent = lastResults.length === 1 ? '1 hash' : lastResults.length + ' hashes';

        saveToAnalyzeHistory(lastResults.slice(0, MAX_SAVED));
    });

    // Copy buttons inside the result cards
    outDiv.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-copy-i]');
        if (!btn) return;
        const r = lastResults[Number(btn.dataset.copyI)];
        if (r) flashCopied(btn, await copyToClipboard(r.hash));
    });

    document.getElementById('clearAnalyzeBtn').addEventListener('click', () => {
        input.value = '';
        lastResults = [];
        outDiv.textContent = '';
        setAnalyzeState('empty');
        fileInput.value = '';
        fileName.textContent = 'No file chosen';
    });

    fileInput.addEventListener('change', e => {
        const f = e.target.files[0];
        if(!f) return;
        fileName.textContent = f.name;
        const reader = new FileReader();
        reader.onload = ev => input.value = ev.target.result.trim();
        reader.readAsText(f);
    });
})();
