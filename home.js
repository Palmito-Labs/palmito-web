'use strict';

document.querySelectorAll('.mobile-menu nav a').forEach(link => {
  link.addEventListener('click', () => { link.closest('details').open = false; });
});

const form = document.querySelector('#contact-form');
const service = document.querySelector('#contact-service');
const requestedService = new URLSearchParams(location.search).get('servicio');

if ([...service.options].some(option => option.value === requestedService)) {
  service.value = requestedService;
}

const submit = form.querySelector('button[type="submit"]');
const formStatus = document.querySelector('#form-status');
const endpoint = form.dataset.endpoint;
submit.disabled = false;

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submit.disabled) return;
  const fields = Object.fromEntries(new FormData(form));
  fields.servicio = service.selectedOptions[0].textContent.trim();

  submit.disabled = true;
  formStatus.textContent = 'Enviando solicitud…';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(fields),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
    const result = await response.json();
    if (!response.ok || result.success !== true) throw new Error('Submission failed');
    form.reset();
    formStatus.textContent = 'Solicitud recibida. Te responderemos por correo.';
  } catch {
    formStatus.textContent = 'No hemos podido confirmar el envío. Tus datos siguen en el formulario.';
  } finally {
    submit.disabled = false;
  }
});

const chat = document.querySelector('#automatizacion-ia .demo-chat');
const messages = [...chat.querySelectorAll('.bubble')];
const playback = document.querySelector('.chat-playback');
const record = document.querySelector('#automatizacion-ia .home-record');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let nextMessage = 0;
let timer;

function showMessage() {
  messages[nextMessage++].hidden = false;
  chat.scrollTop = chat.scrollHeight;
  if (nextMessage === messages.length) {
    timer = undefined;
    record.hidden = false;
    playback.textContent = 'Repetir conversación';
    return;
  }
  timer = window.setTimeout(showMessage, 1500);
}

function startChat() {
  messages.forEach(message => { message.hidden = true; });
  record.hidden = true;
  nextMessage = 0;
  playback.textContent = 'Pausar conversación';
  showMessage();
}

playback.addEventListener('click', () => {
  if (timer !== undefined) {
    window.clearTimeout(timer);
    timer = undefined;
    playback.textContent = 'Continuar conversación';
  } else if (nextMessage === messages.length || nextMessage === 0) {
    startChat();
  } else {
    playback.textContent = 'Pausar conversación';
    showMessage();
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
    observer.disconnect();
    if (reducedMotion.matches) return;
    playback.hidden = false;
    startChat();
  }, { threshold: 0.35 });
  observer.observe(chat);
}

const appTabs = document.querySelector('.app-tabs');
const appScreen = document.querySelector('.app-screen');
const appButtons = [...appTabs.querySelectorAll('button')];
appTabs.hidden = false;

appTabs.addEventListener('click', event => {
  const selected = event.target.closest('button');
  if (!appButtons.includes(selected)) return;

  appButtons.forEach(button => {
    const active = button === selected;
    button.setAttribute('aria-pressed', String(active));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !active;
  });
  appScreen.scrollTop = 0;
});
