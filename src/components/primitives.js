export const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const responsiveWidths = [96, 192, 480, 960, 1280, 1920, 2560];

export function responsiveImageSourceSet(src = "") {
  const match = String(src).match(/^(?:\.\/|\/)?assets\/(.+)\.(?:png|jpe?g|avif)$/i);
  if (!match) return "";
  const base = `./assets/derivatives/${match[1]}`;
  return responsiveWidths.map((width) => `${base}.w${width}.webp ${width}w`).join(", ");
}

export function responsiveImageAttributes(src, { sizes = "100vw", priority = false } = {}) {
  const srcset = responsiveImageSourceSet(src);
  return `${srcset ? ` srcset="${esc(srcset)}" sizes="${esc(sizes)}"` : ""} loading="${priority ? "eager" : "lazy"}"${priority ? ' fetchpriority="high"' : ""} decoding="async"`;
}

export function setResponsiveImageSource(image, src) {
  if (!image || !src) return;
  image.src = src;
  const srcset = responsiveImageSourceSet(src);
  if (srcset) image.srcset = srcset;
  else image.removeAttribute("srcset");
}

const durationLabel = (seconds = 21600) => {
  const value = Math.max(0, Number(seconds));
  const hours = String(Math.floor(value / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((value % 3600) / 60)).padStart(2, "0");
  const remainingSeconds = String(value % 60).padStart(2, "0");
  return `${hours}:${minutes}:${remainingSeconds}`;
};

export const productImages = {
  hero: "./assets/products/72h-black/01-hero-three-quarter.png",
  front: "./assets/products/72h-black/02-front.png",
  rear: "./assets/products/72h-black/03-rear-three-quarter.png",
  interior: "./assets/products/72h-black/04-open-interior.png",
  fabric: "./assets/products/72h-black/05-macro-fabric-seam.png",
  zip: "./assets/products/72h-black/06-macro-top-zip.png",
  handle: "./assets/products/72h-black/07-macro-handle.png",
  carry: "./assets/products/72h-black/09-detail-rear-carry.png",
  construction: "./assets/products/72h-black/10-detail-top-construction.png",
};

export const materialOptions = [
  { name: "Noir", colorway: "black", detail: "Uni · noir mat", src: "./assets/materials/ink-black.png" },
  { name: "Crème", colorway: "cream", detail: "Uni · écru doux", src: "./assets/materials/cream-ecru.png" },
  { name: "Liberty bleu", colorway: "liberty-blue", detail: "Motif · bleu pastel", src: "./assets/materials/liberty-blue.png" },
  { name: "Liberty bordeaux", colorway: "liberty-burgundy", detail: "Motif · bordeaux", src: "./assets/materials/liberty-burgundy.png" },
];

const colorButtons = (variant) => materialOptions.map((option, index) => `<button class="color-option ${index === 0 ? "active" : ""}" type="button" data-color-option data-color-name="${esc(option.name)}" data-colorway="${option.colorway}" aria-label="${esc(option.detail)}" aria-pressed="${index === 0}">${variant === "swatches" ? `<img src="${option.src}" alt=""${responsiveImageAttributes(option.src, { sizes: "44px" })} />` : `<span>${esc(option.name)}</span>${variant === "menu" ? `<small>${esc(option.detail)}</small>` : ""}`}</button>`).join("");

export const materialChoice = ({ compact = false, variant = "swatches" } = {}) => variant === "menu" ? `
  <details class="material-choice compact variant-menu">
    <summary>Coloris · <strong data-selected-color>Noir</strong><span aria-hidden="true">+</span></summary>
    <div class="choice-row" role="group" aria-label="Choisir la matière et le coloris">${colorButtons("menu")}</div>
  </details>` : `
  <div class="material-choice ${compact ? "compact" : ""} variant-${variant}">
    <p class="choice-label">Coloris · <strong data-selected-color>Noir</strong></p>
    <div class="choice-row" role="group" aria-label="Choisir la matière et le coloris">${colorButtons(variant)}</div>
  </div>`;

const productColorNames = {
  black: "Noir",
  cream: "Crème",
  "liberty-blue": "Liberty bleu",
  "liberty-burgundy": "Liberty bordeaux",
};

const mediaImageFor = (label = "") => {
  const value = String(label).toLocaleLowerCase("fr");
  if (/ouvert|intérieur|interieur|organisation|flatlay|packing/.test(value)) return productImages.interior;
  if (/matière|matiere|tissu|macro|déperlant|pluie/.test(value)) return productImages.fabric;
  if (/zip|fermeture/.test(value)) return productImages.zip;
  if (/poignée|poignee/.test(value)) return productImages.handle;
  if (/construction|détail|detail/.test(value)) return productImages.construction;
  if (/porté|porte|épaule|epaule|mouvement|voyage|week-end|route/.test(value)) return productImages.carry;
  if (/gabarit|cabine|avant/.test(value)) return productImages.front;
  if (/arrière|arriere|dos|bretelle/.test(value)) return productImages.rear;
  return productImages.hero;
};

export const icon = (name) => {
  const paths = {
    check: '<path d="m5 12 4 4L19 6"/>',
    bag: '<path d="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    gift: '<path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7H8.5a2.5 2.5 0 1 1 2.2-3.7L12 7Zm0 0h3.5a2.5 2.5 0 1 0-2.2-3.7L12 7Z"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.7 7.5 9.5 4.3-1.8 7.5-5 7.5-9.5V6L12 3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    share: '<path d="M12 16V4m0 0L8 8m4-4 4 4"/><path d="M6 11v8h12v-8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
  };
  return `<svg class="icon icon-${esc(name)}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.check}</svg>`;
};

export const layoutLabel = (node) => `<span class="layout-label">${esc(node.id)} · ${esc(node.label)}</span>`;

export const wireLines = (widths = [100, 88, 64]) => `
  <div class="wf-lines" aria-hidden="true">
    ${widths.map((width) => `<span style="--line-width:${width}%"></span>`).join("")}
  </div>`;

export const mediaSlot = (label = "Asset produit", className = "", explicitSrc = "", explicitCaption = "", colorAssets = null) => {
  const src = explicitSrc || mediaImageFor(label);
  const view = src.split("/").at(-1);
  const productView = explicitSrc ? "" : ` data-product-view="${view}"`;
  const colorCaption = explicitSrc ? "" : " data-color-caption";
  const priority = /(^|\s)hero-media(?:\s|$)/.test(className);
  const imageAttributes = responsiveImageAttributes(src, {
    priority,
    sizes: priority ? "(max-width: 720px) 100vw, 62vw" : "(max-width: 720px) 100vw, 54vw",
  });
  return `
    <div class="media-slot ${esc(className)}">
      <div class="wf-only media-wire" aria-hidden="true"><span>${esc(label)}</span></div>
      <div class="ui-only media-ui">
        <img class="product-media-image"${productView}${colorAssets ? ` data-color-assets="${esc(JSON.stringify(colorAssets))}"` : ""} src="${src}" alt="${esc(label)}"${imageAttributes} />
        <span class="asset-caption"${colorCaption}>${esc(explicitCaption || (explicitSrc ? "EN VOYAGE / 32 L" : "NOIR / TOILE TECHNIQUE / 32 L"))}</span>
      </div>
    </div>`;
};

const dynamicColorCopy = (label = "") => {
  const template = String(label);
  const dynamic = template.includes("{color}");
  return {
    label: dynamic ? template.replaceAll("{color}", "Coloris sélectionné") : template,
    attributes: dynamic ? ` data-color-copy data-color-template="${esc(template)}"` : "",
  };
};

export const uiButton = (label, secondary = false, attributes = "") => {
  const copy = dynamicColorCopy(label);
  return `
  <button type="button" class="shop-button ${secondary ? "secondary" : ""}" data-purchase-action${copy.attributes} ${attributes}>${esc(copy.label)}</button>`;
};

export const wfButton = (label = "CTA principal") => {
  const copy = dynamicColorCopy(label);
  return `<div class="wf-button"${copy.attributes} aria-hidden="true">${esc(copy.label)}</div>`;
};

export const dualAction = (label, secondary = false, attributes = "") => `
  <div class="wf-only">${wfButton(label)}</div>
  <div class="ui-only">${uiButton(label, secondary, attributes)}</div>`;

export const heroBundleOffer = (bundle) => bundle ? `
  <label class="ui-only hero-bundle-offer">
    <input
      type="checkbox"
      data-bundle-toggle
      data-base-price="${esc(bundle.basePrice)}"
      data-bundle-price="${esc(bundle.totalPrice)}"
      data-addon-price="${esc(bundle.addonPrice)}"
      data-base-cta="${esc(bundle.baseCta)}"
      data-bundle-cta-label="${esc(bundle.cta)}"
      ${bundle.selected === false ? "" : "checked"}
    />
    <span class="bundle-copy">
      <span><strong>${esc(bundle.name)}</strong><em>Recommandé</em></span>
      <small>${esc(bundle.description)}</small>
    </span>
    <b data-bundle-delta>+ ${esc(bundle.addonPrice)} €</b>
  </label>` : "";

export const nextOrderPromo = (promotion) => promotion ? `
  <aside class="next-order-promo" aria-label="Avantage sur une prochaine commande">
    <span class="promo-copy"><strong>${esc(promotion.title)}</strong><small>${esc(promotion.detail)}</small></span>
    <span class="promo-code"><small>Code après commande</small><b>${esc(promotion.code)}</b></span>
    <span class="promo-timer"><small>Offre limitée</small><b data-promo-countdown data-seconds="${esc(promotion.durationSeconds || 21600)}">${durationLabel(promotion.durationSeconds)}</b></span>
  </aside>` : "";

export const rating = (score = "4,8", count = "326 avis") => `
  <div class="rating-row" aria-label="${esc(score)} sur 5, ${esc(count)}">
    <span class="stars" aria-hidden="true">★★★★★</span><strong>${esc(score)}</strong><span>${esc(count)}</span>
  </div>`;

export const trustpilot = () => `
  <div class="trustpilot-mark" aria-label="Trustpilot Excellent">
    <span class="trustpilot-star">★</span><strong>Trustpilot</strong><span>Excellent · 4,8</span>
  </div>`;

export const heroTrustRail = () => `
  <div class="ui-only hero-trust-rail" aria-label="Avis et confiance">
    ${trustpilot()}
  </div>`;

export const shopHeader = () => `
  <header class="shop-header">
    <div class="shop-brand-lockup">
      <a class="wf-only wf-shop-logo shop-home-link" href="#preview" aria-label="Retour à la boutique">MARQUE</a>
      <a class="ui-only shop-wordmark shop-home-link" href="#preview" aria-label="Retour à la boutique" data-brand-name>PORT 70</a>
      <button class="shop-prsim-trigger" type="button" data-preview-menu-toggle aria-label="Afficher le header PRSIM" aria-expanded="false">Voir dans PRSIM</button>
    </div>
    <nav aria-label="Navigation boutique">
      <span class="wf-only wf-nav-lines"><i></i><i></i><i></i></span>
      <span class="ui-only shop-nav" aria-label="Navigation de démonstration"><span>Sacs</span><span>Cabine</span><span>Journal</span></span>
    </nav>
    <div class="shop-actions">
      <span class="wf-only wf-icons"><i></i><i></i></span>
      <span class="ui-only">
        <button class="shop-share-action" type="button" data-share-experience aria-label="Partager cette expérience" title="Partager">${icon("share")}</button>
        ${icon("search")} ${icon("bag")}<b>0</b>
        <span class="shop-share-feedback" data-share-feedback role="status" aria-live="polite"></span>
      </span>
    </div>
  </header>`;

export const shopFooter = () => `
  <footer class="shop-footer">
    <div><span class="wf-only wf-footer-mark"></span><strong class="ui-only shop-wordmark" data-brand-name>PORT 70</strong></div>
    ${[
      ["Le sac", ["Passage 32", "Matières & coloris", "Dimensions cabine"]],
      ["Aide", ["Livraison & retours", "Garantie deux ans", "Nous contacter"]],
      ["Journal", ["Guides de villes", "Conseils packing", "Histoires de voyage"]],
    ].map(([title, links]) => `<div><strong class="ui-only">${title}</strong><span class="wf-only">${wireLines([75, 56, 68])}</span><ul class="ui-only">${links.map((link) => `<li>${link}</li>`).join("")}</ul></div>`).join("")}
  </footer>`;

export const stickyBar = (profile) => {
  const bundle = profile.hero.bundle;
  const bundleSelected = bundle && bundle.selected !== false;
  const price = bundleSelected ? `${bundle.totalPrice} €` : profile.price;
  const cta = bundleSelected ? bundle.cta : (bundle?.baseCta || profile.hero.cta || "Ajouter au panier");
  return `
  <div class="sticky-shop-bar">
    <div class="sticky-product">
      <span class="sticky-thumb"><img class="ui-only" data-product-view="01-hero-three-quarter.png" src="${productImages.hero}" alt=""${responsiveImageAttributes(productImages.hero, { sizes: "48px" })} /></span>
      <span><strong class="ui-only">${esc(profile.productName || `Passage 32 · ${productColorNames[profile.colorway] || productColorNames.black}`)}</strong><i class="wf-only"></i><small class="ui-only">${profile.key === "p2" ? "Carte offerte · échange ou bon d’achat 30 jours" : "Livraison offerte · retours 30 jours"}</small></span>
    </div>
    <div class="sticky-buy">
      <strong class="ui-only" data-sticky-price>${esc(price)}</strong>
      ${dualAction(cta, false, bundle ? "data-bundle-cta" : "")}
    </div>
  </div>`;
};

export const copySlot = (node) => `
  <div class="copy-slot">
    ${layoutLabel(node)}
    <div class="wf-only wf-copy">
      <span class="wf-eyebrow"></span>
      ${wireLines([94, 80, 56])}
      <span class="wf-paragraph"></span><span class="wf-paragraph short"></span>
      ${wfButton(node.cta || "CTA principal")}
    </div>
    <div class="ui-only ui-copy">
      <p class="eyebrow">${node.kicker ? esc(node.kicker) : '<span data-brand-name>PORT 70</span> · PASSAGE 32'}</p>
      <h2>${esc(node.title)}</h2>
      <p class="body-copy">${esc(node.body || "Un argument précis, relié au contexte et à une preuve immédiatement visible.")}</p>
      ${nextOrderPromo(node.promotion)}
      ${node.showTrust ? heroTrustRail() : ""}
      ${node.proofs?.length ? `<div class="hero-proof-list">${node.proofs.map((proof) => `<span>✓ ${esc(proof)}</span>`).join("")}</div>` : ""}
      ${materialChoice({ compact: true, variant: node.colorSelector || (["premium", "technical"].includes(node.variant) ? "links" : node.variant === "deadline" ? "menu" : "swatches") })}
      ${node.cta ? uiButton(node.cta) : ""}
    </div>
  </div>`;
