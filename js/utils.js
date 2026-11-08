// ── utils.js – Text measurement, word wrapping, helpers ──

// Page dimensions in px at 96 dpi (A4)
const PAGE_W_PX = 793.7;  // 210mm
const PAGE_H_PX = 1122.5; // 297mm
const DEFAULT_LEFT_MARGIN = 88;
const RIGHT_MARGIN = 30;
const BOTTOM_MARGIN = 50;

// Canvas-based text measurement
let measureCanvas = null;
function measureText(text, fontSize, wordSpacing, letterSpacing) {
    if (!measureCanvas) measureCanvas = document.createElement('canvas');
    const ctx = measureCanvas.getContext('2d');
    ctx.font = `${fontSize}px MyHandwriting, cursive`;
    let width = 0;
    for (let i = 0; i < text.length; i++) {
        width += ctx.measureText(text[i]).width;
        if (i < text.length - 1) width += letterSpacing;
        if (text[i] === ' ') width += wordSpacing;
    }
    return width;
}

// Word-wrap text into lines that fit content width
function wrapText(text, fontSize, wordSpacing, letterSpacing, leftMargin = DEFAULT_LEFT_MARGIN) {
    const contentWidth = PAGE_W_PX - leftMargin - RIGHT_MARGIN;
    const paragraphs = text.split('\n');
    const lines = [];

    for (const para of paragraphs) {
        if (para.trim() === '') {
            lines.push('');
            continue;
        }
        const words = para.split(/\s+/);
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const w = measureText(testLine, fontSize, wordSpacing, letterSpacing);
            if (w > contentWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);
    }
    return lines;
}

// Count words and characters
function countText(text) {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { chars, words };
}

// Toast notifications
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { info: 'ℹ️', success: '✅', error: '❌' };
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
}

// Sample assignment content
const SAMPLE_ASSIGNMENT = `The Theory of Artificial Neural Networks

Artificial neural networks (ANNs) are computational models inspired by the biological neural structures of the human brain. They consist of interconnected processing units called neurons or nodes, structured into layers: an input layer, one or more hidden layers, and an output layer.

Each connection between neurons carries an associated numerical weight. During the forward pass, input data is multiplied by these weights, summed across incoming connections, and adjusted with a bias term before passing through an activation function like ReLU, Sigmoid, or GELU.

The learning process occurs primarily via backpropagation, an application of the mathematical chain rule that calculates the gradient of the loss function with respect to each model parameter. Optimizers such as Adam or Stochastic Gradient Descent (SGD) iteratively adjust weights to minimize total loss.

Key Applications:
1. Computer Vision: Object detection, image segmentation, and medical imaging analysis.
2. Natural Language Processing: Machine translation, sentiment analysis, and large language models.
3. Autonomous Robotics: Real-time sensor fusion, path planning, and obstacle avoidance.

In conclusion, deep neural networks have fundamentally transformed modern artificial intelligence by enabling computational systems to discover rich hierarchical representations directly from complex raw data.`;
