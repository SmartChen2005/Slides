"use strict";

const deck = window.GRAFFITI_DECK;
const mainCount = deck.filter(slide => !slide.backup).length;
const slidesRoot = document.getElementById("slides");
slidesRoot.innerHTML = deck.map((slide, index) => `<section class="slide" id="slide-${index + 1}" tabindex="-1" aria-label="${slide.title}" ${index ? "hidden inert aria-hidden=\"true\"" : ""}>${index ? `<p class="eyebrow">${slide.backup ? "Backup" : "VR Graffiti"}</p>` : ""}${slide.html}${index ? `<span class="slide-no">${String(index + 1).padStart(2, "0")}</span>` : ""}</section>`).join("");

const slides = [...slidesRoot.querySelectorAll(".slide")];
const stage = document.querySelector(".stage");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const notesToggle = document.getElementById("notes-toggle");
const notesPanel = document.getElementById("notes");
const pauseButton = document.getElementById("pause");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentSlide = -1;
let paused = motionPreference.matches;
let elapsed = 0;
let lastFrame = 0;
let raf = 0;

function fitCanvas() {
  stage.style.setProperty("--deck-scale", stage.getBoundingClientRect().width / 1280);
}
new ResizeObserver(fitCanvas).observe(stage);
fitCanvas();

const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => { value = clamp(value); return value * value * (3 - 2 * value); };
const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const totalTime = deck.reduce((sum, slide) => sum + slide.seconds, 0);

function slideFromHash() {
  const match = location.hash.match(/^#slide-(\d+)$/);
  return match ? Math.max(0, Math.min(deck.length - 1, Number(match[1]) - 1)) : 0;
}

function updateNotes() {
  const slide = deck[currentSlide];
  const start = deck.slice(0, currentSlide).reduce((sum, item) => sum + item.seconds, 0);
  document.getElementById("notes-timing").textContent = slide.backup ? "Backup / outside timed talk" : `${formatTime(start)}–${formatTime(start + slide.seconds)} / ${formatTime(totalTime)} total`;
  document.getElementById("notes-title").textContent = slide.title;
  const copy = document.getElementById("notes-copy");
  copy.replaceChildren();
  slide.notes.forEach(text => { const p = document.createElement("p"); p.textContent = text; copy.appendChild(p); });
  if (slide.refs.length) {
    const p = document.createElement("p");
    p.className = "caption";
    p.textContent = "Sources: ";
    slide.refs.forEach((key, index) => {
      if (index) p.append(". ");
      const a = document.createElement("a");
      a.href = sources[key][0]; a.textContent = sources[key][1]; a.target = "_blank"; a.rel = "noopener noreferrer";
      p.appendChild(a);
    });
    copy.appendChild(p);
  }
  notesPanel.scrollTop = 0;
}

function showSlide(index, { updateHash = true, moveFocus = false } = {}) {
  index = Math.max(0, Math.min(deck.length - 1, index));
  if (index === currentSlide) return;
  slides.forEach((slide, i) => {
    slide.hidden = i !== index;
    slide.inert = i !== index;
    slide.classList.toggle("active", i === index);
    slide.classList.remove("entering");
    if (i !== index) slide.setAttribute("aria-hidden", "true");
    else slide.removeAttribute("aria-hidden");
  });
  currentSlide = index;
  const active = slides[index];
  void active.offsetWidth;
  active.classList.add("entering");
  previousButton.disabled = index === 0;
  nextButton.disabled = index === deck.length - 1;
  nextButton.textContent = index === mainCount - 1 ? "References" : index === mainCount ? "Q&A" : "Next";
  nextButton.setAttribute("aria-label", index === mainCount - 1 ? "Open reference backup slide" : index === mainCount ? "Open Q&A backup slide" : "Next slide");
  document.getElementById("slide-counter").textContent = deck[index].backup ? `Backup ${index - mainCount + 1} / ${deck.length - mainCount}` : `${String(index + 1).padStart(2, "0")} / ${String(mainCount).padStart(2, "0")}`;
  document.getElementById("slide-time").textContent = deck[index].backup ? "Q&A" : formatTime(deck[index].seconds);
  document.getElementById("deck-progress").style.transform = `scaleX(${Math.min((index + 1) / mainCount, 1)})`;
  document.title = `${deck[index].name} | VR Graffiti`;
  document.getElementById("announcement").textContent = `${deck[index].backup ? "Backup slide" : `Slide ${index + 1} of ${mainCount}`}. ${deck[index].title}`;
  document.querySelector(".skip-link").href = `#slide-${index + 1}`;
  if (updateHash && location.hash !== `#slide-${index + 1}`) history.pushState(null, "", `#slide-${index + 1}`);
  updateNotes();
  resetAnimation();
  if (moveFocus) active.focus({ preventScroll: true });
}

function setNotes(open, restoreFocus = false) {
  notesPanel.hidden = !open;
  document.body.classList.toggle("with-notes", open);
  notesToggle.setAttribute("aria-expanded", String(open));
  if (open) document.getElementById("notes-close").focus();
  else if (restoreFocus) notesToggle.focus();
  fitCanvas();
}

function setPaused(value) {
  paused = value;
  pauseButton.setAttribute("aria-pressed", String(paused));
  pauseButton.textContent = paused ? "Play" : "Pause";
  if (paused) cancelAnimationFrame(raf);
  else { lastFrame = performance.now(); scheduleAnimation(); }
}

function resetAnimation() {
  elapsed = 0;
  lastFrame = performance.now();
  renderSlide(currentSlide, paused ? (currentSlide === 5 ? 3.1 : 6) : 0);
  cancelAnimationFrame(raf);
  if (!paused && !document.hidden) scheduleAnimation();
}

function scheduleAnimation() { raf = requestAnimationFrame(tick); }
function tick(now) {
  if (paused || document.hidden) return;
  elapsed += Math.min((now - lastFrame) / 1000, .1);
  lastFrame = now;
  renderSlide(currentSlide, elapsed);
  scheduleAnimation();
}

const referencePath = slides[0].querySelector(".hero-stroke");
const referenceLength = referencePath.getTotalLength();
function point(progress) { return referencePath.getPointAtLength(clamp(progress) * referenceLength); }
function ink(root, selector, progress) {
  root.querySelectorAll(selector).forEach(node => {
    node.style.strokeDasharray = "1";
    node.style.strokeDashoffset = String(1 - clamp(progress));
  });
}
function opacity(root, selector, value) { root.querySelectorAll(selector).forEach(node => node.style.opacity = String(clamp(value))); }
function move(root, selector, x, y, rotate = 0) {
  const node = root.querySelector(selector);
  if (node) node.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rotate})`);
}
function follow(root, selector, progress, dx = 0, dy = 0) { const p = point(progress); move(root, selector, p.x + dx, p.y + dy); }

const depthRoot = slides[8].querySelector(".depth-ribbon");
const ns = "http://www.w3.org/2000/svg";
const depthSegments = [];
for (let i = 0; i < 72; i++) {
  const node = document.createElementNS(ns, "path");
  node.setAttribute("fill", "none"); node.setAttribute("stroke-width", "9"); node.setAttribute("stroke-linecap", "round");
  const progress = i / 71;
  node.setAttribute("stroke", progress < .35 ? "var(--accent)" : progress < .7 ? "var(--purple)" : "var(--orange)");
  depthRoot.appendChild(node); depthSegments.push(node);
}
const depthRulings = [];
for (let i = 0; i < 5; i++) {
  const line = document.createElementNS(ns, "path");
  line.setAttribute("fill", "none"); line.setAttribute("stroke", "var(--line)"); line.setAttribute("stroke-dasharray", "3 4");
  depthRoot.prepend(line); depthRulings.push(line);
}

function projectPoint(progress, depth, rotation) {
  const p = point(progress);
  const x = (p.x - 185) * .74;
  const y = (p.y - 170) * .74;
  const z = progress * depth * 170;
  const xr = x * Math.cos(rotation) + z * Math.sin(rotation);
  const zr = -x * Math.sin(rotation) + z * Math.cos(rotation);
  const scale = 700 / (700 + zr);
  return { x: 212 + xr * scale, y: 147 + (y - z * .18) * scale };
}
function drawDepth(t) {
  const progress = clamp(t / 2.1);
  const depth = ease((t - 2.1) / 2.4);
  const rotation = depth * (.65 + .10 * Math.sin(Math.max(0, t - 4.5) * 1.1));
  depthSegments.forEach((node, i) => {
    const a = i / depthSegments.length, b = (i + 1) / depthSegments.length;
    const p1 = projectPoint(a, depth, rotation), p2 = projectPoint(Math.min(b, progress), depth, rotation);
    node.style.opacity = progress >= a ? "1" : "0";
    node.setAttribute("d", `M${p1.x} ${p1.y}L${p2.x} ${p2.y}`);
  });
  depthRulings.forEach((node, i) => {
    const phase = (i + 1) / 5;
    const a = projectPoint(phase, 0, 0), b = projectPoint(phase, depth, rotation);
    node.style.opacity = String(depth * .8);
    node.setAttribute("d", `M${a.x} ${a.y}L${b.x} ${b.y}`);
  });
  slides[8].querySelector(".depth-scrubber").setAttribute("cx", String(54 + 360 * progress));
}

function renderSlide(index, seconds) {
  const root = slides[index];
  if (!root) return;
  const t = seconds % 8;
  if (index === 0) {
    const p = ease(t / 4.7);
    ink(root, ".hero-stroke", p); follow(root, ".hero-tool", p, 25, 6);
  } else if (index === 1) {
    const p = ease(t / 5);
    ink(root, ".movement-stroke", p); follow(root, ".movement-tool", p, 13, 5);
  } else if (index === 3) {
    root.querySelectorAll(".lettering").forEach((node, i) => {
      node.style.strokeDasharray = "1"; node.style.strokeDashoffset = String(1 - ease((t - i * .4) / 3.5));
    });
  } else if (index === 4) {
    const p = ease(t / 4.5);
    const x = 65 + 210 * p;
    ink(root, ".spray-mark,.marker-mark,.roller-mark", p);
    move(root, ".spray-tool", x - 4, 122, -12);
    const footprint = root.querySelector(".spray-footprint");
    footprint.setAttribute("rx", String(7 + 15 * p)); footprint.setAttribute("ry", String(16 + 18 * p));
    root.querySelector(".spray-mark").style.strokeWidth = String(14 + 22 * p);
    root.querySelector(".spray-distance").setAttribute("cx", String(92 + 144 * p));
    move(root, ".marker-tool", 52 + 224 * p, 70 + 57 * p + 14, -14);
    move(root, ".roller-tool", 62 + 216 * p, 89);
  } else if (index === 5) {
    // Eight-second lesson cycle: observe, trace, independent reproduction, remix.
    const phase = t < 2 ? 0 : t < 4.4 ? 1 : t < 6.5 ? 2 : 3;
    const p = phase === 0 ? ease(t / 1.8) : phase === 1 ? ease((t - 2) / 2.1) : phase === 2 ? ease((t - 4.4) / 1.8) : 1;
    const learnerProgress = phase === 1 ? clamp(p - .09) : p;
    const learnerPoint = point(learnerProgress);
    const dx = phase === 3 ? 20 : 8;
    const dy = phase === 3 ? -8 : -5;
    follow(root, ".journey-expert", p, 20, 8);
    move(root, ".journey-learner", learnerPoint.x + dx, learnerPoint.y + dy);
    ink(root, ".journey-ghost", phase <= 1 ? p : 1);
    ink(root, ".journey-ink", phase === 0 ? 0 : learnerProgress);
    opacity(root, ".journey-guide", phase === 0 ? .3 : phase === 1 ? .3 * (1 - ease((t - 3.2) / 1.2)) : 0);
    opacity(root, ".journey-expert,.journey-ghost", phase <= 1 ? 1 - (phase === 1 ? ease((t - 3.2) / 1.2) : 0) : 0);
    opacity(root, ".journey-learner", phase === 0 ? 0 : 1);
    opacity(root, ".journey-deviation", phase === 1 ? .8 : 0);
    root.querySelector(".journey-deviation").setAttribute("d", `M${learnerPoint.x} ${learnerPoint.y}L${learnerPoint.x + dx} ${learnerPoint.y + dy}`);
    const stroke = root.querySelector(".journey-ink");
    stroke.style.stroke = phase === 3 ? "var(--purple)" : "var(--accent)";
    stroke.setAttribute("transform", phase === 3 ? "translate(20 -8) scale(.94 1.05)" : "translate(8 -5)");
    const descriptions = ["Observe the expert motion", "Trace with a fading guide", "Reproduce without the overlay", "Remix the letter deliberately"];
    document.getElementById("journey-phase").textContent = descriptions[phase];
    root.querySelectorAll(".journey-step").forEach((node, i) => node.classList.toggle("is-current", i === phase));
  } else if (index === 6) {
    const p = point(ease(t / 5));
    root.querySelector(".ghost-hand").setAttribute("transform", `translate(${p.x + 15} ${p.y + 12}) scale(.58)`);
    opacity(root, ".ghost-hand", .35 + .15 * Math.sin(t));
  } else if (index === 8) {
    ink(root, ".temporal-current", ease(t / 2.1));
    opacity(root, ".temporal-old-1", ease((t - 2.2) / 1) * .25);
    opacity(root, ".temporal-old-2", ease((t - 3.2) / 1) * .4);
    root.querySelector(".temporal-scrubber").setAttribute("cx", String(54 + 360 * clamp(t / 4.5)));
    drawDepth(t);
  } else if (index === 9) {
    const p = (t % 2.2) / 2.2;
    root.querySelector(".data-pulse").setAttribute("cx", String(10 + 1025 * p));
  }
}

previousButton.addEventListener("click", () => showSlide(currentSlide - 1));
nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
notesToggle.addEventListener("click", () => setNotes(notesPanel.hidden));
document.getElementById("notes-close").addEventListener("click", () => setNotes(false, true));
document.getElementById("replay").addEventListener("click", () => { setPaused(false); resetAnimation(); });
pauseButton.addEventListener("click", () => setPaused(!paused));

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    document.getElementById("announcement").textContent = "Full screen is unavailable in this browser. Use the browser’s full screen command.";
  }
}
document.getElementById("fullscreen").addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", () => {
  const button = document.getElementById("fullscreen");
  button.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
  button.setAttribute("aria-label", button.textContent);
});
window.addEventListener("hashchange", () => showSlide(slideFromHash(), { updateHash: false, moveFocus: true }));
window.addEventListener("popstate", () => showSlide(slideFromHash(), { updateHash: false, moveFocus: true }));
document.addEventListener("visibilitychange", () => {
  cancelAnimationFrame(raf);
  if (!document.hidden && !paused) { lastFrame = performance.now(); scheduleAnimation(); }
});
motionPreference.addEventListener("change", () => { setPaused(motionPreference.matches); if (motionPreference.matches) renderSlide(currentSlide, currentSlide === 5 ? 3.1 : 6); });

document.addEventListener("keydown", event => {
  if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return;
  if (event.target.closest("input,textarea,select,[contenteditable='true']")) return;
  if (event.key === "Escape" && !notesPanel.hidden) { setNotes(false, true); return; }
  const keys = { ArrowRight: currentSlide + 1, PageDown: currentSlide + 1, ArrowLeft: currentSlide - 1, PageUp: currentSlide - 1, Home: 0, End: mainCount - 1 };
  if (Object.hasOwn(keys, event.key)) { event.preventDefault(); showSlide(keys[event.key], { moveFocus: true }); }
  else if (event.key.toLowerCase() === "n") { event.preventDefault(); setNotes(notesPanel.hidden, !notesPanel.hidden); }
  else if (event.key.toLowerCase() === "r") { event.preventDefault(); setPaused(false); resetAnimation(); }
  else if (event.key.toLowerCase() === "f") { event.preventDefault(); toggleFullscreen(); }
  else if (event.code === "Space" && !event.target.closest("button,a")) { event.preventDefault(); setPaused(!paused); }
});

function preparePrint() {
  setPaused(true);
  slides.forEach((_, index) => renderSlide(index, index === 5 ? 3.1 : 6));
}
window.addEventListener("beforeprint", preparePrint);
window.addEventListener("afterprint", () => resetAnimation());

// Deterministic presentation hooks for screenshots, print and interaction checks.
window.deckAPI = {
  showSlide,
  seek(seconds) { setPaused(true); elapsed = seconds; renderSlide(currentSlide, seconds); },
  preparePrint,
  getState() { return { currentSlide, paused, elapsed, mainCount, totalCount: deck.length, totalTime }; }
};
showSlide(slideFromHash(), { updateHash: false });
setPaused(paused);
