// ── generator.js – Page generation logic ──

let currentZoom = 1.0;

function setPreviewZoom(zoom) {
    currentZoom = Math.max(0.3, Math.min(2.0, zoom));
    applyZoomToPages();
    const zoomLabel = document.getElementById('zoomLabel');
    if (zoomLabel) {
        zoomLabel.textContent = `${Math.round(currentZoom * 100)}%`;
    }
}

function zoomIn() {
    setPreviewZoom(currentZoom + 0.1);
}

function zoomOut() {
    setPreviewZoom(currentZoom - 0.1);
}

function zoomFit() {
    const previewPanel = document.querySelector('.preview-panel');
    if (!previewPanel) return;
    const availableWidth = previewPanel.clientWidth - 48; // padding
    const scale = Math.min(1.0, availableWidth / PAGE_W_PX);
    setPreviewZoom(Math.max(0.4, Math.round(scale * 100) / 100));
}

function applyZoomToPages() {
    document.querySelectorAll('.page-scaler').forEach(scaler => {
        scaler.style.width = `${PAGE_W_PX * currentZoom}px`;
        scaler.style.height = `${PAGE_H_PX * currentZoom}px`;
        const page = scaler.querySelector('.page');
        if (page) {
            page.style.transform = `scale(${currentZoom})`;
        }
    });
}

function generateAssignment() {
    const text = document.getElementById('contentInput').value;
    if (!text.trim()) {
        showToast('Please paste some content first!', 'error');
        return;
    }

    const s = getSettings();
    const container = document.getElementById('pagesContainer');
    container.innerHTML = '';

    // Remove empty preview message
    const emptyMsg = document.querySelector('.empty-preview');
    if (emptyMsg) emptyMsg.remove();

    const lines = wrapText(text, s.fontSize, s.wordSpacing, s.letterSpacing, s.leftMargin);

    // Usable height
    const usableHeight = PAGE_H_PX - s.topMargin - BOTTOM_MARGIN;

    // Title spacing
    const titleText = s.titleText.trim();
    const titleLines = titleText ? 2 : 0;

    const linesPerPage = Math.floor(usableHeight / s.lineSpacing);
    const firstPageLines = Math.max(1, linesPerPage - titleLines);

    // Split lines into chunks
    const pageChunks = [];
    let offset = 0;

    const firstChunk = lines.slice(0, firstPageLines);
    pageChunks.push(firstChunk);
    offset = firstPageLines;

    while (offset < lines.length) {
        pageChunks.push(lines.slice(offset, offset + linesPerPage));
        offset += linesPerPage;
    }

    if (pageChunks.length === 0) pageChunks.push([]);

    pageChunks.forEach((chunk, pageIdx) => {
        const scaler = document.createElement('div');
        scaler.className = 'page-scaler';
        scaler.style.width = `${PAGE_W_PX * currentZoom}px`;
        scaler.style.height = `${PAGE_H_PX * currentZoom}px`;

        const page = createPage(chunk, pageIdx + 1, pageChunks.length, s, pageIdx === 0);
        page.style.transform = `scale(${currentZoom})`;

        scaler.appendChild(page);
        container.appendChild(scaler);
    });

    document.getElementById('downloadBtn').disabled = false;
    showToast(`Generated ${pageChunks.length} page${pageChunks.length > 1 ? 's' : ''}`, 'success');
}

function createPage(textLines, pageNum, totalPages, s, isFirstPage) {
    const page = document.createElement('div');
    page.className = 'page';

    // Paper color
    page.style.backgroundColor = s.paperColor;

    // Paper texture
    page.classList.remove('texture-grain', 'texture-parchment', 'texture-clean');
    if (s.paperTexture === 'grain') page.classList.add('texture-grain');
    else if (s.paperTexture === 'parchment') page.classList.add('texture-parchment');
    else if (s.paperTexture === 'clean') page.classList.add('texture-clean');

    // Border radius
    page.style.borderRadius = s.pageBorderRadius + 'px';

    // Brightness & Contrast filter
    page.style.filter = `brightness(${s.brightness}) contrast(${s.contrast})`;

    // Paper vignette / realistic scan shadow
    const vignette = document.createElement('div');
    vignette.className = 'page-vignette';
    vignette.style.background = 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0, 0, 0, 0.4) 100%)';
    vignette.style.opacity = s.vignette;
    page.appendChild(vignette);

    // Left margin lines
    const leftMargin = s.leftMargin || 88;
    const ml1Pos = leftMargin - 18;
    const ml2Pos = leftMargin - 14;

    const ml1 = document.createElement('div');
    ml1.className = 'margin-line-1';
    ml1.style.left = `${ml1Pos}px`;
    ml1.style.background = hexToRgba(s.marginLineColor, 0.45);
    ml1.style.display = s.showMarginLines ? 'block' : 'none';
    page.appendChild(ml1);

    const ml2 = document.createElement('div');
    ml2.className = 'margin-line-2';
    ml2.style.left = `${ml2Pos}px`;
    ml2.style.background = hexToRgba(s.marginLineColor, 0.25);
    ml2.style.display = s.showMarginLines ? 'block' : 'none';
    page.appendChild(ml2);

    // Top red line
    const topLine = document.createElement('div');
    topLine.className = 'page-top-line';
    topLine.style.top = (s.topMargin - 12) + 'px';
    topLine.style.background = hexToRgba(s.marginLineColor, 0.45);
    topLine.style.display = s.showMarginLines ? 'block' : 'none';
    page.appendChild(topLine);

    // Header
    if (s.headerStyle !== 'none') {
        const header = document.createElement('div');
        header.className = 'page-header';
        const dateStr = s.dateText && s.dateText.trim() ? s.dateText.trim() : '___/___/___';
        if (s.headerStyle === 'datepage') {
            header.innerHTML = `DATE : ${dateStr}<br>PAGE : ${pageNum}`;
        } else if (s.headerStyle === 'dateonly') {
            header.innerHTML = `DATE : ${dateStr}`;
        }
        page.appendChild(header);
    }

    // Ruled lines
    const linesContainer = document.createElement('div');
    linesContainer.className = 'lines-container';
    linesContainer.style.display = s.showRuledLines ? 'block' : 'none';
    const usableHeight = PAGE_H_PX - s.topMargin - BOTTOM_MARGIN;
    const totalLines = Math.floor(usableHeight / s.lineSpacing);
    for (let i = 0; i <= totalLines; i++) {
        const line = document.createElement('div');
        line.className = 'ruled-line';
        line.style.top = (s.topMargin + i * s.lineSpacing) + 'px';
        line.style.background = hexToRgba(s.lineColor, 0.35);
        linesContainer.appendChild(line);
    }
    page.appendChild(linesContainer);

    // Title on first page
    const titleText = s.titleText.trim();
    let titleOffset = 0;
    if (isFirstPage && titleText) {
        const titleFontSize = Math.round(s.fontSize * 1.4);
        const titleEl = document.createElement('div');
        titleEl.className = 'page-title';
        titleEl.textContent = titleText;
        titleEl.style.left = `${leftMargin}px`;
        titleEl.style.fontSize = titleFontSize + 'px';
        titleEl.style.color = s.inkColor;
        titleEl.style.opacity = s.inkOpacity;
        titleEl.style.letterSpacing = s.letterSpacing + 'px';

        const lineY = s.topMargin;
        titleEl.style.top = (lineY - titleFontSize * 0.5) + 'px';

        if (s.textTilt !== 0) {
            titleEl.style.transform = `skewX(${s.textTilt}deg)`;
        }

        page.appendChild(titleEl);
        titleOffset = 2;
    }

    // Text content
    const content = document.createElement('div');
    content.className = 'page-content';
    content.style.left = `${leftMargin}px`;

    textLines.forEach((text, i) => {
        const lineEl = document.createElement('div');
        lineEl.className = 'text-line';
        lineEl.textContent = text;
        lineEl.style.fontSize = s.fontSize + 'px';
        lineEl.style.color = s.inkColor;
        lineEl.style.opacity = s.inkOpacity;
        lineEl.style.wordSpacing = s.wordSpacing + 'px';
        lineEl.style.letterSpacing = s.letterSpacing + 'px';

        // Deterministic baseline wobble for authentic handwriting
        const jitter = s.lineJitter ? Math.sin((pageNum * 50 + i) * 1.8) * s.lineJitter : 0;

        if (s.textTilt !== 0) {
            lineEl.style.transform = `skewX(${s.textTilt}deg)`;
        }

        const lineIdx = i + (isFirstPage ? titleOffset : 0);
        const lineY = s.topMargin + lineIdx * s.lineSpacing + jitter;
        lineEl.style.top = (lineY - s.fontSize * 0.75) + 'px';
        content.appendChild(lineEl);
    });
    page.appendChild(content);

    // Page number
    if (s.showPageNumber !== false) {
        const pageNumEl = document.createElement('div');
        pageNumEl.className = 'page-number';
        pageNumEl.textContent = `Page ${pageNum} / ${totalPages}`;
        page.appendChild(pageNumEl);
    }

    return page;
}

// Live update of existing rendered pages without full re-chunking
function updateLiveStyles() {
    const pages = document.querySelectorAll('#pagesContainer .page');
    if (!pages.length) return;

    const s = getSettings();
    const leftMargin = s.leftMargin || 88;

    pages.forEach(page => {
        page.style.backgroundColor = s.paperColor;
        page.style.filter = `brightness(${s.brightness}) contrast(${s.contrast})`;
        page.style.borderRadius = s.pageBorderRadius + 'px';

        // Textures
        page.classList.remove('texture-grain', 'texture-parchment', 'texture-clean');
        if (s.paperTexture === 'grain') page.classList.add('texture-grain');
        else if (s.paperTexture === 'parchment') page.classList.add('texture-parchment');
        else if (s.paperTexture === 'clean') page.classList.add('texture-clean');

        // Vignette
        const vignette = page.querySelector('.page-vignette');
        if (vignette) vignette.style.opacity = s.vignette;

        // Margins
        const ml1 = page.querySelector('.margin-line-1');
        const ml2 = page.querySelector('.margin-line-2');
        const topLine = page.querySelector('.page-top-line');
        const showMarg = s.showMarginLines ? 'block' : 'none';

        if (ml1) {
            ml1.style.display = showMarg;
            ml1.style.left = `${leftMargin - 18}px`;
            ml1.style.background = hexToRgba(s.marginLineColor, 0.45);
        }
        if (ml2) {
            ml2.style.display = showMarg;
            ml2.style.left = `${leftMargin - 14}px`;
            ml2.style.background = hexToRgba(s.marginLineColor, 0.25);
        }
        if (topLine) {
            topLine.style.display = showMarg;
            topLine.style.background = hexToRgba(s.marginLineColor, 0.45);
        }

        // Ruled lines
        const linesContainer = page.querySelector('.lines-container');
        if (linesContainer) {
            linesContainer.style.display = s.showRuledLines ? 'block' : 'none';
            linesContainer.querySelectorAll('.ruled-line').forEach(line => {
                line.style.background = hexToRgba(s.lineColor, 0.35);
            });
        }

        // Content left alignment
        const content = page.querySelector('.page-content');
        if (content) content.style.left = `${leftMargin}px`;

        // Text lines
        page.querySelectorAll('.text-line').forEach(lineEl => {
            lineEl.style.color = s.inkColor;
            lineEl.style.opacity = s.inkOpacity;
            lineEl.style.wordSpacing = s.wordSpacing + 'px';
            lineEl.style.letterSpacing = s.letterSpacing + 'px';
            lineEl.style.transform = s.textTilt !== 0 ? `skewX(${s.textTilt}deg)` : 'none';
        });

        // Title
        const titleEl = page.querySelector('.page-title');
        if (titleEl) {
            titleEl.style.left = `${leftMargin}px`;
            titleEl.style.color = s.inkColor;
            titleEl.style.opacity = s.inkOpacity;
            titleEl.style.letterSpacing = s.letterSpacing + 'px';
            titleEl.style.transform = s.textTilt !== 0 ? `skewX(${s.textTilt}deg)` : 'none';
        }

        // Page number visibility
        const pageNumEl = page.querySelector('.page-number');
        if (pageNumEl) {
            pageNumEl.style.display = s.showPageNumber !== false ? 'block' : 'none';
        }
    });
}

// Helper: hex color to rgba
function hexToRgba(hex, alpha) {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
