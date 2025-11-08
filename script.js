
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

historyToggle.addEventListener('click', () => {
    historyModal.classList.add('active');
    loadHistory();
});

closeModal.addEventListener('click', () => {
    historyModal.classList.remove('active');
});

historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.classList.remove('active');
    }
});

// History Tabs
const historyTabs = document.querySelectorAll('.history-tab');
const hashHistoryContent = document.getElementById('hashHistoryContent');
const checkHistoryContent = document.getElementById('checkHistoryContent');

historyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        historyTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (targetTab === 'hash') {
            hashHistoryContent.classList.add('active');
            checkHistoryContent.classList.remove('active');
            loadHistory();
        } else if (targetTab === 'check') {
            checkHistoryContent.classList.add('active');
            hashHistoryContent.classList.remove('active');
            loadCheckHistory();
        }
    });
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
    document.getElementById('checkOut').textContent = 'Idle.';
    
    // Focus back to input
    document.getElementById('targetHash').focus();
});

// Load and Display History
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('hashHistory') || '[]');
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="no-history">No history yet. Generate some hashes!</div>';
        return;
    }

    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item-header">
                <span class="history-algo">${item.algorithm}</span>
                <span class="history-time">${item.time}</span>
            </div>
            <div class="history-text">Text: ${escapeHtml(item.text.substring(0, 50))}${item.text.length > 50 ? '...' : ''}</div>
            <div class="history-hash">${item.hash}</div>
        </div>
    `).reverse().join('');
}

// Load and Display Check History
function loadCheckHistory() {
    const checkHistory = JSON.parse(localStorage.getItem('checkHistory') || '[]');
    const checkHistoryList = document.getElementById('checkHistoryList');
    
    if (checkHistory.length === 0) {
        checkHistoryList.innerHTML = '<div class="no-history">No check history yet. Check some hashes!</div>';
        return;
    }

    checkHistoryList.innerHTML = checkHistory.map(item => {
        const statusClass = item.found ? 'found' : 'not-found';
        const statusText = item.found ? '✅ Match Found' : '❌ Not Found';
        const passwordInfo = item.found ? `<div class="found-password">Result: ${escapeHtml(item.password)}</div>` : '';
        
        return `
            <div class="check-history-item">
                <div class="history-item-header">
                    <span class="check-status ${statusClass}">${statusText}</span>
                    <span class="history-time">${item.time}</span>
                </div>
                <div class="history-algo">${item.algorithm}</div>
                <div class="history-hash">${item.hash}</div>
                ${passwordInfo}
                <div class="wordlist-info">📁 Wordlist: ${escapeHtml(item.wordlistName)} (${item.totalLines} lines checked)</div>
            </div>
        `;
    }).reverse().join('');
}

// Save to History
function saveToHistory(text, algorithm, hash) {
    const history = JSON.parse(localStorage.getItem('hashHistory') || '[]');
    const now = new Date();
    const time = now.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    history.push({
        text,
        algorithm,
        hash,
        time,
        timestamp: now.getTime()
    });

    if (history.length > 50) {
        history.shift();
    }

    localStorage.setItem('hashHistory', JSON.stringify(history));
}

// Save to Check History
function saveToCheckHistory(hash, algorithm, wordlistName, totalLines, found, password = null) {
    const checkHistory = JSON.parse(localStorage.getItem('checkHistory') || '[]');
    const now = new Date();
    const time = now.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    checkHistory.push({
        hash,
        algorithm,
        wordlistName,
        totalLines,
        found,
        password,
        time,
        timestamp: now.getTime()
    });

    if (checkHistory.length > 50) {
        checkHistory.shift();
    }

    localStorage.setItem('checkHistory', JSON.stringify(checkHistory));
}

// Clear History
document.getElementById('clearHistory').addEventListener('click', () => {
  showConfirm('Are you sure you want to clear all history?', () => {
    localStorage.removeItem('hashHistory');
    localStorage.removeItem('checkHistory');
    loadHistory();
    loadCheckHistory();
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
        hashOut.textContent = 'Please enter some text!';
        return;
    }
    const alg = algSelect.value;
    hashOut.textContent = 'Computing...';
    try {
        const h = await computeHash(alg, txt);
        hashOut.textContent = alg + ' (hex):\n' + h;
        saveToHistory(txt, alg, h);
    } catch (err) {
        hashOut.textContent = 'Error: ' + err;
    }
});

// Clear Button Event
clearBtn.addEventListener('click', () => {
    plainInput.value = ''; 
    hashOut.textContent = '—';
});

// Wordlist Checking Logic
async function checkWordlist(targetHex, alg, file) {
    checkOut.textContent = 'Reading file...';
    const text = await file.text();
    const lines = text.split(/\r?\n/).map(s => s.replace(/\r/g,'')).filter(Boolean);
    const total = lines.length;
    const wordlistName = file.name;
    
    checkOut.textContent = `Loaded ${total} lines. Starting check... (algorithm: ${alg})`;
    const batchSize = 500;
    let idx = 0;
    const start = performance.now();
    
    while (idx < total) {
        if (cancelRequested) {
            checkOut.textContent = 'Cancelled by user.';
            cancelRequested = false;
            checking = false;
            saveToCheckHistory(targetHex, alg, wordlistName, idx, false);
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
                checkOut.textContent = `✅ MATCH FOUND!\nLine ${i+1}: "${candidate}"\nAlgorithm: ${alg}\nTime: ${took}s\n(Total checked: ${i+1})`;
                checking = false;
                saveToCheckHistory(targetHex, alg, wordlistName, i+1, true, candidate);
                return {line: i+1, candidate};
            }
        }
        idx = end;
        checkOut.textContent = `Checked ${idx}/${total} lines...`;
        await new Promise(r => setTimeout(r, 0));
    }
    const took = ((performance.now() - start)/1000).toFixed(2);
    checkOut.textContent = `❌ No match after cracking ${total} entries. Time: ${took}s`;
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
            alert('Failed to read hash file');
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
                checkOut.textContent = 'Failed to read hash file.';
                return;
            }
        }
    }
    
    if (!target) { 
        checkOut.textContent = 'Enter target hash or upload hash file first.'; 
        return; 
    }
    
    const alg = targetAlg.value;
    const f = wordFile.files[0];
    if (!f) { 
        checkOut.textContent = 'Select a local .txt wordlist first.'; 
        return; 
    }
    checking = true;
    cancelRequested = false;
    checkOut.textContent = 'Preparing to check...';
    try {
        await checkWordlist(target, alg, f);
    } catch (err) {
        checkOut.textContent = 'Error during check: ' + err;
        checking = false;
    }
});

// Copy Hash Result
document.getElementById('copyHashBtn').addEventListener('click', async () => {
    const hashText = document.getElementById('hashOut').textContent;
    if (hashText === '—' || hashText === 'Please enter some text!') {
        alert('No hash to copy!');
        return;
    }
    try {        
        const hashOnly = hashText.split('\n').pop().trim();
        await navigator.clipboard.writeText(hashOnly);
        
        // Visual feedback
        const btn = document.getElementById('copyHashBtn');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>';
        setTimeout(() => {
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>';
        }, 1500);
    } catch (err) {
        alert('Failed to copy to clipboard');
    }
});

// Cancel Check Button Event
cancelCheck.addEventListener('click', () => {
    if (!checking) { 
        checkOut.textContent = 'No active check to cancel.'; 
        return; 
    }
    cancelRequested = true;
    checkOut.textContent = 'Cancellation requested...';
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

    document.getElementById('analyzeBtn').addEventListener('click', () => {
        const lines = input.value.trim().split(/\r?\n/).filter(Boolean);
        if (!lines.length) { 
            outDiv.innerHTML = `<p class="warn">⚠️ Please enter or upload a hash.</p>`; 
            return; 
        }

        const results = lines.map(h => {
            const r = detectHashType(h);
            if(!r) return '';
            return `
<div class="result-box">
  <p><strong>Hash:</strong> <code>${r.hash}</code></p>
  <p><strong>Hash type:</strong> ${r.type}</p>
  <p><strong>Bit length:</strong> ${r.bitLength}</p>
  <p><strong>Character length:</strong> ${r.length}</p>
  <p><strong>Character type:</strong> ${r.charType}</p>
  <p><strong>Salt:</strong> ${r.salt}</p>
</div>
`;
        }).join('');
        outDiv.innerHTML = results || `<p>No results found.</p>`;
    });

    document.getElementById('clearAnalyzeBtn').addEventListener('click', () => {
        input.value = '';
        outDiv.innerHTML = '<p>#</p>';
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
