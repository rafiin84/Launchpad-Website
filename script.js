/* ============================================================
   LAUNCHPAD — Interactions & Animations
   ============================================================ */

(function () {
  'use strict';

  // ── Sticky navbar ──────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile hamburger ───────────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer    = document.querySelector('.mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Smooth scroll ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (drawer) {
        drawer.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
      const offset = navbar ? navbar.offsetHeight + 16 : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Scroll-reveal ──────────────────────────────────────────
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('[data-animate]').forEach((el) => revealObs.observe(el));

  // ── Animated stat counters ─────────────────────────────────
  function animateCounter(el) {
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const final  = el.dataset.final  || '';
    const target = parseFloat(el.dataset.count || '0');
    const dur    = 1800;
    const startT = performance.now();

    function fmt(n) {
      if (target >= 1e9)  return (n / 1e9).toFixed(1) + 'B';
      if (target >= 1e6)  return (n / 1e6).toFixed(1) + 'M';
      if (target >= 1e3)  return (n / 1e3).toFixed(1) + 'K';
      return Math.round(n).toString();
    }

    function tick(now) {
      const pct  = Math.min((now - startT) / dur, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      el.textContent = prefix + fmt(target * ease) + suffix;
      if (pct < 1) requestAnimationFrame(tick);
      else if (final) el.textContent = prefix + final + suffix;
    }
    requestAnimationFrame(tick);
  }

  const statsObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
          statsObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObs.observe(statsSection);

  // ── How-it-works tabs ──────────────────────────────────────
  document.querySelectorAll('.how-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const sec = tab.closest('.how-section') || document;
      const id  = tab.dataset.tab;
      sec.querySelectorAll('.how-tab').forEach((t) => t.classList.toggle('active', t === tab));
      sec.querySelectorAll('.how-content').forEach((c) => c.classList.toggle('active', c.dataset.tab === id));
    });
  });
  document.querySelectorAll('.how-section').forEach((sec) => {
    const first = sec.querySelector('.how-tab');
    if (first && !sec.querySelector('.how-tab.active')) first.click();
  });

  // ── FAQ accordion ──────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ── Pricing toggle ─────────────────────────────────────────
  const pricingToggle = document.querySelector('.toggle-switch');
  if (pricingToggle) {
    let annual = false;
    pricingToggle.addEventListener('click', () => {
      annual = !annual;
      pricingToggle.classList.toggle('on', annual);
      document.querySelectorAll('[data-monthly]').forEach((el) => {
        el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
      });
    });
  }

  // ── AI feature tabs ────────────────────────────────────────
  const aiItems = document.querySelectorAll('.ai-item');
  aiItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      aiItems.forEach((x) => x.classList.remove('active'));
      item.classList.add('active');
    });
    if (i === 0) item.classList.add('active');
  });

  // ── Set mock chart bar heights ─────────────────────────────
  const barH = [35, 52, 42, 68, 55, 80, 100, 72, 88, 62, 92, 58];
  document.querySelectorAll('.mock-bars .mock-bar').forEach((bar, i) => {
    bar.style.height = (barH[i % barH.length]) + '%';
  });

  // ── Active nav link ────────────────────────────────────────
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach((link) => {
    const href = link.getAttribute('href').replace('./', '');
    if (href === page) link.classList.add('active');
  });

})();
