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
let endpoint;
if (form.dataset.endpoint) {
  try {
    const url = new URL(form.dataset.endpoint);
    if (url.protocol === 'https:') endpoint = url.href;
  } catch {
    // An invalid configuration leaves the form disabled.
  }
}

if (endpoint) {
  submit.disabled = false;
  formStatus.textContent = '';
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!endpoint || submit.disabled) return;

  submit.disabled = true;
  formStatus.textContent = 'Enviando solicitud…';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Submission failed');
    form.reset();
    formStatus.textContent = 'Solicitud recibida. Te responderemos por correo.';
  } catch {
    formStatus.textContent = 'No hemos podido confirmar el envío. Tus datos siguen en el formulario.';
  } finally {
    submit.disabled = false;
  }
});
