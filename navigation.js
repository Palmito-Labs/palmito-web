
'use strict';
(() => {
  const dialog = document.querySelector('#desktop-navigation');
  const rail = document.querySelector('.desktop-rail');
  const header = document.querySelector('.site-header');
  const panel = dialog?.querySelector('.side-panel');
  const scrim = dialog?.querySelector('.side-scrim');
  const railToggle = rail?.querySelector('.rail-toggle');
  const summary = header?.querySelector('.mobile-menu summary');
  if (!dialog || !rail || !header || !panel || !scrim || !summary || typeof dialog.showModal !== 'function') return;
  const railLayout = matchMedia('(min-width: 1024px), (orientation: landscape) and (min-width: 640px) and (max-height: 600px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const railHome = document.createComment('Rail home');
  const headerHome = document.createComment('Header home');
  const spacer = document.createElement('div');
  spacer.className = 'mobile-header-spacer'; spacer.setAttribute('aria-hidden', 'true');
  rail.before(railHome); header.before(headerHome, spacer);
  const mobileToggle = document.createElement('button');
  mobileToggle.type = 'button'; mobileToggle.className = 'mobile-menu-toggle';
  mobileToggle.setAttribute('aria-controls', dialog.id);
  const label = document.createElement('span'); label.textContent = 'Menú';
  mobileToggle.append(label, summary.querySelector('.nav-fan'));
  header.insertBefore(mobileToggle, header.querySelector('.mobile-menu'));
  const logo = header.querySelector('.brand-logo');
  logo.src = '/assets/logo-final/palmito-labs-navigation-dark.svg';
  logo.removeAttribute('srcset');
  logo.width = 740; logo.height = 190;
  const triggers = [railToggle, mobileToggle];
  function setExpanded(open) { triggers.forEach(button => { button.setAttribute('aria-expanded', String(open)); button.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'); }); }
  setExpanded(false);
  document.documentElement.classList.add('side-nav-ready');
  let closing = false, exitAnimation, activeChrome, scrollBeforeOpen, navigating = false;
  const currentToggle = () => railLayout.matches ? railToggle : mobileToggle;
  function animateLogo(button = currentToggle()) {
    if (!reduced.matches) button.querySelectorAll('animateTransform').forEach(animation => animation.beginElement());
  }
  function measure() { document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`); }
  function openMenu() {
    scrollBeforeOpen = { left: scrollX, top: scrollY }; navigating = false;
    document.body.classList.add('menu-modal-active');
    activeChrome = railLayout.matches ? rail : header;
    if (activeChrome === header) spacer.style.height = `${header.getBoundingClientRect().height}px`;
    dialog.prepend(activeChrome);
    dialog.showModal();
    void activeChrome.offsetWidth;
    document.body.classList.add('desktop-menu-open', 'menu-modal-active');
    setExpanded(true); animateLogo(); measure();
    window.scrollTo({ ...scrollBeforeOpen, behavior: 'instant' });
  }
  function closeMenu(immediate = false, afterClose) {
    if (!dialog.open) return;
    if (immediate) { navigating = Boolean(afterClose); exitAnimation?.cancel(); closing = false; dialog.close(); afterClose?.(); return; }
    if (closing) return;
    navigating = Boolean(afterClose);
    closing = true;
    document.body.classList.remove('desktop-menu-open');
    animateLogo(activeChrome === rail ? railToggle : mobileToggle);
    if (reduced.matches) { dialog.close(); afterClose?.(); return; }
    exitAnimation = panel.animate([{ transform: getComputedStyle(panel).transform }, { transform: 'translateX(-100%)' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
    const fades = scrim.getAnimations().map(animation => animation.finished.catch(() => {}));
    Promise.all([exitAnimation.finished, ...fades]).then(() => { dialog.close(); exitAnimation.cancel(); afterClose?.(); }).catch(() => {});
  }
  triggers.forEach(button => button.addEventListener('click', () => { if (dialog.open) closeMenu(); else openMenu(); }));
  dialog.querySelector('.side-close').addEventListener('click', () => closeMenu());
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
  dialog.addEventListener('close', () => {
    railHome.after(rail); headerHome.after(spacer, header); spacer.style.height = '0px';
    document.body.classList.remove('desktop-menu-open', 'menu-modal-active');
    setExpanded(false); closing = false; activeChrome = null; measure();
    currentToggle().focus({ preventScroll: true });
    if (!navigating && scrollBeforeOpen) window.scrollTo({ ...scrollBeforeOpen, behavior: 'instant' });
  });
  dialog.addEventListener('click', event => { if (event.target === dialog || event.target === scrim) closeMenu(); });
  [...dialog.querySelectorAll('a'), ...rail.querySelectorAll('a'), ...header.querySelectorAll('a')].forEach(link => link.addEventListener('click', event => {
    if (!dialog.open || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); closeMenu(false, () => location.assign(link.href));
  }));
  railLayout.addEventListener('change', () => { if (dialog.open) closeMenu(true); measure(); });
  if (typeof ResizeObserver === 'function') new ResizeObserver(measure).observe(header);
  window.addEventListener('resize', measure); measure();
})();
