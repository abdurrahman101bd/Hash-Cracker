(() => {
  const notesGrid = document.getElementById('notesGrid');
  const fabBtn = document.getElementById('fabBtn');
  const noteModal = document.getElementById('noteModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const noteForm = document.getElementById('noteForm');
  const modalTitle = document.getElementById('modalTitle');
  const noteTitleInput = document.getElementById('noteTitle');
  const noteContentInput = document.getElementById('noteContent');
  const cancelBtn = document.getElementById('cancelBtn');
  const charCount = document.getElementById('charCount');
  const autosaveHint = document.getElementById('autosaveHint');

  const viewModal = document.getElementById('viewModal');
  const closeViewBtn = document.getElementById('closeViewBtn');
  const copyViewBtn = document.getElementById('copyViewBtn');
  const viewTitle = document.getElementById('viewTitle');
  const viewContent = document.getElementById('viewContent');
  const viewDate = document.getElementById('viewDate');
  const editFromViewBtn = document.getElementById('editFromViewBtn');
  const deleteFromViewBtn = document.getElementById('deleteFromViewBtn');

  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const noteCount = document.getElementById('noteCount');
  const storageHint = document.getElementById('storageHint');
  const toast = document.getElementById('toast');

  const confirmModal = document.getElementById('confirmModal');
  const closeConfirmBtn = document.getElementById('closeConfirmBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  let pendingDeleteId = null;

  // state
  const LS_KEY = 'notesAppNotesV1';
  let notes = [];
  let editingId = null;
  let viewingId = null;
  let formDirty = false;
  let toastTimer = null;

  // ---------- helpers ----------
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  const ACCENTS = ['#6366f1', '#8b5cf6', '#38bdf8', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6'];
  function accentFor(id) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return ACCENTS[h % ACCENTS.length];
  }

  function relativeTime(ts) {
    const seconds = Math.floor((Date.now() - ts) / 1000);
    if (seconds < 45) return 'Just now';
    if (seconds < 3600) return Math.max(1, Math.round(seconds / 60)) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' h ago';
    if (seconds < 172800) return 'Yesterday';
    if (seconds < 6 * 86400) return Math.floor(seconds / 86400) + ' d ago';
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  const fullTime = (ts) => new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  const saveToStorage = () => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(notes)); }
    catch (e) { showAlert("Couldn't save — your browser's local storage may be full or disabled."); }
  };
  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      notes = raw ? JSON.parse(raw) : [];
    } catch (e) {
      notes = [];
    }
  };

  function showToast(msg = 'Saved') {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

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

  function vibrate() { if (navigator.vibrate) navigator.vibrate(20); }

  // ---------- render ----------
  function updateCounts(shown, total) {
    noteCount.textContent = total === 0 ? '' : (shown === total ? `${total} note${total === 1 ? '' : 's'}` : `${shown} of ${total}`);
    storageHint.textContent = `${total} note${total === 1 ? '' : 's'} · saved in this browser`;
  }

  function renderNotes(filter = '') {
    const q = filter.trim().toLowerCase();
    const list = notes
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .filter(n => !q || (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q));

    updateCounts(list.length, notes.length);
    searchClear.hidden = !filter;

    if (!list.length) {
      notesGrid.innerHTML = notes.length
        ? `<div class="empty-state">
             <svg viewBox="0 -960 960 960"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
             <h3>No matching notes</h3>
             <p>Try a different search term.</p>
           </div>`
        : `<div class="empty-state">
             <svg viewBox="0 -960 960 960"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Z"/></svg>
             <h3>No notes yet</h3>
             <p>Tap the + button to write your first note.</p>
             <button type="button" class="btn btn-primary" id="emptyAddBtn">New note</button>
           </div>`;
      const addBtn = document.getElementById('emptyAddBtn');
      if (addBtn) addBtn.addEventListener('click', openAddModal);
      return;
    }

    notesGrid.innerHTML = list.map(note => {
      const title = note.title ? escapeHtml(note.title) : '';
      return `
        <article class="note-card" data-id="${note.id}" style="--accent:${accentFor(note.id)}" tabindex="0" role="button" aria-label="Open note ${title || 'Untitled'}">
          <h3 class="title${title ? '' : ' untitled'}">${title || 'Untitled'}</h3>
          <div class="content">${escapeHtml(note.content || '')}</div>
          <div class="card-footer">
            <span class="date" title="${escapeHtml(fullTime(note.updatedAt))}">${escapeHtml(relativeTime(note.updatedAt))}</span>
            <div class="actions">
              <button type="button" class="icon btn-delete" title="Delete note" aria-label="Delete note">
                <svg viewBox="0 -960 960 960" aria-hidden="true"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>
              </button>
            </div>
          </div>
        </article>`;
    }).join('');
  }

  // ---------- modal helpers ----------
  const openModals = [];
  function openModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    openModals.push(modal);
    const input = modal.querySelector('input, textarea, button');
    if (input) input.focus();
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    const i = openModals.indexOf(modal);
    if (i !== -1) openModals.splice(i, 1);
    if (!openModals.length) document.body.classList.remove('modal-open');
  }
  function isOpen(modal) {
    return modal && modal.getAttribute('aria-hidden') === 'false';
  }

  // ---------- delete flow ----------
  function confirmDelete(id) {
    pendingDeleteId = id;
    openModal(confirmModal);
  }
  function performDelete() {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    notes = notes.filter(n => n.id !== id);
    saveToStorage();
    renderNotes(searchInput.value);
    showToast('Note deleted');
    vibrate();
    if (viewingId === id) { closeModal(viewModal); viewingId = null; }
    if (editingId === id) { closeModal(noteModal); editingId = null; }
    pendingDeleteId = null;
    closeModal(confirmModal);
  }

  // ---------- CRUD ----------
  function updateCharCount() {
    const n = noteContentInput.value.length;
    charCount.textContent = `${n.toLocaleString()} character${n === 1 ? '' : 's'}`;
  }

  function markDirty() {
    if (formDirty) return;
    formDirty = true;
    autosaveHint.hidden = false;
  }

  function openAddModal() {
    editingId = null;
    formDirty = false;
    autosaveHint.hidden = true;
    modalTitle.textContent = 'Add note';
    noteTitleInput.value = '';
    noteContentInput.value = '';
    updateCharCount();
    openModal(noteModal);
  }

  function openEditModal(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    editingId = id;
    formDirty = false;
    autosaveHint.hidden = true;
    modalTitle.textContent = 'Edit note';
    noteTitleInput.value = note.title || '';
    noteContentInput.value = note.content || '';
    updateCharCount();
    openModal(noteModal);
  }

  function openViewModal(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    viewingId = id;
    viewTitle.textContent = note.title || 'Untitled';
    viewContent.textContent = note.content || '';
    viewDate.textContent = `Edited ${fullTime(note.updatedAt)}`;
    copyViewBtn.classList.remove('is-copied');
    openModal(viewModal);
  }

  function closeEditor(force) {
    if (formDirty && !force) {
      confirmDiscard();
      return;
    }
    closeModal(noteModal);
  }

  function confirmDiscard() {
    showConfirmGeneric('Discard changes?', "You have unsaved changes. They'll be lost if you leave now.", 'Discard', () => {
      closeModal(noteModal);
    });
  }

  // generic yes/no using the existing confirm modal (retitles it, restores after)
  const confirmTitleEl = document.getElementById('confirmTitle');
  const confirmBodyEl = confirmModal.querySelector('.modal-body p');
  const DEFAULT_CONFIRM_TITLE = confirmTitleEl.textContent;
  const DEFAULT_CONFIRM_BODY = confirmBodyEl.textContent;
  const DEFAULT_CONFIRM_LABEL = confirmDeleteBtn.textContent;
  let genericConfirmAction = null;

  function showConfirmGeneric(title, body, actionLabel, onConfirm) {
    confirmTitleEl.textContent = title;
    confirmBodyEl.textContent = body;
    confirmDeleteBtn.textContent = actionLabel;
    genericConfirmAction = onConfirm;
    pendingDeleteId = null;
    openModal(confirmModal);
  }

  function resetConfirmModal() {
    confirmTitleEl.textContent = DEFAULT_CONFIRM_TITLE;
    confirmBodyEl.textContent = DEFAULT_CONFIRM_BODY;
    confirmDeleteBtn.textContent = DEFAULT_CONFIRM_LABEL;
    genericConfirmAction = null;
  }

  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    if (!title && !content) {
      showAlert('Write a title or some content first.');
      return;
    }

    if (editingId) {
      const idx = notes.findIndex(n => n.id === editingId);
      if (idx !== -1) {
        notes[idx].title = title;
        notes[idx].content = content;
        notes[idx].updatedAt = Date.now();
      }
      showToast('Note updated');
    } else {
      notes.push({ id: uid(), title, content, createdAt: Date.now(), updatedAt: Date.now() });
      showToast('Note saved');
    }

    formDirty = false;
    saveToStorage();
    closeModal(noteModal);
    renderNotes(searchInput.value);
  });

  noteTitleInput.addEventListener('input', markDirty);
  noteContentInput.addEventListener('input', () => { markDirty(); updateCharCount(); });

  // ---------- alert modal ----------
  const alertModal = document.getElementById('alertModal');
  const alertMessage = document.getElementById('alertMessage');
  const alertOkBtn = document.getElementById('alertOkBtn');
  function showAlert(message) {
    alertMessage.textContent = message;
    openModal(alertModal);
  }
  alertOkBtn.addEventListener('click', () => closeModal(alertModal));

  // ---------- button handlers ----------
  fabBtn.addEventListener('click', openAddModal);
  closeModalBtn.addEventListener('click', () => closeEditor(false));
  cancelBtn.addEventListener('click', () => closeEditor(false));
  closeViewBtn.addEventListener('click', () => closeModal(viewModal));

  copyViewBtn.addEventListener('click', async () => {
    const text = (viewTitle.textContent ? viewTitle.textContent + '\n\n' : '') + viewContent.textContent;
    const ok = await copyToClipboard(text.trim());
    if (ok) {
      vibrate();
      copyViewBtn.classList.add('is-copied');
      copyViewBtn.querySelector('.i-copy').setAttribute('hidden', '');
      copyViewBtn.querySelector('.i-check').removeAttribute('hidden');
      setTimeout(() => {
        copyViewBtn.classList.remove('is-copied');
        copyViewBtn.querySelector('.i-copy').removeAttribute('hidden');
        copyViewBtn.querySelector('.i-check').setAttribute('hidden', '');
      }, 1500);
    } else {
      showToast("Couldn't copy — select the text manually");
    }
  });

  editFromViewBtn.addEventListener('click', () => {
    if (!viewingId) return;
    closeModal(viewModal);
    openEditModal(viewingId);
  });

  deleteFromViewBtn.addEventListener('click', () => {
    if (!viewingId) return;
    confirmDelete(viewingId);
  });

  closeConfirmBtn.addEventListener('click', () => { pendingDeleteId = null; closeModal(confirmModal); resetConfirmModal(); });
  cancelDeleteBtn.addEventListener('click', () => { pendingDeleteId = null; closeModal(confirmModal); resetConfirmModal(); });
  confirmDeleteBtn.addEventListener('click', () => {
    if (genericConfirmAction) {
      const action = genericConfirmAction;
      closeModal(confirmModal);
      resetConfirmModal();
      action();
    } else {
      performDelete();
    }
  });

  // ---------- backdrop click ----------
  [noteModal, viewModal, confirmModal, alertModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target !== modal) return;
      if (modal === noteModal) closeEditor(false);
      else if (modal === confirmModal) { pendingDeleteId = null; closeModal(confirmModal); resetConfirmModal(); }
      else closeModal(modal);
    });
  });

  // ---------- search ----------
  searchInput.addEventListener('input', (e) => renderNotes(e.target.value));
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    renderNotes('');
    searchInput.focus();
  });

  // ---------- grid delegation ----------
  notesGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.note-card');
    if (!card) return;
    const id = card.dataset.id;
    if (e.target.closest('.btn-delete')) { confirmDelete(id); return; }
    openViewModal(id);
  });
  notesGrid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.note-card');
    if (!card || e.target.closest('.btn-delete')) return;
    e.preventDefault();
    openViewModal(card.dataset.id);
  });

  // ---------- keyboard shortcuts ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isOpen(alertModal)) { closeModal(alertModal); return; }
      if (isOpen(confirmModal)) { pendingDeleteId = null; closeModal(confirmModal); resetConfirmModal(); return; }
      if (isOpen(noteModal)) { closeEditor(false); return; }
      if (isOpen(viewModal)) { closeModal(viewModal); return; }
    }
    if ((e.key === 'n' || e.key === 'N') && !isOpen(noteModal) && !isOpen(viewModal) &&
        document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openAddModal();
    }
  });

  // ---------- init ----------
  function init() {
    loadFromStorage();
    renderNotes();
  }
  init();
})();
