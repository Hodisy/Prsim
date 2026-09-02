import { systemPipeline } from "../components/system-pipeline.js";
import { availableAnchorsForProfile, navigationAnchors } from "../core/navigation-anchors.js";
import { toolGroups } from "../webmcp/tools.js";

const esc = (value = "") => String(value).replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const json = (value) => esc(JSON.stringify(value, null, 2));

function stateRow(label, value, writable = true) {
  return `<div class="mcp-state-row"><span>${label}</span><code>${esc(value ?? "null")}</code><i>${writable ? "mutable" : "read only"}</i></div>`;
}

export function renderMcpStatePage({
  profile,
  activeScenario,
  selectionSource,
  resolution,
  activeExperience,
  colorway,
  productId,
  language,
  commerce,
  lastNavigation,
  webmcpSupported,
  experienceMutations,
}) {
  const available = new Set(availableAnchorsForProfile(profile).map((anchor) => anchor.id));
  const scenarioLabel = activeScenario === "classic" ? "Site classique" : `${profile.name} · ${profile.title}`;
  const snapshot = {
    session_only: true,
    active_scenario: activeScenario,
    selection_source: selectionSource,
    prepared_experience: activeExperience,
    presentation_updates: experienceMutations,
    nearest_match: resolution ? {
      scenario: resolution.scenario?.key,
      confidence: resolution.confidence,
      local_variations: resolution.localVariations || [],
    } : null,
    storefront: { product_id: productId, color: colorway, language },
    commerce,
    last_navigation: lastNavigation,
  };

  return `
    <div class="system-page mcp-state-page">
      ${systemPipeline("mcp")}
      <header class="system-lead compact mcp-state-lead">
        <p>MCP SESSION SANDBOX / LOCAL ONLY</p>
        <h2>Ce que l’agent voit.<br>Ce qu’il peut changer.</h2>
        <div class="system-lead-copy"><p>L’état est limité à cette session et à la boutique. Le WebMCP réel est exposé dans Preview ; cet écran en montre le contrat et la valeur courante sans déclencher de nouvel appel.</p></div>
      </header>

      <section class="mcp-active-state">
        <div><span>EXPÉRIENCE ACTIVE</span><strong>${esc(scenarioLabel)}</strong><small>source · ${esc(selectionSource)}</small></div>
        <div><span>WEBMCP DANS PREVIEW</span><strong>${webmcpSupported ? "NATIF DISPONIBLE" : "FALLBACK JS"}</strong><small>pause volontaire sur cet écran</small></div>
        <button type="button" class="system-primary" data-view="preview">Ouvrir Preview</button>
      </section>

      <div class="mcp-state-grid">
        <section class="mcp-panel">
          <header><span>01</span><h3>État mutable</h3></header>
          ${stateRow("scenario", activeScenario)}
          ${stateRow("color", colorway)}
          ${stateRow("product_id", productId)}
          ${stateRow("language", language)}
          ${stateRow("bundle.enabled", commerce.bundle?.enabled)}
          ${stateRow("checkout.status", commerce.checkout?.status || null)}
          ${stateRow("selection_source", selectionSource, false)}
          ${stateRow("hero.block", experienceMutations?.heroPurpose || "scenario default")}
          ${stateRow("body.updates", experienceMutations?.operations?.length || 0)}
          ${stateRow("customer_evidence.focus", experienceMutations?.customerEvidence?.evidence?.focus || null)}
          ${stateRow("customer_evidence.items", experienceMutations?.customerEvidence?.evidence?.reviewIds?.length || 0)}
        </section>

        <section class="mcp-panel mcp-json-panel">
          <header><span>02</span><h3>Snapshot de session</h3></header>
          <pre><code>${json(snapshot)}</code></pre>
        </section>
      </div>

      <section class="mcp-tools-section">
        <header><span>03</span><h3>Fonctions exposées dans Preview</h3><p>Avant préparation : <code>prepare_shopping_experience</code>. Après : <code>change_experience_hero</code>, <code>update_experience_blocks</code> et <code>show_customer_evidence</code> prennent le relais sans rematcher toute la page.</p></header>
        <div class="mcp-tool-groups">
          ${toolGroups.map((group) => `
            <article class="mcp-tool-group">
              <div><span>${esc(group.protocol)}</span><h4>${esc(group.label)}</h4></div>
              <ol>${group.tools.map((tool) => `<li><code>${esc(tool.name)}</code><small>${esc(tool.effect)}</small></li>`).join("")}</ol>
            </article>`).join("")}
        </div>
      </section>

      <section class="mcp-anchors-section">
        <header><span>04</span><h3>Ancres de navigation</h3><p><code>navigate_to({ section })</code> cible ces attributs sémantiques, jamais un sélecteur CSS arbitraire.</p></header>
        <div class="mcp-anchor-list">
          ${navigationAnchors.map((anchor) => `<div class="${available.has(anchor.id) ? "available" : "missing"}"><code>${anchor.id}</code><span>${anchor.label}</span><i>${available.has(anchor.id) ? "présente" : "absente de cet assemblage"}</i></div>`).join("")}
        </div>
      </section>
    </div>`;
}
