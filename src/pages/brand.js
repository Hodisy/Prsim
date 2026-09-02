import { esc, icon, rating, trustpilot, uiButton } from "../components/primitives.js";
import { systemPipeline } from "../components/system-pipeline.js";
import { titleFonts } from "../core/brand.js";

const editorFields = (brand) => `
  <form class="brand-editor" data-brand-editor>
    <label class="brand-field brand-name-field"><span>Nom de marque</span><input type="text" maxlength="32" value="${esc(brand.name)}" data-brand-field="name"></label>
    ${[
      ["ink", "Encre"], ["graphite", "Graphite"], ["fog", "Brume"],
      ["paper", "Papier"], ["review", "Avis"], ["trust", "Confiance"],
    ].map(([key, fieldLabel]) => `<label class="brand-field brand-color-field"><span>${fieldLabel}</span><span class="brand-color-input"><input type="color" value="${brand[key]}" data-brand-field="${key}"><code data-brand-value="${key}">${brand[key].toUpperCase()}</code></span></label>`).join("")}
    <label class="brand-field brand-font-field"><span>Fonte des titres</span><select data-brand-field="titleFont">${Object.entries(titleFonts).map(([key, option]) => `<option value="${key}" ${brand.titleFont === key ? "selected" : ""}>${option.label}</option>`).join("")}</select></label>
  </form>`;

export function renderBrandPage(brand, options = {}) {
  const editing = Boolean(options.editing);
  const draft = options.draft || brand;
  return `
    <div class="brand-page">
      ${systemPipeline("brand")}
      <header class="brand-hero ${editing ? "is-editing" : ""}"${editing ? ` style="--draft-ink:${draft.ink};--draft-paper:${draft.paper};--draft-title-font:${esc(titleFonts[draft.titleFont].stack)}"` : ""}>
        <div class="brand-hero-top"><span>BRAND SYSTEM / VERSION 0.2</span>${editing ? `<span>MODE ÉDITION</span>` : `<button type="button" data-brand-edit>Éditer la Brand</button>`}</div>
        ${editing ? `
          <div class="brand-hero-editor">
            <div class="brand-editor-intro">
              <span>APERÇU LOCAL</span>
              <strong data-brand-draft-name>${esc(draft.name)}</strong>
              <p>Modifiez les tokens ici. Rien ne se propage dans le projet avant l’enregistrement.</p>
            </div>
            ${editorFields(draft)}
          </div>
          <div class="brand-editor-actions"><button type="button" data-brand-reset>Réinitialiser</button><button type="button" data-brand-cancel>Annuler</button><button type="button" class="primary" data-brand-save>Enregistrer</button></div>
        ` : `
          <div class="brand-lockup"><strong data-brand-name>${esc(brand.name)}</strong><p>Un bagage précis pour les départs courts.<br>Une collection nommée simplement par son volume.</p></div>
          <div class="brand-principles"><span>MONOCHROME</span><span>FONCTION AVANT STYLE</span><span>PREUVE CONTEXTUELLE</span><span>PHOTOGRAPHIE DOCUMENTAIRE</span></div>
        `}
      </header>

      <section class="brand-section">
        <header><span>01</span><div><h2>Fondations</h2><p>Une palette noire éditoriale. Les seules couleurs servent une information, jamais la décoration.</p></div></header>
        <div class="palette-grid">
          <div class="swatch-card ink"><span data-brand-value="ink">${brand.ink.toUpperCase()}</span><strong>INK</strong></div>
          <div class="swatch-card graphite"><span data-brand-value="graphite">${brand.graphite.toUpperCase()}</span><strong>GRAPHITE</strong></div>
          <div class="swatch-card fog"><span data-brand-value="fog">${brand.fog.toUpperCase()}</span><strong>FOG</strong></div>
          <div class="swatch-card paper"><span data-brand-value="paper">${brand.paper.toUpperCase()}</span><strong>PAPER</strong></div>
          <div class="swatch-card star-color"><span data-brand-value="review">${brand.review.toUpperCase()}</span><strong>REVIEW ONLY</strong></div>
          <div class="swatch-card trust-color"><span data-brand-value="trust">${brand.trust.toUpperCase()}</span><strong>TRUST ONLY</strong></div>
        </div>
      </section>

      <section class="brand-section">
        <header><span>02</span><div><h2>Typographie</h2><p>Une sans grotesque système et une fonte de titre configurable. Pas de fonte « futuriste » illustrative.</p></div></header>
        <div class="type-grid">
          <article class="type-display"><span>DISPLAY / <b data-brand-font-label>${titleFonts[brand.titleFont].label}</b></span><strong>Trois jours.<br>Un seul volume.</strong><small>64 / 0.94 / −0.04 em</small></article>
          <article class="type-system"><span>INTERFACE / SYSTEM SANS</span><h3>Une information nette au bon moment.</h3><p>La preuve est attachée à la décision qu’elle sécurise. Les labels sont courts, les données tabulaires et les conditions explicites.</p><small>14 / 1.55 / 0</small></article>
        </div>
      </section>

      <section class="brand-section">
        <header><span>03</span><div><h2>Actions & choix</h2><p>Angles francs, contraste direct, un seul bouton dominant par zone.</p></div></header>
        <div class="component-grid two">
          <article class="brand-demo dark-demo"><span class="demo-label">BUTTONS</span><div class="button-demo">${uiButton("Ajouter au panier")} ${uiButton("Voir les dimensions", true)}</div><a href="#library" class="text-link">Comparer les modèles ${icon("arrow")}</a></article>
          <article class="brand-demo"><span class="demo-label">SELECT / TOGGLE</span><div class="choice-demo"><button type="button" class="active">Passage 32</button><button type="button">Passage 36</button><button type="button">Passage 42</button></div><label class="switch-demo"><input type="checkbox" checked><span></span>Livraison avec signature</label></article>
        </div>
      </section>

      <section class="brand-section">
        <header><span>04</span><div><h2>Preuve sociale</h2><p>La couleur s’active seulement sur les étoiles et les marques de confiance reconnues.</p></div></header>
        <div class="component-grid three">
          <article class="brand-demo"><span class="demo-label">RATING</span>${rating("4,8", "326 avis vérifiés")}<p class="demo-copy">Note globale et volume d’avis restent toujours voisins.</p></article>
          <article class="brand-demo"><span class="demo-label">TRUSTPILOT</span>${trustpilot()}<p class="demo-copy">Le vert est réservé à cet indicateur.</p></article>
          <article class="brand-demo review-demo"><span class="demo-label">AVIS CONTEXTUEL</span><div class="context-tag">MÊME COMPAGNIE</div><blockquote>« Passé sous le siège sans discussion. »</blockquote><small>Léo B. · Ryanair · vérifié</small></article>
        </div>
      </section>

      <section class="brand-section">
        <header><span>05</span><div><h2>Commerce contextuel</h2><p>Des composants courts qui répondent à l’objection située juste avant le CTA.</p></div></header>
        <div class="component-grid two">
          <article class="brand-demo airline-demo"><span class="demo-label">AIRLINE VERIFIED</span><div class="airline-row"><strong>RYANAIR</strong><span>✓ Vérifié</span></div><h3>Petit bagage personnel</h3><div class="dimension-demo"><span>Limite compagnie</span><strong>40 × 20 × 25 cm</strong><small>Vérifié le 28 août 2026</small></div>${uiButton("Voyager sans supplément")}</article>
          <article class="brand-demo gift-demo"><span class="demo-label">GIFT READY</span><div class="gift-demo-grid"><div>${icon("truck")}<strong>Jeu. 04</strong><span>Livré à temps</span></div><div>${icon("gift")}<strong>30 jours</strong><span>Échange cadeau</span></div></div><label><input type="checkbox" data-gift-bundle> Ajouter un étui passeport <b>+ 12 €</b></label>${uiButton("Préparer ce cadeau")}</article>
        </div>
      </section>

      <section class="brand-section">
        <header><span>06</span><div><h2>États & micro-interactions</h2><p>L’état choisi est lisible par la bordure, le texte et l’attribut accessible — jamais par la couleur seule.</p></div></header>
        <div class="component-grid two">
          <article class="brand-demo"><span class="demo-label">ACCORDION</span><div class="brand-accordion">${["Passe-t-il sous le siège ?", "Comment fonctionne un échange ?", "Quand arrive ma commande ?"].map((question) => `<button type="button" data-accordion aria-expanded="false"><span>${question}</span>${icon("plus")}<small>La réponse s’ouvre dans le même flux, sans déplacer la décision.</small></button>`).join("")}</div></article>
          <article class="brand-demo sticky-demo"><span class="demo-label">STICKY CTA</span><div class="sticky-demo-bar"><span class="sticky-demo-thumb"></span><span><strong>Passage 32 · Noir</strong><small>Livraison offerte</small></span><b>149 €</b>${uiButton("Choisir")}</div></article>
        </div>
      </section>
    </div>`;
}
