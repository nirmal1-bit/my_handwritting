// ── controls.js – Control panel logic, presets, sidebar ──

// Preset definitions
const PRESETS = {
    notebook: {
        label: '📓 Notebook',
        fontSize: 22, lineSpacing: 32, inkColor: '#1a1a6e', wordSpacing: 4,
        letterSpacing: 0, topMargin: 80, leftMargin: 88, brightness: 1, contrast: 1,
        vignette: 0, lineJitter: 0.5, paperColor: '#fdfaf5', paperTexture: 'none',
        inkOpacity: 1, textTilt: 0, marginLineColor: '#dc5050', showMarginLines: true,
        showRuledLines: true, lineColor: '#96a0af', pageBorderRadius: 0,
        headerStyle: 'datepage', dateText: '', titleText: '', showPageNumber: true
    },
    exam: {
        label: '📝 Exam Paper',
        fontSize: 20, lineSpacing: 30, inkColor: '#0a1128', wordSpacing: 3,
        letterSpacing: 0.5, topMargin: 90, leftMargin: 90, brightness: 1.05, contrast: 1.05,
        vignette: 0, lineJitter: 0.3, paperColor: '#ffffff', paperTexture: 'clean',
        inkOpacity: 1, textTilt: 0, marginLineColor: '#dc5050', showMarginLines: true,
        showRuledLines: true, lineColor: '#b0b8c4', pageBorderRadius: 0,
        headerStyle: 'datepage', dateText: '', titleText: '', showPageNumber: true
    },
    clean: {
        label: '🧻 Clean Sheet',
        fontSize: 24, lineSpacing: 34, inkColor: '#222244', wordSpacing: 5,
        letterSpacing: 0, topMargin: 70, leftMargin: 70, brightness: 1.1, contrast: 1,
        vignette: 0, lineJitter: 0, paperColor: '#ffffff', paperTexture: 'clean',
        inkOpacity: 0.95, textTilt: 0, marginLineColor: '#dc5050', showMarginLines: false,
        showRuledLines: false, lineColor: '#96a0af', pageBorderRadius: 4,
        headerStyle: 'none', dateText: '', titleText: '', showPageNumber: true
    },
    vintage: {
        label: '📜 Vintage',
        fontSize: 21, lineSpacing: 31, inkColor: '#2a1a0a', wordSpacing: 4,
        letterSpacing: 0.3, topMargin: 85, leftMargin: 88, brightness: 0.92, contrast: 1.1,
        vignette: 0.35, lineJitter: 1.2, paperColor: '#f0e6d0', paperTexture: 'parchment',
        inkOpacity: 0.85, textTilt: -1, marginLineColor: '#a06030', showMarginLines: true,
        showRuledLines: true, lineColor: '#b09878', pageBorderRadius: 2,
        headerStyle: 'dateonly', dateText: '', titleText: '', showPageNumber: true
    }
};

// Pen ink presets
const PEN_PRESETS = {
    ballpoint: { color: '#1a1a6e', opacity: 1.0 },
    gel: { color: '#0a1128', opacity: 1.0 },
    fountain: { color: '#192a56', opacity: 0.95 },
    pencil: { color: '#3d3d3d', opacity: 0.8 },
    red: { color: '#a71d2a', opacity: 1.0 }
};

// Get all control values as settings object
function getSettings() {
    const val = (id, fallback) => {
        const el = document.getElementById(id);
        return el ? el.value : fallback;
    };
    const checked = (id, fallback) => {
        const el = document.getElementById(id);
        return el ? el.checked : fallback;
    };

    return {
        fontSize: parseInt(val('fontSize', 22)),
        lineSpacing: parseInt(val('lineSpacing', 32)),
        inkColor: val('inkColor', '#1a1a6e'),
        wordSpacing: parseInt(val('wordSpacing', 4)),
        letterSpacing: parseFloat(val('letterSpacing', 0)),
        topMargin: parseInt(val('topMargin', 80)),
        leftMargin: parseInt(val('leftMargin', 88)),
        brightness: parseFloat(val('brightness', 1.0)),
        contrast: parseFloat(val('contrast', 1.0)),
        vignette: parseFloat(val('vignette', 0)),
        paperColor: val('paperColor', '#fdfaf5'),
        paperTexture: val('paperTexture', 'none'),
        inkOpacity: parseFloat(val('inkOpacity', 1.0)),
        textTilt: parseFloat(val('textTilt', 0)),
        lineJitter: parseFloat(val('lineJitter', 0.5)),
        marginLineColor: val('marginLineColor', '#dc5050'),
        showMarginLines: checked('showMarginLines', true),
        showRuledLines: checked('showRuledLines', true),
        lineColor: val('lineColor', '#96a0af'),
        pageBorderRadius: parseInt(val('pageBorderRadius', 0)),
        headerStyle: val('headerStyle', 'datepage'),
        dateText: val('dateText', ''),
        titleText: val('titleText', ''),
        showPageNumber: checked('showPageNumber', true),
    };
}

// Apply a preset
function applyPreset(presetName) {
    const preset = PRESETS[presetName];
    if (!preset) return;

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };
    const setChecked = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.checked = val;
    };

    setVal('fontSize', preset.fontSize);
    setVal('lineSpacing', preset.lineSpacing);
    setVal('inkColor', preset.inkColor);
    setVal('wordSpacing', preset.wordSpacing);
    setVal('letterSpacing', preset.letterSpacing);
    setVal('topMargin', preset.topMargin);
    setVal('leftMargin', preset.leftMargin || 88);
    setVal('brightness', preset.brightness);
    setVal('contrast', preset.contrast);
    setVal('vignette', preset.vignette !== undefined ? preset.vignette : 0);
    setVal('paperColor', preset.paperColor);
    setVal('paperTexture', preset.paperTexture);
    setVal('inkOpacity', preset.inkOpacity);
    setVal('textTilt', preset.textTilt);
    setVal('lineJitter', preset.lineJitter !== undefined ? preset.lineJitter : 0.5);
    setVal('marginLineColor', preset.marginLineColor);
    setChecked('showMarginLines', preset.showMarginLines);
    setChecked('showRuledLines', preset.showRuledLines);
    setVal('lineColor', preset.lineColor);
    setVal('pageBorderRadius', preset.pageBorderRadius);
    setVal('headerStyle', preset.headerStyle);
    setVal('dateText', preset.dateText || '');
    setVal('titleText', preset.titleText || '');
    setChecked('showPageNumber', preset.showPageNumber !== false);

    updateAllBadges();
    updateAllSwatches();

    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.preset-btn[data-preset="${presetName}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    showToast(`${preset.label} preset applied`, 'success');

    // Auto-re-render if content exists
    const text = document.getElementById('contentInput').value;
    if (text.trim()) {
        generateAssignment();
    }
}

// Update all range badges
function updateAllBadges() {
    document.querySelectorAll('input[type="range"]').forEach(input => {
        const badge = input.parentElement.querySelector('.range-badge');
        if (badge) {
            const suffix = input.dataset.suffix || '';
            badge.textContent = input.value + suffix;
        }
    });
}

// Update all color swatches
function updateAllSwatches() {
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        const input = swatch.querySelector('input[type="color"]');
        if (input) {
            swatch.style.backgroundColor = input.value;
            const hexLabel = swatch.parentElement.querySelector('.color-hex');
            if (hexLabel) hexLabel.textContent = input.value;
        }
    });
}

// Debounce helper
let layoutDebounceTimer = null;
function triggerLayoutUpdate() {
    clearTimeout(layoutDebounceTimer);
    layoutDebounceTimer = setTimeout(() => {
        const hasPages = document.querySelectorAll('#pagesContainer .page').length > 0;
        const text = document.getElementById('contentInput').value.trim();
        if (hasPages && text) {
            generateAssignment();
        }
    }, 350);
}

// Initialize controls
function initControls() {
    // Section collapse toggles
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('collapsed');
        });
    });

    // Range slider badge updates & live style sync
    document.querySelectorAll('input[type="range"]').forEach(input => {
        const badge = input.parentElement.querySelector('.range-badge');
        const suffix = input.dataset.suffix || '';
        if (badge) badge.textContent = input.value + suffix;

        input.addEventListener('input', () => {
            if (badge) badge.textContent = input.value + suffix;

            // Direct visual updates
            const liveAttrs = ['brightness', 'contrast', 'vignette', 'inkOpacity', 'textTilt', 'lineJitter', 'pageBorderRadius'];
            if (liveAttrs.includes(input.id)) {
                updateLiveStyles();
            } else {
                // Layout updates
                triggerLayoutUpdate();
            }
        });
    });

    // Color swatch updates & live sync
    document.querySelectorAll('.color-swatch input[type="color"]').forEach(input => {
        const swatch = input.parentElement;
        const hexLabel = swatch.parentElement.querySelector('.color-hex');
        swatch.style.backgroundColor = input.value;
        if (hexLabel) hexLabel.textContent = input.value;

        input.addEventListener('input', () => {
            swatch.style.backgroundColor = input.value;
            if (hexLabel) hexLabel.textContent = input.value;
            updateLiveStyles();
        });
    });

    // Checkboxes (toggles) & selects live sync
    document.querySelectorAll('.sidebar input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            updateLiveStyles();
        });
    });

    document.querySelectorAll('.sidebar select').forEach(sel => {
        sel.addEventListener('change', () => {
            if (sel.id === 'paperTexture') {
                updateLiveStyles();
            } else {
                triggerLayoutUpdate();
            }
        });
    });

    // Title / Date text live updates
    const titleText = document.getElementById('titleText');
    if (titleText) titleText.addEventListener('input', triggerLayoutUpdate);

    const dateText = document.getElementById('dateText');
    if (dateText) dateText.addEventListener('input', triggerLayoutUpdate);

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyPreset(btn.dataset.preset);
        });
    });

    // Pen quick swatches
    document.querySelectorAll('.pen-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const penType = pill.dataset.pen;
            const pen = PEN_PRESETS[penType];
            if (!pen) return;

            const inkColorInput = document.getElementById('inkColor');
            const inkOpacityInput = document.getElementById('inkOpacity');

            if (inkColorInput) {
                inkColorInput.value = pen.color;
                const swatch = inkColorInput.parentElement;
                if (swatch) swatch.style.backgroundColor = pen.color;
                const hexLabel = swatch.parentElement.querySelector('.color-hex');
                if (hexLabel) hexLabel.textContent = pen.color;
            }
            if (inkOpacityInput) {
                inkOpacityInput.value = pen.opacity;
                const badge = inkOpacityInput.parentElement.querySelector('.range-badge');
                if (badge) badge.textContent = pen.opacity;
            }

            updateLiveStyles();
            showToast(`Selected ${pill.textContent.trim()}`, 'info');
        });
    });

    // Text counter
    const textarea = document.getElementById('contentInput');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');

    if (textarea && wordCount && charCount) {
        const updateCounts = () => {
            const counts = countText(textarea.value);
            wordCount.textContent = counts.words + ' words';
            charCount.textContent = counts.chars + ' chars';
        };
        textarea.addEventListener('input', updateCounts);
        updateCounts();

        // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to generate
        textarea.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                generateAssignment();
            }
        });
    }

    // Sample assignment loader
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', () => {
            if (textarea) {
                textarea.value = SAMPLE_ASSIGNMENT;
                const counts = countText(textarea.value);
                if (wordCount) wordCount.textContent = counts.words + ' words';
                if (charCount) charCount.textContent = counts.chars + ' chars';

                const titleInput = document.getElementById('titleText');
                if (titleInput) titleInput.value = 'Artificial Neural Networks';

                generateAssignment();
                showToast('Sample assignment loaded!', 'success');
            }
        });
    }

    // Clear content button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (textarea && textarea.value) {
                textarea.value = '';
                const counts = countText('');
                if (wordCount) wordCount.textContent = '0 words';
                if (charCount) charCount.textContent = '0 chars';
                document.getElementById('pagesContainer').innerHTML = `
                    <div class="empty-preview">
                        <div class="empty-icon">📝</div>
                        <p>Paste your content in the text area and click <strong>Generate</strong> to see your handwritten pages here.</p>
                    </div>
                `;
                document.getElementById('downloadBtn').disabled = true;
                showToast('Cleared content', 'info');
            }
        });
    }

    // Sidebar mobile toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    // Zoom controls
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomFitBtn = document.getElementById('zoomFitBtn');

    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
    if (zoomFitBtn) zoomFitBtn.addEventListener('click', zoomFit);

    // Auto-fit on smaller screens on initial load
    if (window.innerWidth <= 1200) {
        setTimeout(zoomFit, 100);
    }
}
