/* ===================================
   main.js — Landing Page Interactions
   =================================== */

(function () {
  'use strict';

  /* ── Utilities ── */
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  /* ─────────────────────────────────────
     1. NAV — scroll-aware sticky header
  ───────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const navToggle = $('navToggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ─────────────────────────────────────
     1b. NAV ACTIVE SECTION INDICATOR
  ───────────────────────────────────── */
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sectionIds = ['about', 'services', 'work', 'process', 'contact'];

  function setActiveLink(id) {
    navLinkEls.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + id);
    });
  }

  // Set active on click immediately
  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').replace('#', '');
      setActiveLink(id);
    });
  });

  // Scroll-based section tracking — finds whichever section is at/past the trigger point
  function updateActiveSection() {
    const triggerY = window.scrollY + window.innerHeight * 0.25; // 25% from top of viewport
    let currentId = sectionIds[0];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top + window.scrollY <= triggerY) {
        currentId = id;
      }
    });

    setActiveLink(currentId);
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection(); // run on load

  /* ─────────────────────────────────────
     2. TERMINAL TYPING — hero headline
  ───────────────────────────────────── */
  const words = [
    'Websites',
    'Workflows',
    'Automations',
    'APIs',
    'Solutions',
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let paused = false;

  const terminalEl = $('terminalText');
  const SPEED_TYPE = 80;
  const SPEED_DELETE = 40;
  const PAUSE_END = 1800;
  const PAUSE_START = 300;

  // Syntax highlight colors for the terminal
  const colors = ['#F0EDE6', '#00FF88', '#7EB8F7', '#FFB86C', '#FF79C6'];

  function typeLoop() {
    if (paused) return;
    const word = words[wordIndex];

    if (!deleting) {
      charIndex++;
      terminalEl.textContent = word.slice(0, charIndex);
      terminalEl.style.color = colors[wordIndex % colors.length];

      if (charIndex === word.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; typeLoop(); }, PAUSE_END);
        return;
      }
    } else {
      charIndex--;
      terminalEl.textContent = word.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        paused = true;
        setTimeout(() => { paused = false; typeLoop(); }, PAUSE_START);
        return;
      }
    }

    setTimeout(typeLoop, deleting ? SPEED_DELETE : SPEED_TYPE);
  }

  // Start after a brief entrance delay
  setTimeout(typeLoop, 900);

  /* ─────────────────────────────────────
     3. CODE WINDOW — animated code typing
  ───────────────────────────────────── */
  const codeLines = [
    { text: '// automation engine', color: '#40506A' },
    { text: 'const workflow = {', color: '#F0EDE6' },
    { text: "  trigger: 'webhook',", color: '#7EB8F7' },
    { text: "  steps: [", color: '#F0EDE6' },
    { text: "    fetchLeads(),", color: '#00FF88' },
    { text: "    enrichData(),", color: '#00FF88' },
    { text: "    sendToSlack(),", color: '#00FF88' },
    { text: "    updateCRM(),", color: '#00FF88' },
    { text: "  ],", color: '#F0EDE6' },
    { text: "  retry: true,", color: '#7EB8F7' },
    { text: "  notify: true,", color: '#7EB8F7' },
    { text: '};', color: '#F0EDE6' },
    { text: '', color: '' },
    { text: 'await workflow.run();', color: '#FFB86C' },
    { text: '// ✓ 247 leads processed', color: '#00FF88' },
  ];

  const codeEl = $('codeContent');
  let lineIdx = 0;

  function appendCodeLine() {
    if (lineIdx >= codeLines.length) {
      // After full render, add subtle glow to done badge
      return;
    }
    const line = codeLines[lineIdx];
    const span = document.createElement('span');
    span.style.color = line.color || 'inherit';
    span.style.display = 'block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(4px)';
    span.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    span.textContent = line.text;
    codeEl.appendChild(span);

    // Force reflow for transition
    span.getBoundingClientRect();
    span.style.opacity = '1';
    span.style.transform = 'translateY(0)';

    lineIdx++;
    const delay = line.text.length > 0 ? 160 : 80;
    setTimeout(appendCodeLine, delay);
  }

  setTimeout(appendCodeLine, 400);

  /* ─────────────────────────────────────
     4. INTERSECTION OBSERVER — scroll reveals
  ───────────────────────────────────── */
  const revealEls = $$('.project-row, .service-card, .section-header, .contact-inner, .hero-stats, .about-photo-wrap, .about-content, .about-tags');

  // Add reveal class to elements
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger sibling about elements slightly
        const delay = entry.target.classList.contains('about-content') ? 150 : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* Process steps observer */
  const processSteps = $$('.process-step');
  const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });

  processSteps.forEach(el => processObserver.observe(el));

  /* ─────────────────────────────────────
     5. COUNTER ANIMATION — hero stats
  ───────────────────────────────────── */
  const statNums = $$('.stat-num');
  // Match the stat numbers in the HTML (12+, 8+, 5)
  const targets = [12, 8, 5];

  let countersStarted = false;

  const heroSection = document.querySelector('.hero');
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      animateCounters();
    }
  }, { threshold: 0.5 });

  counterObserver.observe(heroSection);

  function animateCounters() {
    statNums.forEach((el, i) => {
      if (targets[i] === null) return; // skip ∞
      const target = targets[i];
      const suffix = el.textContent.includes('%') ? '%' : '+';
      let start = 0;
      const duration = 1200;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
        const val = Math.round(eased * target);
        el.textContent = val + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  /* ─────────────────────────────────────
     6. SERVICE CARDS — keyboard nav
  ───────────────────────────────────── */
  const serviceCards = $$('.service-card');
  serviceCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.addEventListener('mouseenter', () => card.classList.add('active'));
    card.addEventListener('mouseleave', () => card.classList.remove('active'));
  });

  /* ─────────────────────────────────────
     7. CONTACT FORM — submission feedback
  ───────────────────────────────────── */
  const form = $('contactForm');
  const submitBtn = $('submitBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = $('nameInput').value.trim();
    const email = $('emailInput').value.trim();
    const project = $('projectInput').value.trim();

    if (!name || !email || !project) {
      shakeForm();
      return;
    }

    // Simulate send
    submitBtn.classList.add('sending');
    submitBtn.querySelector('.btn-submit-text').textContent = 'Sending…';

    setTimeout(() => {
      submitBtn.style.background = '#00FF88';
      submitBtn.querySelector('.btn-submit-text').textContent = 'Message Sent ✓';
      submitBtn.querySelector('.btn-submit-arrow').textContent = '';
      form.reset();

      setTimeout(() => {
        submitBtn.classList.remove('sending');
        submitBtn.style.background = '';
        submitBtn.querySelector('.btn-submit-text').textContent = 'Send Message';
        submitBtn.querySelector('.btn-submit-arrow').textContent = '→';
      }, 3000);
    }, 1200);
  });

  function shakeForm() {
    form.style.animation = 'none';
    form.classList.add('shake');
    form.addEventListener('animationend', () => form.classList.remove('shake'), { once: true });
  }

  /* ─────────────────────────────────────
     8. CURSOR GLITCH — subtle accent glow
     follows mouse on hero
  ───────────────────────────────────── */
  const hero = document.querySelector('.hero');
  let glowEl = null;

  hero.addEventListener('mousemove', (e) => {
    if (!glowEl) {
      glowEl = document.createElement('div');
      glowEl.style.cssText = `
        position: absolute;
        width: 400px; height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        z-index: 0;
      `;
      hero.style.position = 'relative';
      hero.appendChild(glowEl);
    }
    const rect = hero.getBoundingClientRect();
    glowEl.style.left = (e.clientX - rect.left) + 'px';
    glowEl.style.top = (e.clientY - rect.top) + 'px';
    glowEl.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', () => {
    if (glowEl) glowEl.style.opacity = '0';
  });

  /* ─────────────────────────────────────
     9. ADD SHAKE KEYFRAME via JS
  ───────────────────────────────────── */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
    .shake { animation: shake 0.4s ease; }
  `;
  document.head.appendChild(styleEl);

  /* ─────────────────────────────────────
     10. ABOUT PHOTO — show/hide placeholder
     To use your photo: set the img src to
     your file name, e.g. "profile.jpg".
     The placeholder hides automatically.
  ───────────────────────────────────── */
  const aboutImg = $('aboutImg');
  const photoPlaceholder = $('photoPlaceholder');

  function syncPhotoState() {
    const hasSrc = aboutImg && aboutImg.src && !aboutImg.src.endsWith('/');
    if (hasSrc) {
      // Photo is set — hide placeholder, show image
      photoPlaceholder.style.display = 'none';
      aboutImg.style.display = 'block';
    } else {
      // No photo yet — show placeholder
      photoPlaceholder.style.display = 'flex';
      if (aboutImg) aboutImg.style.display = 'none';
    }
  }

  // Run on load
  syncPhotoState();

  // Also handle onload in case the image loads after
  if (aboutImg) {
    aboutImg.addEventListener('load', () => {
      photoPlaceholder.style.display = 'none';
      aboutImg.style.display = 'block';
    });
    aboutImg.addEventListener('error', () => {
      photoPlaceholder.style.display = 'flex';
      aboutImg.style.display = 'none';
    });
  }

})();
