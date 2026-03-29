/* ═══════════════════════════════════════════════════════
   WEJOY — script.js
   Content protection + UI interactions
   ═══════════════════════════════════════════════════════ */

/* ── 0. MARK JS AS READY (enables CSS animations safely) ─ */
// Add class to body so CSS animations only activate after JS loads
// This prevents content being permanently invisible if JS/observer fails
document.documentElement.addEventListener('DOMContentLoaded', function() {
  document.body.classList.add('js-ready');
});
// Fallback: add immediately if DOM already loaded
if (document.readyState !== 'loading') {
  document.body.classList.add('js-ready');
}

/* ── 1. CONTENT PROTECTION ────────────────────────────── */

// Block right-click context menu
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

// Block keyboard shortcuts: Ctrl/Cmd + S, U, P, A, C, Shift+I/J/C, F12
document.addEventListener('keydown', function(e) {
  var ctrl = e.ctrlKey || e.metaKey;
  var key  = e.key.toLowerCase();

  // Block Ctrl+S (save), Ctrl+U (view source), Ctrl+P (print)
  if (ctrl && (key === 's' || key === 'u' || key === 'p')) {
    e.preventDefault();
    return false;
  }

  // Block Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
  if (ctrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
    e.preventDefault();
    return false;
  }

  // Block F12 (DevTools)
  if (e.key === 'F12') {
    e.preventDefault();
    return false;
  }

  // Block Ctrl+A (select all)
  if (ctrl && key === 'a') {
    e.preventDefault();
    return false;
  }
});

// Block drag events (image dragging)
document.addEventListener('dragstart', function(e) {
  e.preventDefault();
  return false;
});

// Block copy event
document.addEventListener('copy', function(e) {
  e.preventDefault();
  return false;
});

// Block print screen (best effort — browsers limit this)
document.addEventListener('keyup', function(e) {
  if (e.key === 'PrintScreen') {
    navigator.clipboard.writeText('');
  }
});


/* ── 2. NAVIGATION ────────────────────────────────────── */

// Scroll shadow on navbar
var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Active nav link on scroll
var sections  = document.querySelectorAll('section[id]');
var navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', function() {
  var scrollPos = window.scrollY + 120;
  sections.forEach(function(sec) {
    var top    = sec.offsetTop;
    var bottom = top + sec.offsetHeight;
    var id     = sec.getAttribute('id');
    if (scrollPos >= top && scrollPos < bottom) {
      navAnchors.forEach(function(a) {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + id) {
          a.classList.add('active');
        }
      });
    }
  });
}, { passive: true });

// Mobile menu toggle
function toggleMenu() {
  var menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}


/* ── 3. SCROLL REVEAL ─────────────────────────────────── */

var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.05,
  rootMargin: '0px 0px 0px 0px'
});

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});

// Also trigger all elements already in view on page load
setTimeout(function() {
  document.querySelectorAll('.reveal').forEach(function(el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      el.classList.add('visible');
    }
  });
}, 100);


/* ── 4. FOOTER YEAR ───────────────────────────────────── */

var yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── 5. SMOOTH SCROLL (backup for older browsers) ──────── */

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});