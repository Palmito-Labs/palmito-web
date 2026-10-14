
'use strict';
const messages = [...document.querySelectorAll('.demo-chat .bubble')];
const play = document.querySelector('#demo-play');
const pause = document.querySelector('#demo-pause');
const status = document.querySelector('#demo-status');
const record = document.querySelector('#demo-record');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let timer = null, index = 0, running = false;
function stop() { clearTimeout(timer); running = false; pause.hidden = true; }
function complete() { stop(); messages.forEach(m => m.hidden = false); record.classList.remove('is-pending'); status.textContent = 'Ejemplo completo. Solicitud pendiente de confirmación por el equipo.'; play.textContent = 'Repetir demo'; }
function next() {
  if (index >= messages.length) { complete(); return; }
  messages[index++].hidden = false;
  status.textContent = `Mensaje ${index} de ${messages.length}`;
  timer = setTimeout(next, 2200);
}
play.hidden = false;
play.addEventListener('click', () => {
  stop();
  if (reduced.matches) { complete(); return; }
  index = 0; messages.forEach(m => m.hidden = true); record.classList.add('is-pending');
  running = true; pause.hidden = false; pause.textContent = 'Pausar'; play.textContent = 'Reiniciar demo'; next();
});
pause.addEventListener('click', () => {
  if (running) { clearTimeout(timer); running = false; pause.textContent = 'Continuar'; status.textContent = 'Demo en pausa.'; }
  else { running = true; pause.textContent = 'Pausar'; next(); }
});
reduced.addEventListener('change', () => { if (reduced.matches) complete(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && running) pause.click(); });
const form = document.querySelector('#pilot-form');
const submit = document.querySelector('#pilot-submit');
const formStatus = document.querySelector('#form-status');
let endpoint;
try { const url = new URL(form.dataset.endpoint); if(url.protocol === 'https:') endpoint = url.href; } catch {}
if (endpoint) { submit.disabled = false; formStatus.textContent = 'Revisaremos tu solicitud y contactaremos contigo por correo.'; }
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!endpoint || !form.reportValidity() || submit.disabled) return;
  submit.disabled = true; formStatus.textContent = 'Enviando solicitud…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
    if (!response.ok) throw new Error('Submission failed');
    formStatus.textContent = 'Solicitud recibida. Gracias por tu interés; contactaremos contigo por correo para valorar el piloto.';
    form.reset();
  } catch {
    formStatus.textContent = 'No hemos podido confirmar el envío. Tus datos siguen aquí: puedes reintentarlo o escribir a hola@palmitolabs.com. Si ya lo enviaste, evita duplicar la solicitud.';
  } finally { clearTimeout(timeout); submit.disabled = false; }
});
