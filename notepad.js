/* Modern Notes App — script.js */
(() => {
  // DOM elements
  const notesGrid = document.getElementById('notesGrid');
  const fabBtn = document.getElementById('fabBtn');
  const noteModal = document.getElementById('noteModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const noteForm = document.getElementById('noteForm');
  const modalTitle = document.getElementById('modalTitle');
  const noteTitleInput = document.getElementById('noteTitle');
  const noteContentInput = document.getElementById('noteContent');
  const cancelBtn = document.getElementById('cancelBtn');

  const viewModal = document.getElementById('viewModal');
  const closeViewBtn = document.getElementById('closeViewBtn');
  const viewTitle = document.getElementById('viewTitle');
  const viewContent = document.getElementById('viewContent');
  const viewDate = document.getElementById('viewDate');
  const editFromViewBtn = document.getElementById('editFromViewBtn');
  const deleteFromViewBtn = document.getElementById('deleteFromViewBtn');

  const searchInput = document.getElementById('searchInput');
  const toast = document.getElementById('toast');

  // Confirm modal elements (must exist in HTML as instructed earlier)
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

  // helpers
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);

  const nowFormatted = (ts = Date.now()) => {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const saveToStorage = () => localStorage.setItem(LS_KEY, JSON.stringify(notes));
  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      notes = raw ? JSON.parse(raw) : [];
    } catch (e) {
      notes = [];
    }
  };

  const showToast = (msg = 'Saved') => {
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(6px)';
    }, 1500);
  };

  // render
  function renderNotes(filter = '') {
    notesGrid.innerHTML = '';
    const q = filter.trim().toLowerCase();
    const list = notes
      .slice()
      .sort((a,b) => b.updatedAt - a.updatedAt)
      .filter(n => {
        if (!q) return true;
        return (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q);
      });

    if (list.length === 0) {
      notesGrid.innerHTML = `<div class="empty">ᑎO ᑎOTE YET - ᑕᒪIᑕK ⊹ TO ᗩᗪᗪ OᑎE</div>`;
      return;
    }

    for (const note of list) {
      const card = document.createElement('article');
      card.className = 'card';
      card.dataset.id = note.id;
      card.innerHTML = `
        <div class="card-top">
          <h3 class="title"></h3>
        </div>
        <div class="content"></div>
        <div class="card-footer">
          <div class="date"></div>
          <div class="actions">
            <button class="icon btn-delete" title="Delete note" aria-label="Delete note">🗑</button>
          </div>
        </div>
      `;

      card.querySelector('.title').textContent = note.title || 'ᑌᑎTITᒪEᗪ';
      card.querySelector('.content').textContent = note.content || '';
      card.querySelector('.date').textContent = new Date(note.updatedAt).toLocaleDateString();

      notesGrid.appendChild(card);
    }
  }

  // modal helpers
  function openModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const input = modal.querySelector('input, textarea, button');
    if (input) input.focus();
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Confirm delete flow
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
    showToast('ᗪEᒪETEᗪ');
    if (viewingId === id) {
      closeModal(viewModal);
      viewingId = null;
    }
    pendingDeleteId = null;
    closeModal(confirmModal);
  }

  // CRUD
  function openAddModal() {
    editingId = null;
    modalTitle.textContent = 'ᗩᗪᗪ ᑎOTE';
    noteTitleInput.value = '';
    noteContentInput.value = '';
    openModal(noteModal);
  }

  function openEditModal(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    editingId = id;
    modalTitle.textContent = 'EᗪITE ᑎOTE';
    noteTitleInput.value = note.title || '';
    noteContentInput.value = note.content || '';
    openModal(noteModal);
  }

  function openViewModal(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    viewingId = id;
    viewTitle.textContent = note.title || 'ᑌᑎTITᒪEᗪ';
    viewContent.textContent = note.content || '';
    viewDate.textContent = nowFormatted(note.updatedAt);
    openModal(viewModal);
  }

  // just open our confirm modal
  function deleteNote(id) {
    // open custom confirm modal
    confirmDelete(id);
  }

  // form submit
  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    if (!title && !content) {
  showAlert("𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐚 𝐭𝐢𝐭𝐥𝐞 𝐨𝐫 𝐬𝐨𝐦𝐞 𝐜𝐨𝐧𝐭𝐞𝐧𝐭.");
  return;
    }

    if (editingId) {
      const idx = notes.findIndex(n => n.id === editingId);
      if (idx !== -1) {
        notes[idx].title = title;
        notes[idx].content = content;
        notes[idx].updatedAt = Date.now();
      }
      showToast('ᑌᑭᗪᗩTEᗪ');
    } else {
      const newNote = {
        id: uid(),
        title,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      notes.push(newNote);
      showToast('ՏᗩᐯEᗪ');
    }

    saveToStorage();
    closeModal(noteModal);
    renderNotes(searchInput.value);
  });
  
  // ==== Custom Alert Modal ====
const alertModal = document.getElementById('alertModal');
const alertMessage = document.getElementById('alertMessage');
const alertOkBtn = document.getElementById('alertOkBtn');

function showAlert(message) {
  alertMessage.textContent = message;
  openModal(alertModal);
}

alertOkBtn.addEventListener('click', () => {
  closeModal(alertModal);
});

  // button handlers
  fabBtn.addEventListener('click', openAddModal);
  closeModalBtn.addEventListener('click', () => closeModal(noteModal));
  cancelBtn.addEventListener('click', () => closeModal(noteModal));
  closeViewBtn.addEventListener('click', () => closeModal(viewModal));

  editFromViewBtn.addEventListener('click', () => {
    if (!viewingId) return;
    closeModal(viewModal);
    openEditModal(viewingId);
  });

  // when delete clicked in view modal — open confirm modal
  deleteFromViewBtn.addEventListener('click', () => {
    if (!viewingId) return;
    confirmDelete(viewingId);
  });

  // confirm modal button handlers
  if (closeConfirmBtn) closeConfirmBtn.addEventListener('click', () => {
    pendingDeleteId = null;
    closeModal(confirmModal);
  });
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => {
    pendingDeleteId = null;
    closeModal(confirmModal);
  });
  if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', performDelete);

  // search
  searchInput.addEventListener('input', (e) => {
    renderNotes(e.target.value);
  });

  // click delegation for grid (open view / delete)
  notesGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const id = card.dataset.id;

    if (e.target.closest('.btn-delete')) {
      // open confirm modal for the clicked card
      confirmDelete(id);
      return;
    }

    openViewModal(id);
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (noteModal.getAttribute('aria-hidden') === 'false') closeModal(noteModal);
      if (viewModal.getAttribute('aria-hidden') === 'false') closeModal(viewModal);
      if (confirmModal && confirmModal.getAttribute('aria-hidden') === 'false') {
        pendingDeleteId = null;
        closeModal(confirmModal);
      }
    }
  });

  // initialize
  function init() {
    loadFromStorage();
    renderNotes();
  }
  init();
})();
