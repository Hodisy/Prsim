import { renderNode } from "../components/layouts.js";
import { systemPipeline } from "../components/system-pipeline.js";
import { catalogGroups } from "../data/catalog.js";
import { profiles } from "../data/profiles.js";

const previewProfile = profiles.p6;

export function renderLibraryPage(brand) {
  const layoutOrdinals = new Map(catalogGroups
    .flatMap((group) => group.items)
    .map((node, index) => [`${node.id}:${node.variant}`, index + 1]));
  return `
    <div class="library-page">
      ${systemPipeline("library")}
      <header class="library-intro">
        <span>PRSIM / LAYOUT SYSTEM 01</span>
        <h2>Des layouts indépendants du scénario.</h2>
        <p>Chaque carte utilise le vrai composant. En mode UI, elle hérite en direct de la marque <b data-brand-name>${brand.name}</b> : palette, fonte de titre et composants.</p>
      </header>
      <aside class="library-references" aria-label="Références théoriques">
        <span class="library-references-label">ELABORATION LIKELIHOOD MODEL / PETTY & CACIOPPO, 1986</span>
        <div class="library-reference-list">
          <blockquote class="library-reference">
            <p>“As personal relevance or thoughtfulness increases, the quality of issue-relevant arguments becomes more important than the quantity of arguments provided.”</p>
            <footer>« Plus le sujet est personnellement pertinent ou examiné avec attention, plus la qualité des arguments compte davantage que leur quantité. » <span>Petty & Cacioppo, 1986 · p. 160</span></footer>
          </blockquote>
          <blockquote class="library-reference">
            <p>“The personal relevance of a message is an important determinant of the route to persuasion.”</p>
            <footer>« La pertinence personnelle d’un message détermine largement la manière dont il persuade. » <span>Petty & Cacioppo, 1986 · p. 161</span></footer>
          </blockquote>
          <blockquote class="library-reference">
            <p>“Under conditions of high elaboration likelihood, attitudes are affected mostly by argument quality.”</p>
            <footer>« Lorsque les personnes examinent vraiment le message, c’est surtout la qualité des arguments qui influence leur jugement. » <span>Petty & Cacioppo, 1986 · p. 135</span></footer>
          </blockquote>
        </div>
      </aside>
      ${catalogGroups.map((group) => `
        <section class="library-group">
          <header><h3>${group.title}</h3><p>${group.note}</p></header>
          <div class="pattern-grid">
            ${group.items.map((node) => `
              <article class="pattern-card" data-pattern-id="${node.id}">
                <div class="pattern-card-head"><strong><i class="registry-order">L${String(layoutOrdinals.get(`${node.id}:${node.variant}`)).padStart(2, "0")}</i>${node.id} · ${node.label}</strong><span data-pattern-mode>GLOBAL</span></div>
                <div class="pattern-viewport"><div class="pattern-scale">${renderNode(node, previewProfile)}</div></div>
              </article>`).join("")}
          </div>
        </section>`).join("")}
    </div>`;
}
