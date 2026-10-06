"use strict";

const slides = [...document.querySelectorAll(".slide")];
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentSlide = -1;
let transitionTimer;

// Scale one 1280 x 720 composition uniformly; resizing never changes its layout.
const stage = document.querySelector(".stage");
function fitCanvas() {
  stage.style.setProperty("--deck-scale", stage.getBoundingClientRect().width / 1280);
}
new ResizeObserver(fitCanvas).observe(stage);
fitCanvas();

slides.forEach(slide => {
  slide.querySelectorAll(".reveal").forEach((node, index) => node.style.setProperty("--reveal-index", index));
});

function slideFromHash() {
  const match = location.hash.match(/^#slide-([1-5])$/);
  return match ? Number(match[1]) - 1 : 0;
}

function showSlide(index, { updateHash = true, moveFocus = false } = {}) {
  index = Math.max(0, Math.min(slides.length - 1, index));
  if (index === currentSlide) return;
  clearTimeout(transitionTimer);
  const previous = currentSlide;
  const direction = index >= previous ? 1 : -1;
  slides.forEach((slide, i) => {
    slide.classList.remove("active", "entering", "leaving");
    slide.style.setProperty("--direction", direction);
    if (i !== index) {
      slide.inert = true;
      slide.setAttribute("aria-hidden", "true");
      slide.hidden = true;
    }
  });
  if (previous >= 0 && !reducedMotion.matches) {
    slides[previous].hidden = false;
    slides[previous].classList.add("leaving");
    transitionTimer = setTimeout(() => {
      if (currentSlide !== previous) {
        slides[previous].hidden = true;
        slides[previous].classList.remove("leaving");
      }
    }, 185);
  }
  const active = slides[index];
  active.hidden = false;
  active.inert = false;
  active.removeAttribute("aria-hidden");
  active.scrollTop = 0;
  active.classList.add("active", "entering");
  currentSlide = index;
  previousButton.disabled = index === 0;
  nextButton.disabled = index === slides.length - 1;
  document.getElementById("slide-counter").textContent = String(index + 1).padStart(2, "0") + " / 05";
  document.getElementById("deck-progress").style.transform = "scaleX(" + ((index + 1) / slides.length) + ")";
  const title = active.querySelector("h1,h2").innerText.replace(/\s+/g, " ").trim();
  document.title = active.dataset.name + " | Ensemble Mutual";
  document.getElementById("announcement").textContent = "Slide " + (index + 1) + " of 5. " + title;
  document.querySelector(".skip-link").href = "#slide-" + (index + 1);
  if (updateHash && location.hash !== "#slide-" + (index + 1)) history.pushState(null, "", "#slide-" + (index + 1));
  // Keep Next focused so repeated Enter presses advance without extra navigation.
  if (moveFocus) active.focus({ preventScroll: true });
}

previousButton.addEventListener("click", () => showSlide(currentSlide - 1));
nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
window.addEventListener("hashchange", () => showSlide(slideFromHash(), { updateHash: false, moveFocus: true }));
window.addEventListener("popstate", () => showSlide(slideFromHash(), { updateHash: false, moveFocus: true }));
document.addEventListener("keydown", event => {
  if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return;
  if (event.target.closest("input,textarea,select,[contenteditable='true']")) return;
  const keys = { ArrowRight: currentSlide + 1, PageDown: currentSlide + 1, ArrowLeft: currentSlide - 1, PageUp: currentSlide - 1, Home: 0, End: 4 };
  if (Object.hasOwn(keys, event.key)) {
    event.preventDefault();
    showSlide(keys[event.key], { moveFocus: true });
  } else if (/^[1-5]$/.test(event.key)) {
    event.preventDefault();
    showSlide(Number(event.key) - 1, { moveFocus: true });
  }
});

// Both conceptual comparisons are visible on arrival; no interaction is required.
const heatmaps = {
  similar: [[1,.88,.81,.76],[.88,1,.85,.79],[.81,.85,1,.77],[.76,.79,.77,1]],
  diverse: [[1,.24,.18,.31],[.24,1,.22,.16],[.18,.22,1,.27],[.31,.16,.27,1]]
};
document.querySelectorAll("[data-matrix]").forEach(matrix => {
  heatmaps[matrix.dataset.matrix].flat().forEach(value => {
    const cell = document.createElement("span");
    cell.style.setProperty("--heat", .07 + value * .93);
    cell.setAttribute("aria-hidden", "true");
    matrix.appendChild(cell);
  });
});

showSlide(slideFromHash(), { updateHash: false });
