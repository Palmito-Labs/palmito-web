
'use strict';
(() => {
  const dialog = document.querySelector('#desktop-navigation');
  const toggle = document.querySelector('.rail-toggle');
  if (!dialog || !toggle || typeof dialog.showModal !== 'function') return;
  const desktop = matchMedia('(min-width: 1024px)');
  document.documentElement.classList.add('side-nav-ready');
  let closing = false;
  function animateLogo() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    toggle.querySelectorAll('animateTransform').forEach(animation => animation.beginElement());
  }
  function closeMenu(immediate = false) {
    if (!dialog.open || closing) return;
    if (immediate || matchMedia('(prefers-reduced-motion: reduce)').matches) { dialog.close(); return; }
    closing = true;
    const animation = dialog.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }], { duration: 320, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
    animation.finished.then(() => { dialog.close(); animation.cancel(); closing = false; }).catch(() => { closing = false; });
  }
  function reflectOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    document.body.classList.toggle('desktop-menu-open', open);
    animateLogo();
  }
  toggle.addEventListener('click', () => {
    if (!desktop.matches) return;
    if (dialog.open) closeMenu();
    else { dialog.showModal(); reflectOpen(true); }
  });
  dialog.querySelector('.side-close').addEventListener('click', () => closeMenu());
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
  dialog.addEventListener('close', () => reflectOpen(false));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeMenu();
  });
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  desktop.addEventListener('change', () => { if (!desktop.matches && dialog.open) closeMenu(true); });
})();

// Keep the first screen aligned below the actual mobile/tablet header.
(() => {
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.mobile-menu');
  const summary = menu?.querySelector('summary');

  if (menu && summary) menu.addEventListener('toggle', () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    summary.querySelectorAll('animateTransform').forEach(animation => animation.beginElement());
  });
  const measure = () => document.documentElement.style.setProperty('--header-height', `${header?.getBoundingClientRect().height || 0}px`);
  if (header && typeof ResizeObserver === 'function') new ResizeObserver(measure).observe(header);
  window.addEventListener('resize', measure);
  measure();
})();
