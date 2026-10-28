
'use strict';
(() => {
  const dialog = document.querySelector('#desktop-navigation');
  const rail = document.querySelector('.desktop-rail');
  const panel = dialog?.querySelector('.side-panel');
  const toggle = rail?.querySelector('.rail-toggle');
  if (!dialog || !rail || !panel || !toggle || typeof dialog.showModal !== 'function') return;
  const desktop = matchMedia('(min-width: 1024px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const home = document.createComment('Desktop rail returns here when the menu closes');
  rail.before(home);
  document.documentElement.classList.add('side-nav-ready');
  let closing = false;
  let exitAnimation;
  function animateLogo() {
    if (!reduced.matches) toggle.querySelectorAll('animateTransform').forEach(animation => animation.beginElement());
  }
  function openMenu() {
    // Keep the real rail in the modal's top layer, above the sliding panel.
    dialog.prepend(rail);
    dialog.showModal();
    void rail.offsetWidth;
    document.body.classList.add('desktop-menu-open', 'menu-modal-active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    animateLogo();
  }
  function closeMenu(immediate = false, afterClose) {
    if (!dialog.open) return;
    if (immediate) {
      exitAnimation?.cancel(); closing = false; dialog.close(); afterClose?.(); return;
    }
    if (closing) return;
    closing = true;
    document.body.classList.remove('desktop-menu-open');
    animateLogo();
    if (reduced.matches) { dialog.close(); afterClose?.(); return; }
    exitAnimation = panel.animate([{ transform: getComputedStyle(panel).transform }, { transform: 'translateX(-100%)' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
    exitAnimation.finished.then(() => { dialog.close(); exitAnimation.cancel(); afterClose?.(); }).catch(() => {});
  }
  toggle.addEventListener('click', () => {
    if (!desktop.matches) return;
    if (dialog.open) closeMenu(); else openMenu();
  });
  dialog.querySelector('.side-close').addEventListener('click', () => closeMenu());
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
  dialog.addEventListener('close', () => {
    home.after(rail);
    document.body.classList.remove('desktop-menu-open', 'menu-modal-active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú de navegación');
    closing = false;
    toggle.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeMenu(); });
  [...dialog.querySelectorAll('a'), ...rail.querySelectorAll('a')].forEach(link => link.addEventListener('click', event => {
    if (!dialog.open || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu(false, () => location.assign(link.href));
  }));
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
