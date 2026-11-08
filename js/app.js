// ── app.js – Main app initialization ──

document.addEventListener('DOMContentLoaded', () => {
    initControls();

    // Set default preset highlight
    const notebookBtn = document.querySelector('.preset-btn[data-preset="notebook"]');
    if (notebookBtn) notebookBtn.classList.add('active');
});
