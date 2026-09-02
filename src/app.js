import { assemblies, profiles, views } from "./data/profiles.js";
import { renderBrandPage } from "./pages/brand.js";
import { renderLibraryPage } from "./pages/library.js";
import { formatElapsed, renderPaymentPage, startPaymentExperience } from "./pages/payment.js";
import { renderProfilePage } from "./pages/profile.js";
import { renderAssembliesPage, renderAssetsPage, renderBlocksPage, renderFoundationPage, renderScenariosPage } from "./pages/system.js";
import { renderMcpStatePage } from "./pages/mcp-state.js";
import { completeCheckout, getCommerceState, selectVariant, setBundle as setCommerceBundle } from "./core/commerce.js";
import { applyBrandTokens, defaultBrand, normalizeBrand, titleFonts } from "./core/brand.js";
import { getProduct } from "./data/shop.js";
import { getPrsimToolState, registerPrsimTools, resetPrsimToolState } from "./webmcp/tools.js";
import { registerPrsimAdminGateway, registerPrsimStudioTools } from "./webmcp/admin-tools.js";
import { languageName, localizeElement, normalizeLanguage, translateText } from "./core/i18n.js";
import { navigationAnchors } from "./core/navigation-anchors.js";
import { scenarioSeeds } from "./data/scenario-system.js";
import { findBlockByPurpose, inferBlockForNode, instantiateBlock } from "./data/block-registry.js";

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

const compactViewportQuery = window.matchMedia("(max-width: 720px)");

function storedAnalytics() {
  try { return JSON.parse(safeStorage.get("prsim-demand-analytics-v2", "{}")); }
  catch { return {}; }
}

function storedBrand() {
  try { return normalizeBrand(JSON.parse(safeStorage.get("prsim-brand-system-v1", "{}"))); }
  catch { return { ...defaultBrand }; }
}

const emptyExperienceMutations = () => ({ heroPurpose: null, operations: [], customerEvidence: null });

const state = {
  mode: safeStorage.get("prsim-preview-mode", "ui"),
  viewport: safeStorage.get("prsim-preview-viewport", compactViewportQuery.matches ? "mobile" : "desktop"),
  language: normalizeLanguage(safeStorage.get("prsim-language", "fr")),
  classicColorway: safeStorage.get("prsim-classic-colorway", "black"),
  view: "preview",
  transition: 0,
  toolColorway: null,
  toolProductId: null,
  purchase: null,
  assetFamily: "images",
  assetFilter: "all",
  assetColor: "all",
  reviewSource: "all",
  scenarioFamily: "Tous",
  selectedScenario: "p1",
  selectedAssembly: "p1",
  assemblyInspectorView: "layouts",
  customAssemblies: [],
  brand: storedBrand(),
  brandEditing: false,
  brandDraft: null,
  previewScenario: "classic",
  previewResolution: null,
  experienceMutations: emptyExperienceMutations(),
  selectionSource: "default",
  lastNavigation: null,
  previewHeaderVisible: false,
  previewSketch: false,
  toolRegistration: null,
  toolRegistrationDeferred: false,
  analytics: storedAnalytics(),
};

const sessionStartedAt = performance.now();

const conversionPhrases = [
  "Tu avais vraiment besoin de ça ? On préfère ne pas demander.",
  "Tu étais venu regarder. Bien sûr.",
  "Le sac n’était pas urgent. L’envie, visiblement, si.",
  "Quelques secondes ont suffi pour transformer une envie en départ.",
  "Décision rationnelle, émotion parfaitement chronométrée.",
  "On appelle ça un coup de cœur. Ton relevé bancaire dira achat impulsif.",
];

const sourceLabels = {
  human_cta: "le bouton Acheter",
  prsim_webmcp: "PRSIM WebMCP",
  shopify_webmcp: "Shopify WebMCP",
  ucp: "un checkout UCP",
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

  elements.canvas.querySelectorAll("img[data-color-assets]").forEach((image) => {
    try {
      const sources = JSON.parse(image.dataset.colorAssets);
      const nextSource = sources[colorway] || sources.black || sources.cream;
      if (nextSource && image.getAttribute("src") !== nextSource) {
        image.src = nextSource;
        image.animate?.([{ opacity: .45 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
      }
    } catch { /* A malformed optional map must not block product selection. */ }
  });

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
    caption.textContent = translateText(`${label} / TOILE TECHNIQUE / 32 L`, state.language);
  });

  elements.canvas.querySelectorAll("[data-color-copy]").forEach((element) => {
    const template = element.dataset.colorTemplate || element.textContent;
    const copy = template.replaceAll("{color}", colorwayNames[colorway] || colorwayNames.black);
    element.textContent = translateText(copy, state.language);
  });

  const stickyName = elements.canvas.querySelector(".sticky-product strong");
  if (stickyName) stickyName.textContent = translateText(`Passage 32 · ${colorwayNames[colorway] || colorwayNames.black}`, state.language);
}

function syncClassicColorSelector(colorway) {
  elements.canvas.querySelectorAll("[data-color-option]").forEach((option) => {
    const active = option.dataset.colorway === colorway;
    option.classList.toggle("active", active);
    option.setAttribute("aria-pressed", String(active));
  });
  const selectedColor = elements.canvas.querySelector("[data-selected-color]");
  if (selectedColor) selectedColor.textContent = translateText(colorwayNames[colorway] || colorwayNames.black, state.language);
}

const sketchStudyAssets = [
  "./assets/sketch/passage-front-three-quarter.png",
  "./assets/sketch/passage-front.png",
  "./assets/sketch/passage-rear-three-quarter.png",
];

function applyLibrarySketchAssets() {
  if (state.mode !== "ui") return;
  const page = elements.canvas.querySelector(".library-page");
  if (!page) return;

  const images = [...page.querySelectorAll(".pattern-viewport img")]
    .filter((image) => !image.closest(".color-option"));
  images.forEach((image, index) => {
    image.src = sketchStudyAssets[index % sketchStudyAssets.length];
    image.removeAttribute("srcset");
    image.removeAttribute("data-color-assets");
  });

  const sourceAttributes = ["data-gallery-src", "data-scene-src", "data-routine-src", "data-loadout-src"];
  sourceAttributes.forEach((attribute, attributeIndex) => {
    page.querySelectorAll(`.pattern-viewport [${attribute}]`).forEach((element, index) => {
      element.setAttribute(attribute, sketchStudyAssets[(attributeIndex + index) % sketchStudyAssets.length]);
    });
  });
}

function applySketchExperience() {
  const page = elements.canvas.querySelector(".shop-page.sketch-experience");
  if (!page) return;

  const images = [...page.querySelectorAll("img")].filter((image) => !image.closest(".color-option"));
  images.forEach((image, index) => {
    image.src = sketchStudyAssets[index % sketchStudyAssets.length];
    image.removeAttribute("srcset");
  });

  const sourceAttributes = ["data-gallery-src", "data-scene-src", "data-routine-src", "data-loadout-src"];
  sourceAttributes.forEach((attribute, attributeIndex) => {
    page.querySelectorAll(`[${attribute}]`).forEach((element, index) => {
      element.setAttribute(attribute, sketchStudyAssets[(attributeIndex + index) % sketchStudyAssets.length]);
    });
  });

  page.querySelectorAll(".asset-caption").forEach((caption, index) => {
    caption.textContent = `ÉTUDE ${String(index + 1).padStart(2, "0")} / PASSAGE 32`;
  });
}

function keyFromHash() {
  const key = location.hash.replace(/^#/, "");
  return views.some((view) => view.key === key) ? key : "preview";
}

function isAdminMode() {
  return new URLSearchParams(location.search).get("admin") === "1";
}

function renderTabs() {
  elements.tabs.innerHTML = views.filter((view) => !view.hidden).map((view) => `
    <button class="tab" type="button" data-view="${view.key}">
      ${view.label}
    </button>`).join("");
}

function syncLanguageControl() {
  const nextLanguage = state.language === "fr" ? "en" : "fr";
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.textContent = nextLanguage.toUpperCase();
    button.dataset.languageTarget = nextLanguage;
    button.setAttribute("aria-label", state.language === "fr" ? "Afficher le site en anglais" : "Display the site in French");
    button.title = state.language === "fr" ? "English" : "Français";
  });
}

function syncPreviewChrome() {
  const headerVisible = state.view === "preview" && state.previewHeaderVisible;
  document.body.classList.toggle("preview-chrome-visible", headerVisible);
  document.querySelectorAll("[data-preview-menu-toggle]").forEach((button) => {
    button.setAttribute("aria-expanded", String(headerVisible));
  });
  document.querySelectorAll("[data-preview-header-hide]").forEach((button) => {
    button.disabled = state.view !== "preview";
  });
}

function renderSequence(sequence) {
  elements.sequence.innerHTML = sequence.map((item, index) => `
    ${index ? '<span class="sequence-arrow">→</span>' : ""}<span class="sequence-chip">${item}</span>`).join("");
}

function syncGlobalControls() {
  const effectiveViewport = compactViewportQuery.matches ? "mobile" : state.viewport;
  document.querySelectorAll("[data-preview-mode]").forEach((button) => {
    const active = button.dataset.previewMode === state.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-viewport]").forEach((button) => {
    const active = button.dataset.viewport === effectiveViewport;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.canvas.classList.toggle("mode-wireframe", state.mode === "wireframe");
  elements.canvas.classList.toggle("mode-ui", state.mode === "ui");
  elements.canvas.classList.toggle("desktop", effectiveViewport === "desktop");
  elements.canvas.classList.toggle("mobile", effectiveViewport === "mobile");
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

function previewProfile() {
  const base = structuredClone(profiles[state.previewScenario] || profiles.classic);
  const variations = state.previewResolution?.localVariations || [];
  const claimedIndexes = new Set();
  const replaceableIndex = (preferredVariants = []) => {
    const preferred = base.sections.findIndex((section, index) => !claimedIndexes.has(index) && preferredVariants.includes(section.variant));
    if (preferred >= 0) {
      claimedIndexes.add(preferred);
      return preferred;
    }
    for (let index = base.sections.length - 2; index >= 0; index -= 1) {
      if (!claimedIndexes.has(index) && base.sections[index].id !== "CTA") {
        claimedIndexes.add(index);
        return index;
      }
    }
    return 0;
  };

  variations.forEach((variation) => {
    if (variation.slot === "weather") {
      const donor = profiles.p9.sections.find((section) => section.title === "Eau perlante");
      if (donor) base.sections.splice(replaceableIndex(["split"]), 1, structuredClone(donor));
    }
    if (variation.slot === "durability") {
      const donor = profiles.p9.sections.find((section) => section.variant === "metrics");
      if (donor) base.sections.splice(replaceableIndex(["metrics", "cards"]), 1, structuredClone(donor));
    }
    if (variation.slot === "proof") {
      const donor = profiles.p6.sections.find((section) => ["comments", "reviews"].includes(section.variant));
      if (donor) base.sections.splice(replaceableIndex(["reviews", "comments", "trust"]), 1, structuredClone(donor));
    }
    if (variation.slot === "utility") {
      const donor = profiles.classic.sections.find((section) => section.variant === "packing");
      if (donor) base.sections.splice(replaceableIndex(["packing", "cards", "split"]), 1, structuredClone(donor));
      base.hero.bundle = structuredClone(profiles.classic.hero.bundle);
    }
    if (variation.slot === "story") {
      const donor = profiles.p12.sections.find((section) => ["journal", "scene-selector"].includes(section.variant));
      if (donor) base.sections.splice(replaceableIndex(["journal", "mosaic", "scene-selector"]), 1, structuredClone(donor));
    }
    if (variation.slot === "offer") base.hero.promotion = structuredClone(profiles.classic.hero.promotion);
  });

  const mutations = state.experienceMutations;
  if (mutations.heroPurpose) {
    const definition = findBlockByPurpose("hero", mutations.heroPurpose);
    const nextHero = instantiateBlock(definition, profiles);
    base.hero = {
      ...nextHero,
      colorSelector: base.hero.colorSelector || nextHero.colorSelector || "swatches",
    };
  }

  if (mutations.operations.length) {
    const finalSections = base.sections.filter((section) => section.id === "CTA" || section.variant === "final");
    let bodySections = base.sections
      .filter((section) => section.id !== "CTA" && section.variant !== "final")
      .map((section) => {
        const definition = inferBlockForNode(section);
        return { ...section, blockId: definition.id, blockPurpose: definition.purpose };
      });

    mutations.operations.forEach((mutation) => {
      const definition = findBlockByPurpose("content", mutation.purpose);
      const existingIndex = bodySections.findIndex((section) => section.blockPurpose === definition.purpose);
      const fresh = instantiateBlock(definition, profiles);

      if (mutation.operation === "remove") {
        bodySections = bodySections.filter((section) => section.blockPurpose !== definition.purpose);
        return;
      }

      if (mutation.operation === "replace") {
        const requestedIndex = bodySections.findIndex((section) => section.blockPurpose === mutation.replacePurpose);
        const targetIndex = requestedIndex >= 0 ? requestedIndex : Math.max(0, bodySections.length - 1);
        if (bodySections.length) bodySections.splice(targetIndex, 1, fresh);
        else bodySections.push(fresh);
      } else if (existingIndex >= 0) {
        const [existing] = bodySections.splice(existingIndex, 1);
        bodySections.unshift(existing);
      } else if (mutation.placement === "before_cta") {
        bodySections.push(fresh);
      } else {
        bodySections.unshift(fresh);
      }

      while (bodySections.length > 5) {
        const removable = bodySections.map((section) => section.blockPurpose).lastIndexOf(definition.purpose) === bodySections.length - 1
          ? 0
          : bodySections.length - 1;
        bodySections.splice(removable, 1);
      }
    });

    base.sections = [...bodySections, ...finalSections.slice(-1)];
  }

  if (mutations.customerEvidence) {
    const { blockPurpose, evidence, concern } = mutations.customerEvidence;
    const definition = findBlockByPurpose("content", blockPurpose || "customer_context");
    const dynamicEvidence = {
      ...instantiateBlock(definition, profiles),
      id: "SE",
      label: "Preuve client dynamique",
      variant: "customer-evidence",
      title: evidence.title,
      concern,
      evidence,
      content: { reviews: evidence.reviews },
      blockId: definition.id,
      templateBlockId: definition.id,
      blockPurpose: definition.purpose,
    };
    const finalSections = base.sections.filter((section) => section.id === "CTA" || section.variant === "final");
    let bodySections = base.sections.filter((section) => section.id !== "CTA" && section.variant !== "final" && section.variant !== "customer-evidence");
    const existingReviewIndex = bodySections.findIndex((section) => ["reviews", "comments"].includes(section.variant));
    let placement = "after_hero";

    if (existingReviewIndex >= 0) {
      bodySections.splice(existingReviewIndex, 1, dynamicEvidence);
      placement = "replaced_customer_reviews";
    } else {
      const focusTargets = {
        cabin: ["airline-compare", "airline-card", "table"],
        weather: ["metrics", "split"],
        durability: ["metrics", "split"],
        long_term: ["metrics", "split"],
        organization: ["packing", "loadout-switch", "hotspots", "cards"],
        gift: ["gift-reassurance", "timeline"],
        returns: ["trust", "warranty", "faq"],
        value: ["comparison", "before-after", "product-grid"],
        color: ["photo-proof", "mosaic", "scene-selector"],
      };
      const targets = focusTargets[evidence.focus] || [];
      const relatedIndex = bodySections.findIndex((section) => targets.includes(section.variant));
      const insertionIndex = relatedIndex >= 0 ? relatedIndex + 1 : 0;
      bodySections.splice(insertionIndex, 0, dynamicEvidence);
      placement = relatedIndex >= 0 ? `after_${bodySections[relatedIndex].variant}` : "after_hero";
      while (bodySections.length > 5) {
        const removableIndex = bodySections.map((section) => section.variant).lastIndexOf("customer-evidence") === bodySections.length - 1 ? 0 : bodySections.length - 1;
        bodySections.splice(removableIndex, 1);
      }
    }
    dynamicEvidence.evidencePlacement = placement;
    base.sections = [...bodySections, ...finalSections.slice(-1)];
  }

  if (state.previewSketch) {
    base.sketchMode = true;
    base.hero = {
      ...base.hero,
      id: "HX",
      variant: "sketch",
      label: "Croquis caché",
      title: "Le Passage, en trois traits.",
      body: "Trois angles. Une forme cabine. Rien de plus que l’essentiel.",
      cta: base.hero.bundle?.baseCta || base.hero.cta || "Acheter maintenant · 149 €",
      bundle: null,
      promotion: null,
    };
  }

  return base;
}

function activeShopProfile() {
  return state.view === "preview" ? previewProfile() : profiles[state.view];
}

function availableAssemblies() {
  return {
    ...assemblies,
    ...Object.fromEntries(state.customAssemblies.map((assembly) => [assembly.key, assembly])),
  };
}

function createAssemblyDraft({ sourceKey, label } = {}) {
  const source = availableAssemblies()[sourceKey || state.selectedAssembly] || assemblies.p1;
  const sequence = state.customAssemblies.length + 1;
  const key = `draft-${String(sequence).padStart(2, "0")}`;
  const draft = structuredClone(source);
  draft.key = key;
  draft.id = `ASM-DRAFT-${String(sequence).padStart(2, "0")}`;
  draft.label = label || `Nouvel assemblage ${String(sequence).padStart(2, "0")}`;
  draft.nodes = draft.nodes.map((instance, index) => ({
    ...instance,
    instanceId: `${key}-${index === 0 ? "hero" : `section-${String(index).padStart(2, "0")}`}`,
  }));
  draft.variants = [];
  state.customAssemblies.push(draft);
  state.selectedAssembly = key;
  return draft;
}

function renderCurrentView({ scroll = true } = {}) {
  state.view = keyFromHash();
  const view = views.find((candidate) => candidate.key === state.view);
  const isProfile = Boolean(profiles[state.view]);
  const isShopView = isProfile || state.view === "preview" || state.view === "payment";
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
    if (state.view === "foundation") elements.canvas.innerHTML = renderFoundationPage();
    else if (state.view === "brand") elements.canvas.innerHTML = renderBrandPage(state.brand, { editing: state.brandEditing, draft: state.brandDraft });
    else if (state.view === "library") elements.canvas.innerHTML = renderLibraryPage(state.brand);
    else if (state.view === "assets") elements.canvas.innerHTML = renderAssetsPage(state.assetFamily, state.assetFilter, state.assetColor, state.reviewSource);
    else if (state.view === "blocks") elements.canvas.innerHTML = renderBlocksPage(profiles, availableAssemblies());
    else if (state.view === "scenarios") elements.canvas.innerHTML = renderScenariosPage(profiles, state.selectedScenario, state.scenarioFamily, state.analytics, state.previewScenario);
    else if (state.view === "assemblies") elements.canvas.innerHTML = renderAssembliesPage(profiles, state.selectedAssembly, state.brand, availableAssemblies(), state.assemblyInspectorView);
    else if (state.view === "mcp") elements.canvas.innerHTML = renderMcpStatePage({
      profile: previewProfile(),
      activeScenario: state.previewScenario,
      selectionSource: state.selectionSource,
      resolution: state.previewResolution,
      activeExperience: getPrsimToolState(),
      colorway: state.toolColorway || profiles[state.previewScenario]?.colorway || state.classicColorway,
      productId: state.toolProductId || "passage-32",
      language: state.language,
      commerce: getCommerceState(),
      lastNavigation: state.lastNavigation,
      webmcpSupported: Boolean(document.modelContext?.registerTool),
      experienceMutations: state.experienceMutations,
    });
    else if (state.view === "preview") elements.canvas.innerHTML = renderProfilePage(previewProfile());
    else if (state.view === "payment") elements.canvas.innerHTML = renderPaymentPage(state.purchase);
    else elements.canvas.innerHTML = renderProfilePage(profiles[state.view]);

    applyBrandTokens(state.brand);

    const renderedProfile = activeShopProfile();
    const activeColorway = state.toolColorway || (renderedProfile?.key === "classic" ? state.classicColorway : undefined);
    if (renderedProfile) applyProfileColorway(renderedProfile, activeColorway);
    if (renderedProfile?.sketchMode) applySketchExperience();
    if (state.view === "library") applyLibrarySketchAssets();
    if (renderedProfile) syncClassicColorSelector(activeColorway || renderedProfile.colorway || "black");
    if (state.view === "payment") startPaymentExperience({
      frozenMs: state.purchase?.elapsedMs,
      sessionStartedAt,
    });

    const compactChrome = isProfile || state.view === "payment";
    document.documentElement.classList.toggle("profile-preview", compactChrome);
    document.body.classList.toggle("profile-preview", compactChrome);
    document.body.classList.toggle("payment-preview", state.view === "payment");
    document.body.classList.toggle("preview-home", state.view === "preview");
    syncGlobalControls();
    syncToolRegistration();
    syncPreviewChrome();
    localizeElement(document.body, state.language);
    syncLanguageControl();
    const activeTab = document.querySelector(`[data-view="${state.view}"]`);
    activeTab?.scrollIntoView({ block: "nearest", inline: "center" });
    if (isShopView) requestAnimationFrame(scrollProfileIntoView);
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

function setLanguage(language, { render = true } = {}) {
  const nextLanguage = normalizeLanguage(language);
  state.language = nextLanguage;
  safeStorage.set("prsim-language", nextLanguage);
  renderTabs();
  if (render) renderCurrentView({ scroll: false });
  else syncLanguageControl();
  return {
    language: nextLanguage,
    language_name: languageName(nextLanguage, nextLanguage),
    destination_unchanged: true,
    nationality_unchanged: true,
  };
}

function setView(key) {
  if (!views.some((view) => view.key === key)) return;
  state.previewHeaderVisible = key === "preview";
  if (location.hash === `#${key}`) renderCurrentView();
  else location.hash = key;
}

function conversionTypeFor(elapsedMs) {
  if (elapsedMs < 30000) return "ACHAT IMPULSIF";
  if (elapsedMs < 90000) return "COUP DE CŒUR";
  if (elapsedMs < 180000) return "CONVAINCU RAPIDEMENT";
  return "ACHAT RÉFLÉCHI";
}

function currentPurchaseSelection(overrides = {}) {
  const commerce = getCommerceState();
  const page = elements.canvas.querySelector(".shop-page");
  const selectedModel = page?.querySelector("[data-selected-model]")?.textContent?.trim();
  const profileProducts = { p1: "passage-24", p4: "passage-36", p9: "passage-42", p14: "passage-36" };
  const productId = overrides.product_id || state.toolProductId || profileProducts[state.view] || commerce.product_id || "passage-32";
  const product = getProduct(productId);
  const colorway = overrides.color || state.toolColorway || commerce.color || activeShopProfile()?.colorway || "black";
  const bundleToggle = page?.querySelector("[data-bundle-toggle]");
  const bundleEnabled = overrides.bundle_enabled ?? bundleToggle?.checked ?? commerce.bundle.enabled;
  const visiblePrice = page?.querySelector("[data-sticky-price]")?.textContent?.trim();
  const computedPrice = `${product.price_eur + (bundleEnabled ? commerce.bundle.price_eur : 0)} €`;

  return {
    productId,
    productLabel: selectedModel || product.title,
    colorway,
    colorLabel: colorwayNames[colorway] || colorway,
    bundleEnabled,
    price: overrides.bundle_enabled === undefined && visiblePrice ? visiblePrice : computedPrice,
    image: `./assets/products/72h-${colorway}/01-hero-three-quarter.png`,
  };
}

function openPayment(source = "human_cta", overrides = {}) {
  const elapsedMs = Math.round(performance.now() - sessionStartedAt);
  const selection = currentPurchaseSelection(overrides);
  state.purchase = {
    ...selection,
    elapsedMs,
    clickedAt: new Date().toISOString(),
    conversionType: conversionTypeFor(elapsedMs),
    phrase: conversionPhrases[Math.floor(Math.random() * conversionPhrases.length)],
    source,
    sourceLabel: sourceLabels[source] || source,
  };
  setView("payment");
  return { opened: true, payment_url: `${location.origin}${location.pathname}#payment`, conversion_time_ms: elapsedMs, conversion_type: state.purchase.conversionType, selection };
}

function navigateToSection(section) {
  const selectors = {
    overview: ".hero-layout",
    recommendation: ".hero-layout",
    colors: ".material-choice",
    bundle: "[data-bundle-toggle]",
    dimensions: '[data-layout-id="S2"], [data-layout-variant="table"]',
    organization: '[data-layout-variant="packing"], [data-layout-variant="loadout-switch"]',
    materials: '[data-layout-variant="metrics"], [data-layout-id="S1"]',
    airline_compatibility: '[data-layout-variant="airline-compare"], [data-layout-variant="table"]',
    delivery: '.delivery-options, [data-layout-variant="timeline"]',
    comparison: '[data-layout-variant="comparison"], [data-model-group]',
    reviews: '[data-layout-variant="reviews"], [data-layout-variant="comments"]',
    warranty: '[data-layout-variant="trust"], [data-layout-variant="faq"]',
    faq: '[data-layout-variant="faq"]',
    purchase: "[data-purchase-action]",
  };
  const target = [...elements.canvas.querySelectorAll("[data-prsim-anchor]")]
    .find((element) => element.dataset.prsimAnchor.split(/\s+/).includes(section))
    || elements.canvas.querySelector(selectors[section]);
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
  state.lastNavigation = {
    section,
    navigated: Boolean(target),
    available: navigationAnchors.some((anchor) => anchor.id === section),
    at: new Date().toISOString(),
  };
  return state.lastNavigation;
}

function resetPreviewExperience({ preserveProductChoices = true } = {}) {
  resetPrsimToolState();
  state.previewScenario = "classic";
  state.previewResolution = null;
  state.experienceMutations = emptyExperienceMutations();
  state.previewSketch = false;
  state.selectionSource = "default";
  state.lastNavigation = null;
  if (!preserveProductChoices) {
    state.toolColorway = null;
    state.toolProductId = null;
  }
}

function selectScenarioForPreview(key) {
  if (!profiles[key] || key === "classic") return;
  resetPrsimToolState();
  state.selectedScenario = key;
  state.previewScenario = key;
  state.previewResolution = null;
  state.experienceMutations = emptyExperienceMutations();
  state.previewSketch = false;
  state.selectionSource = "scenario_picker";
  state.lastNavigation = null;
  state.toolColorway = profiles[key].colorway || "black";
  const profileProducts = { p1: "passage-24", p4: "passage-36", p9: "passage-42", p14: "passage-36" };
  state.toolProductId = profileProducts[key] || "passage-32";
  selectVariant(state.toolProductId, state.toolColorway);
}

function stepScenarioForPreview(step = 1) {
  const keys = scenarioSeeds.map((scenario) => scenario.key);
  const currentKey = keys.includes(state.previewScenario) ? state.previewScenario : state.selectedScenario;
  const currentIndex = Math.max(0, keys.indexOf(currentKey));
  const nextIndex = (currentIndex + step + keys.length) % keys.length;
  selectScenarioForPreview(keys[nextIndex]);
}

function selectRandomScenarioForPreview() {
  const keys = scenarioSeeds.map((scenario) => scenario.key);
  const currentKey = keys.includes(state.previewScenario) ? state.previewScenario : state.selectedScenario;
  const alternatives = keys.filter((key) => key !== currentKey);
  const nextKey = alternatives[Math.floor(Math.random() * alternatives.length)] || keys[0];
  selectScenarioForPreview(nextKey);
}

function applyToolVariant(variant) {
  state.toolColorway = variant.color;
  state.toolProductId = variant.product_id;
  if (state.view === "classic") {
    state.classicColorway = variant.color;
    safeStorage.set("prsim-classic-colorway", variant.color);
  }
  if (activeShopProfile()) {
    applyProfileColorway(activeShopProfile(), variant.color);
    if (state.view === "preview" && state.previewSketch) applySketchExperience();
    syncClassicColorSelector(variant.color);
  }
}

function applyToolBundle(bundle) {
  const toggle = elements.canvas.querySelector("[data-bundle-toggle]");
  if (!toggle) return;
  toggle.checked = bundle.enabled;
  syncBundleOffer(toggle);
}

function tickSessionClock() {
  const clock = elements.canvas.querySelector("[data-session-elapsed]");
  if (clock) clock.textContent = formatElapsed(performance.now() - sessionStartedAt);
}

function recordWantAnalytics(resolution) {
  const request = resolution.request;
  const parts = [
    request.contexts?.[0] || "unspecified_context",
    request.buying_for || "unspecified_buying_for",
    request.decision_preferences?.style || "unspecified_decision",
    request.experience_desires?.projection?.[0] || "unspecified_projection",
    request.experience_desires?.content?.[0] || "unspecified_content",
    request.experience_desires?.tone?.[0] || "unspecified_tone",
    request.person?.age_group || "unknown",
    request.person?.gender_representation || "unspecified",
    request.aesthetic_preferences?.color || "no_preference",
    request.use_language || "fr",
  ];
  const signature = parts.join("|");
  const existing = state.analytics[signature] || { count: 0, parts, matchedScenario: resolution.scenario.key };
  state.analytics[signature] = { ...existing, count: existing.count + 1, lastSeenAt: new Date().toISOString(), confidence: resolution.confidence };
  safeStorage.set("prsim-demand-analytics-v2", JSON.stringify(state.analytics));
}

function syncToolRegistration() {
  const adminMode = isAdminMode();
  const adminPages = new Set(["foundation", "brand", "library", "assets", "blocks", "assemblies", "scenarios", "mcp"]);
  const shopperStage = state.previewResolution ? "prepared" : "initial";
  const desiredScope = adminMode && state.view === "preview"
    ? "admin_gateway:preview"
    : adminMode && adminPages.has(state.view)
      ? `admin_studio:${state.view}`
      : state.view === "preview"
        ? `shopper_preview:${shopperStage}`
        : "inactive";

  if (state.toolRegistrationDeferred && desiredScope.startsWith("shopper_preview:")) return;

  if (state.toolRegistration?.scope === desiredScope) return;
  state.toolRegistration?.controller?.abort();
  state.toolRegistration = null;
  window.prsimTools = {};

  if (desiredScope === "inactive") {
    document.documentElement.dataset.webmcp = "inactive";
    document.documentElement.dataset.webmcpScope = "inactive";
    syncPreviewChrome();
    return;
  }

  const selectAdminTarget = (destination, targetId) => {
    if (destination === "assemblies" && availableAssemblies()[targetId]) state.selectedAssembly = targetId;
    if (destination === "scenarios" && profiles[targetId] && targetId !== "classic") selectScenarioForPreview(targetId);
  };
  const deferRender = () => queueMicrotask(() => renderCurrentView({ scroll: false }));
  const navigateAdmin = ({ destination, target_id }) => {
    selectAdminTarget(destination, target_id);
    queueMicrotask(() => setView(destination));
    return { navigated: true, destination, target_id: target_id || null };
  };

  if (desiredScope === "admin_gateway:preview") {
    state.toolRegistration = registerPrsimAdminGateway({
      onOpenStudio: navigateAdmin,
    });
    syncPreviewChrome();
    return;
  }

  if (desiredScope.startsWith("admin_studio:")) {
    state.toolRegistration = registerPrsimStudioTools(state.view, {
      getStudioState: () => ({
        screen: state.view,
        brand: state.brand,
        assets: { family: state.assetFamily, type: state.assetFilter, color: state.assetColor, review_source: state.reviewSource },
        assembly: { selected: state.selectedAssembly, session_drafts: state.customAssemblies.map(({ key, id, label }) => ({ key, id, label })) },
        scenario: { selected: state.selectedScenario, preview_active: state.previewScenario, family: state.scenarioFamily },
        mode: state.mode,
        viewport: state.viewport,
      }),
      onNavigate: navigateAdmin,
      onUpdateBrand: (patch) => {
        const mapped = { ...patch };
        if (mapped.title_font) mapped.titleFont = mapped.title_font;
        delete mapped.title_font;
        state.brand = normalizeBrand({ ...state.brand, ...mapped });
        safeStorage.set("prsim-brand-system-v1", JSON.stringify(state.brand));
        applyBrandTokens(state.brand);
        deferRender();
        return { updated: true, brand: state.brand };
      },
      onFilterAssets: ({ family, type, color, review_source }) => {
        if (family) state.assetFamily = family;
        if (type) state.assetFilter = type;
        if (color) state.assetColor = color;
        if (review_source) state.reviewSource = review_source;
        deferRender();
        return { filtered: true, family: state.assetFamily, type: state.assetFilter, color: state.assetColor, review_source: state.reviewSource };
      },
      onSelectAssembly: ({ assembly_key }) => {
        if (!availableAssemblies()[assembly_key]) return { selected: false, reason: "unknown_assembly" };
        state.selectedAssembly = assembly_key;
        deferRender();
        return { selected: true, assembly_key };
      },
      onDuplicateAssembly: ({ source_key, label }) => {
        if (source_key && !availableAssemblies()[source_key]) return { created: false, reason: "unknown_assembly" };
        const draft = createAssemblyDraft({ sourceKey: source_key, label });
        deferRender();
        return { created: true, assembly_key: draft.key, assembly_id: draft.id, label: draft.label };
      },
      onSelectScenario: ({ scenario_key }) => {
        if (!profiles[scenario_key] || scenario_key === "classic") return { selected: false, reason: "unknown_scenario" };
        selectScenarioForPreview(scenario_key);
        deferRender();
        return { selected: true, scenario_key, preview_active: scenario_key };
      },
      onBrowseScenarios: ({ direction }) => {
        if (direction === "random") selectRandomScenarioForPreview();
        else stepScenarioForPreview(direction === "previous" ? -1 : 1);
        deferRender();
        return { selected: true, scenario_key: state.previewScenario, direction };
      },
      onResetScenario: ({ preserve_product_choices }) => {
        resetPreviewExperience({ preserveProductChoices: preserve_product_choices });
        deferRender();
        return { reset: true, preview_active: "classic", preserve_product_choices };
      },
    });
    syncPreviewChrome();
    return;
  }

  state.toolRegistration = registerPrsimTools({
    onExperiencePrepared(resolution) {
      if (!resolution.easterEgg) recordWantAnalytics(resolution);
      state.previewScenario = resolution.renderScenarioKey || resolution.scenario.key;
      state.previewResolution = resolution;
      state.experienceMutations = emptyExperienceMutations();
      state.selectedScenario = resolution.renderScenarioKey || resolution.scenario.key;
      state.selectionSource = resolution.easterEgg ? "easter_egg" : "prepare_shopping_experience";
      state.lastNavigation = null;
      // The easter egg already owns a complete authored p16 profile. The generic
      // sketch override is reserved for legacy/local preview experiments.
      state.previewSketch = !resolution.easterEgg && resolution.presentationMode === "sketch_study";
      if (resolution.presentationMode === "sketch_study") setMode("ui");
      const requestedColor = resolution.request.aesthetic_preferences?.color;
      const recommendedColor = resolution.colorRecommendation?.color;
      state.toolColorway = requestedColor && requestedColor !== "no_preference"
        ? requestedColor.replaceAll("_", "-")
        : recommendedColor || null;
      const profileProducts = { p1: "passage-24", p4: "passage-36", p9: "passage-42", p14: "passage-36" };
      state.toolProductId = profileProducts[state.previewScenario] || "passage-32";
      const activeProfile = profiles[state.previewScenario] || profiles.classic;
      const selectedColor = state.toolColorway || activeProfile.colorway || "black";
      const selectedVariant = selectVariant(state.toolProductId, selectedColor);
      const selectedProduct = getProduct(state.toolProductId);
      state.toolRegistrationDeferred = true;
      renderCurrentView({ scroll: false });
      window.setTimeout(() => {
        state.toolRegistrationDeferred = false;
        syncToolRegistration();
      }, 0);
      return {
        selection: {
          product_id: selectedProduct.id,
          variant_id: selectedVariant.id,
          title: selectedProduct.title,
          display_name: activeProfile.productName || selectedProduct.title,
          volume_l: selectedProduct.volume_l,
          price: activeProfile.price || `${selectedProduct.price_eur} €`,
          color: selectedColor,
          color_label: colorwayNames[selectedColor] || selectedColor,
          color_source: resolution.colorRecommendation?.source || "scenario_default",
          color_confidence: resolution.colorRecommendation?.confidence || null,
          color_reasons: resolution.colorRecommendation?.reasons || [],
          creative_target: resolution.colorRecommendation?.spec || null,
          dimensions_cm: selectedProduct.dimensions_cm,
        },
      };
    },
    onExperienceReset({ preserve_product_choices }) {
      resetPreviewExperience({ preserveProductChoices: preserve_product_choices });
      state.toolRegistrationDeferred = true;
      renderCurrentView({ scroll: false });
      window.setTimeout(() => {
        state.toolRegistrationDeferred = false;
        syncToolRegistration();
      }, 0);
    },
    onHeroChanged({ goal, preserve = [], request }) {
      const block = findBlockByPurpose("hero", goal);
      state.experienceMutations.heroPurpose = block.purpose;
      state.selectionSource = "experience_block_update";
      renderCurrentView({ scroll: false });
      return {
        applied: true,
        request,
        block: { id: block.id, purpose: block.purpose, label: block.label },
        preserved: preserve,
        active_block_count: previewProfile().sections.filter((section) => section.id !== "CTA").length,
      };
    },
    onBlocksUpdated({ operation = "auto", purpose, replace_purpose, placement = "best", request }) {
      const block = findBlockByPurpose("content", purpose);
      const before = previewProfile().sections.filter((section) => section.id !== "CTA").map((section) => inferBlockForNode(section).purpose);
      state.experienceMutations.operations.push({ operation, purpose: block.purpose, replacePurpose: replace_purpose, placement });
      state.selectionSource = "experience_block_update";
      renderCurrentView({ scroll: false });
      const after = previewProfile().sections.filter((section) => section.id !== "CTA").map((section) => section.blockPurpose || inferBlockForNode(section).purpose);
      return {
        applied: true,
        request,
        operation,
        block: { id: block.id, purpose: block.purpose, label: block.label },
        removed: before.filter((item) => !after.includes(item)),
        active_blocks: after,
        active_block_count: after.length,
      };
    },
    onCustomerEvidenceShown({ concern, source, evidence, block }) {
      const replacedPreviousEvidence = Boolean(state.experienceMutations.customerEvidence);
      state.experienceMutations.customerEvidence = {
        concern,
        source,
        evidence,
        blockPurpose: block.purpose,
      };
      state.selectionSource = "customer_evidence";
      const nextProfile = previewProfile();
      const evidenceNode = nextProfile.sections.find((section) => section.variant === "customer-evidence");
      const placement = evidenceNode?.evidencePlacement || "after_hero";
      state.lastNavigation = {
        section: "reviews",
        navigated: true,
        available: true,
        scheduled: true,
        at: new Date().toISOString(),
      };
      renderCurrentView({ scroll: false });
      window.setTimeout(() => {
        const target = elements.canvas.querySelector(".section-customer-evidence");
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (state.lastNavigation?.section === "reviews") state.lastNavigation.scheduled = false;
      }, 120);
      return {
        applied: true,
        concern,
        block: { id: block.id, purpose: block.purpose, label: block.label },
        placement,
        anchor: "reviews",
        scroll_scheduled: true,
        replaced_previous_customer_evidence: replacedPreviousEvidence,
        active_block_count: nextProfile.sections.filter((section) => section.id !== "CTA").length,
      };
    },
    onVariantSelected: applyToolVariant,
    onBundleSelected: applyToolBundle,
    onNavigate: navigateToSection,
    onPurchase: openPayment,
    onLanguageSelected: ({ language, source }) => setLanguage(language, { render: source !== "prepare_shopping_experience" }),
    getLanguage: () => state.language,
    getCustomerEvidenceContext: () => ({
      profileKey: state.previewScenario,
      color: state.toolColorway || profiles[state.previewScenario]?.colorway || state.classicColorway,
    }),
  }, { stage: shopperStage });
  state.toolRegistration.scope = `shopper_preview:${shopperStage}`;
  document.documentElement.dataset.webmcpScope = `shopper_preview:${shopperStage}`;
  syncPreviewChrome();
}

document.addEventListener("click", (event) => {
  const menuToggle = event.target.closest("[data-preview-menu-toggle]");
  if (menuToggle) {
    state.previewHeaderVisible = true;
    return syncPreviewChrome();
  }

  const headerHide = event.target.closest("[data-preview-header-hide]");
  if (headerHide) {
    state.previewHeaderVisible = false;
    return syncPreviewChrome();
  }

  const modeButton = event.target.closest("[data-preview-mode]");
  if (modeButton) return setMode(modeButton.dataset.previewMode);

  const viewportButton = event.target.closest("[data-viewport]");
  if (viewportButton) return setViewport(viewportButton.dataset.viewport);

  const languageToggle = event.target.closest("[data-language-toggle]");
  if (languageToggle) return setLanguage(languageToggle.dataset.languageTarget);

  const assemblyTarget = event.target.closest("[data-assembly-target]");
  if (assemblyTarget) {
    state.selectedAssembly = assemblyTarget.dataset.assemblyTarget;
    return setView("assemblies");
  }

  const tab = event.target.closest("[data-view]");
  if (tab) return setView(tab.dataset.view);

  const assetFamily = event.target.closest("[data-asset-family]");
  if (assetFamily) {
    state.assetFamily = assetFamily.dataset.assetFamily;
    return renderCurrentView({ scroll: false });
  }

  const assetFilter = event.target.closest("[data-asset-filter]");
  if (assetFilter) {
    state.assetFilter = assetFilter.dataset.assetFilter;
    return renderCurrentView({ scroll: false });
  }

  const assetColor = event.target.closest("[data-asset-color]");
  if (assetColor) {
    state.assetColor = assetColor.dataset.assetColor;
    return renderCurrentView({ scroll: false });
  }

  const reviewSource = event.target.closest("[data-review-source]");
  if (reviewSource) {
    state.reviewSource = reviewSource.dataset.reviewSource;
    return renderCurrentView({ scroll: false });
  }

  const scenarioFamily = event.target.closest("[data-scenario-family]");
  if (scenarioFamily) {
    state.scenarioFamily = scenarioFamily.dataset.scenarioFamily;
    return renderCurrentView({ scroll: false });
  }

  const scenarioSelect = event.target.closest("[data-scenario-select]");
  if (scenarioSelect) {
    selectScenarioForPreview(scenarioSelect.dataset.scenarioSelect);
    return renderCurrentView({ scroll: false });
  }

  const scenarioReset = event.target.closest("[data-scenario-reset]");
  if (scenarioReset) {
    resetPreviewExperience({ preserveProductChoices: false });
    return renderCurrentView({ scroll: false });
  }

  const scenarioStep = event.target.closest("[data-scenario-step]");
  if (scenarioStep) {
    stepScenarioForPreview(Number(scenarioStep.dataset.scenarioStep) || 1);
    return renderCurrentView({ scroll: false });
  }

  const scenarioRandom = event.target.closest("[data-scenario-random]");
  if (scenarioRandom) {
    selectRandomScenarioForPreview();
    return renderCurrentView({ scroll: false });
  }

  const assemblySelect = event.target.closest("[data-assembly-select]");
  if (assemblySelect) {
    state.selectedAssembly = assemblySelect.dataset.assemblySelect;
    return renderCurrentView({ scroll: false });
  }

  const assemblyInspectorView = event.target.closest("[data-assembly-inspector-view]");
  if (assemblyInspectorView) {
    state.assemblyInspectorView = assemblyInspectorView.dataset.assemblyInspectorView;
    return renderCurrentView({ scroll: false });
  }

  const createAssembly = event.target.closest("[data-create-assembly]");
  if (createAssembly) {
    createAssemblyDraft();
    return renderCurrentView({ scroll: false });
  }

  const brandEdit = event.target.closest("[data-brand-edit]");
  if (brandEdit) {
    state.brandEditing = true;
    state.brandDraft = { ...state.brand };
    return renderCurrentView({ scroll: false });
  }

  const brandCancel = event.target.closest("[data-brand-cancel]");
  if (brandCancel) {
    state.brandEditing = false;
    state.brandDraft = null;
    return renderCurrentView({ scroll: false });
  }

  const brandSave = event.target.closest("[data-brand-save]");
  if (brandSave) {
    state.brand = normalizeBrand(state.brandDraft || state.brand);
    safeStorage.set("prsim-brand-system-v1", JSON.stringify(state.brand));
    state.brandEditing = false;
    state.brandDraft = null;
    return renderCurrentView({ scroll: false });
  }

  const brandReset = event.target.closest("[data-brand-reset]");
  if (brandReset) {
    state.brandDraft = { ...defaultBrand };
    return renderCurrentView({ scroll: false });
  }

  const openPreview = event.target.closest("[data-open-preview]");
  if (openPreview) {
    selectScenarioForPreview(openPreview.dataset.openPreview);
    return setView("preview");
  }

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
    const productId = model.dataset.model.toLocaleLowerCase("fr").replaceAll(" ", "-");
    const colorway = state.toolColorway || activeShopProfile()?.colorway || "black";
    applyToolVariant(selectVariant(productId, colorway));
    return;
  }

  const bundleToggle = event.target.closest("[data-bundle-toggle]");
  if (bundleToggle) {
    syncBundleOffer(bundleToggle);
    setCommerceBundle("organization_pack", bundleToggle.checked);
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
    group.querySelector("[data-selected-color]").textContent = translateText(colorOption.dataset.colorName, state.language);
    applyToolVariant(selectVariant(state.toolProductId || "passage-32", colorOption.dataset.colorway));
    if (group.matches("details")) group.open = false;
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
    let sceneSource = sceneChoice.dataset.sceneSrc;
    if (sceneChoice.dataset.sceneColorAssets) {
      try {
        const sources = JSON.parse(sceneChoice.dataset.sceneColorAssets);
        const profile = activeShopProfile();
        const colorway = state.toolColorway || (profile?.key === "classic" ? state.classicColorway : profile?.colorway) || "black";
        sceneSource = sources[colorway] || sources.black || sources.cream || sceneSource;
        image.dataset.colorAssets = sceneChoice.dataset.sceneColorAssets;
      } catch { /* Keep the base scene if its optional color map is malformed. */ }
    } else {
      delete image.dataset.colorAssets;
    }
    image.src = sceneSource;
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
    return openPayment("human_cta");
  }

  const completePayment = event.target.closest("[data-complete-payment]");
  if (completePayment) {
    completeCheckout();
    completePayment.textContent = translateText("Paiement simulé ✓", state.language);
    completePayment.classList.add("done");
  }
});

document.addEventListener("input", (event) => {
  const field = event.target.closest("[data-brand-field]");
  if (!field) return;
  const key = field.dataset.brandField;
  const currentDraft = state.brandDraft || { ...state.brand };
  state.brandDraft = key === "name"
    ? { ...currentDraft, name: field.value.slice(0, 32) }
    : normalizeBrand({ ...currentDraft, [key]: field.value });
  const hero = field.closest(".brand-hero.is-editing");
  if (hero) {
    if (key === "ink" || key === "paper") hero.style.setProperty(`--draft-${key}`, state.brandDraft[key]);
    if (key === "titleFont") hero.style.setProperty("--draft-title-font", titleFonts[state.brandDraft.titleFont].stack);
    if (key === "name") {
      const draftName = hero.querySelector("[data-brand-draft-name]");
      if (draftName) draftName.textContent = field.value || "—";
    }
  }
  if (field.type === "color") {
    hero?.querySelectorAll(`[data-brand-value="${field.dataset.brandField}"]`).forEach((element) => {
      element.textContent = state.brandDraft[field.dataset.brandField].toUpperCase();
    });
  }
});

window.addEventListener("hashchange", () => renderCurrentView());
compactViewportQuery.addEventListener?.("change", syncGlobalControls);
window.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const navigableViews = views.filter((view) => !view.hidden);
  const currentIndex = navigableViews.findIndex((view) => view.key === state.view);
  if (currentIndex < 0) return;
  const delta = event.key === "ArrowRight" ? 1 : -1;
  const nextIndex = Math.max(0, Math.min(navigableViews.length - 1, currentIndex + delta));
  setView(navigableViews[nextIndex].key);
});

if (!location.hash || !views.some((view) => `#${view.key}` === location.hash)) {
  history.replaceState(null, "", `${location.pathname}${location.search}#preview`);
}
renderTabs();
applyBrandTokens(state.brand);
renderCurrentView({ scroll: false });
window.setInterval(tickPromotionCountdowns, 1000);
window.setInterval(tickSessionClock, 31);
