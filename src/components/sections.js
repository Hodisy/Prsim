import { dualAction, esc, icon, layoutLabel, mediaSlot, productImages, rating, trustpilot, wireLines } from "./primitives.js";
import { reviewSourceLabels } from "../data/reviews.js";
import { comparisonProducts } from "../data/comparison-products.js";

const shell = (node, className, content) => `
  <section class="layout-block section-layout ${className}" data-layout-id="${esc(node.id)}" data-layout-variant="${esc(node.variant)}">
    ${layoutLabel(node)}${content}
  </section>`;

const heading = (node, centered = false) => `
  <header class="section-heading ${centered ? "centered" : ""}">
    <div class="wf-only">${wireLines([76, 55])}</div>
    <div class="ui-only"><p class="eyebrow">${esc(node.id)} · <span data-brand-name>PORT 70</span></p><h3>${esc(node.title)}</h3></div>
  </header>`;

const colorAssetsAttr = (assets, attribute = "data-color-assets") => assets
  ? ` ${attribute}="${esc(JSON.stringify(assets))}"`
  : "";

const split = (node) => shell(node, `section-split ${node.reverse ? "reverse" : ""}`, `
  ${mediaSlot(node.media || "Asset argument", "section-media", node.asset, node.assetCaption, node.colorAssets)}
  <div class="section-copy">
    <div class="wf-only">${wireLines([82, 67, 92, 74])}<span class="wf-paragraph"></span></div>
    <div class="ui-only"><p class="eyebrow">DÉTAIL / USAGE</p><h3>${esc(node.title)}</h3><p>${esc(node.body || "Chaque détail répond à un moment concret du trajet, sans multiplier les fonctions décoratives.")}</p><a href="#brand">Voir le détail ${icon("arrow")}</a></div>
  </div>`);

const metrics = (node, profile) => {
  const defaults = (profile.facts || ["Test mesuré", "Résultat publié", "Usage vérifié"]).slice(0, 3).map((label, index) => ({ value: ["17 KG", "1 200", "980 G"][index], label, note: `PROTOCOLE 0${index + 1}` }));
  const metrics = node.metrics || defaults;
  return shell(node, "section-metrics", `${heading(node, true)}<div class="metric-grid">${metrics.slice(0, 3).map((metric, index) => `
    <article><span class="wf-only wf-metric"></span><div class="wf-only">${wireLines([68, 82])}</div><strong class="ui-only">${esc(metric.value)}</strong><p class="ui-only">${esc(metric.label)}</p><small class="ui-only">${esc(metric.note || `PREUVE 0${index + 1}`)}</small></article>`).join("")}</div>`);
};

const reviewCards = (node, profile) => {
  const reviews = node.content?.reviews?.length ? node.content.reviews : profile.reviews || [];
  return shell(node, "section-reviews", `${heading(node)}<div class="review-grid">${reviews.map((review, index) => `
    <article class="review-card"><div class="wf-only">${wireLines([42, 100, 90, 62])}<span class="wf-avatar"></span></div><div class="ui-only">${rating(review.rating ? String(review.rating).replace(".", ",") : "—", "")}<blockquote>« ${esc(review.body)} »</blockquote><footer><span class="avatar">${esc(review.author?.charAt(0) || String.fromCharCode(65 + index))}</span><span><strong>${esc(review.author)}</strong><small>${esc(reviewSourceLabels[review.source] || review.source)}${review.verifiedPurchase ? " · achat vérifié" : ""}${review.prototype ? " · prototype" : ""}</small></span></footer></div></article>`).join("")}</div>`);
};

const comments = (node) => {
  const reviews = node.content?.reviews || [];
  return shell(node, "section-comments", `${heading(node)}<div class="comment-grid">${reviews.map((review) => `
    <article><div class="wf-only">${wireLines([48, 100, 86, 66])}</div><div class="ui-only"><span class="context-tag">${esc(review.tags?.find((tag) => !/^p\d+$/.test(tag)) || "contexte comparable")}</span><blockquote>« ${esc(review.body)} »</blockquote><small>${esc(review.context || review.author)} · ${esc(reviewSourceLabels[review.source] || review.source)}${review.prototype ? " · prototype" : ""}</small></div></article>`).join("")}</div>`);
};

const customerEvidence = (node) => {
  const reviews = node.content?.reviews || [];
  const evidence = node.evidence || {};
  const average = evidence.averageRating ? String(evidence.averageRating).replace(".", ",") : "—";
  const sources = evidence.sources || [...new Set(reviews.map((review) => review.source))];
  const sourceChips = sources.map((source) => `<span>${esc(reviewSourceLabels[source] || source)}</span>`).join("");
  const disclosure = evidence.prototype
    ? "Contenus de démonstration · chaque source est signalée · connecteurs réels à brancher"
    : "Avis reliés à leur source · aucune approbation déduite ou inventée";
  return shell(node, "section-customer-evidence", `
    ${heading(node)}
    <div class="customer-evidence-layout">
      <aside class="customer-evidence-summary">
        <div class="wf-only">${wireLines([46, 72, 94, 66])}<span class="wf-metric"></span></div>
        <div class="ui-only">
          <p class="eyebrow">${esc(evidence.label || "PREUVE CLIENT")}</p>
          <div class="customer-evidence-score"><strong>${esc(average)}</strong><span>/ 5</span></div>
          <p>${esc(evidence.summary || "Les retours les plus proches de la question exprimée.")}</p>
          <dl>
            <div><dt>Avis affichés</dt><dd>${reviews.length}</dd></div>
            <div><dt>Achats vérifiés</dt><dd>${evidence.verifiedCount || 0}</dd></div>
          </dl>
          <div class="customer-evidence-sources" aria-label="Sources des avis">${sourceChips}</div>
        </div>
      </aside>
      <div class="customer-evidence-reviews">
        ${reviews.map((review, index) => `<article class="customer-evidence-card">
          <div class="wf-only">${wireLines([38, 100, 88, 64])}<span class="wf-avatar"></span></div>
          <div class="ui-only">
            <div class="customer-evidence-card-top">${review.rating ? rating(String(review.rating).replace(".", ","), "") : `<span class="context-tag">Retour d’usage</span>`}<span>0${index + 1}</span></div>
            <blockquote>« ${esc(review.body)} »</blockquote>
            <footer><span class="avatar">${esc(review.author?.charAt(0) || "C")}</span><span><strong>${esc(review.author)}</strong><small>${esc(review.context || "Contexte déclaré")}</small></span></footer>
            <div class="customer-evidence-source"><span>${esc(reviewSourceLabels[review.source] || review.source)}</span>${review.verifiedPurchase ? "<strong>✓ Achat vérifié</strong>" : "<i>Source déclarée</i>"}</div>
          </div>
        </article>`).join("")}
      </div>
    </div>
    <p class="ui-only customer-evidence-disclosure">${esc(disclosure)}</p>`);
};

const routineSelector = (node) => {
  const moments = node.moments || [
    { time: "08:12", label: "Transport", note: "Le sac protège le matériel pendant le premier trajet.", image: productImages.carry, caption: "MATIN / TRANSPORT" },
    { time: "09:03", label: "Coworking", note: "Le bureau sort sans ouvrir le compartiment vêtements.", image: productImages.interior, caption: "BUREAU / INSTALLATION" },
    { time: "18:40", label: "Départ", note: "Le bureau redevient bagage sans refaire le sac.", image: productImages.hero, caption: "SOIR / DÉPART" },
  ];
  const first = moments[0];
  return shell(node, "section-routine-selector", `
    <div class="routine-stage">
      <div class="wf-only media-wire"><span>Moment sélectionnable</span></div>
      <div class="ui-only media-ui"><img data-routine-image src="${esc(first.image)}" alt="${esc(first.alt || first.label)}" loading="lazy" /><span class="asset-caption" data-routine-caption>${esc(first.caption)}</span></div>
    </div>
    <div class="routine-band">
      <div class="wf-only routine-wire">${wireLines([66, 92, 72])}</div>
      <div class="ui-only routine-copy"><p class="eyebrow">UNE JOURNÉE DE TRAVAIL · BANGKOK</p><h3>${esc(node.title)}</h3><p data-routine-note>${esc(first.note)}</p></div>
      <div class="ui-only routine-moments" data-routine-selector role="group" aria-label="Choisir un moment de la journée">
        ${moments.map((moment, index) => `<button type="button" class="routine-moment ${index === 0 ? "active" : ""}" data-routine-choice data-routine-src="${esc(moment.image)}" data-routine-alt="${esc(moment.alt || moment.label)}" data-routine-caption="${esc(moment.caption)}" data-routine-note="${esc(moment.note)}" aria-pressed="${index === 0}"><span>${esc(moment.time)}</span><strong>${esc(moment.label)}</strong><small>${esc(moment.proof || "Même sac, aucun transfert")}</small></button>`).join("")}
      </div>
    </div>`);
};

const loadoutSwitch = (node) => {
  const modes = node.modes || [
    { key: "work", label: "Journée de travail", title: "Le bureau essentiel.", body: "L’ordinateur et ses accessoires restent accessibles.", image: productImages.interior, caption: "CHARGEMENT / TRAVAIL", items: ["Laptop", "Chargeur", "Casque", "Carnet"] },
    { key: "travel", label: "Déplacement 3 jours", title: "Le même sac, après le travail.", body: "Le matériel reste séparé des vêtements.", image: productImages.hero, caption: "CHARGEMENT / 3 JOURS", items: ["Laptop", "2 tenues", "Trousse", "Câbles"] },
  ];
  const first = modes[0];
  return shell(node, "section-loadout-switch", `
    <div class="loadout-stage">
      <div class="wf-only media-wire"><span>Chargement sélectionnable</span></div>
      <div class="ui-only media-ui"><img data-loadout-image src="${esc(first.image)}" alt="${esc(first.alt || first.label)}" loading="lazy" /><span class="asset-caption" data-loadout-caption>${esc(first.caption)}</span></div>
    </div>
    <aside class="loadout-panel">
      <div class="wf-only">${wireLines([52, 88, 74])}<div class="wf-ratio-toggle"><i></i><i></i></div><span class="wf-paragraph"></span></div>
      <div class="ui-only loadout-ui">
        <p class="eyebrow">TRAVAIL / VOYAGE</p><h3>${esc(node.title)}</h3>
        <div class="loadout-toggle" data-loadout-selector role="group" aria-label="Choisir le chargement">
          ${modes.map((mode, index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-loadout-choice data-loadout-src="${esc(mode.image)}" data-loadout-alt="${esc(mode.alt || mode.label)}" data-loadout-caption="${esc(mode.caption)}" data-loadout-title="${esc(mode.title)}" data-loadout-body="${esc(mode.body)}" data-loadout-items="${esc(mode.items.join("||"))}" aria-pressed="${index === 0}">${esc(mode.label)}</button>`).join("")}
        </div>
        <h4 data-loadout-title>${esc(first.title)}</h4><p data-loadout-body>${esc(first.body)}</p>
        <ul data-loadout-items>${first.items.map((item, index) => `<li><span>0${index + 1}</span>${esc(item)}</li>`).join("")}</ul>
      </div>
    </aside>`);
};

const sceneSelector = (node) => {
  const scenes = node.scenes || [
    { label: "Tenue claire", place: "Terrasse", note: "Le motif devient le point d’ancrage de la silhouette.", image: productImages.hero, caption: "LOOK 01 / TERRASSE" },
    { label: "Tenue sombre", place: "Vieille ville", note: "Le bordeaux reste lisible dans les ombres.", image: productImages.front, caption: "LOOK 02 / VILLE" },
    { label: "Denim", place: "Bord de mer", note: "Une couleur forte dans une image très claire.", image: productImages.carry, caption: "LOOK 03 / MER" },
  ];
  const first = scenes[0];
  return shell(node, "section-scene-selector", `
    <div class="scene-stage">
      <div class="wf-only media-wire"><span>Image principale sélectionnable</span></div>
      <div class="ui-only media-ui"><img class="scene-stage-image" data-scene-image${colorAssetsAttr(first.colorAssets)} src="${esc(first.image)}" alt="${esc(first.alt || first.place)}" loading="lazy" /><span class="asset-caption" data-scene-caption>${esc(first.caption || first.place)}</span></div>
    </div>
    <aside class="scene-panel" data-scene-selector>
      <div class="wf-only">${wireLines([48, 92, 72])}<span class="wf-paragraph"></span><div class="wf-scene-controls"><i></i><i></i><i></i></div>${dualAction(node.cta || "Acheter")}</div>
      <div class="ui-only scene-panel-ui">
        <p class="eyebrow">INSPIRATION ÉDITORIALE · BARCELONE</p>
        <h3>${esc(node.title)}</h3>
        <p data-scene-note>${esc(first.note)}</p>
        <div class="scene-choice-list" role="group" aria-label="Choisir une tenue et un lieu">
          ${scenes.map((scene, index) => `<button type="button" class="scene-choice ${index === 0 ? "active" : ""}" data-scene-choice data-scene-src="${esc(scene.image)}"${colorAssetsAttr(scene.colorAssets, "data-scene-color-assets")} data-scene-alt="${esc(scene.alt || scene.place)}" data-scene-caption="${esc(scene.caption || scene.place)}" data-scene-note="${esc(scene.note)}" aria-pressed="${index === 0}"><span>0${index + 1}</span><strong>${esc(scene.label)}</strong><small>${esc(scene.place)}</small></button>`).join("")}
        </div>
        <small class="editorial-disclosure">Shooting éditorial · modèle de projection, pas une cliente.</small>
        ${dualAction(node.cta || "Acheter")}
      </div>
    </aside>`);
};

const photoProof = (node) => {
  const proofs = node.proofs || [
    { label: "Lumière naturelle", note: "Bordeaux profond", image: productImages.front },
    { label: "Golden hour", note: "Motif toujours lisible", image: productImages.hero },
    { label: "Flash du soir", note: "Ni rouge, ni brillant", image: productImages.carry },
  ];
  return shell(node, "section-photo-proof", `
    <div class="photo-proof-heading">
      ${heading(node)}
      <div class="wf-only wf-ratio-toggle"><i></i><i></i></div>
      <div class="ui-only photo-ratio-toggle" role="group" aria-label="Choisir le cadrage"><button type="button" class="active" data-photo-ratio="portrait" aria-pressed="true">Portrait 4:5</button><button type="button" data-photo-ratio="story" aria-pressed="false">Story 9:16</button></div>
    </div>
    <div class="photo-proof-grid" data-photo-proof-grid data-ratio="portrait">
      ${proofs.map((proof) => `<figure class="photo-proof-card"><div class="wf-only media-wire"><span>${esc(proof.label)}</span></div><img class="ui-only"${colorAssetsAttr(proof.colorAssets)} src="${esc(proof.image)}" alt="${esc(proof.alt || proof.label)}" loading="lazy" /><figcaption class="ui-only"><strong>${esc(proof.label)}</strong><span>${esc(proof.note)}</span></figcaption></figure>`).join("")}
    </div>`);
};

const productGrid = (node) => {
  return shell(node, "section-products", `${heading(node, true)}<div class="product-grid">${comparisonProducts.map(({ name, price, size, note, image, recommended }) => `
    <article class="product-tile ${recommended ? "featured" : ""}"><span class="wf-only wf-product-box"></span><div class="ui-only product-asset-small"><img src="${image}" alt="${esc(name)} · ${esc(size)}" loading="lazy" /></div><span class="ui-only card-note">${esc(note)}</span><strong class="ui-only">${esc(name)}</strong><span class="ui-only">${esc(size)}</span><b class="ui-only">${esc(price)}</b><div class="wf-only">${wireLines([72, 48])}</div></article>`).join("")}</div>`);
};

const airportStory = (node) => shell(node, "section-airport-story", `
  ${mediaSlot(node.media || "Voyageur dans un aéroport", "airport-story-media", node.asset, node.assetCaption, node.colorAssets)}
  <div class="airport-story-band">
    <div class="wf-only airport-story-wire">${wireLines([74, 92, 66])}<span class="wf-quote"></span></div>
    <div class="ui-only airport-story-copy">
      <p class="eyebrow">DU TERMINAL À LA PORTE</p>
      <h3>${esc(node.title)}</h3>
      <p>${esc(node.body)}</p>
    </div>
    <dl class="ui-only airport-cost-rail">
      ${(node.costs || []).map(([label, value], index) => `<div class="${index === 2 ? "saved" : ""}"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}
    </dl>
  </div>`);

const packing = (node) => {
  const items = node.items?.length
    ? node.items
    : Array.from({ length: 6 }, (_, index) => ({ label: `Élément ${index + 1}`, specification: "Asset et contenu à associer" }));
  return shell(node, "section-packing", `${heading(node)}<div class="packing-grid">
    ${mediaSlot(node.media || "Vue principale du produit", "packing-media", node.asset, node.assetCaption, node.colorAssets)}
    <div class="packing-items">${items.map((item, index) => {
      const normalized = typeof item === "string" ? { label: item } : item;
      const asset = normalized.asset
        ? `<img class="packing-icon" src="${esc(normalized.asset)}" alt="" loading="lazy" />`
        : '<span class="packing-icon packing-icon-placeholder" aria-hidden="true"></span>';
      return `<div class="packing-item"><span class="wf-only"></span><div class="ui-only packing-item-top"><strong>${String(index + 1).padStart(2, "0")}</strong>${asset}</div><div class="ui-only packing-item-copy"><b>${esc(normalized.label || `Élément ${index + 1}`)}</b><small>${esc(normalized.specification || "Information à renseigner")}</small></div></div>`;
    }).join("")}</div>
  </div>`);
};

const timeline = (node, journey = false) => {
  const steps = node.steps || (journey ? ["Bureau", "Train", "Rendez-vous", "Hôtel"] : ["Aujourd’hui", "Expédié", "Livré jeudi"]);
  const details = node.details || (journey ? steps.map(() => "Transition sans changer de sac") : ["Commande confirmée", "Suivi envoyé", "Avant l’événement"]);
  return shell(node, journey ? "section-journey" : "section-timeline", `${heading(node, true)}<div class="timeline">${steps.map((step, index) => `
    <div><span class="timeline-dot">${index + 1}</span><div class="wf-only">${wireLines([72, 52])}</div><strong class="ui-only">${esc(step)}</strong><small class="ui-only">${esc(details[index] || "Étape confirmée")}</small></div>`).join("")}</div>`);
};

const journal = (node, profile) => shell(node, `section-journal ${node.reverse ? "reverse" : ""}`, `
  ${mediaSlot(node.media || "Photo de voyage", "journal-media", node.asset, node.assetCaption, node.colorAssets)}
  <article class="journal-copy"><div class="wf-only">${wireLines([38, 88, 68, 100, 82])}<span class="wf-quote"></span></div><div class="ui-only"><p class="eyebrow">${esc(node.eyebrow || "CHAPITRE 01 · SUR LA ROUTE")}</p><h3>${esc(node.title)}</h3><p>${esc(node.body || "La section devient un court récit : un lieu, une contrainte et la manière dont le produit intervient sans interrompre l’histoire.")}</p><blockquote>« ${esc(node.quote || profile.quote)} »</blockquote><small>${esc(node.author || profile.author)}</small></div></article>`);

const commuteProof = (node, profile) => {
  const scenes = node.scenes || [
    { label: "Parvis", image: productImages.carry, caption: "TRAJET / MATIN", time: "08:40" },
    { label: "Métro", image: productImages.hero, caption: "MÉTRO / TRAJET", time: "08:54" },
  ];
  const proofs = node.proofs || profile.facts || [];
  return shell(node, "section-commute-proof", `
    ${heading(node)}
    <p class="ui-only commute-proof-intro">${esc(node.body || "Le sac s’insère dans le trajet sans devenir un équipement de déplacement de plus.")}</p>
    <div class="commute-proof-images">
      ${scenes.map((scene) => `<figure class="commute-proof-image"><div class="wf-only media-wire"><span>${esc(scene.label)}</span></div><img class="ui-only" src="${esc(scene.image)}" alt="${esc(scene.alt || scene.label)}" loading="lazy" /><figcaption class="ui-only"><strong>${esc(scene.caption)}</strong><span>${esc(scene.time)}</span></figcaption></figure>`).join("")}
    </div>
    <div class="commute-proof-rail">
      ${proofs.slice(0, 3).map((proof, index) => `<article><span class="wf-only wf-feature-icon"></span><div class="ui-only"><strong>${esc(proof)}</strong><p>${esc((node.proofNotes || [])[index] || "Une donnée rendue visible dans le trajet réel.")}</p></div></article>`).join("")}
    </div>`);
};

const giftReassurance = (node) => shell(node, "section-gift-reassurance", `${heading(node, true)}
  <div class="gift-reassurance-grid">
    ${(node.assurances || []).map(([title, body], index) => `<article>
      <span class="wf-only wf-feature-icon"></span><div class="wf-only">${wireLines([75, 58])}</div>
      <span class="ui-only reassurance-number">0${index + 1}</span><strong class="ui-only">${esc(title)}</strong><p class="ui-only">${esc(body)}</p>
    </article>`).join("")}
  </div>
  <p class="ui-only gift-reassurance-foot">Le destinataire reçoit un lien d’échange dédié. La confirmation d’achat et le montant payé restent envoyés uniquement à Sophie.</p>`);

const airlineCard = (node) => shell(node, "section-airline-card", `${heading(node)}<div class="airline-proof-layout">
  ${mediaSlot("Sac dans le gabarit easyJet", "airline-proof-media")}
  <article class="airline-proof-card"><div class="wf-only">${wireLines([46, 84, 68, 92])}</div><div class="ui-only"><div class="airline-row"><strong>EASYJET</strong><span>✓ Vérifié</span></div><p>Petit bagage cabine</p><strong class="dimension-value">45 × 36 × 20 cm</strong><dl><div><dt>Passage 32</dt><dd>44 × 34 × 19 cm</dd></div><div><dt>Statut</dt><dd>Compatible</dd></div></dl><small>Vérifié le 28 août 2026</small></div></article>
  </div>`);

const beforeAfter = (node) => shell(node, "section-before-after", `${heading(node, true)}<div class="before-after-grid">
  <article>${mediaSlot("Avant / option bagage")}<div class="ui-only compare-caption"><span>4 vols × 42 €</span><strong>168 €</strong></div></article>
  <span class="compare-arrow">${icon("arrow")}</span>
  <article>${mediaSlot("Avec le Passage 32")}<div class="ui-only compare-caption"><span>Un seul achat</span><strong>149 €</strong></div></article>
  </div>`);

const hotspots = (node) => shell(node, "section-hotspots", `${heading(node)}<div class="hotspot-layout">
  ${mediaSlot("Vue ouverte du sac", "hotspot-media")}
  ${["Passeports", "Gourde", "Change", "Écouteurs"].map((name, index) => `<span class="hotspot hot-${index + 1}"><b>${index + 1}</b><i class="ui-only">${name}</i></span>`).join("")}
  </div>`);

const table = (node, comparison = false) => {
  const headers = comparison ? ["Modèle", "Volume", "Poids", "Prix"] : ["Compagnie", "Limite", "Passage 32", "Statut"];
  const rows = comparison
    ? [["Passage 24", "24 L", "980 g", "119 €"], ["Passage 32", "32 L", "1,18 kg", "149 €"], ["Passage 36", "36 L", "1,34 kg", "169 €"], ["Passage 42", "42 L", "1,48 kg", "189 €"]]
    : [["Ryanair", "40×20×25", "40×20×25", "Compatible"], ["easyJet", "45×36×20", "44×34×19", "Compatible"], ["Air France", "55×35×25", "44×34×19", "Compatible"], ["Delta", "56×35×23", "44×34×19", "Compatible"]];
  const selectedAirline = comparison || !node.airline ? "" : String(node.airline).toLocaleLowerCase("fr");
  return shell(node, comparison ? "section-comparison" : "section-table", `${heading(node)}<div class="data-table">
    <div class="table-row table-head">${headers.map((cell) => `<span class="ui-only">${cell}</span><i class="wf-only"></i>`).join("")}</div>
    ${rows.map((row, index) => `<div class="table-row ${(comparison && index === 1) || (selectedAirline && row[0].toLocaleLowerCase("fr") === selectedAirline) ? "selected" : ""}">${row.map((cell) => `<span class="ui-only">${cell}</span><i class="wf-only"></i>`).join("")}</div>`).join("")}
  </div>`);
};

const airlineCompare = (node) => {
  const model = node.model || "Passage 32";
  const modelDimensions = node.modelDimensions || "44 × 34 × 19 cm";
  const airlines = [
    { name: "Ryanair", allowance: "40 × 20 × 25 cm", status: model === "Passage 24" ? "Compatible" : "Passage 24 requis" },
    { name: "easyJet", allowance: "45 × 36 × 20 cm", status: "Compatible" },
    { name: "Air France", allowance: "55 × 35 × 25 cm", status: "Compatible" },
    { name: "Lufthansa", allowance: "55 × 40 × 23 cm", status: "Compatible" },
  ];
  const selectedAirline = (node.airline || "easyJet").toLowerCase();
  const active = airlines.find((airline) => airline.name.toLowerCase() === selectedAirline) || airlines[1];
  return shell(node, "section-airline-compare", `${heading(node)}
    <div class="airline-compare-layout">
      <aside class="airline-compare-now">
        <div class="wf-only">${wireLines([50, 84, 67, 45])}</div>
        <div class="ui-only"><span>Votre prochain vol</span><strong>${esc(active.name)}</strong><b>✓ Format vérifié</b><p>${esc(model)} · ${esc(modelDimensions)}</p></div>
      </aside>
      <div class="data-table airline-compare-table">
        <div class="table-row table-head"><span class="ui-only">Compagnie</span><span class="ui-only">Petit bagage</span><span class="ui-only">${esc(model)}</span><span class="ui-only">Statut</span><i class="wf-only"></i><i class="wf-only"></i><i class="wf-only"></i><i class="wf-only"></i></div>
        ${airlines.map((airline) => `<div class="table-row ${airline.name.toLowerCase() === selectedAirline ? "selected current-airline" : ""}"><span class="ui-only">${esc(airline.name)}${airline.name.toLowerCase() === selectedAirline ? " · votre vol" : ""}</span><span class="ui-only">${esc(airline.allowance)}</span><span class="ui-only">${esc(modelDimensions)}</span><span class="ui-only">${esc(airline.status)}</span><i class="wf-only"></i><i class="wf-only"></i><i class="wf-only"></i><i class="wf-only"></i></div>`).join("")}
      </div>
    </div>
    <p class="ui-only airline-compare-future"><strong>Pour ce vol, puis les suivants.</strong> ${esc(node.futureNote || "Les formats compatibles restent visibles : vous savez quand garder ce sac, et quel modèle choisir si une compagnie impose un gabarit plus petit.")}</p>`);
};

const cards = (node, profile, kind = "cards") => {
  const data = kind === "trust"
    ? [["truck", "Livraison suivie"], ["shield", "Retours 30 jours"], ["check", "Paiement protégé"]]
    : [["bag", "Ordinateur 16 pouces"], ["shield", "Tissu déperlant"], ["gift", "Accessoires inclus"]];
  return shell(node, `section-${kind}`, `${heading(node, true)}<div class="feature-grid">${data.map(([name, label], index) => `<article><span class="wf-only wf-feature-icon"></span><span class="ui-only feature-icon">${icon(name)}</span><div class="wf-only">${wireLines([75, 55])}</div><strong class="ui-only">${label}</strong><p class="ui-only">${profile.facts?.[index] || "Condition clairement expliquée."}</p></article>`).join("")}</div>${kind === "trust" ? `<div class="ui-only trustpilot-row">${trustpilot()}</div>` : ""}`);
};

const warranty = (node) => shell(node, "section-warranty", `${heading(node, true)}<div class="warranty-grid">${["Écrivez-nous", "Diagnostic sous 48 h", "Réparation ou échange"].map((step, index) => `<article><span class="process-number">0${index + 1}</span><div class="wf-only">${wireLines([78, 58])}</div><strong class="ui-only">${step}</strong><p class="ui-only">Un interlocuteur et un statut lisible.</p></article>`).join("")}</div>`);

const mosaic = (node) => {
  const defaults = [
    { label: "Vue trois-quarts", image: productImages.hero, view: "01-hero-three-quarter.png", caption: "SILHOUETTE" },
    { label: "Face", image: productImages.front, view: "02-front.png", caption: "ACCÈS AVANT" },
    { label: "Dos", image: productImages.rear, view: "03-rear-three-quarter.png", caption: "PORTAGE" },
    { label: "Intérieur", image: productImages.interior, view: "04-open-interior.png", caption: "ORGANISATION" },
    { label: "Matière", image: productImages.fabric, view: "05-macro-fabric-seam.png", caption: "TOILE TECHNIQUE" },
  ];
  const images = node.images || defaults;
  return shell(node, "section-mosaic", `${heading(node, true)}<div class="mosaic-grid">${images.map((item) => `<figure class="mosaic-media">
    <div class="wf-only media-wire"><span>${esc(item.label)}</span></div>
    <div class="ui-only mosaic-visual"><img class="product-media-image"${item.view ? ` data-product-view="${esc(item.view)}"` : ""}${colorAssetsAttr(item.colorAssets)} src="${esc(item.image)}" alt="${esc(item.alt || item.label)}" loading="lazy" /></div>
    <figcaption class="ui-only"><strong>${esc(item.label)}</strong><span>${esc(item.caption || "PORT 70 / EN MOUVEMENT")}</span></figcaption>
  </figure>`).join("")}</div>`);
};

const faq = (node) => shell(node, "section-faq", `${heading(node)}<div class="faq-list">${["Passe-t-il sous le siège ?", "Comment choisir le volume ?", "Le tissu résiste-t-il à la pluie ?", "Comment fonctionne un retour ?"].map((question, index) => `<button type="button" data-accordion aria-expanded="false"><span class="wf-only wf-faq-line"></span><span class="ui-only">${question}</span>${icon("plus")}<small class="ui-only">${index === 0 ? "Oui, selon la compagnie et le chargement. Les dimensions vérifiées restent affichées sur la page." : "Réponse détaillée disponible dans la fiche produit."}</small></button>`).join("")}</div>`);

const final = (node) => shell(node, "section-final", `<div class="wf-only">${wireLines([55, 36])}${dualAction(node.cta || "Action principale")}</div><div class="ui-only"><p class="eyebrow">DERNIÈRE ÉTAPE</p><h3>${esc(node.title)}</h3><p>${esc(node.body || "Livraison offerte · retours pendant 30 jours")}</p>${dualAction(node.cta || "Action principale")}</div>`);

export function renderSection(node, profile = { facts: [], quote: "", author: "" }) {
  const renderers = {
    split: () => split(node),
    metrics: () => metrics(node, profile),
    reviews: () => reviewCards(node, profile),
    comments: () => comments(node),
    "customer-evidence": () => customerEvidence(node),
    "routine-selector": () => routineSelector(node),
    "loadout-switch": () => loadoutSwitch(node),
    "scene-selector": () => sceneSelector(node),
    "photo-proof": () => photoProof(node),
    "product-grid": () => productGrid(node),
    "airport-story": () => airportStory(node),
    packing: () => packing(node),
    timeline: () => timeline(node),
    journey: () => timeline(node, true),
    journal: () => journal(node, profile),
    "commute-proof": () => commuteProof(node, profile),
    "gift-reassurance": () => giftReassurance(node),
    "airline-card": () => airlineCard(node),
    "airline-compare": () => airlineCompare(node),
    "before-after": () => beforeAfter(node),
    hotspots: () => hotspots(node),
    table: () => table(node),
    comparison: () => table(node, true),
    cards: () => cards(node, profile),
    trust: () => cards(node, profile, "trust"),
    warranty: () => warranty(node),
    mosaic: () => mosaic(node),
    faq: () => faq(node),
    final: () => final(node),
  };
  return (renderers[node.variant] || renderers.cards)();
}
