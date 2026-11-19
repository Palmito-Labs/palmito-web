
'use strict';
const chat = document.querySelector('#demo-chat');
const messages = [...document.querySelectorAll('.demo-chat .bubble')];
const play = document.querySelector('#demo-play');
const pause = document.querySelector('#demo-pause');
const status = document.querySelector('#demo-status');
const record = document.querySelector('#demo-record');
const steps = [...document.querySelectorAll('.demo-steps li')];
const recordDetails = record.querySelector('dl');
const recordProgress = document.querySelector('#record-progress');
function showStep(step) { steps.forEach((item, i) => { if (i === step) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); }); }
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let timer = null, index = 0, running = false;
function stop() { clearTimeout(timer); running = false; pause.hidden = true; }
function complete() { stop(); messages.forEach(m => m.hidden = false); record.classList.remove('is-pending'); recordDetails.hidden = false; recordProgress.hidden = true; showStep(3); status.textContent = 'Ejemplo completo. Dos citas agendadas en la simulación, con fecha, hora y profesional.'; play.textContent = 'Repetir demo'; }
function next() {
  if (index >= messages.length) { complete(); return; }
  messages[index++].hidden = false;
  showStep(Number(messages[index - 1].dataset.step));
  chat.scrollTop = chat.scrollHeight;
  status.textContent = `Mensaje ${index} de ${messages.length}`;
  timer = setTimeout(next, 2200);
}
play.hidden = false;
const read = document.querySelector('#demo-read');
read.hidden = false;
read.addEventListener('click', () => { complete(); chat.scrollTop = 0; });
play.addEventListener('click', () => {
  stop();
  if (reduced.matches) { complete(); return; }
  index = 0; messages.forEach(m => m.hidden = true); record.classList.add('is-pending'); recordDetails.hidden = true; recordProgress.hidden = false; steps.forEach(item => item.removeAttribute('aria-current'));
  running = true; pause.hidden = false; pause.textContent = 'Pausar'; play.textContent = 'Reiniciar demo'; next();
});
pause.addEventListener('click', () => {
  if (running) { clearTimeout(timer); running = false; pause.textContent = 'Continuar'; status.textContent = 'Demo en pausa.'; }
  else { running = true; pause.textContent = 'Pausar'; next(); }
});
reduced.addEventListener('change', () => { if (reduced.matches) complete(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && running) pause.click(); });
// Close the mobile menu after choosing an in-page destination.
document.querySelectorAll('.mobile-menu nav a').forEach(link => link.addEventListener('click', () => { link.closest('details').open = false; }));
