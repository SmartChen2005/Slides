"use strict";

const archive = document.getElementById("archive");
const status = document.getElementById("archive-status");
const filters = [...document.querySelectorAll("[data-category]")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const categories = filters.map(button => button.dataset.category);
const decks = Array.isArray(window.SLIDE_ARCHIVE) ? window.SLIDE_ARCHIVE : null;
let opening = false;
let frame = 0;
let pointer = null;
let stackRects = [];
let measuredScrollY = 0;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function dateLabel(date) {
  if (!date) return "DATE UNRECORDED";
  // Dates describe a calendar day, not an instant. UTC avoids timezone shifts.
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" })
    .format(new Date(date + "T00:00:00Z")).toUpperCase();
}

function makeDeck(deck) {
  const article = element("article", "deck");
  const link = element("a", "stack-link");
  link.href = deck.path;
  link.setAttribute("aria-label", `${deck.title}, ${deck.category}, ${dateLabel(deck.date)}, ${deck.slideCount} slides. Open presentation.`);
  const stack = element("div", "stack");
  const layers = Math.min(4, Math.max(0, deck.slideCount - 1));
  for (let layer = layers; layer > 0; layer--) {
    const sheet = element("div", "sheet under-sheet");
    sheet.style.setProperty("--layer", layer);
    sheet.setAttribute("aria-hidden", "true");
    stack.append(sheet);
  }
  const front = element("div", "sheet front-sheet");
  const meta = element("div", "sheet-meta");
  meta.append(element("span", "", deck.category), element("span", "", `${String(deck.slideCount).padStart(2, "0")} SLIDES`));
  const heading = element("div", "sheet-heading");
  heading.append(element("h3", "", deck.title));
  if (deck.description) heading.append(element("p", "", deck.description));
  const bottom = element("div", "sheet-bottom");
  const date = element("time", "", dateLabel(deck.date));
  if (deck.date) date.dateTime = deck.date;
  const open = element("span", "open-label", "Open deck");
  const arrow = element("span", "open-arrow", "↗");
  arrow.setAttribute("aria-hidden", "true");
  open.append(arrow);
  bottom.append(date, open);
  front.append(meta, heading, bottom);
  stack.append(front);
  link.append(stack);
  article.append(link);
  const previews = deck.thumbnails?.length ? deck.thumbnails : deck.cover ? [deck.cover] : [];
  if (previews.length) {
    const strip = element("div", "preview-strip");
    strip.setAttribute("aria-hidden", "true");
    previews.slice(0, 3).forEach(src => {
      const image = element("img");
      image.src = src;
      image.alt = "";
      image.width = 320;
      image.height = 180;
      image.loading = "lazy";
      image.addEventListener("error", () => image.remove(), { once: true });
      strip.append(image);
    });
    article.append(strip);
  }
  link.addEventListener("click", event => openDeck(event, link, front));
  return article;
}

function categoryFromUrl() {
  const category = new URL(location.href).searchParams.get("category")?.toUpperCase() || "ALL";
  return categories.includes(category) ? category : "ALL";
}

function render(category) {
  archive.replaceChildren();
  filters.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === category)));
  if (!decks) {
    const error = element("div", "empty-state", "The archive could not load.");
    error.append(element("p", "", "Reload this page to try again."));
    const reload = element("button", "", "Reload archive");
    reload.type = "button";
    reload.addEventListener("click", () => location.reload());
    error.append(reload);
    archive.append(error);
    status.textContent = "The archive could not load. Reload this page to try again.";
    return;
  }
  const visible = decks.filter(deck => category === "ALL" || deck.category === category);
  const groups = new Map();
  visible.forEach(deck => {
    const year = deck.date?.slice(0, 4) || "Undated";
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(deck);
  });
  groups.forEach((items, year) => {
    const group = element("section", "year-group");
    const label = element("h2", "year-label", year);
    label.id = "year-" + year.toLowerCase();
    group.setAttribute("aria-labelledby", label.id);
    const grid = element("div", "deck-grid");
    items.forEach(deck => grid.append(makeDeck(deck)));
    group.append(label, grid);
    archive.append(group);
  });
  if (!visible.length) {
    const empty = element("div", "empty-state", category === "ALL" ? "The archive is awaiting its first deck." : `No ${category.toLowerCase()} presentations yet.`);
    if (category !== "ALL") {
      const reset = element("button", "", "View all presentations");
      reset.type = "button";
      reset.addEventListener("click", () => {
        setCategory("ALL");
        filters[0].focus();
      });
      empty.append(element("p", "", "Try another category or return to the full archive."), reset);
    }
    archive.append(empty);
  }
  status.textContent = `${visible.length} ${visible.length === 1 ? "presentation" : "presentations"}${category === "ALL" ? " in the archive" : " in " + category.toLowerCase()}.`;
  measureStacks();
}

function setCategory(category) {
  const url = new URL(location.href);
  if (category === "ALL") url.searchParams.delete("category");
  else url.searchParams.set("category", category.toLowerCase());
  history.pushState(null, "", url);
  render(category);
}
filters.forEach(button => button.addEventListener("click", () => {
  if (opening || button.getAttribute("aria-pressed") === "true") return;
  setCategory(button.dataset.category);
}));
addEventListener("popstate", () => render(categoryFromUrl()));

async function openDeck(event, link, front) {
  // Preserve new tabs, modified clicks, download behavior, and ordinary links.
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (reducedMotion.matches || typeof front.animate !== "function") return;
  event.preventDefault();
  if (opening) return;
  opening = true;
  document.body.classList.add("opening");
  link.setAttribute("aria-busy", "true");
  const rect = front.getBoundingClientRect();
  const flight = front.cloneNode(true);
  flight.classList.add("deck-flight");
  flight.setAttribute("aria-hidden", "true");
  Object.assign(flight.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, transform: "none", viewTransitionName: "open-deck" });
  document.body.append(flight);
  front.style.visibility = "hidden";
  status.textContent = "Opening presentation.";
  const width = Math.min(innerWidth - 40, (innerHeight - 120) * 16 / 9, 1100);
  const height = width * 9 / 16;
  try {
    // First pull the sheet into the center, then let the browser match it to
    // the real presentation stage across the navigation (where supported).
    await flight.animate([
      { transform: "none" },
      { transform: `translate(${(innerWidth - width) / 2 - rect.left}px, ${(innerHeight - height - 60) / 2 - rect.top}px) scale(${width / rect.width}, ${height / rect.height})` }
    ], { duration: finePointer.matches ? 340 : 220, easing: "cubic-bezier(.22,.68,0,1.01)", fill: "forwards" }).finished;
  } catch {
    // An interrupted animation must never strand the navigation.
  }
  location.assign(link.href);
}

function resetOpening() {
  opening = false;
  document.body.classList.remove("opening");
  document.querySelectorAll(".deck-flight").forEach(node => node.remove());
  document.querySelectorAll(".front-sheet").forEach(node => { node.style.visibility = ""; });
  document.querySelectorAll(".stack-link").forEach(node => node.removeAttribute("aria-busy"));
}
addEventListener("pageshow", resetOpening);
addEventListener("pagereveal", event => {
  // Keep the outgoing name for the captured snapshot, then clean up on Back.
  if (event.viewTransition) event.viewTransition.finished.finally(resetOpening);
});

function measureStacks() {
  stackRects = [...document.querySelectorAll(".stack")].map(node => ({ node, rect: node.getBoundingClientRect() }));
  measuredScrollY = scrollY;
}
function updatePerspective() {
  frame = 0;
  if (!finePointer.matches || reducedMotion.matches || opening) return;
  stackRects.forEach(({ node, rect }) => {
    const dx = pointer ? pointer.x - rect.left - rect.width / 2 : 0;
    const dy = pointer ? pointer.y - rect.top - rect.height / 2 : 0;
    const near = pointer && Math.hypot(dx, dy) < Math.max(rect.width, rect.height) * 1.15;
    const weight = near ? .9 : 0;
    node.style.setProperty("--rx", `${(-Math.max(-1, Math.min(1, dy / rect.height)) * weight).toFixed(2)}deg`);
    node.style.setProperty("--ry", `${(Math.max(-1, Math.min(1, dx / rect.width)) * weight).toFixed(2)}deg`);
  });
}
function queuePerspective() { if (!frame) frame = requestAnimationFrame(updatePerspective); }
document.addEventListener("pointermove", event => {
  if (!finePointer.matches || reducedMotion.matches || event.pointerType === "touch") return;
  if (scrollY !== measuredScrollY) measureStacks();
  pointer = { x: event.clientX, y: event.clientY };
  queuePerspective();
}, { passive: true });
document.documentElement.addEventListener("pointerleave", () => { pointer = null; queuePerspective(); });
addEventListener("resize", measureStacks, { passive: true });
// ResizeObserver catches filter/layout changes; scroll measurement happens only
// when a pointer moves, avoiding continuous animation or scroll event work.
new ResizeObserver(measureStacks).observe(archive);
document.addEventListener("pointerover", measureStacks, { passive: true });
function resetPerspective() {
  pointer = null;
  stackRects.forEach(({ node }) => { node.style.removeProperty("--rx"); node.style.removeProperty("--ry"); });
}
reducedMotion.addEventListener("change", resetPerspective);
finePointer.addEventListener("change", resetPerspective);

if (decks) {
  const count = decks.length;
  const slides = decks.reduce((sum, deck) => sum + deck.slideCount, 0);
  document.getElementById("archive-totals").textContent = `${String(count).padStart(2, "0")} ${count === 1 ? "PRESENTATION" : "PRESENTATIONS"} / ${String(slides).padStart(2, "0")} ${slides === 1 ? "SLIDE" : "SLIDES"}`;
}
render(categoryFromUrl());
