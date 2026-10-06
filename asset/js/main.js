const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Load external HTML (navbar/footer) into a placeholder
function includeHTML(elementId, filePath, callback) {
    return fetch(filePath)
        .then(res => {
            if (!res.ok) throw new Error(`Failed to load ${filePath}: ${res.statusText}`);
            return res.text();
        })
        .then(html => {
            const el = document.getElementById(elementId);
            if (el) el.innerHTML = html;
            if (callback) callback();
        })
        .catch(err => console.error('Error loading component:', err));
}

// Light/dark toggle
function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = next === 'dark' ? '#0c0e1d' : '#f6f5fc';
    });
}

// Mobile Navbar Drawer Toggle Setup
function initMobileNav() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('is-open');
    });

    // Close menu when clicking on links
    const links = mobileNav.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('is-open');
        });
    });
}

// Highlight active section on scroll
function initScrollSpy() {
    const links = document.querySelectorAll('.nav-link-custom[href^="#"], .dock a[href^="#"]');
    const ids = ['top', 'about', 'skills', 'projects', 'contact'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const setActive = id => links.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + id));

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
}

// Glow effect on cards
function initGlowCards() {
    document.querySelectorAll('.glow-card').forEach(card => {
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });
}

// Code typing effect
function initTyping() {
    const el = document.getElementById('typed');
    if (!el) return;
    const html =
        '<span class="kw">const</span> developer = {\n' +
        '  name: <span class="str">"Thilina Oshan Demel"</span>,\n' +
        '  stack: [<span class="str">"Java"</span>, <span class="str">"React.js"</span>, <span class="str">"PHP"</span>],\n' +
        '  <span class="fn">solveChallenges</span>: <span class="str">"always"</span>\n};';
    if (reduceMotion) { el.innerHTML = html; return; }

    let i = 0;
    const caret = '<span class="caret"></span>';
    (function tick() {
        while (html[i] === '<') i = html.indexOf('>', i) + 1;
        i++;
        el.innerHTML = html.slice(0, i) + caret;
        if (i < html.length) setTimeout(tick, 28);
    })();
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
        window.scrollTo(0, 0);
    }

    includeHTML('navbar-placeholder', 'includes/navbar.html', () => {
        initThemeToggle();
        initMobileNav();
        initScrollSpy();
    });
    includeHTML('footer-placeholder', 'includes/footer.html');
    initGlowCards();
    initTyping();
});