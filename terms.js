(function () {
    'use strict';

    const STORAGE_KEY = 'hashCracker.terms';
    const TERMS_VERSION = 1; // bump this to ask everyone to accept again

    const modal = document.getElementById('termsModal');
    if (!modal) return;

    const checkbox = document.getElementById('termsCheck');
    const checkWrap = document.getElementById('termsCheckWrap');
    const acceptBtn = document.getElementById('termsAccept');
    const closeBtn = document.getElementById('termsClose');
    const acceptedNote = document.getElementById('termsAccepted');
    const openBtn = document.getElementById('openTerms');

    let mode = 'first';
    let returnFocus = null;
    const inertTargets = [];

    function readAccepted() {
        try {
            const v = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return v && v.version >= TERMS_VERSION ? v : null;
        } catch (e) {
            return null;
        }
    }

    function saveAccepted() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: TERMS_VERSION, at: Date.now() }));
        } catch (e) { /* storage blocked: dialog will simply show again next visit */ }
    }

    function setBackgroundInert(on) {
        if (on) {
            Array.from(document.body.children).forEach(el => {
                if (el === modal || el.tagName === 'SCRIPT' || el.id === 'toast') return;
                if (!el.inert) { el.inert = true; inertTargets.push(el); }
            });
        } else {
            inertTargets.splice(0).forEach(el => { el.inert = false; });
        }
    }

    function open(nextMode) {
        mode = nextMode;
        returnFocus = document.activeElement;
        const accepted = readAccepted();

        if (mode === 'first') {
            checkbox.checked = false;
            checkWrap.hidden = false;
            acceptedNote.hidden = true;
            acceptBtn.disabled = true;
            acceptBtn.textContent = 'Continue';
            closeBtn.hidden = true;
        } else {
            checkWrap.hidden = true;
            acceptedNote.hidden = false;
            acceptedNote.textContent = accepted
                ? 'You accepted these terms on ' + new Date(accepted.at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + '.'
                : '';
            acceptBtn.disabled = false;
            acceptBtn.textContent = 'Close';
            closeBtn.hidden = false;
        }

        modal.hidden = false;
        document.body.classList.add('modal-open');
        setBackgroundInert(true);
        modal.querySelector('.terms-body').scrollTop = 0;
        (mode === 'first' ? checkbox : acceptBtn).focus();
    }

    function close() {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        setBackgroundInert(false);
        if (returnFocus && returnFocus.focus) returnFocus.focus();
    }

    checkbox.addEventListener('change', () => {
        acceptBtn.disabled = !checkbox.checked;
    });

    acceptBtn.addEventListener('click', () => {
        if (mode === 'first') {
            if (!checkbox.checked) return;
            saveAccepted();
        }
        close();
    });

    closeBtn.addEventListener('click', close);

    modal.addEventListener('click', (e) => {
        if (e.target === modal && mode === 'review') close();
    });

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mode === 'review') {
            e.preventDefault();
            close();
            return;
        }
        if (e.key !== 'Tab') return;
        const focusable = Array.from(modal.querySelectorAll('button, input, [tabindex="0"]'))
            .filter(el => !el.disabled && !el.hidden && el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    if (openBtn) {
        openBtn.addEventListener('click', () => open(readAccepted() ? 'review' : 'first'));
    }

    if (!readAccepted()) open('first');
})();
