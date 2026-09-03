import { assemblies, profiles, resolveProfileVariant, views } from "./data/profiles.js";
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
import { selectCustomerEvidence } from "./data/reviews.js";
import { experiencePath, parseExperienceCode, parseExperiencePath, serializeExperienceCode } from "./core/experience-route.js";
import { setResponsiveImageSource } from "./components/primitives.js";

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
  language: normalizeLanguage(safeStorage.get("prsim-language", "en")),
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
  previewVariant: "base",
  previewResolution: null,
  experienceMutations: emptyExperienceMutations(),
  bundleOverride: null,
  selectionSource: "default",
  lastNavigation: null,
  previewHeaderVisible: false,
  previewSketch: false,
  toolRegistration: null,
  toolRegistrationDeferred: false,
  analytics: storedAnalytics(),
  appliedRoutePath: null,
  inboundRoute: null,
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
        setResponsiveImageSource(image, nextSource);
        image.animate?.([{ opacity: .45 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
      }
    } catch { /* A malformed optional map must not block product selection. */ }
  });

  elements.canvas.querySelectorAll("[data-product-view]").forEach((image) => {
    const requestedView = image.dataset.productView;
    const view = colorway === "black" || coreColorwayViews.has(requestedView)
      ? requestedView
      : colorwayFallbackViews[requestedView] || "01-hero-three-quarter.png";
    setResponsiveImageSource(image, `./assets/products/72h-${colorway}/${view}`);
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
    setResponsiveImageSource(image, sketchStudyAssets[index % sketchStudyAssets.length]);
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
    setResponsiveImageSource(image, sketchStudyAssets[index % sketchStudyAssets.length]);
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

const directViewKeys = new Set(views.filter((view) => !profiles[view.key]).map((view) => view.key));
const hasScenario = (key) => Boolean(profiles[key] && assemblies[key]);
const profileProducts = Object.freeze({ p1: "passage-24", p4: "passage-36", p9: "passage-42", p14: "passage-36" });
const evidenceBlockPurpose = Object.freeze({
  overall: "customer_rating",
  similar_use: "customer_context",
  long_term: "customer_long_term",
  balanced: "customer_balanced",
  color: "customer_color",
  durability: "customer_long_term",
  weather: "customer_context",
  comfort: "customer_context",
  cabin: "customer_context",
  organization: "customer_context",
  gift: "customer_context",
  returns: "customer_balanced",
  value: "customer_balanced",
});

const profileDefaultProduct = (key) => profileProducts[key] || "passage-32";
const profileDefaultBundle = (profile) => Boolean(profile?.hero?.bundle && profile.hero.bundle.selected !== false);

function routeEvidence(route, colorway) {
  if (!route.evidence) return null;
  const evidence = selectCustomerEvidence({
    concern: "",
    focus: route.evidence.focus,
    source: route.evidence.source,
    profileKey: route.scenarioKey,
    color: colorway,
  });
  return {
    concern: "",
    source: route.evidence.source,
    evidence,
    blockPurpose: evidenceBlockPurpose[evidence.focus] || "customer_context",
  };
}

function applyInboundExperienceRoute(route) {
  const profile = resolveProfileVariant(route.scenarioKey, route.variantId) || profiles[route.scenarioKey];
  resetPrsimToolState();
  state.previewScenario = route.scenarioKey;
  state.previewVariant = route.variantId;
  const routePrepared = Boolean(route.localVariations?.length || route.heroPurpose || route.operations?.length || route.evidence);
  state.previewResolution = routePrepared ? { localVariations: route.localVariations || [], sharedRoute: true } : null;
  state.previewSketch = false;
  state.selectedScenario = route.scenarioKey;
  state.selectionSource = "shared_experience_path";
  state.lastNavigation = null;
  state.toolColorway = route.colorway || profile.colorway || "black";
  state.toolProductId = route.productId || profileDefaultProduct(route.scenarioKey);
  state.bundleOverride = route.bundleEnabled;
  state.experienceMutations = {
    heroPurpose: route.heroPurpose,
    operations: route.operations || [],
    customerEvidence: routeEvidence(route, state.toolColorway),
  };
  selectVariant(state.toolProductId, state.toolColorway);
  const bundleEnabled = route.bundleEnabled ?? profileDefaultBundle(profile);
  setCommerceBundle(route.scenarioKey === "p2" ? "gift_pack" : "organization_pack", bundleEnabled);
  state.language = normalizeLanguage(route.language || "en");
  safeStorage.set("prsim-language", state.language);
  state.inboundRoute = {
    scenario: route.scenarioKey,
    variant: route.variantId,
    code: route.code,
  };
  if (location.hash === "#payment" && !state.purchase) {
    const product = getProduct(state.toolProductId);
    const basePrice = Number.parseInt(profile.price, 10) || product.price_eur;
    const bundlePrice = bundleEnabled ? (route.scenarioKey === "p2" ? 12 : 20) : 0;
    state.purchase = {
      productId: product.id,
      productLabel: product.title,
      colorway: state.toolColorway,
      colorLabel: colorwayNames[state.toolColorway] || state.toolColorway,
      bundleEnabled,
      price: `${basePrice + bundlePrice} €`,
      image: `./assets/products/72h-${state.toolColorway}/01-hero-three-quarter.png`,
      source: "shared_experience_path",
      sourceLabel: "un lien partagé",
    };
  }
}

function currentExperienceCode() {
  if (state.previewScenario === "classic") return "";
  const profile = resolveProfileVariant(state.previewScenario, state.previewVariant) || profiles[state.previewScenario];
  return serializeExperienceCode({
    scenarioKey: state.previewScenario,
    variantId: state.previewVariant,
    language: state.language,
    colorway: state.toolColorway || profile.colorway || "black",
    defaultColorway: profile.colorway || "black",
    bundleEnabled: state.bundleOverride,
    defaultBundleEnabled: profileDefaultBundle(profile),
    productId: state.toolProductId || profileDefaultProduct(state.previewScenario),
    defaultProductId: profileDefaultProduct(state.previewScenario),
    heroPurpose: state.experienceMutations.heroPurpose,
    localVariations: state.previewResolution?.localVariations || [],
    operations: state.experienceMutations.operations,
    evidence: state.experienceMutations.customerEvidence && {
      focus: state.experienceMutations.customerEvidence.evidence?.focus,
      source: state.experienceMutations.customerEvidence.source,
    },
  });
}

function syncExperienceUrl({ view = state.view, push = false } = {}) {
  const code = currentExperienceCode();
  const path = experiencePath(code);
  const hash = directViewKeys.has(view) ? `#${view}` : "#preview";
  const search = isAdminMode() ? "?admin=1" : "";
  const url = `${path}${search}${hash}`;
  if (`${location.pathname}${location.search}${location.hash}` !== url) {
    history[push ? "pushState" : "replaceState"](null, "", url);
  }
  state.appliedRoutePath = path;
  return `${location.origin}${path}${hash}`;
}

function applyPathRoute() {
  let route = parseExperiencePath(location.pathname, { hasScenario });
  if (!route.valid) {
    resetPreviewExperience({ preserveProductChoices: false });
    state.previewHeaderVisible = false;
    const search = isAdminMode() ? "?admin=1" : "";
    history.replaceState(null, "", `/${search}#preview`);
    state.appliedRoutePath = "/";
    return;
  }
  const canonicalPath = experiencePath(route.code);
  if (canonicalPath !== location.pathname) {
    history.replaceState(null, "", `${canonicalPath}${location.search}${location.hash || "#preview"}`);
  }
  if (state.appliedRoutePath === canonicalPath) return;
  state.appliedRoutePath = canonicalPath;
  if (route.scenarioKey === "classic") {
    resetPreviewExperience({ preserveProductChoices: false });
    state.inboundRoute = null;
  } else {
    applyInboundExperienceRoute(route);
  }
}

function keyFromHash() {
  const hashValue = location.hash.replace(/^#/, "").trim();
  if (/^s\d/i.test(hashValue)) {
    const legacy = parseExperienceCode(hashValue, { hasScenario });
    if (legacy.valid && legacy.scenarioKey !== "classic") {
      history.replaceState(null, "", `${experiencePath(legacy.code)}${location.search}#preview`);
      state.appliedRoutePath = null;
    }
  }
  applyPathRoute();
  const view = location.hash.replace(/^#/, "");
  if (directViewKeys.has(view)) return view;
  history.replaceState(null, "", `${location.pathname}${location.search}#preview`);
  return "preview";
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
  const isPreviewExperience = state.view === "preview" || state.view === "payment";
  const headerVisible = isPreviewExperience && state.previewHeaderVisible;
  document.body.classList.toggle("preview-chrome-visible", headerVisible);
  document.querySelectorAll("[data-preview-menu-toggle]").forEach((button) => {
    button.setAttribute("aria-expanded", String(headerVisible));
  });
  document.querySelectorAll("[data-preview-header-hide]").forEach((button) => {
    button.disabled = !isPreviewExperience;
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
  const routedProfile = resolveProfileVariant(state.previewScenario, state.previewVariant);
  const base = structuredClone(routedProfile || profiles[state.previewScenario] || profiles.classic);
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

  if (state.bundleOverride !== null) {
    if (!base.hero.bundle && state.bundleOverride) {
      const basePrice = Number.parseInt(base.price, 10) || 149;
      base.hero.bundle = {
        ...structuredClone(profiles.classic.hero.bundle),
        basePrice,
        totalPrice: basePrice + 20,
        baseCta: base.hero.cta,
        cta: `Acheter avec le pack · ${basePrice + 20} €`,
      };
    }
    if (base.hero.bundle) base.hero.bundle.selected = state.bundleOverride;
  }

  const mutations = state.experienceMutations;
  if (mutations.heroPurpose) {
    const definition = findBlockByPurpose("hero", mutations.heroPurpose);
    const nextHero = instantiateBlock(definition, profiles);
    const preservedBundle = base.hero.bundle;
    base.hero = {
      ...nextHero,
      bundle: preservedBundle || nextHero.bundle || null,
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
      const requestedPosition = Number(mutation.position);
      const requestedIndex = Number.isInteger(requestedPosition)
        ? Math.max(0, requestedPosition - 1)
        : -1;
      const positionedIndex = requestedIndex >= 0 && bodySections.length
        ? Math.max(0, Math.min(requestedPosition - 1, Math.max(0, bodySections.length - 1)))
        : -1;
      const insertionIndex = requestedIndex >= 0 ? Math.min(requestedIndex, bodySections.length) : -1;

      if (mutation.operation === "remove" && positionedIndex >= 0) {
        bodySections.splice(positionedIndex, 1);
        return;
      }
      if (mutation.operation === "prioritize" && positionedIndex >= 0) {
        const [section] = bodySections.splice(positionedIndex, 1);
        if (section) bodySections.unshift(section);
        return;
      }

      const definition = findBlockByPurpose("content", mutation.purpose);
      const existingIndex = bodySections.findIndex((section) => section.blockPurpose === definition.purpose);
      const fresh = instantiateBlock(definition, profiles);

      if (mutation.operation === "remove") {
        bodySections = bodySections.filter((section) => section.blockPurpose !== definition.purpose);
        return;
      }

      if (mutation.operation === "replace") {
        const semanticIndex = bodySections.findIndex((section) => section.blockPurpose === mutation.replacePurpose);
        const targetIndex = positionedIndex >= 0
          ? positionedIndex
          : semanticIndex >= 0 ? semanticIndex : Math.max(0, bodySections.length - 1);
        if (bodySections.length) bodySections.splice(targetIndex, 1, fresh);
        else bodySections.push(fresh);
      } else if (insertionIndex >= 0) {
        if (existingIndex >= 0) bodySections.splice(existingIndex, 1);
        bodySections.splice(Math.min(insertionIndex, bodySections.length), 0, fresh);
      } else if (existingIndex >= 0) {
        const [existing] = bodySections.splice(existingIndex, 1);
        bodySections.unshift(existing);
      } else if (mutation.placement === "before_cta") {
        bodySections.push(fresh);
      } else if (definition.purpose === "laptop_access") {
        const airlineIndex = bodySections.findIndex((section) => section.blockPurpose === "airline_compatibility" || section.variant === "airline-compare");
        bodySections.splice(airlineIndex >= 0 ? airlineIndex + 1 : 0, 0, fresh);
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

let viewMotionTimers = [];

function scheduleViewMotion(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  viewMotionTimers.push(timer);
  return timer;
}

function clearViewMotion() {
  viewMotionTimers.forEach((timer) => window.clearTimeout(timer));
  viewMotionTimers = [];
  elements.canvas.classList.remove("experience-preparing", "experience-revealing");
  elements.canvas.removeAttribute("aria-busy");
  elements.canvas.querySelectorAll(".block-collapse-out, .block-expand-in, .block-morph-out, .block-morph-in").forEach((element) => {
    element.classList.remove("block-collapse-out", "block-expand-in", "block-morph-out", "block-morph-in");
    element.style.removeProperty("--block-motion-height");
  });
}

function profileBodySections() {
  return [...elements.canvas.querySelectorAll(".shop-page > .section-layout")]
    .filter((section) => section.dataset.layoutVariant !== "final" && section.dataset.layoutId !== "CTA");
}

function motionTarget(motion, phase = "after") {
  if (!motion) return null;
  if (motion.kind === "hero") return elements.canvas.querySelector(".hero-layout");
  if (phase === "after" && motion.purpose) {
    const byPurpose = elements.canvas.querySelector(`[data-block-purpose="${motion.purpose}"]`);
    if (byPurpose) return byPurpose;
  }
  const sections = profileBodySections();
  const position = phase === "before" ? motion.beforePosition : motion.afterPosition;
  if (Number.isInteger(position) && position > 0) return sections[position - 1] || null;
  if (phase === "after" && motion.selector) return elements.canvas.querySelector(motion.selector);
  return null;
}

function revealMotionTarget(motion, transition) {
  if (transition !== state.transition || motion.operation === "remove") return;
  const target = motionTarget(motion, "after");
  if (!target) return;
  const expands = motion.kind === "section" && ["add", "replace"].includes(motion.operation);
  const className = expands ? "block-expand-in" : "block-morph-in";
  if (expands) target.style.setProperty("--block-motion-height", `${Math.ceil(target.getBoundingClientRect().height)}px`);
  target.classList.add(className);
  scheduleViewMotion(() => {
    target.classList.remove(className);
    target.style.removeProperty("--block-motion-height");
  }, expands ? 900 : 800);
  scheduleViewMotion(() => target.scrollIntoView({ behavior: "smooth", block: motion.kind === "hero" ? "start" : "center" }), 90);
}

function runLocalViewMotion({ motion, applyView, transition }) {
  const previous = motionTarget(motion, "before");
  const collapses = motion.kind === "section" && ["replace", "remove"].includes(motion.operation);
  const delay = previous ? (collapses ? 430 : 300) : 0;

  if (previous) {
    if (collapses) {
      previous.style.setProperty("--block-motion-height", `${Math.ceil(previous.getBoundingClientRect().height)}px`);
      previous.classList.add("block-collapse-out");
    } else {
      previous.classList.add("block-morph-out");
    }
  }

  scheduleViewMotion(() => {
    if (transition !== state.transition) return;
    applyView();
    revealMotionTarget(motion, transition);
  }, delay);
}

function runExperiencePreparation({ applyView, transition }) {
  elements.canvas.setAttribute("aria-busy", "true");
  elements.canvas.classList.add("experience-preparing");
  scheduleViewMotion(() => {
    if (transition !== state.transition) return;
    applyView();
    elements.canvas.classList.remove("experience-preparing");
    elements.canvas.classList.add("experience-revealing");
    scheduleViewMotion(() => {
      if (transition !== state.transition) return;
      elements.canvas.classList.remove("experience-revealing");
      elements.canvas.removeAttribute("aria-busy");
    }, 1380);
  }, 520);
}

function replayMicroMotion(selector, className, duration = 520) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  elements.canvas.querySelectorAll(selector).forEach((element) => {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), duration);
  });
}

function renderCurrentView({ scroll = true, motion = null } = {}) {
  clearViewMotion();
  state.view = keyFromHash();
  const view = views.find((candidate) => candidate.key === state.view);
  const isProfile = Boolean(profiles[state.view]);
  const isShopView = isProfile || state.view === "preview" || state.view === "payment";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shouldAnimate = scroll && !reducedMotion;
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
    if (state.view === "preview") document.title = `PORT 70 | ${translateText(previewProfile().hero.title, state.language)}`;
    else if (state.view === "payment") document.title = `PORT 70 | ${translateText("Paiement direct", state.language)}`;
    else document.title = `PRSIM | ${translateText(view.label, state.language)}`;
    const activeTab = document.querySelector(`[data-view="${state.view}"]`);
    activeTab?.scrollIntoView({ block: "nearest", inline: "center" });
    if (isShopView && (scroll || motion?.type === "prepare")) requestAnimationFrame(scrollProfileIntoView);
    else if (scroll) {
      elements.stage.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  if (motion && !reducedMotion) {
    if (motion.type === "prepare") return runExperiencePreparation({ applyView, transition });
    return runLocalViewMotion({ motion, applyView, transition });
  }

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
  if (["preview", "payment"].includes(state.view) && state.previewScenario !== "classic") syncExperienceUrl();
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
  if (!directViewKeys.has(key)) return;
  state.previewHeaderVisible = key === "preview";
  if (key === "preview" && state.previewScenario !== "classic") {
    syncExperienceUrl({ view: key, push: state.view !== "preview" });
    return renderCurrentView();
  }
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
  const productId = overrides.product_id || state.toolProductId || profileProducts[state.previewScenario] || commerce.product_id || "passage-32";
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

let shareFeedbackTimer = null;

function showShareFeedback(message) {
  const feedback = elements.canvas.querySelector("[data-share-feedback]");
  if (!feedback) return;
  feedback.textContent = translateText(message, state.language);
  feedback.classList.add("is-visible");
  if (shareFeedbackTimer) window.clearTimeout(shareFeedbackTimer);
  shareFeedbackTimer = window.setTimeout(() => feedback.classList.remove("is-visible"), 1800);
}

async function shareCurrentExperience() {
  const profile = previewProfile();
  const code = currentExperienceCode();
  const url = `${location.origin}${experiencePath(code)}#preview`;
  const title = `PORT 70 | ${translateText(profile.hero.title, state.language)}`;
  const text = translateText(profile.hero.body || profile.sub || "", state.language);
  const payload = { title, text, url };
  if (navigator.share) {
    try {
      await navigator.share(payload);
      showShareFeedback("Expérience partagée");
      return { shared: true, url };
    } catch (error) {
      if (error?.name === "AbortError") return { shared: false, canceled: true, url };
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    showShareFeedback("Lien copié");
    return { shared: true, copied: true, url };
  } catch {
    showShareFeedback(url);
    return { shared: false, url };
  }
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
  state.previewVariant = "base";
  state.previewResolution = null;
  state.experienceMutations = emptyExperienceMutations();
  state.bundleOverride = null;
  state.previewSketch = false;
  state.selectionSource = "default";
  state.lastNavigation = null;
  if (!preserveProductChoices) {
    state.toolColorway = null;
    state.toolProductId = null;
    setCommerceBundle("organization_pack", false);
  }
}

function selectScenarioForPreview(key) {
  if (!profiles[key] || key === "classic") return;
  resetPrsimToolState();
  state.selectedScenario = key;
  state.previewScenario = key;
  state.previewVariant = "base";
  state.previewResolution = null;
  state.experienceMutations = emptyExperienceMutations();
  state.bundleOverride = null;
  state.previewSketch = false;
  state.selectionSource = "scenario_picker";
  state.lastNavigation = null;
  state.toolColorway = profiles[key].colorway || "black";
  state.toolProductId = profileDefaultProduct(key);
  selectVariant(state.toolProductId, state.toolColorway);
  setCommerceBundle(key === "p2" ? "gift_pack" : "organization_pack", profileDefaultBundle(profiles[key]));
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
    replayMicroMotion(".product-media-image, .gallery-thumb-image", "colorway-swap-in", 520);
  }
  if (["preview", "payment"].includes(state.view) && state.previewScenario !== "classic") syncExperienceUrl();
}

function applyToolBundle(bundle) {
  state.bundleOverride = Boolean(bundle.enabled);
  const toggle = elements.canvas.querySelector("[data-bundle-toggle]");
  if (toggle) {
    toggle.checked = bundle.enabled;
    syncBundleOffer(toggle);
    replayMicroMotion(".hero-bundle-offer, [data-bundle-cta], .sticky-buy", "commerce-feedback", 480);
  } else if (state.view === "preview") {
    renderCurrentView({ scroll: false });
  }
  if (["preview", "payment"].includes(state.view) && state.previewScenario !== "classic") syncExperienceUrl();
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
        syncExperienceUrl();
        deferRender();
        return { selected: true, scenario_key, preview_active: scenario_key };
      },
      onBrowseScenarios: ({ direction }) => {
        if (direction === "random") selectRandomScenarioForPreview();
        else stepScenarioForPreview(direction === "previous" ? -1 : 1);
        syncExperienceUrl();
        deferRender();
        return { selected: true, scenario_key: state.previewScenario, direction };
      },
      onResetScenario: ({ preserve_product_choices }) => {
        resetPreviewExperience({ preserveProductChoices: preserve_product_choices });
        syncExperienceUrl();
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
      state.previewVariant = "base";
      state.previewResolution = resolution;
      state.experienceMutations = emptyExperienceMutations();
      state.bundleOverride = null;
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
      state.toolProductId = profileDefaultProduct(state.previewScenario);
      const activeProfile = profiles[state.previewScenario] || profiles.classic;
      const selectedColor = state.toolColorway || activeProfile.colorway || "black";
      const selectedVariant = selectVariant(state.toolProductId, selectedColor);
      setCommerceBundle(state.previewScenario === "p2" ? "gift_pack" : "organization_pack", profileDefaultBundle(activeProfile));
      const selectedProduct = getProduct(state.toolProductId);
      syncExperienceUrl({ view: "preview" });
      state.toolRegistrationDeferred = true;
      renderCurrentView({ scroll: false, motion: { type: "prepare" } });
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
      syncExperienceUrl({ view: "preview" });
      state.toolRegistrationDeferred = true;
      renderCurrentView({ scroll: false, motion: { type: "prepare" } });
      window.setTimeout(() => {
        state.toolRegistrationDeferred = false;
        syncToolRegistration();
      }, 0);
    },
    onHeroChanged({ goal, preserve = [], request }) {
      const block = findBlockByPurpose("hero", goal);
      state.experienceMutations.heroPurpose = block.purpose;
      state.selectionSource = "experience_block_update";
      syncExperienceUrl();
      renderCurrentView({
        scroll: false,
        motion: { type: "local", kind: "hero", operation: "replace", purpose: block.purpose },
      });
      return {
        applied: true,
        request,
        block: { id: block.id, purpose: block.purpose, label: block.label },
        preserved: preserve,
        active_block_count: previewProfile().sections.filter((section) => section.id !== "CTA").length,
      };
    },
    onBlocksUpdated({ operation = "auto", purpose, replace_purpose, placement = "best", position, request }) {
      const block = findBlockByPurpose("content", purpose);
      const before = previewProfile().sections.filter((section) => section.id !== "CTA").map((section) => inferBlockForNode(section).purpose);
      const requestedPosition = Number(position);
      const explicitPosition = Number.isInteger(requestedPosition) && requestedPosition > 0 ? requestedPosition : null;
      const existingPosition = before.indexOf(block.purpose) + 1 || null;
      const replacedPosition = before.indexOf(replace_purpose) + 1 || null;
      const effectiveOperation = operation === "auto"
        ? existingPosition ? "prioritize" : before.length >= 5 ? "replace" : "add"
        : operation;
      const beforePosition = explicitPosition
        || (effectiveOperation === "remove" || effectiveOperation === "prioritize" ? existingPosition : null)
        || (effectiveOperation === "replace" ? replacedPosition || before.length : null);
      state.experienceMutations.operations.push({ operation, purpose: block.purpose, replacePurpose: replace_purpose, placement, position });
      state.selectionSource = "experience_block_update";
      syncExperienceUrl();
      const after = previewProfile().sections.filter((section) => section.id !== "CTA").map((section) => section.blockPurpose || inferBlockForNode(section).purpose);
      const afterPosition = after.indexOf(block.purpose) + 1 || explicitPosition || null;
      renderCurrentView({
        scroll: false,
        motion: {
          type: "local",
          kind: "section",
          operation: effectiveOperation,
          purpose: block.purpose,
          beforePosition,
          afterPosition,
        },
      });
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
      const currentSections = previewProfile().sections.filter((section) => section.id !== "CTA");
      const previousEvidencePosition = currentSections.findIndex((section) => section.variant === "customer-evidence") + 1;
      const previousReviewsPosition = currentSections.findIndex((section) => ["reviews", "comments"].includes(section.variant)) + 1;
      state.experienceMutations.customerEvidence = {
        concern,
        source,
        evidence,
        blockPurpose: block.purpose,
      };
      state.selectionSource = "customer_evidence";
      syncExperienceUrl();
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
      const evidencePosition = nextProfile.sections.filter((section) => section.id !== "CTA").findIndex((section) => section.variant === "customer-evidence") + 1;
      renderCurrentView({
        scroll: false,
        motion: {
          type: "local",
          kind: "section",
          operation: previousEvidencePosition || previousReviewsPosition ? "replace" : "add",
          purpose: block.purpose,
          selector: ".section-customer-evidence",
          beforePosition: previousEvidencePosition || previousReviewsPosition || null,
          afterPosition: evidencePosition || null,
        },
      });
      window.setTimeout(() => {
        const target = elements.canvas.querySelector(".section-customer-evidence");
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (state.lastNavigation?.section === "reviews") state.lastNavigation.scheduled = false;
      }, 760);
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
  const laptopReplay = event.target.closest("[data-laptop-replay]");
  if (laptopReplay) {
    const diagram = laptopReplay.closest(".section-laptop-access")?.querySelector(".laptop-access-diagram");
    if (diagram) {
      diagram.classList.remove("is-replaying");
      void diagram.offsetWidth;
      diagram.classList.add("is-replaying");
    }
    return;
  }

  const shareExperience = event.target.closest("[data-share-experience]");
  if (shareExperience) {
    shareCurrentExperience();
    return;
  }

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
    syncExperienceUrl();
    return renderCurrentView({ scroll: false });
  }

  const scenarioReset = event.target.closest("[data-scenario-reset]");
  if (scenarioReset) {
    resetPreviewExperience({ preserveProductChoices: false });
    syncExperienceUrl();
    return renderCurrentView({ scroll: false });
  }

  const scenarioStep = event.target.closest("[data-scenario-step]");
  if (scenarioStep) {
    stepScenarioForPreview(Number(scenarioStep.dataset.scenarioStep) || 1);
    syncExperienceUrl();
    return renderCurrentView({ scroll: false });
  }

  const scenarioRandom = event.target.closest("[data-scenario-random]");
  if (scenarioRandom) {
    selectRandomScenarioForPreview();
    syncExperienceUrl();
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
    state.previewHeaderVisible = true;
    syncExperienceUrl({ view: "preview", push: true });
    return renderCurrentView();
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
    state.bundleOverride = bundleToggle.checked;
    setCommerceBundle(state.previewScenario === "p2" ? "gift_pack" : "organization_pack", bundleToggle.checked);
    replayMicroMotion(".hero-bundle-offer, [data-bundle-cta], .sticky-buy", "commerce-feedback", 480);
    if (["preview", "payment"].includes(state.view) && state.previewScenario !== "classic") syncExperienceUrl();
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
      setResponsiveImageSource(mainImage, galleryImage.dataset.gallerySrc);
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
    setResponsiveImageSource(image, sceneSource);
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
    setResponsiveImageSource(image, routineChoice.dataset.routineSrc);
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
    setResponsiveImageSource(image, loadoutChoice.dataset.loadoutSrc);
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
window.addEventListener("popstate", () => {
  state.appliedRoutePath = null;
  renderCurrentView({ scroll: false });
});
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

if (!location.hash) history.replaceState(null, "", `${location.pathname}${location.search}#preview`);
renderTabs();
applyBrandTokens(state.brand);
renderCurrentView({ scroll: false });
window.setInterval(tickPromotionCountdowns, 1000);
window.setInterval(tickSessionClock, 31);
