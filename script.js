// 🔹 Theme & Mobile Menu Script
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');

// Theme Toggle
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileMenuBtn.classList.toggle('active');
  nav.classList.toggle('active');
});

// Close menu when clicking nav links
const navLinks = nav.querySelectorAll('a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (nav.classList.contains('active') && 
      !nav.contains(e.target) && 
      !mobileMenuBtn.contains(e.target)) {
    nav.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

const input = document.getElementById("wordFile");
  const fileName = document.getElementById("fileName");

  input.addEventListener("change", () => {
    if (input.files.length > 0) {
      fileName.textContent = input.files[0].name;
    } else {
      fileName.textContent = "No file chosen";
    }
  });

// 🔹 History Modal Script
const historyModal = document.getElementById('historyModal');
const historyToggle = document.getElementById('historyToggle');
const closeModal = document.getElementById('closeModal');
const historyList = document.getElementById('historyList');
const clearHistory = document.getElementById('clearHistory');

// Open History Modal
historyToggle.addEventListener('click', () => {
  historyModal.classList.add('active');
  loadHistory();
});

// Close History Modal
closeModal.addEventListener('click', () => {
  historyModal.classList.remove('active');
});

// Close modal when clicking outside
historyModal.addEventListener('click', (e) => {
  if (e.target === historyModal) {
    historyModal.classList.remove('active');
  }
});

// Load and display history
function loadHistory() {
  const history = JSON.parse(localStorage.getItem('hashHistory') || '[]');
  
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

// Tab Switching
document.querySelectorAll('.history-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.getAttribute('data-tab');
    
    // Remove active class from all tabs and contents
    document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked tab
    tab.classList.add('active');
    
    // Show corresponding content
    if (targetTab === 'hash') {
      document.getElementById('hashHistoryContent').classList.add('active');
      loadHistory();
    } else if (targetTab === 'check') {
      document.getElementById('checkHistoryContent').classList.add('active');
      loadCheckHistory();
    }
  });
});

// Load and display check history
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
    const passwordInfo = item.found ? `<div class="found-password">Password: ${escapeHtml(item.password)}</div>` : '';
    
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

// Save to check history
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

  // Keep only last 50 entries
  if (checkHistory.length > 50) {
    checkHistory.shift();
  }

  localStorage.setItem('checkHistory', JSON.stringify(checkHistory));
}

// Clear all history
clearHistory.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all history?')) {
    localStorage.removeItem('hashHistory');
    loadHistory();
  }
});
// Clear check history button 
const clearCheckHistoryBtn = document.createElement('button');
clearCheckHistoryBtn.className = 'clear-history-btn';
clearCheckHistoryBtn.textContent = 'Clear Check History';
clearCheckHistoryBtn.style.marginTop = '10px';
clearCheckHistoryBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear check history?')) {
    localStorage.removeItem('checkHistory');
    loadCheckHistory();
  }
});

// Modal content clear button
document.querySelector('.modal-content').appendChild(clearCheckHistoryBtn);

// Save to history
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

  // Keep only last 50 entries
  if (history.length > 50) {
    history.shift();
  }

  localStorage.setItem('hashHistory', JSON.stringify(history));
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 🔹 Hash Checker Script
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

// --- MD5 Implementation ---
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

// --- Web Crypto digest to hex ---
async function subtleDigestHex(name, input) {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const hash = await crypto.subtle.digest(name, data);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map(b => b.toString(16).padStart(2,'0')).join('');
}

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

// UI: compute hash from plain input
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
    
    // Save to history
    saveToHistory(txt, alg, h);
  } catch (err) {
    hashOut.textContent = 'Error: ' + err;
  }
});

clearBtn.addEventListener('click', () => {
  plainInput.value=''; 
  hashOut.textContent='—';
});

// Wordlist checking logic (batched to avoid freezing) 
async function checkWordlist(targetHex, alg, file) {
  checkOut.textContent = 'Reading file...';
  const text = await file.text();
  const lines = text.split(/\r?\n/).map(s=>s.replace(/\r/g,'')).filter(Boolean);
  const total = lines.length;
  const wordlistName = file.name; // Get filename
  
  checkOut.textContent = `Loaded ${total} lines. Starting check... (algorithm: ${alg})`;
  const batchSize = 500;
  let idx = 0;
  const start = performance.now();
  
  while (idx < total) {
    if (cancelRequested) {
      checkOut.textContent = 'Cancelled by user.';
      cancelRequested = false;
      checking = false;
      
      // Save cancelled check to history
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
        
        // Save successful check to history
        saveToCheckHistory(targetHex, alg, wordlistName, i+1, true, candidate);
        return {line: i+1, candidate};
      }
    }
    idx = end;
    checkOut.textContent = `Checked ${idx}/${total} lines...`;
    await new Promise(r => setTimeout(r, 0));
  }
  const took = ((performance.now() - start)/1000).toFixed(2);
  checkOut.textContent = `❌ No match after checking ${total} entries. Time: ${took}s`;
  checking = false;
  
  // Save unsuccessful check to history
  saveToCheckHistory(targetHex, alg, wordlistName, total, false);
  return null;
}

startCheck.addEventListener('click', async () => {
  if (checking) return;
  const target = targetHashInput.value.trim();
  if (!target) { 
    checkOut.textContent = 'Enter target hash first.'; 
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

cancelCheck.addEventListener('click', () => {
  if (!checking) { 
    checkOut.textContent = 'No active check to cancel.'; 
    return; 
  }
  cancelRequested = true;
  checkOut.textContent = 'Cancellation requested...';
});