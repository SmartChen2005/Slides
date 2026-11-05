/* Static deck. No network dependencies or storage. */
(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const data = JSON.parse(document.getElementById('deck-data').textContent);
  const $ = id => document.getElementById(id);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  const parseHash = () => {
    const match = /^#slide-(\d+)$/.exec(location.hash);
    return match ? Math.min(slides.length - 1, Math.max(0, Number(match[1]) - 1)) : 0;
  };
  function resize() {
    if (innerWidth <= 700) return;
    const width = Math.min(1440, innerWidth - 64, (innerHeight - 142) * 16 / 9);
    const stage = document.querySelector('.stage');
    stage.style.width = `${Math.max(240, width)}px`;
    stage.style.height = `${Math.max(240, width) * 9 / 16}px`;
    document.documentElement.style.setProperty('--scale', Math.max(240, width) / 1440);
  }
  function show(index, history = false, animate = true) {
    index = Math.min(slides.length - 1, Math.max(0, index));
    const old = current;
    current = index;
    slides.forEach((slide, i) => {
      slide.getAnimations().forEach(animation => animation.cancel());
      slide.hidden = i !== index;
      slide.classList.toggle('active', i === index);
    });
    if (old !== index && animate && !reduced.matches) {
      slides[index].animate([{opacity:.45, transform:`translateX(${index > old ? 18 : -18}px)`}, {opacity:1, transform:'translateX(0)'}], {duration:240, easing:'cubic-bezier(.22,1,.36,1)'});
    }
    $('previous').disabled = index === 0;
    $('next').disabled = index === slides.length - 1;
    $('counter').textContent = `${String(index + 1).padStart(2, '0')} / ${slides.length}`;
    $('progress-fill').style.width = `${(index + 1) / slides.length * 100}%`;
    $('announcement').textContent = `Slide ${index + 1} of ${slides.length}. ${data[index].title}`;
    document.title = `${index + 1}. ${data[index].title} | Feedback & Motor Skill Learning`;
    document.querySelectorAll('#outline-list button').forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    $('notes-slide-title').textContent = `${index + 1}. ${data[index].title}`;
    $('notes-body').replaceChildren(...data[index].notes.split('。').filter(Boolean).reduce((parts, sentence, i) => {
      if (i % 3 === 0) parts.push(document.createElement('p'));
      parts[parts.length - 1].textContent += sentence + '。';
      return parts;
    }, []));
    if (history && location.hash !== `#slide-${index + 1}`) window.history.pushState(null, '', `#slide-${index + 1}`);
    if (old !== index) scrollTo({top:0, behavior:'instant'});
  }
  data.forEach((slide, index) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    button.append(number, document.createTextNode(slide.title));
    button.addEventListener('click', () => { $('outline-dialog').close(); show(index, true); });
    li.append(button); $('outline-list').append(li);
  });
  for (const dialog of document.querySelectorAll('dialog')) dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { $('announcement').textContent = 'Full screen is unavailable. Browser presentation controls remain available.'; }
  }
  document.addEventListener('fullscreenchange', () => {
    const active = !!document.fullscreenElement;
    $('fullscreen').textContent = active ? 'Exit full screen' : 'Full screen';
    $('fullscreen').setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
    resize();
  });
  document.addEventListener('keydown', event => {
    if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]') || event.target.closest('button,a,input,textarea,select')) return;
    if (['ArrowRight','PageDown',' '].includes(event.key)) {event.preventDefault();show(current + 1, true);}
    else if (['ArrowLeft','PageUp'].includes(event.key)) {event.preventDefault();show(current - 1, true);}
    else if (event.key === 'Home') {event.preventDefault();show(0, true);}
    else if (event.key === 'End') {event.preventDefault();show(slides.length - 1, true);}
    else if (event.key.toLowerCase() === 'n') $('notes-dialog').showModal();
    else if (event.key.toLowerCase() === 'o') $('outline-dialog').showModal();
    else if (event.key.toLowerCase() === 'f') fullscreen();
  });
  addEventListener('hashchange', () => show(parseHash()));
  addEventListener('popstate', () => show(parseHash()));
  addEventListener('resize', resize);
  reduced.addEventListener('change', () => {if(reduced.matches) slides.forEach(s => s.getAnimations().forEach(a => a.cancel()));});
  window.deckAPI = { navigate:delta => show(current + delta, true), fullscreen, showSlide:index => show(index, false, false), getState:() => ({currentSlide:current, totalSlides:slides.length}) };
  show(parseHash(), false, false); resize();
})();
