/**
 * knowway Utility Functions
 * Common helpers used across all pages
 */

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Debounce function for search inputs
 */
function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Update navbar with user info
 */
function updateNavbar() {
    const userContainer = document.getElementById('navbarUser');
    if (!userContainer) return;

    const user = JSON.parse(localStorage.getItem('user'));
    userContainer.innerHTML = user
        ? `<a href="profile.html"><button class="btn btn-sm" style="background:var(--primary);color:var(--crust);width:40px;height:40px;border-radius:var(--radius-full);font-weight:700;">${user.username.charAt(0).toUpperCase()}</button></a>`
        : `<a href="login.html" class="btn btn-secondary btn-sm">Log in</a>`;
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

/**
 * Get current user
 */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}

/**
 * Format category label
 */
function formatCategory(cat) {
    const labels = { dev: 'Development', design: 'Design', marketing: 'Marketing' };
    return labels[cat] || cat;
}

/**
 * Format date
 */
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Parse simple markdown to HTML
 */
function parseMarkdown(content) {
    if (!content) return '';

    // Process code blocks first (preserve them)
    const codeBlocks = [];
    content = content.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        codeBlocks.push(`<pre><code>${escapeHtml(code.trim())}</code></pre>`);
        return `%%CODEBLOCK${codeBlocks.length - 1}%%`;
    });

    let html = content
        // Headings
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`(.+?)`/g, '<code>$1</code>')
        // Images and links
        .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1">')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Process lists
    const lines = html.split('\n');
    let result = [];
    let listStack = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const ulMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
        const olMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);

        if (ulMatch) {
            const indent = ulMatch[1].length;
            const text = ulMatch[2];
            const level = Math.floor(indent / 2);

            while (listStack.length > level + 1) {
                result.push(listStack.pop() === 'ul' ? '</ul>' : '</ol>');
            }
            if (listStack.length <= level) {
                result.push('<ul>');
                listStack.push('ul');
            }
            result.push(`<li>${text}</li>`);
        } else if (olMatch) {
            const indent = olMatch[1].length;
            const text = olMatch[3];
            const level = Math.floor(indent / 2);

            while (listStack.length > level + 1) {
                result.push(listStack.pop() === 'ul' ? '</ul>' : '</ol>');
            }
            if (listStack.length <= level) {
                result.push('<ol>');
                listStack.push('ol');
            }
            result.push(`<li>${text}</li>`);
        } else {
            while (listStack.length > 0) {
                result.push(listStack.pop() === 'ul' ? '</ul>' : '</ol>');
            }
            if (line.trim() && !line.startsWith('<h') && !line.startsWith('<')) {
                result.push(`<p>${line}</p>`);
            } else {
                result.push(line);
            }
        }
    }

    while (listStack.length > 0) {
        result.push(listStack.pop() === 'ul' ? '</ul>' : '</ol>');
    }

    html = result.join('\n');

    // Restore code blocks
    codeBlocks.forEach((block, i) => {
        html = html.replace(`%%CODEBLOCK${i}%%`, block);
    });

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
}

/**
 * Get YouTube/Vimeo embed URL
 */
function getVideoEmbedUrl(url) {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
}
