import { profiles, views } from "./data/profiles.js";
import { renderBrandPage } from "./pages/brand.js";
import { renderLibraryPage } from "./pages/library.js";
import { renderProfilePage } from "./pages/profile.js";

const elements = {
  tabs: document.querySelector("#tabs"),
  canvas: document.querySelector("#canvas"),
  title: document.querySelector("#view-title"),
  sub: document.querySelector("#view-sub"),
  sequence: document.querySelector("#sequence"),
  modeStatus: document.querySelector("#mode-status"),
  stage: document.querySelector(".stage"),
};

const safeStorage = {
  get(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* Preview remains usable without storage. */ }
  },
};

const state = {
  mode: safeStorage.get("prsim-preview-mode", "wireframe"),
  viewport: safeStorage.get("prsim-preview-viewport", "desktop"),
  classicColorway: safeStorage.get("prsim-classic-colorway", "black"),
  view: "library",
  transition: 0,
};

const guidedAnswerTimers = new WeakMap();

const formatPrice = (value) => `${Number(value)} €`;

function syncBundleOffer(toggle, nextBasePrice) {
  const page = toggle.closest(".shop-page");
  if (!page) return;

  const basePrice = Number(nextBasePrice ?? toggle.dataset.basePrice);
  const addonPrice = Number(toggle.dataset.addonPrice);
  const bundlePrice = basePrice + addonPrice;
  toggle.dataset.basePrice = String(basePrice);
  toggle.dataset.bundlePrice = String(bundlePrice);

  const selected = toggle.checked;
  const baseCta = toggle.dataset.baseCta.replace(/\d+\s*€/, formatPrice(basePrice));
  const bundleCta = toggle.dataset.bundleCtaLabel.replace(/\d+\s*€/, formatPrice(bundlePrice));
  const activeCta = selected ? bundleCta : baseCta;
  const activePrice = selected ? bundlePrice : basePrice;

  page.querySelectorAll("[data-bundle-cta]").forEach((button) => { button.textContent = activeCta; });
  const stickyPrice = page.querySelector("[data-sticky-price]");
  if (stickyPrice) stickyPrice.textContent = formatPrice(activePrice);
}

function tickPromotionCountdowns() {
  document.querySelectorAll("[data-promo-countdown]").forEach((counter) => {
    const remaining = Math.max(0, Number(counter.dataset.seconds) - 1);
    counter.dataset.seconds = String(remaining);
    const hours = String(Math.floor(remaining / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
    const seconds = String(remaining % 60).padStart(2, "0");
    counter.textContent = `${hours}:${minutes}:${seconds}`;
  });
}

const colorwayLabels = {
  black: "NOIR",
  cream: "CRÈME",
  "liberty-blue": "LIBERTY BLEU",
  "liberty-burgundy": "LIBERTY BORDEAUX",
};

const colorwayNames = {
  black: "Noir",
  cream: "Crème",
  "liberty-blue": "Liberty bleu",
  "liberty-burgundy": "Liberty bordeaux",
};

const coreColorwayViews = new Set([
  "01-hero-three-quarter.png",
  "02-front.png",
  "03-rear-three-quarter.png",
  "04-open-interior.png",
]);

const colorwayFallbackViews = {
  "05-macro-fabric-seam.png": "02-front.png",
  "06-macro-top-zip.png": "01-hero-three-quarter.png",
  "07-macro-handle.png": "01-hero-three-quarter.png",
  "09-detail-rear-carry.png": "03-rear-three-quarter.png",
  "10-detail-top-construction.png": "01-hero-three-quarter.png",
};

function applyProfileColorway(profile, override) {
  const colorway = override || profile?.colorway || "black";
  const label = colorwayLabels[colorway] || colorwayLabels.black;

  elements.canvas.querySelectorAll("[data-product-view]").forEach((image) => {
    const requestedView = image.dataset.productView;
    const view = colorway === "black" || coreColorwayViews.has(requestedView)
      ? requestedView
      : colorwayFallbackViews[requestedView] || "01-hero-three-quarter.png";
    image.src = `./assets/products/72h-${colorway}/${view}`;
  });

  elements.canvas.querySelectorAll("[data-gallery-image]").forEach((button) => {
    const image = button.querySelector("[data-product-view]");
    if (image) button.dataset.gallerySrc = image.getAttribute("src");
  });

  elements.canvas.querySelectorAll(".asset-caption[data-color-caption]").forEach((caption) => {
    caption.textContent = `${label} / TOILE TECHNIQUE / 32 L`;
  });

  const stickyName = elements.canvas.querySelector(".sticky-product strong");
  if (stickyName) stickyName.textContent = `Passage 32 · ${colorwayNames[colorway] || colorwayNames.black}`;
}

function syncClassicColorSelector(colorway) {
  elements.canvas.querySelectorAll("[data-color-option]").forEach((option) => {
    const active = option.dataset.colorway === colorway;
    option.classList.toggle("active", active);
    option.setAttribute("aria-pressed", String(active));
  });
  const selectedColor = elements.canvas.querySelector("[data-selected-color]");
  if (selectedColor) selectedColor.textContent = colorwayNames[colorway] || colorwayNames.black;
}

function keyFromHash() {
  const key = location.hash.replace(/^#/, "");
  return views.some((view) => view.key === key) ? key : "library";
}

function renderTabs() {
  elements.tabs.innerHTML = views.map((view) => `
    <button class="tab" type="button" data-view="${view.key}">
      ${view.label}
    </button>`).join("");
}

function renderSequence(sequence) {
  elements.sequence.innerHTML = sequence.map((item, index) => `
    ${index ? '<span class="sequence-arrow">→</span>' : ""}<span class="sequence-chip">${item}</span>`).join("");
}

function syncGlobalControls() {
  document.querySelectorAll("[data-preview-mode]").forEach((button) => {
    const active = button.dataset.previewMode === state.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-viewport]").forEach((button) => {
    const active = button.dataset.viewport === state.viewport;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.canvas.classList.toggle("mode-wireframe", state.mode === "wireframe");
  elements.canvas.classList.toggle("mode-ui", state.mode === "ui");
  elements.canvas.classList.toggle("desktop", state.viewport === "desktop");
  elements.canvas.classList.toggle("mobile", state.viewport === "mobile");
  elements.modeStatus.textContent = state.view === "brand"
    ? `Référence UI · état global mémorisé : ${state.mode === "ui" ? "UI" : "Wireframe"}`
    : `Rendu global : ${state.mode === "ui" ? "UI de marque" : "Wireframe"}`;
}

function scrollProfileIntoView() {
  // Keep the compact PRSIM toolbar visible, then start directly on the shop.
  const toolbarHeight = document.querySelector(".tabs-wrap")?.getBoundingClientRect().bottom || 0;
  const stageTop = elements.stage.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, stageTop - toolbarHeight + 8), behavior: "instant" });
}

function renderCurrentView({ scroll = true } = {}) {
  state.view = keyFromHash();
  const view = views.find((candidate) => candidate.key === state.view);
  const isProfile = Boolean(profiles[state.view]);
  const shouldAnimate = scroll && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const transition = ++state.transition;

  document.querySelectorAll("[data-view]").forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });

  elements.title.textContent = view.title;
  elements.sub.textContent = view.sub;
  renderSequence(view.sequence);

  const applyView = () => {
    if (transition !== state.transition) return;
    elements.canvas.classList.toggle("brand-reference", state.view === "brand");
    if (state.view === "brand") elements.canvas.innerHTML = renderBrandPage();
    else if (state.view === "library") elements.canvas.innerHTML = renderLibraryPage();
    else elements.canvas.innerHTML = renderProfilePage(profiles[state.view]);

    const activeColorway = state.view === "classic" ? state.classicColorway : undefined;
    applyProfileColorway(profiles[state.view], activeColorway);
    if (state.view === "classic") syncClassicColorSelector(state.classicColorway);

    document.documentElement.classList.toggle("profile-preview", isProfile);
    document.body.classList.toggle("profile-preview", isProfile);
    syncGlobalControls();
    const activeTab = document.querySelector(`[data-view="${state.view}"]`);
    activeTab?.scrollIntoView({ block: "nearest", inline: "center" });
    if (isProfile) requestAnimationFrame(scrollProfileIntoView);
    else if (scroll) {
      elements.stage.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  if (!shouldAnimate) return applyView();

  elements.canvas.classList.remove("view-transition-in");
  elements.canvas.classList.add("view-transition-out");
  window.setTimeout(() => {
    if (transition !== state.transition) return;
    applyView();
    elements.canvas.classList.remove("view-transition-out");
    elements.canvas.classList.add("view-transition-in");
    window.setTimeout(() => {
      if (transition === state.transition) elements.canvas.classList.remove("view-transition-in");
    }, 420);
  }, 110);
}

function setMode(mode) {
  if (!["wireframe", "ui"].includes(mode)) return;
  state.mode = mode;
  safeStorage.set("prsim-preview-mode", mode);
  syncGlobalControls();
}

function setViewport(viewport) {
  if (!["desktop", "mobile"].includes(viewport)) return;
  state.viewport = viewport;
  safeStorage.set("prsim-preview-viewport", viewport);
  syncGlobalControls();
}

function setView(key) {
  if (!views.some((view) => view.key === key)) return;
  if (location.hash === `#${key}`) renderCurrentView();
  else location.hash = key;
}

document.addEventListener("click", (event) => {
  const modeButton = event.target.closest("[data-preview-mode]");
  if (modeButton) return setMode(modeButton.dataset.previewMode);

  const viewportButton = event.target.closest("[data-viewport]");
  if (viewportButton) return setViewport(viewportButton.dataset.viewport);

  const tab = event.target.closest("[data-view]");
  if (tab) return setView(tab.dataset.view);

  const model = event.target.closest("[data-model]");
  if (model) {
    const group = model.closest("[data-model-group]");
    group.querySelectorAll("[data-model]").forEach((card) => {
      const active = card === model;
      card.classList.toggle("selected", active);
      card.setAttribute("aria-pressed", String(active));
    });
    group.querySelector("[data-selected-model]").textContent = model.dataset.model;
    group.querySelector("[data-selected-price]").textContent = model.dataset.modelPrice;
    const bundleToggle = group.querySelector("[data-bundle-toggle]");
    if (bundleToggle) syncBundleOffer(bundleToggle, Number.parseInt(model.dataset.modelPrice, 10));
    return;
  }

  const bundleToggle = event.target.closest("[data-bundle-toggle]");
  if (bundleToggle) {
    syncBundleOffer(bundleToggle);
    return;
  }

  const colorOption = event.target.closest("[data-color-option]");
  if (colorOption) {
    const group = colorOption.closest(".material-choice");
    group.querySelectorAll("[data-color-option]").forEach((option) => {
      const active = option === colorOption;
      option.classList.toggle("active", active);
      option.setAttribute("aria-pressed", String(active));
    });
    group.querySelector("[data-selected-color]").textContent = colorOption.dataset.colorName;
    if (state.view === "classic") {
      state.classicColorway = colorOption.dataset.colorway;
      safeStorage.set("prsim-classic-colorway", state.classicColorway);
      applyProfileColorway(profiles.classic, state.classicColorway);
    }
    return;
  }

  const galleryImage = event.target.closest("[data-gallery-image]");
  if (galleryImage) {
    const gallery = galleryImage.closest(".classic-gallery");
    gallery.querySelectorAll("[data-gallery-image]").forEach((button) => {
      const active = button === galleryImage;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const mainImage = gallery.querySelector(".product-media-image");
    if (mainImage) {
      mainImage.src = galleryImage.dataset.gallerySrc;
      mainImage.dataset.productView = galleryImage.querySelector("[data-product-view]")?.dataset.productView || mainImage.dataset.productView;
    }
    return;
  }

  const heroQuestion = event.target.closest("[data-hero-question]");
  if (heroQuestion) {
    const group = heroQuestion.closest("[data-hero-questions]");
    group.querySelectorAll("[data-hero-question]").forEach((button) => {
      const active = button === heroQuestion;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const answer = group.querySelector("[data-hero-answer]");
    const previousTimer = guidedAnswerTimers.get(group);
    if (previousTimer) window.clearInterval(previousTimer);

    answer.textContent = "";
    const tokens = heroQuestion.dataset.answer.match(/\S+\s*/g) || [];
    let tokenIndex = 0;
    const timer = window.setInterval(() => {
      answer.textContent += tokens[tokenIndex] || "";
      tokenIndex += 1;
      if (tokenIndex >= tokens.length) {
        window.clearInterval(timer);
        guidedAnswerTimers.delete(group);
        heroQuestion.classList.remove("active");
        heroQuestion.setAttribute("aria-pressed", "false");

        const currentLabel = heroQuestion.textContent;
        const currentAnswer = heroQuestion.dataset.answer;
        heroQuestion.classList.add("is-morphing");
        window.setTimeout(() => {
          heroQuestion.textContent = heroQuestion.dataset.nextLabel;
          heroQuestion.dataset.answer = heroQuestion.dataset.nextAnswer;
          heroQuestion.dataset.nextLabel = currentLabel;
          heroQuestion.dataset.nextAnswer = currentAnswer;
          heroQuestion.classList.remove("is-morphing");
          heroQuestion.classList.add("is-next");
          window.setTimeout(() => heroQuestion.classList.remove("is-next"), 420);
        }, 150);
      }
    }, 24);
    guidedAnswerTimers.set(group, timer);
    return;
  }

  const sceneChoice = event.target.closest("[data-scene-choice]");
  if (sceneChoice) {
    const selector = sceneChoice.closest("[data-scene-selector]");
    const section = sceneChoice.closest(".section-scene-selector");
    const image = section.querySelector("[data-scene-image]");
    selector.querySelectorAll("[data-scene-choice]").forEach((button) => {
      const active = button === sceneChoice;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    image.classList.add("changing");
    image.src = sceneChoice.dataset.sceneSrc;
    image.alt = sceneChoice.dataset.sceneAlt;
    section.querySelector("[data-scene-caption]").textContent = sceneChoice.dataset.sceneCaption;
    selector.querySelector("[data-scene-note]").textContent = sceneChoice.dataset.sceneNote;
    window.setTimeout(() => image.classList.remove("changing"), 180);
    return;
  }

  const routineChoice = event.target.closest("[data-routine-choice]");
  if (routineChoice) {
    const section = routineChoice.closest(".section-routine-selector");
    section.querySelectorAll("[data-routine-choice]").forEach((button) => {
      const active = button === routineChoice;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const image = section.querySelector("[data-routine-image]");
    image.classList.add("changing");
    image.src = routineChoice.dataset.routineSrc;
    image.alt = routineChoice.dataset.routineAlt;
    section.querySelector("[data-routine-caption]").textContent = routineChoice.dataset.routineCaption;
    section.querySelector("[data-routine-note]").textContent = routineChoice.dataset.routineNote;
    window.setTimeout(() => image.classList.remove("changing"), 180);
    return;
  }

  const loadoutChoice = event.target.closest("[data-loadout-choice]");
  if (loadoutChoice) {
    const section = loadoutChoice.closest(".section-loadout-switch");
    section.querySelectorAll("[data-loadout-choice]").forEach((button) => {
      const active = button === loadoutChoice;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const image = section.querySelector("[data-loadout-image]");
    image.classList.add("changing");
    image.src = loadoutChoice.dataset.loadoutSrc;
    image.alt = loadoutChoice.dataset.loadoutAlt;
    section.querySelector("[data-loadout-caption]").textContent = loadoutChoice.dataset.loadoutCaption;
    section.querySelector("h4[data-loadout-title]").textContent = loadoutChoice.dataset.loadoutTitle;
    section.querySelector("p[data-loadout-body]").textContent = loadoutChoice.dataset.loadoutBody;
    const items = loadoutChoice.dataset.loadoutItems.split("||");
    const list = section.querySelector("ul[data-loadout-items]");
    list.replaceChildren(...items.map((item, index) => {
      const row = document.createElement("li");
      const number = document.createElement("span");
      number.textContent = `0${index + 1}`;
      row.append(number, item);
      return row;
    }));
    window.setTimeout(() => image.classList.remove("changing"), 180);
    return;
  }

  const photoRatio = event.target.closest("[data-photo-ratio]");
  if (photoRatio) {
    const section = photoRatio.closest(".section-photo-proof");
    section.querySelectorAll("[data-photo-ratio]").forEach((button) => {
      const active = button === photoRatio;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    section.querySelector("[data-photo-proof-grid]").dataset.ratio = photoRatio.dataset.photoRatio;
    return;
  }

  const accordion = event.target.closest("[data-accordion]");
  if (accordion) {
    const open = accordion.getAttribute("aria-expanded") === "true";
    accordion.setAttribute("aria-expanded", String(!open));
    return;
  }

  const purchase = event.target.closest("[data-purchase-action]");
  if (purchase) {
    const original = purchase.textContent;
    purchase.textContent = "Choix enregistré ✓";
    purchase.classList.add("confirmed");
    window.setTimeout(() => {
      purchase.textContent = original;
      purchase.classList.remove("confirmed");
    }, 1400);
  }
});

window.addEventListener("hashchange", () => renderCurrentView());
window.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const currentIndex = views.findIndex((view) => view.key === state.view);
  const delta = event.key === "ArrowRight" ? 1 : -1;
  const nextIndex = Math.max(0, Math.min(views.length - 1, currentIndex + delta));
  setView(views[nextIndex].key);
});

renderTabs();
renderCurrentView({ scroll: false });
window.setInterval(tickPromotionCountdowns, 1000);
