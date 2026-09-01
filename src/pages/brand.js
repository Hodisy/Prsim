import { icon, rating, trustpilot, uiButton } from "../components/primitives.js";

export function renderBrandPage() {
  return `
    <div class="brand-page">
      <header class="brand-hero">
        <div class="brand-hero-top"><span>BRAND SYSTEM / VERSION 0.2</span><span>SEPTEMBRE 2026</span></div>
        <div class="brand-lockup"><strong>PORT 70</strong><p>Un bagage précis pour les départs courts.<br>Une collection nommée simplement par son volume.</p></div>
        <div class="brand-principles"><span>MONOCHROME</span><span>FONCTION AVANT STYLE</span><span>PREUVE CONTEXTUELLE</span><span>PHOTOGRAPHIE DOCUMENTAIRE</span></div>
      </header>

      <section class="brand-section">
        <header><span>01</span><div><h2>Fondations</h2><p>Une palette noire éditoriale. Les seules couleurs servent une information, jamais la décoration.</p></div></header>
        <div class="palette-grid">
          <div class="swatch-card ink"><span>#0A0A0A</span><strong>INK</strong></div>
          <div class="swatch-card graphite"><span>#272727</span><strong>GRAPHITE</strong></div>
          <div class="swatch-card fog"><span>#E8E8E3</span><strong>FOG</strong></div>
          <div class="swatch-card paper"><span>#F7F7F2</span><strong>PAPER</strong></div>
          <div class="swatch-card star-color"><span>#F4B740</span><strong>REVIEW ONLY</strong></div>
          <div class="swatch-card trust-color"><span>#00B67A</span><strong>TRUST ONLY</strong></div>
        </div>
      </section>

      <section class="brand-section">
        <header><span>02</span><div><h2>Typographie</h2><p>Une sans grotesque système et une serif éditoriale. Pas de fonte « futuriste » illustrative.</p></div></header>
        <div class="type-grid">
          <article class="type-display"><span>DISPLAY / GEORGIA</span><strong>Trois jours.<br>Un seul volume.</strong><small>64 / 0.94 / −0.04 em</small></article>
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
