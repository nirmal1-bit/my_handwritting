// ── pdf.js – PDF download logic ──

async function downloadPDF() {
    const container = document.getElementById('pagesContainer');
    const pages = container.querySelectorAll('.page');
    if (!pages.length) {
        showToast('Generate pages first!', 'error');
        return;
    }

    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('active');

    try {
        const titleInput = document.getElementById('titleText');
        const customTitle = titleInput && titleInput.value.trim() ? titleInput.value.trim().replace(/[^a-zA-Z0-9_-]/g, '_') : 'assignment';
        const filename = `${customTitle}_handwritten.pdf`;

        const opt = {
            margin: 0,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false,
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: { mode: ['css', 'legacy'], avoid: '.page' }
        };

        // Build a wrapper for clean PDF output
        const wrapper = document.createElement('div');
        wrapper.style.background = 'white';
        wrapper.style.width = '210mm';

        pages.forEach((p, i) => {
            const clone = p.cloneNode(true);
            clone.style.boxShadow = 'none';
            clone.style.margin = '0';
            clone.style.transform = 'none'; // reset preview zoom scale
            clone.style.width = '210mm';
            clone.style.height = '297mm';
            if (i < pages.length - 1) {
                clone.style.pageBreakAfter = 'always';
            }
            wrapper.appendChild(clone);
        });

        // Temporarily add to DOM for rendering
        wrapper.style.position = 'absolute';
        wrapper.style.left = '-9999px';
        wrapper.style.top = '0';
        document.body.appendChild(wrapper);

        await html2pdf().set(opt).from(wrapper).save();

        document.body.removeChild(wrapper);
        showToast('PDF downloaded successfully!', 'success');
    } catch (err) {
        console.error('PDF generation error:', err);
        showToast('Error generating PDF. Check console for details.', 'error');
    } finally {
        overlay.classList.remove('active');
    }
}
