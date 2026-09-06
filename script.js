(() => {
  'use strict';
  const topLink = document.querySelector('.floating-top');
  const navLinks = [...document.querySelectorAll('.site-header nav a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  document.querySelectorAll('[data-open]').forEach(link => {
    link.addEventListener('click', event => {
      const panel = document.getElementById(link.dataset.open);
      if (!panel) return;
      event.preventDefault();
      panel.open = true;
      history.replaceState(null, '', `#${panel.id}`);
      panel.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
      panel.querySelector('summary')?.focus({preventScroll: true});
    });
  });

  const revealHash = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = id ? document.getElementById(id) : null;
    if (target instanceof HTMLDetailsElement) target.open = true;
    const parent = target?.closest('details');
    if (parent) parent.open = true;
  };
  revealHash();
  addEventListener('hashchange', revealHash);

  let scheduled = false;
  const updateScrollState = () => {
    topLink.hidden = window.scrollY < 600;
    let current = '';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 160) current = `#${section.id}`;
    }
    for (const link of navLinks) {
      if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  };
  addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateScrollState);
    }
  }, {passive: true});
  updateScrollState();
})();
