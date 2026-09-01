import { copySlot, dualAction, esc, heroBundleOffer, heroTrustRail, layoutLabel, materialOptions, mediaSlot, nextOrderPromo, productImages, rating, trustpilot, wireLines } from "./primitives.js";

const shell = (node, className, content) => `
  <section class="layout-block hero-layout ${className}" data-layout-id="${esc(node.id)}" data-layout-variant="${esc(node.variant)}">
    ${content}
  </section>`;

const purchaseAction = (node) => dualAction(
  node.bundle && node.bundle.selected !== false ? node.bundle.cta : (node.bundle?.baseCta || node.cta),
  false,
  node.bundle ? "data-bundle-cta" : "",
);

const classicHero = (node, profile) => shell(node, "hero-classic", `
  <div class="classic-gallery">
    <div class="classic-thumbs">${[
      [productImages.hero, "Vue trois-quarts"],
      [productImages.front, "Vue de face"],
      [productImages.rear, "Vue arrière"],
      [productImages.interior, "Vue intérieure"],
    ].map(([src, label], index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-gallery-image data-gallery-src="${src}" aria-label="${label}" aria-pressed="${index === 0}"><span class="wf-only"></span><img class="ui-only gallery-thumb-image" data-product-view="${src.split("/").at(-1)}" src="${src}" alt="" /></button>`).join("")}</div>
    ${mediaSlot(node.media || "Galerie produit", "hero-media")}
  </div>
  <div class="classic-summary">
    ${layoutLabel(node)}
    <div class="wf-only wf-copy">${wireLines([86, 65])}<span class="wf-rating"></span><span class="wf-price"></span>${wireLines([100, 88, 62])}<span class="wf-select"></span>${dualAction(node.cta)}</div>
    <div class="ui-only ui-copy">
      <p class="eyebrow">${esc(node.kicker)}</p><h2>${esc(node.title)}</h2><div class="classic-rating-trust">${rating()}${trustpilot()}</div><strong class="product-price">${esc(profile.price)}</strong>
      <p class="body-copy">${esc(node.body)}</p>
      <div class="material-choice">
        <p class="choice-label">Coloris · <strong data-selected-color>Noir</strong></p>
        <div class="choice-row" role="group" aria-label="Choisir la matière et le coloris">
          ${materialOptions.map((option, index) => `<button class="color-option ${index === 0 ? "active" : ""}" type="button" data-color-option data-color-name="${esc(option.name)}" data-colorway="${option.colorway}" aria-label="${esc(option.detail)}" aria-pressed="${index === 0}"><img src="${option.src}" alt="" /></button>`).join("")}
        </div>
      </div>
      <button class="variant-select" type="button">Passage 32 · 32 L <span>⌄</span></button>
      ${heroBundleOffer(node.bundle)}
      ${purchaseAction(node)}
      ${nextOrderPromo(node.promotion)}
      <ul class="micro-proof"><li>Livraison offerte</li><li>Retours 30 jours</li><li>Garantie 2 ans</li></ul>
    </div>
  </div>`);

const priceHero = (node) => {
  const products = [
    ["Passage 24", "119 €", "24 L", "Le moins cher", "./assets/products/comparison/liberty-blue/compact-24l.png"],
    ["Passage 32", "149 €", "32 L", "Recommandé", "./assets/products/72h-liberty-blue/01-hero-three-quarter.png"],
    ["Passage 36", "169 €", "36 L", "Plus de place", "./assets/products/comparison/liberty-blue/expandable-36l.png"],
    ["Passage 42", "189 €", "42 L", "Plus grand", "./assets/products/comparison/liberty-blue/weekender-42l.png"],
  ];
  return shell(node, `hero-price ${node.id === "H11" ? "hero-price-compact" : ""}`, `
    <div class="price-intro">
      ${layoutLabel(node)}
      <div class="wf-only">${wireLines([68, 92, 52])}</div>
      <div class="ui-only"><p class="eyebrow">${esc(node.kicker)}</p><h2>${esc(node.title)}</h2><p>${esc(node.body)}</p></div>
    </div>
    <div class="price-decision-grid" data-model-group>
      <div class="price-options">
        ${products.map(([name, price, size, note, image], index) => `
          <button type="button" class="price-card ${index === 1 ? "selected" : ""}" data-model="${name}" data-model-price="${price}" aria-pressed="${index === 1}">
            <span class="wf-only wf-product-box"></span>
            <span class="ui-only card-note">${note}</span>
            <span class="ui-only product-asset-small"><img src="${image}" alt="${esc(note)} · sac Liberty bleu ${size}" loading="lazy" /></span>
            <strong class="ui-only">${name}</strong><span class="ui-only">${size}</span><b class="ui-only">${price}</b>
          </button>`).join("")}
      </div>
      <aside class="price-cta-panel">
        <div class="wf-only">${wireLines([75, 100, 65])}</div>
        <div class="ui-only"><span>Choix actuel</span><strong data-selected-model>Passage 32</strong><p>Le meilleur équilibre entre capacité cabine, matière et prix.</p><b data-selected-price>149 €</b></div>
        ${node.showTrust ? heroTrustRail() : ""}
        ${heroBundleOffer(node.bundle)}
        ${purchaseAction(node)}
      </aside>
    </div>`);
};

const airlineHero = (node, profile) => shell(node, "hero-airline", `
  ${mediaSlot(node.media || "Produit dans le gabarit cabine", "hero-media", node.asset)}
  <div class="decision-panel">
    ${layoutLabel(node)}
    <div class="wf-only airline-wire">
      ${wireLines([42, 78, 60])}<div class="wf-proof-card">${wireLines([88, 62, 72])}</div>${dualAction(node.cta)}
    </div>
    <div class="ui-only airline-ui">
      <p class="eyebrow">${esc(node.kicker)}</p>
      ${node.showTrust ? `<div class="airline-trust-top">${trustpilot()}</div>` : ""}
      <div class="airline-row"><strong>${esc(node.airline || "AIRLINE")}</strong><span>${"✓"} Vérifié</span></div>
      <h2>${esc(node.title)}</h2><p>${esc(node.body)}</p>
      <div class="cabin-card"><span>Dimension cabine personnelle</span><strong>${esc(node.dimensions || "40 × 20 × 25 cm")}</strong><small>Règle vérifiée · 28 août 2026</small></div>
      ${node.showTrust ? "" : `<article class="hero-context-review"><span class="context-tag">MÊME COMPAGNIE</span><blockquote>« ${esc(profile.quote)} »</blockquote><small>${esc(profile.author)}</small></article>`}
      ${heroBundleOffer(node.bundle)}
      ${purchaseAction(node)}
    </div>
  </div>`);

const giftHero = (node) => shell(node, "hero-gift", `
  ${mediaSlot(node.media || "Cadeau en voyage", "hero-media", node.asset, node.assetCaption)}
  <div class="decision-panel gift-panel">
    ${layoutLabel(node)}
    <div class="wf-only">${wireLines([48, 92, 75])}<div class="wf-fact-grid"><span></span><span></span><span></span></div>${dualAction(node.cta)}</div>
    <div class="ui-only ${node.giftExperience ? "gift-checkout" : ""}">
      <p class="eyebrow">${esc(node.kicker)}</p><h2>${esc(node.title)}</h2><p>${esc(node.body)}</p>
      ${node.giftExperience ? `
        <div class="gift-delivery-promise">
          <span>Livraison standard confirmée</span>
          <strong>${esc(node.deliveryDate)}</strong>
          <small>✓ ${esc(node.deliveryNote)}</small>
        </div>
        <div class="gift-options" aria-label="Options du cadeau">
          <label class="gift-option">
            <input type="checkbox" data-gift-card checked />
            <span><strong>Carte cadeau personnalisée</strong><small>Incluse dans le colis · prix masqué</small></span>
            <b>Offerte</b>
          </label>
          <label class="gift-message"><span>Votre message</span><textarea rows="2" aria-label="Message de la carte cadeau">${esc(node.giftMessage)}</textarea></label>
          <label class="gift-option">
            <input type="checkbox" data-gift-express />
            <span><strong>Livraison express · mercredi 2</strong><small>Option facultative : la livraison standard arrive déjà à temps</small></span>
            <b>+ 12 €</b>
          </label>
        </div>
        <aside class="gift-return-note"><strong>Le cadeau ne lui convient pas ?</strong><span>Il choisit un autre modèle, un autre coloris ou un bon d’achat pendant 30 jours, sans voir le prix payé.</span></aside>
      ` : `
        <div class="gift-facts"><div><b>JEU. 04</b><span>Livré à temps</span></div><div><b>30 J</b><span>Échange cadeau</span></div><div><b>CARTE</b><span>Message cadeau</span></div></div>
        <label class="gift-bundle"><input type="checkbox" data-gift-bundle /> <span>Ajouter l’étui passeport au cadeau</span><b>+ 12 €</b></label>
        <label class="gift-bundle"><input type="checkbox" data-gift-card checked /> <span>Ajouter une carte-message cadeau</span><b>Offerte</b></label>
      `}
      ${node.showTrust ? heroTrustRail() : ""}
      ${heroBundleOffer(node.bundle)}
      ${purchaseAction(node)}
    </div>
  </div>`);

const socialHero = (node) => shell(node, "hero-social", `
  ${mediaSlot(node.media, "hero-media")}
  <div class="decision-panel">
    ${layoutLabel(node)}
    <div class="wf-only">${wireLines([65, 88, 54])}<span class="wf-rating-large"></span>${dualAction(node.cta)}</div>
    <div class="ui-only"><p class="eyebrow">${esc(node.kicker)}</p><h2>${esc(node.title)}</h2>${rating("4,8", "326 voyageurs vérifiés")}<p>${esc(node.body)}</p>${dualAction(node.cta)}</div>
  </div>`);

const trustHero = (node, profile) => shell(node, "hero-trust", `
  ${mediaSlot(node.media, "hero-media")}
  <div class="decision-panel trust-panel">
    ${layoutLabel(node)}
    <div class="wf-only">${wireLines([65, 88, 54])}<span class="wf-rating-large"></span><div class="wf-proof-card">${wireLines([88, 62, 72])}</div>${dualAction(node.cta)}</div>
    <div class="ui-only">
      <p class="eyebrow">${esc(node.kicker)}</p><h2>${esc(node.title)}</h2>
      <div class="trust-signals">${rating("4,8", "326 avis vérifiés")}${trustpilot()}</div>
      <article class="hero-context-review"><span class="context-tag">PREMIER ACHAT</span><blockquote>« ${esc(profile.quote)} »</blockquote><small>${esc(profile.author)}</small></article>
      <div class="trust-facts">${(profile.facts || []).map((fact) => `<span>✓ ${esc(fact)}</span>`).join("")}</div>
      ${dualAction(node.cta)}
    </div>
  </div>`);

const defaultQuestions = [
  { label: "Passe-t-il vraiment en cabine ?", answer: "Le Passage 32 mesure 40 × 20 × 25 cm dans sa configuration compacte. Ces dimensions correspondent au format personnel indiqué pour le trajet sélectionné. Vérifie toujours la règle appliquée à ton billet avant le départ." },
  { label: "Que signifie 1 200 cycles ?", answer: "Le tissu a subi 1 200 cycles d’abrasion dans notre protocole de comparaison. C’est un indicateur de résistance de surface, pas une promesse abstraite. Les zones les plus exposées sont également renforcées." },
  { label: "Que couvre la garantie ?", answer: "La garantie couvre les défauts de structure et de fabrication pendant deux ans. Les dommages liés à un usage anormal ou à une usure naturelle restent exclus. En cas de doute, l’équipe vérifie le cas avant toute réparation." },
  { label: "Combien pèse-t-il à vide ?", answer: "Le sac pèse 1,18 kg à vide. Ce poids inclut les renforts, les séparations intérieures et la quincaillerie métallique indiqués dans la fiche technique." },
  { label: "Le tissu résiste-t-il à la pluie ?", answer: "La toile ralentit la pénétration d’une pluie légère et les zips sont protégés. Pour une exposition longue ou intense, une housse imperméable reste recommandée." },
  { label: "Peut-on remplacer une pièce ?", answer: "Les tirettes, certaines sangles et plusieurs éléments de quincaillerie peuvent être remplacés après diagnostic, afin d’éviter de changer le sac complet." },
];

const guidedHero = (node) => {
  const questions = node.questions || defaultQuestions;
  const visibleQuestions = questions.slice(0, 3);
  const followupQuestions = questions.slice(3, 6);
  const initialAnswer = visibleQuestions[0]?.answer || "";
  return shell(node, "hero-guided", `
    <div class="decision-panel guided-panel">
      ${layoutLabel(node)}
      <div class="wf-only">${wireLines([65, 88, 54])}<div class="wf-proof-card">${wireLines([88, 62, 72])}</div>${dualAction(node.cta)}</div>
      <div class="ui-only">
        <p class="eyebrow">${esc(node.kicker)}</p><h2>${esc(node.title)}</h2><p>${esc(node.body)}</p>
        ${dualAction(node.cta)}
        <div class="guided-questions" data-hero-questions>
          <div class="question-chip-list">${visibleQuestions.map((question, index) => {
            const followup = followupQuestions[index] || defaultQuestions[index + 3];
            return `<button class="question-chip" type="button" data-hero-question data-answer="${esc(question.answer)}" data-next-label="${esc(followup.label)}" data-next-answer="${esc(followup.answer)}" aria-pressed="false">${esc(question.label)}</button>`;
          }).join("")}</div>
          <div class="mock-answer"><p data-hero-answer aria-live="polite">${esc(initialAnswer)}</p></div>
        </div>
      </div>
    </div>
    ${mediaSlot(node.media, "hero-media")}`);
};

const technicalHero = (node, profile) => shell(node, "hero-technical", `
  <div class="technical-copy">
    ${copySlot(node)}
    <div class="technical-specs">
      ${(profile.facts || []).map((fact, index) => `<div><span class="wf-only wf-spec-value"></span><strong class="ui-only">${["1 200", "17 KG", "1,18 KG"][index] || `0${index + 1}`}</strong><small class="ui-only">${esc(fact)}</small></div>`).join("")}
    </div>
  </div>
  ${mediaSlot(node.media, "hero-media")}`);

const centerHero = (node) => shell(node, `hero-center ${node.compactMedia ? "hero-center-compact" : ""} ${node.promotionPlacement ? `hero-center-with-promo promo-${node.promotionPlacement}` : ""}`, `
  ${node.promotionPlacement === "top" ? `<div class="ui-only hero-promo-edge hero-promo-top">${nextOrderPromo(node.promotion)}</div>` : ""}
  ${copySlot(node.promotionPlacement ? { ...node, promotion: null } : node)}
  ${mediaSlot(node.media, "hero-media")}
  ${node.promotionPlacement === "footer" ? `<div class="ui-only hero-promo-edge hero-promo-footer">${nextOrderPromo(node.promotion)}</div>` : ""}`);

const splitHero = (node, className = "hero-split") => shell(node, `${className} ${node.reverse ? "reverse" : ""}`, `
  ${mediaSlot(node.media, "hero-media", node.asset, node.assetCaption)}
  ${copySlot(node)}`);

const immersiveHero = (node) => shell(node, "hero-immersive", `
  ${mediaSlot(node.media || "Image immersive", "hero-media", node.asset, node.assetCaption)}
  <div class="wf-only immersive-wire-copy">
    ${layoutLabel(node)}${wireLines([62, 88, 70, 48])}${dualAction(node.cta)}
  </div>
  <div class="ui-only immersive-copy">
    ${layoutLabel(node)}
    <p class="eyebrow">${esc(node.kicker)}</p>
    <h2>${esc(node.title)}</h2>
    <p>${esc(node.body)}</p>
    ${heroBundleOffer(node.bundle)}
    ${purchaseAction(node)}
  </div>`);

const deliveryHero = (node) => {
  const options = [
    ["locker", "Casier 24/24", "Disponible aujourd’hui à 18:10", "Pickup", "Gratuit"],
    ["relay", "Point relais", "Disponible aujourd’hui à 17:45", "Mondial Relay", "Gratuit"],
    ["home", "Domicile express", "Livré aujourd’hui avant 22:00", "Coursier local", "Gratuit"],
  ];
  return shell(node, "hero-delivery", `
    ${mediaSlot(node.media || "Retrait express", "hero-media", node.asset, node.assetCaption)}
    <div class="decision-panel delivery-panel">
      ${layoutLabel(node)}
      <div class="wf-only">${wireLines([58, 92, 72])}<div class="wf-fact-grid"><span></span><span></span><span></span></div>${dualAction(node.cta)}</div>
      <div class="ui-only delivery-ui">
        <p class="eyebrow">${esc(node.kicker)}</p>
        <h2>${esc(node.title)}</h2>
        <p>${esc(node.body)}</p>
        <div class="delivery-location"><span>Zone vérifiée</span><strong>Paris 11e · autour de vous</strong><small>Stock local confirmé</small></div>
        <fieldset class="delivery-options">
          <legend>Mode de livraison</legend>
          ${options.map(([value, title, detail, carrier, price], index) => `<label class="delivery-option">
            <input type="radio" name="delivery-mode" value="${value}" ${index === 0 ? "checked" : ""} />
            <span><strong>${title}</strong><small>${detail} · ${carrier}</small></span><b>${price}</b>
          </label>`).join("")}
        </fieldset>
        <label class="carrier-select"><span>Transporteur</span><select aria-label="Choisir le transporteur"><option>Pickup</option><option>Mondial Relay</option><option>Colissimo</option><option>Coursier local</option></select></label>
        <p class="delivery-cutoff">Commande avant 16:45 · disponibilité et créneau garantis au paiement.</p>
        ${dualAction(node.cta)}
      </div>
    </div>`);
};

export function renderHero(node, profile = { facts: [], price: "149 €" }) {
  const renderers = {
    classic: () => classicHero(node, profile),
    price: () => priceHero(node),
    airline: () => airlineHero(node, profile),
    gift: () => giftHero(node),
    social: () => socialHero(node),
    trust: () => trustHero(node, profile),
    guided: () => guidedHero(node),
    technical: () => technicalHero(node, profile),
    center: () => centerHero(node),
    immersive: () => immersiveHero(node),
    delivery: () => deliveryHero(node),
    premium: () => splitHero(node, "hero-premium"),
    deadline: () => splitHero(node, "hero-deadline"),
    split: () => splitHero(node),
  };
  return (renderers[node.variant] || renderers.split)();
}
