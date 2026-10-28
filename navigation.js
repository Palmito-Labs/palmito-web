
'use strict';
(() => {
  const dialog = document.querySelector('#desktop-navigation');
  const toggle = document.querySelector('.rail-toggle');
  if (!dialog || !toggle || typeof dialog.showModal !== 'function') return;
  const desktop = matchMedia('(min-width: 1024px)');
  document.documentElement.classList.add('side-nav-ready');
  let animationTimer;
  function animateLogo() {
    clearTimeout(animationTimer);
    toggle.classList.remove('is-animating');
    void toggle.offsetWidth;
    toggle.classList.add('is-animating');
    animationTimer = setTimeout(() => toggle.classList.remove('is-animating'), 650);
  }
  function reflectOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    document.body.classList.toggle('desktop-menu-open', open);
    animateLogo();
  }
  toggle.addEventListener('click', () => {
    if (!desktop.matches) return;
    if (dialog.open) dialog.close();
    else { dialog.showModal(); reflectOpen(true); }
  });
  dialog.querySelector('.side-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => reflectOpen(false));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));
  desktop.addEventListener('change', () => { if (!desktop.matches && dialog.open) dialog.close(); });
})();
