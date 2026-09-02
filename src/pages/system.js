import { assetManifest, baseSignatureCount, forestDimensions, gapCandidates, localVariationCombinationCount, potentialScenarioCount, scenarioSeeds } from "../data/scenario-system.js";
import { esc } from "../components/primitives.js";
import { systemPipeline } from "../components/system-pipeline.js";
import { assetUsageForAssembly, contentUsageForAssembly, resolveLayoutInstance } from "../core/assembly.js";
import { editableFieldsFor } from "../data/layout-registry.js";
import { reviewManifest, reviewSourceLabels } from "../data/reviews.js";
import { instantiateBlock, switchableBlocks } from "../data/block-registry.js";
import { renderNode } from "../components/layouts.js";

const label = (value) => value.replaceAll("_", " ");
const number = (value) => new Intl.NumberFormat("fr-FR").format(value);

function dimensionBlock(title, values, note) {
  return `
    <section class="forest-branch">
      <header><h3>${title}</h3><span>${values.length}</span></header>
      <p>${note}</p>
      <div class="system-tags">${values.map((value) => `<span>${label(value)}</span>`).join("")}</div>
    </section>`;
}

export function renderFoundationPage() {
  return `
    <div class="system-page foundation-page">
      ${systemPipeline("")}
      <header class="system-lead">
        <p>PRSIM / EXPERIENCE MODEL</p>
        <h2>Une forêt de signaux.<br>Pas une liste infinie de pages.</h2>
        <div class="system-lead-copy">
          <p><strong>15 scénarios édités</strong> servent de points d’ancrage. Toute nouvelle demande cherche le voisin le plus proche, puis compose des blocs génériques sans dépasser cinq blocs de contenu visibles.</p>
          <p>Le potentiel inclut contexte, achat, décision, projection, contenu, ton, âge, genre, coloris, langue d’interface et variations locales. Même les champs « non dit » restent une signature possible.</p>
        </div>
      </header>

      <section class="coverage-strip" aria-label="Couverture actuelle">
        <div><strong>15</strong><span>scénarios édités</span></div>
        <i>/</i>
        <div><strong>${number(potentialScenarioCount)}</strong><span>déclinaisons théoriques</span></div>
        <div><strong>100 %</strong><span>adressables par voisinage</span></div>
        <div><strong>${localVariationCombinationCount}</strong><span>combinaisons locales</span></div>
      </section>

      <div class="forest-grid">
        ${dimensionBlock("01 · Contexte", forestDimensions.contexts, "Où et pour quoi le produit sera réellement utilisé.")}
        ${dimensionBlock("02 · Situation d’achat", forestDimensions.buyingFor, "Pour soi, pour offrir ou pour équiper plusieurs personnes.")}
        ${dimensionBlock("03 · Décision", forestDimensions.decisionStyles, "La manière dont la personne veut arriver à une décision.")}
        ${dimensionBlock("04 · Projection", forestDimensions.projections, "La façon dont elle souhaite se voir avec le produit.")}
        ${dimensionBlock("05 · Langage", forestDimensions.contentAffinities, "Les preuves et récits qui lui sont les plus utiles.")}
        ${dimensionBlock("06 · Ton", forestDimensions.tones, "La personnalité visible de la page, indépendante de son contenu.")}
        ${dimensionBlock("07 · Âge", forestDimensions.ageGroups, "Tranche déclarée, inférée avec confiance ou laissée inconnue.")}
        ${dimensionBlock("08 · Genre", forestDimensions.genderRepresentations, "Représentation ciblée, mixte ou non dite.")}
        ${dimensionBlock("09 · Coloris", forestDimensions.colorPreferences, "Préférence explicite ou absence de préférence.")}
        ${dimensionBlock("10 · Langue d’interface", forestDimensions.languages, "Langue explicitement demandée, indépendante de la destination et de la nationalité.")}
      </div>

      <section class="formula-strip">
        <span>${forestDimensions.contexts.length} contextes</span><i>×</i>
        <span>${forestDimensions.buyingFor.length} achats</span><i>×</i>
        <span>${forestDimensions.decisionStyles.length} décisions</span><i>×</i>
        <span>${forestDimensions.projections.length} projections</span><i>×</i>
        <span>${forestDimensions.contentAffinities.length} langages</span><i>×</i>
        <span>${forestDimensions.tones.length} tons</span><i>×</i>
        <span>${forestDimensions.ageGroups.length} âges</span><i>×</i>
        <span>${forestDimensions.genderRepresentations.length} genres</span><i>×</i>
        <span>${forestDimensions.colorPreferences.length} coloris</span><i>×</i>
        <span>${forestDimensions.languages.length} langues UI</span><i>×</i>
        <span>${localVariationCombinationCount} variations</span>
        <strong>= ${number(potentialScenarioCount)}</strong>
        <small>${number(baseSignatureCount)} signatures avant variations de sections.</small>
      </section>

      <section class="tool-contract">
        <div>
          <span>PRIMARY WEBMCP FUNCTION</span>
          <h3>prepare_shopping_experience</h3>
          <p>La personne exprime une situation, ses contraintes et ses envies ; le companion peut compléter uniquement avec un contexte déjà connu et pertinent. PRSIM prépare et améliore alors l’expérience d’achat en sélectionnant la présentation, le contenu, les images et les preuves les plus utiles. Le mécanisme reste caché pour préserver la surprise. Si le besoin est trop vague, une seule question courte est renvoyée ; sinon l’expérience prête à découvrir termine la recherche.</p>
        </div>
        <pre><code>prepare_shopping_experience({
  request,
  use_language,
  contexts,
  buying_for,
  person: { age_group, gender_representation },
  constraints,
  practical_needs,
  decision_preferences,
  experience_desires,
  aesthetic_preferences,
  organization_need,
  purchase_scope,
  assumptions
})</code></pre>
      </section>

      <section class="tool-contract">
        <div>
          <span>FOLLOW-UP WEBMCP FUNCTIONS</span>
          <h3>change_experience_hero<br>update_experience_blocks<br>show_customer_evidence</h3>
          <p>Une fois l’expérience préparée, le point d’entrée principal disparaît. Le companion peut alors répondre à une nouvelle question en remplaçant le hero, en ajustant un bloc générique ou en faisant remonter des avis pertinents et sourcés. Une nouvelle preuve client remplace la précédente, apparaît au meilleur endroit puis est amenée dans la fenêtre. Le CTA final reste présent et le moteur ne dépasse pas cinq blocs de contenu.</p>
        </div>
        <pre><code>change_experience_hero({
  request,
  goal,
  preserve
})

update_experience_blocks({
  request,
  operation: "auto",
  purpose,
  placement: "best"
})

show_customer_evidence({
  concern,
  focus: "auto",
  source: "auto"
})</code></pre>
      </section>

      <section class="system-rules">
        <h3>Ordre de décision</h3>
        <ol>
          <li><span>01</span>Résoudre les contraintes qui peuvent bloquer l’achat.</li>
          <li><span>02</span>Trouver le scénario édité le plus proche.</li>
          <li><span>03</span>Composer le hero et jusqu’à 5 blocs de contenu sans doublon.</li>
          <li><span>04</span>Remplacer localement une preuve, une histoire ou une offre.</li>
          <li><span>05</span>Conserver le choix de coloris et un CTA d’achat dans le hero.</li>
          <li><span>06</span>Présenter la proposition une fois, puis attendre une demande explicite.</li>
        </ol>
      </section>

      <section class="prsim-manifesto">
        <header>
          <span>POURQUOI PRSIM ?</span>
          <h3>Vous avez probablement lu<br>« prism » sans y penser.</h3>
        </header>
        <div class="prsim-word-study" aria-label="PRSIM se lit comme PRISM">
          <strong>PR<span>SI</span>M</strong>
          <i>→</i>
          <strong>PR<span>IS</span>M</strong>
        </div>
        <div class="prsim-manifesto-copy">
          <p><b>PRSIM n’est pas une faute.</b> Le nom conserve le début et la fin de <i>PRISM</i>, mais transpose ses deux lettres centrales. La lecture reste possible parce que notre système visuel ne traite pas chaque lettre comme une suite de positions parfaitement rigides : leur position relative et le contexte suffisent souvent à reconnaître le mot.</p>
          <p>Ce phénomène est appelé <b>effet des lettres transposées</b>. Il ne signifie pas que l’ordre ne compte jamais — la lecture brouillée a un coût — mais qu’une forme peut être comprise sans être montrée de manière parfaitement littérale.</p>
          <p>Le prisme donne le sens du projet : il ne crée pas une nouvelle lumière, il <b>révèle différemment la même matière selon l’angle</b>. PRSIM ne demande donc pas à une IA d’inventer une boutique. Il sélectionne et ordonne la Brand, les layouts, le copy et les assets existants selon le besoin exprimé.</p>
        </div>

        <div class="prsim-elm">
          <div>
            <span>FONDEMENT THÉORIQUE</span>
            <h4>Elaboration Likelihood Model</h4>
            <p>Petty & Cacioppo · 1986</p>
          </div>
          <blockquote>
            <p>“As personal relevance or thoughtfulness increases, the quality of issue-relevant arguments becomes more important than the quantity of arguments provided.”</p>
            <footer>« Plus le sujet est personnellement pertinent ou examiné avec attention, plus la qualité des arguments compte davantage que leur quantité. »</footer>
          </blockquote>
          <div class="prsim-elm-conclusion">
            <p>La pertinence personnelle détermine en grande partie la manière dont un message persuade. PRSIM ne cherche donc pas à <b>tout montrer</b>, mais à montrer <b>ce qui mérite d’être examiné ici</b> : la bonne preuve, le bon récit et la bonne action.</p>
          </div>
        </div>

        <footer class="prsim-sources">
          <span>SOURCES</span>
          <a href="https://www.cs.umd.edu/~shankar/cwhitney/Papers/TICS.pdf" target="_blank" rel="noreferrer">Grainger & Whitney · Transposed-letter effect · 2004</a>
          <a href="https://doi.org/10.1111/j.1467-9280.2006.01684.x" target="_blank" rel="noreferrer">Rayner et al. · There is a cost · 2006</a>
          <a href="https://doi.org/10.1016/S0065-2601(08)60214-2" target="_blank" rel="noreferrer">Petty & Cacioppo · Elaboration Likelihood Model · 1986</a>
        </footer>
      </section>
    </div>`;
}

function assetCard(asset, index) {
  return `
    <article class="asset-row" data-asset-type="${asset.type}">
      <div class="asset-thumb"><img src="${asset.path}" alt="" loading="lazy"></div>
      <div class="asset-identity"><i class="registry-order">A${String(index + 1).padStart(3, "0")}</i><strong>${asset.id}</strong><span>${asset.path.replace("./assets/", "")}</span></div>
      <span class="asset-type">${asset.type}</span>
      <span class="asset-role">${asset.role}</span>
      <span class="asset-color"><i class="asset-color-dot color-${asset.color}"></i>${label(asset.color)}</span>
      <div class="asset-tags">${asset.tags.slice(0, 5).map((tag) => `<span>${label(tag)}</span>`).join("")}</div>
    </article>`;
}

function reviewCard(review, index) {
  const ratingLabel = review.rating ? `${String(review.rating).replace(".", ",")} / 5` : "Sans note";
  return `
    <article class="review-asset-row">
      <div class="review-asset-id"><i class="registry-order">R${String(index + 1).padStart(3, "0")}</i><strong>${esc(review.id)}</strong><span>${esc(review.kind)}</span></div>
      <blockquote>« ${esc(review.body)} »</blockquote>
      <div class="review-asset-author"><strong>${esc(review.author)}</strong><span>${esc(review.context || "Contexte non précisé")}</span></div>
      <div class="review-asset-source"><strong>${esc(reviewSourceLabels[review.source] || review.source)}</strong><span>${review.prototype ? "Contenu de prototype" : review.verifiedPurchase ? "Achat vérifié" : "Source déclarée"}</span></div>
      <span class="review-asset-rating">${ratingLabel}</span>
      <div class="asset-tags">${review.tags.slice(0, 5).map((tag) => `<span>${esc(label(tag))}</span>`).join("")}</div>
    </article>`;
}

export function renderAssetsPage(activeFamily = "images", activeType = "all", activeColor = "all", activeReviewSource = "all") {
  const visible = assetManifest.filter((asset) => (activeType === "all" || asset.type === activeType) && (activeColor === "all" || asset.color === activeColor));
  const visibleReviews = reviewManifest.filter((review) => activeReviewSource === "all" || review.source === activeReviewSource);
  const types = ["all", "product", "context", "editorial", "material", "icon", "sketch"];
  const colors = ["all", "black", "cream", "liberty-blue", "liberty-burgundy", "unspecified"];
  const reviewSources = ["all", ...new Set(reviewManifest.map((review) => review.source))];
  const countForType = (type) => assetManifest.filter((asset) =>
    (type === "all" || asset.type === type)
    && (activeColor === "all" || asset.color === activeColor)).length;
  const countForColor = (color) => assetManifest.filter((asset) =>
    (activeType === "all" || asset.type === activeType)
    && (color === "all" || asset.color === color)).length;
  return `
    <div class="system-page assets-page">
      ${systemPipeline("assets")}
      <section class="asset-source-banner">
        <div>
          <span>SOURCE DE DONNÉES</span>
          <strong>Assets est le point d’entrée du contenu.</strong>
          <p>On y importe les images et leurs métadonnées, puis on y connecte les avis issus de l’après-achat, Trustpilot, enquêtes ou autres sources.</p>
        </div>
        <div><b>IMAGES</b><span>Upload → tags → ID stable</span></div>
        <div><b>AVIS</b><span>Connecteur → source → ID stable</span></div>
        <div><b>ASSEMBLAGES</b><span>Référencent ces IDs dans chaque instance de layout</span></div>
      </section>
      <header class="system-lead compact">
        <p>ASSET REGISTRY / ${assetManifest.length} IMAGES / ${reviewManifest.length} AVIS</p>
        <h2>Les preuves deviennent interrogeables.</h2>
        <div class="system-lead-copy"><p>Images et avis sont des contenus réutilisables, liés par référence. Les titres, FAQ, citations éditoriales et CTA restent du copy marchand dans les assemblages.</p></div>
      </header>
      <nav class="asset-family-tabs" aria-label="Famille d’assets">
        <button type="button" data-asset-family="images" class="${activeFamily === "images" ? "active" : ""}"><span>Images</span><strong>${assetManifest.length}</strong></button>
        <button type="button" data-asset-family="reviews" class="${activeFamily === "reviews" ? "active" : ""}"><span>Avis</span><strong>${reviewManifest.length}</strong></button>
      </nav>
      ${activeFamily === "images" ? `<div class="asset-toolbar">
        <div role="group" aria-label="Filtrer par type">
          <strong>TYPE</strong>${types.map((type) => `<button type="button" data-asset-filter="${type}" class="${activeType === type ? "active" : ""}">${type === "all" ? "Tous" : label(type)} <span>${countForType(type)}</span></button>`).join("")}
        </div>
        <div role="group" aria-label="Filtrer par coloris">
          <strong>COLORIS</strong>${colors.map((color) => `<button type="button" data-asset-color="${color}" class="${activeColor === color ? "active" : ""}">${color === "all" ? "Tous" : label(color)} <span>${countForColor(color)}</span></button>`).join("")}
        </div>
      </div>
      <div class="asset-result-count">${visible.length} asset${visible.length > 1 ? "s" : ""} dans cette vue</div>
      <div class="asset-table-head"><span>Preview</span><span>Fichier</span><span>Type</span><span>Rôle</span><span>Coloris</span><span>Tags détectés</span></div>
      <div class="asset-list">${visible.map((asset) => assetCard(asset, assetManifest.indexOf(asset))).join("")}</div>` : `
      <div class="asset-toolbar review-toolbar"><div role="group" aria-label="Filtrer les avis par source"><strong>SOURCE</strong>${reviewSources.map((source) => {
        const count = reviewManifest.filter((review) => source === "all" || review.source === source).length;
        return `<button type="button" data-review-source="${source}" class="${activeReviewSource === source ? "active" : ""}">${source === "all" ? "Toutes" : reviewSourceLabels[source] || label(source)} <span>${count}</span></button>`;
      }).join("")}</div></div>
      <div class="asset-result-count">${visibleReviews.length} avis ou commentaire${visibleReviews.length > 1 ? "s" : ""} dans cette vue</div>
      <div class="review-asset-head"><span>ID / format</span><span>Contenu</span><span>Auteur / contexte</span><span>Source</span><span>Note</span><span>Tags</span></div>
      <div class="review-asset-list">${visibleReviews.map((review) => reviewCard(review, reviewManifest.indexOf(review))).join("")}</div>`}
    </div>`;
}

function blockCard(block, profiles, assemblies, ordinal) {
  const node = instantiateBlock(block, profiles);
  const previewProfile = profiles[block.sourceProfile] || profiles.classic;
  const usages = Object.values(assemblies || {}).filter((assembly) => assembly.nodes?.some((instance) => instance.templateBlockId === block.id));
  return `
    <article class="block-registry-card">
      <header><span>${esc(ordinal)} · ${esc(block.role === "hero" ? "HERO" : "SECTION")}</span><code>${esc(block.id)}</code></header>
      <div class="block-live-preview pattern-viewport"><div class="pattern-scale">${renderNode(node, previewProfile)}</div></div>
      <h3>${esc(block.label)}</h3>
      <p>${esc(block.description)}</p>
      <dl>
        <div><dt>Question utilisateur</dt><dd>${esc(block.shopperQuestion || "Question contextuelle")}</dd></div>
        <div><dt>Argument tool</dt><dd><code>${esc(block.purpose)}</code></dd></div>
        <div><dt>Layout source</dt><dd>${esc(block.sourceProfile)} · ${esc(block.sourceVariant)}</dd></div>
        <div><dt>Usage</dt><dd>${block.usage === "switchable" ? `switch · ${esc(block.argumentType)}` : `assembly core · ${esc(block.argumentType)}`}</dd></div>
        <div><dt>Fallback</dt><dd>${block.purpose === "product_overview" ? "universel" : "product_overview"}</dd></div>
      </dl>
      <div class="block-assembly-usage"><strong>ASSEMBLAGES · ${usages.length}</strong><div>${usages.length ? usages.map((assembly) => `<span>${esc(assembly.id)}</span>`).join("") : "<em>Disponible · pas encore instancié</em>"}</div></div>
      <div class="system-tags">${block.tags.map((tag) => `<span>${esc(label(tag))}</span>`).join("")}</div>
    </article>`;
}

function concreteBlockCard(instance, profile, ordinal) {
  const node = resolveLayoutInstance(instance);
  const embeddedAssetCount = ["price", "product-grid"].includes(instance.layoutVariant) ? 4 : 0;
  const assetCount = Object.keys(instance.assetBindings || {}).length + embeddedAssetCount;
  const reviewCount = Object.values(instance.contentBindings || {}).flat().length;
  return `
    <article class="block-registry-card concrete-block-card">
      <header><span>B${String(ordinal).padStart(3, "0")} · ${instance.type === "hero" ? "HERO" : "SECTION"}</span><code>${esc(instance.blockId)}</code></header>
      <div class="block-live-preview pattern-viewport"><div class="pattern-scale">${renderNode(node, profile)}</div></div>
      <h3>${esc(instance.props?.label || instance.templateId)}</h3>
      <p>${esc(instance.props?.title || "Bloc de contenu déjà composé dans cet assemblage.")}</p>
      <dl>
        <div><dt>Layout</dt><dd><code>${esc(instance.templateId)}</code></dd></div>
        <div><dt>Copy</dt><dd>${Object.keys(instance.props || {}).length} champs</dd></div>
        <div><dt>Assets</dt><dd>${assetCount} image${assetCount > 1 ? "s" : ""} · ${reviewCount} avis</dd></div>
        <div><dt>Proof mapping</dt><dd>${esc(instance.templateBlockId || "aucun · contexte uniquement")}</dd></div>
      </dl>
    </article>`;
}

export function renderBlocksPage(profiles, assemblies = {}) {
  const assemblyEntries = Object.values(assemblies);
  const concreteCount = assemblyEntries.reduce((total, assembly) => total + (assembly.nodes?.length || 0), 0);
  const concreteOrdinals = new Map();
  let concreteOrdinal = 0;
  assemblyEntries.forEach((assembly) => assembly.nodes.forEach((instance) => {
    concreteOrdinal += 1;
    concreteOrdinals.set(instance.instanceId, concreteOrdinal);
  }));
  const blockGroup = (role, title, description) => {
    const blocks = switchableBlocks.filter((block) => block.role === role);
    const prefix = role === "hero" ? "P-H" : "P-S";
    if (!blocks.length) return "";
    return `<section class="block-registry-group">
      <header><div><span>PROOF / CONVERSATIONAL SWITCH · ${role === "hero" ? "HERO" : "SECTION"}</span><h3>${title}</h3></div><p>${description}</p></header>
      <div class="block-registry-grid">${blocks.map((block, index) => blockCard(block, profiles, assemblies, `${prefix}${String(index + 1).padStart(2, "0")}`)).join("")}</div>
    </section>`;
  };
  return `
    <div class="system-page blocks-page">
      ${systemPipeline("blocks")}
      <header class="system-lead compact">
        <p>AUTHORED BLOCK CATALOG / ${concreteCount} BLOCS / ${switchableBlocks.length} PROOF SWITCHES</p>
        <h2>Les assemblages sont<br>déjà faits de blocs.</h2>
        <div class="system-lead-copy"><p>Un bloc concret contient son layout, son copy, ses images et ses avis. Les assemblages ne font que référencer et ordonner ces blocs. Le sous-ensemble « proof switch » désigne les blocs neutres que le WebMCP peut utiliser pour répondre à une question précise.</p></div>
      </header>
      <section class="block-contract-strip">
        <div><span>01</span><strong>Layout</strong><small>structure</small></div><i>+</i>
        <div><span>02</span><strong>Copy + assets</strong><small>images · avis · preuves</small></div><i>→</i>
        <div><span>03</span><strong>Bloc concret</strong><small><code>block.p6.hero</code></small></div><i>→</i>
        <div><span>04</span><strong>Assemblage</strong><small>références + ordre</small></div>
      </section>
      ${blockGroup("hero", "Changer le cadre de décision.", "Hero de comparaison, compatibilité, matière ou urgence. Le produit et le coloris courant sont conservés ; aucun contexte narratif n’est exposé au tool.")}
      ${blockGroup("section", "Répondre à une question précise.", "Formats, prix, cabine, pluie, solidité, avis, rangement, livraison, matière ou retours : uniquement des arguments pragmatiques et réutilisables.")}
      <section class="block-registry-group assembly-block-catalog">
        <header><div><span>FOUNDATION · ASSEMBLY BLOCKS</span><h3>${concreteCount} blocs déjà composés.</h3></div><p>Ils conservent volontairement leur contexte. Ouvrez un assemblage pour voir ses blocs réels, avec leurs images et leur copy.</p></header>
        <div class="assembly-block-groups">${assemblyEntries.map((assembly, assemblyIndex) => `<details class="assembly-block-group" open><summary><span><i class="registry-order">ASM ${String(assemblyIndex + 1).padStart(2, "0")}</i><strong>${esc(assembly.id)}</strong><small>${esc(assembly.label)}</small></span><b>${assembly.nodes.length} blocs · ${assembly.blockRefs?.length || assembly.nodes.length} références</b></summary><div class="block-registry-grid">${assembly.nodes.map((instance) => concreteBlockCard(instance, profiles[assembly.key] || profiles.classic, concreteOrdinals.get(instance.instanceId))).join("")}</div></details>`).join("")}</div>
      </section>
      <footer class="block-fallback-note"><strong>Des preuves, pas des personas.</strong><span>Le tool ne voit que les <code>switchIntent</code> neutres. Le moteur part d’un bloc existant, applique sa variante de copy, puis l’insère ou le remonte dans l’assemblage actif.</span><b>${switchableBlocks.length} variantes switch</b></footer>
    </div>`;
}

function scenarioCard(seed, profiles, selectedKey, activePreviewKey, ordinal) {
  const profile = profiles[seed.key];
  const assetCount = [profile.hero, ...(profile.sections || [])].filter((node) => node.asset).length;
  const sectionCount = profile.sections?.length || 0;
  return `
    <button type="button" class="scenario-row ${selectedKey === seed.key ? "active" : ""} ${activePreviewKey === seed.key ? "preview-selected" : ""}" data-scenario-select="${seed.key}" aria-pressed="${activePreviewKey === seed.key}">
      <span class="scenario-code"><i class="registry-order">SCN ${String(ordinal).padStart(2, "0")}</i>${seed.code}</span>
      <span class="scenario-name"><strong>${seed.title}</strong><small>${seed.family} · ${label(seed.context)}</small></span>
      <span><strong>${sectionCount}</strong><small>sections</small></span>
      <span><strong>${assetCount}</strong><small>assets liés</small></span>
      <span class="scenario-tags">${seed.tags.slice(0, 3).map((tag) => `<i>${label(tag)}</i>`).join("")}${activePreviewKey === seed.key ? "<em>Dans Preview</em>" : ""}</span>
    </button>`;
}

export function renderScenariosPage(profiles, selectedKey = "p1", activeFamily = "Tous", analytics = {}, activePreviewKey = "classic") {
  const families = ["Tous", ...new Set(scenarioSeeds.map((seed) => seed.family))];
  const selected = scenarioSeeds.find((seed) => seed.key === selectedKey) || scenarioSeeds[0];
  const activeScenarioIndex = Math.max(0, scenarioSeeds.findIndex((seed) => seed.key === activePreviewKey));
  const scenarioPosition = `${String(activeScenarioIndex + 1).padStart(2, "0")} / ${String(scenarioSeeds.length).padStart(2, "0")}`;
  const profile = profiles[selected.key];
  const filtered = activeFamily === "Tous" ? scenarioSeeds : scenarioSeeds.filter((seed) => seed.family === activeFamily);
  const observations = Object.values(analytics);
  const demandFor = (context) => observations.filter((entry) => entry.parts?.[0] === context).reduce((total, entry) => total + entry.count, 0);
  const orderedGaps = [...gapCandidates].sort((a, b) => demandFor(b.context) - demandFor(a.context));
  return `
    <div class="system-page scenarios-page">
      ${systemPipeline("scenarios")}
      <header class="system-lead compact">
        <p>SCENARIO FOREST / ${scenarioSeeds.length} EDITED</p>
        <h2>Des scénarios de référence,<br>pas des personas figés.</h2>
        <div class="system-lead-copy"><p>Les noms historiques sont conservés dans les données, mais l’expérience est désormais décrite par son travail : compatibilité, cadeau, preuve, projection ou urgence.</p></div>
      </header>
      <section class="scenario-coverage">
        <div><strong>${scenarioSeeds.length} / ${number(potentialScenarioCount)}</strong><span>scénarios édités / signatures possibles</span></div>
        <div class="coverage-bar"><i style="width:${Math.max(1.5, scenarioSeeds.length / potentialScenarioCount * 100)}%"></i></div>
        <p>Le reste utilise le voisin le plus proche. Les analytics déterminent quelles combinaisons méritent ensuite un scénario dédié.</p>
      </section>
      <section class="scenario-preview-state">
        <div class="scenario-preview-copy">
          <span>PREVIEW ACTIVE</span>
          <strong>${activePreviewKey === "classic" ? "Site classique" : `${profiles[activePreviewKey]?.name} · ${profiles[activePreviewKey]?.title}`}</strong>
          <small>La sélection est maintenant partagée avec MCP State et Preview.</small>
        </div>
        <div class="scenario-preview-actions">
          <button type="button" class="scenario-step" data-scenario-step="-1" aria-label="Scénario précédent">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 3.5 6 8l4.5 4.5"/></svg><span>Précédent</span>
          </button>
          <output class="scenario-position" aria-live="polite">${scenarioPosition}</output>
          <button type="button" class="scenario-step" data-scenario-step="1" aria-label="Scénario suivant">
            <span>Suivant</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 3.5 10 8l-4.5 4.5"/></svg>
          </button>
          <button type="button" data-scenario-random>Aléatoire</button>
          <button type="button" data-view="mcp">Inspecter MCP State</button>
          <button type="button" data-view="preview">Ouvrir Preview</button>
          <button type="button" class="scenario-reset" data-scenario-reset ${activePreviewKey === "classic" ? "disabled" : ""}>Reset</button>
        </div>
      </section>
      <div class="scenario-family-filter">
        ${families.map((family) => `<button type="button" data-scenario-family="${family}" class="${family === activeFamily ? "active" : ""}">${family}</button>`).join("")}
      </div>
      <div class="scenario-workbench">
        <div class="scenario-list">${filtered.map((seed) => scenarioCard(seed, profiles, selected.key, activePreviewKey, scenarioSeeds.indexOf(seed) + 1)).join("")}</div>
        <aside class="scenario-inspector">
          <span>${selected.code}</span>
          <h3>${selected.title}</h3>
          <div class="scenario-assembly-link"><small>ASSEMBLAGE ASSOCIÉ</small><strong>ASM-${selected.code}</strong><button type="button" data-view="assemblies" data-assembly-target="${selected.key}">Voir le détail</button></div>
          <dl>
            <div><dt>Contexte</dt><dd>${label(selected.context)}</dd></div>
            <div><dt>Achat</dt><dd>${label(selected.buyingFor)}</dd></div>
            <div><dt>Décision</dt><dd>${label(selected.decision)}</dd></div>
            <div><dt>Projection</dt><dd>${label(selected.projection)}</dd></div>
            <div><dt>Langage</dt><dd>${label(selected.content)}</dd></div>
            <div><dt>Âge seed</dt><dd>${label(selected.ageGroup)}</dd></div>
            <div><dt>Genre seed</dt><dd>${label(selected.genderRepresentation)}</dd></div>
            <div><dt>Coloris seed</dt><dd>${label(selected.color)}</dd></div>
          </dl>
          <div class="system-tags">${selected.tags.map((tag) => `<span>${label(tag)}</span>`).join("")}</div>
          <ol class="assembly-sequence">
            <li><b>${profile.hero.id}</b><span>${profile.hero.label}</span></li>
            ${profile.sections.map((section) => `<li><b>${section.id}</b><span>${section.label}</span></li>`).join("")}
          </ol>
          <button type="button" class="system-primary" data-open-preview="${selected.key}">Ouvrir dans Preview</button>
        </aside>
      </div>
      <section class="gap-queue">
        <header><div><span>NEXT-BEST SCENARIOS · ${observations.reduce((total, entry) => total + entry.count, 0)} OBSERVATIONS</span><h3>Trous classés par demandes réelles</h3></div><strong>${gapCandidates.length}</strong></header>
        ${orderedGaps.map((gap, index) => `<div><b>${String(index + 1).padStart(2, "0")}</b><strong>${gap.label}</strong><span>${gap.demand}</span><i>${demandFor(gap.context)} demande${demandFor(gap.context) > 1 ? "s" : ""}</i></div>`).join("")}
      </section>
    </div>`;
}

function compactValue(value) {
  if (typeof value === "boolean") return value ? "oui" : "non";
  if (Array.isArray(value)) return `${value.length} élément${value.length > 1 ? "s" : ""}`;
  if (value && typeof value === "object") return `${Object.keys(value).length} champs structurés`;
  const text = String(value ?? "");
  return text.length > 190 ? `${text.slice(0, 187)}…` : text;
}

function renderAssemblyInstance(instance, index) {
  const fields = editableFieldsFor(instance).filter((field) => Object.hasOwn(instance.props || {}, field.key));
  const assets = assetUsageForAssembly({ nodes: [instance] });
  const reviews = contentUsageForAssembly({ nodes: [instance] });
  return `
    <details class="assembly-instance-card" open>
      <summary>
        <b>${String(index + 1).padStart(2, "0")}</b>
        <span><strong>${esc(instance.templateId)}</strong><small>${esc(instance.blockId || "block.product-overview")} · ${esc(instance.instanceId)} · ${esc(instance.type)}</small></span>
        <i>${fields.length} champs</i><i>${assets.length} image${assets.length > 1 ? "s" : ""}</i><i>${reviews.length} avis</i>
      </summary>
      <div class="assembly-instance-content">
        <section>
          <header><strong>Copy / props</strong><span>${fields.length}</span></header>
          <dl>${fields.length ? fields.map((field) => `<div><dt>${esc(field.label)}</dt><dd>${esc(compactValue(instance.props[field.key]))}</dd></div>`).join("") : "<p>Aucun copy propre : le layout utilise ses valeurs par défaut.</p>"}</dl>
        </section>
        <section>
          <header><strong>Images liées</strong><span>${assets.length}</span></header>
          <div class="assembly-instance-assets">${assets.length ? assets.map((usage) => `<figure><img src="${esc(usage.asset.path)}" alt=""><figcaption><b>${esc(usage.slot)}</b><span>${esc(usage.assetId)}</span></figcaption></figure>`).join("") : "<p>Aucune image liée à cette instance.</p>"}</div>
        </section>
        <section>
          <header><strong>Avis liés</strong><span>${reviews.length}</span></header>
          <div class="assembly-instance-reviews">${reviews.length ? reviews.map((usage) => `<article><span>${esc(usage.slot)} · ${esc(usage.reviewId)}</span><blockquote>« ${esc(usage.review?.body || "Référence introuvable")} »</blockquote><small>${esc(reviewSourceLabels[usage.review?.source] || usage.review?.source || "inconnu")}</small></article>`).join("") : "<p>Aucun avis lié à cette instance.</p>"}</div>
        </section>
      </div>
    </details>`;
}

function renderGroupedAssemblyContent(instances, assets, reviews) {
  const copy = instances.flatMap((instance) => editableFieldsFor(instance)
    .filter((field) => Object.hasOwn(instance.props || {}, field.key))
    .map((field) => ({ instance, field, value: compactValue(instance.props[field.key]) })));
  return `
    <section class="assembly-grouped-content">
      <header><strong>01 · Contenu groupé</strong><span>${copy.length + assets.length + reviews.length}</span></header>
      <div class="assembly-grouped-grid">
        <section><header><strong>Copy</strong><span>${copy.length}</span></header><div class="assembly-copy-list">${copy.length ? copy.map((entry) => `<article><span>${esc(entry.instance.templateId)} · ${esc(entry.field.label)}</span><p>${esc(entry.value)}</p></article>`).join("") : "<p>Aucun copy injecté.</p>"}</div></section>
        <section><header><strong>Assets</strong><span>${assets.length}</span></header><div class="assembly-asset-list">${assets.length ? assets.map((usage) => `<figure><img src="${esc(usage.asset.path)}" alt=""><figcaption><b>${esc(usage.assetId)}</b><small>${esc(usage.templateId)} · ${esc(usage.slot)}</small></figcaption></figure>`).join("") : "<p>Aucun asset lié.</p>"}</div></section>
        <section><header><strong>Avis</strong><span>${reviews.length}</span></header><div class="assembly-review-list">${reviews.length ? reviews.map((usage) => `<article><span>${esc(usage.templateId)} · ${esc(usage.reviewId)}</span><blockquote>« ${esc(usage.review?.body || "Référence introuvable")} »</blockquote><small>${esc(reviewSourceLabels[usage.review?.source] || usage.review?.source || "inconnu")}</small></article>`).join("") : "<p>Aucun avis lié.</p>"}</div></section>
      </div>
    </section>`;
}

export function renderAssembliesPage(profiles, selectedKey = "p1", brand = { name: "PORT 70" }, assemblies = {}, inspectorView = "layouts") {
  const assemblyEntries = Object.values(assemblies).filter((assembly) => assembly.key !== "classic");
  const selectedAssembly = assemblies[selectedKey] || assemblies.p1 || assemblyEntries[0];
  const selected = scenarioSeeds.find((seed) => seed.key === selectedAssembly?.key);
  const selectedInstances = selectedAssembly?.nodes || [];
  const selectedAssets = selectedAssembly ? assetUsageForAssembly(selectedAssembly) : [];
  const selectedReviews = selectedAssembly ? contentUsageForAssembly(selectedAssembly) : [];
  const associatedCount = assemblyEntries.filter((assembly) => scenarioSeeds.some((seed) => seed.key === assembly.key)).length;
  return `
    <div class="system-page assemblies-page">
      ${systemPipeline("assemblies")}
      <header class="system-lead compact">
        <p>ASSEMBLY LEDGER / ${assemblyEntries.length} ASSEMBLAGES / ${associatedCount} ASSOCIÉS</p>
        <h2>Ce qui est réellement assemblé.</h2>
        <div class="system-lead-copy"><p>Chaque ligne instancie un bloc générique, puis lui applique ses propres props, images et avis liés par ID. Un nouvel assemblage peut partir d’une copie, puis être modifié avant d’être associé à un scénario.</p><button type="button" class="system-inline-action" data-create-assembly>+ Nouvel assemblage depuis la sélection</button></div>
      </header>
      <section class="assembly-explainer">
        <div><span>01</span><strong>Blocs</strong><small>Intention + layout source</small></div><i>+</i>
        <div><span>02</span><strong>Copy</strong><small>Titres, preuves, CTA</small></div><i>+</i>
        <div><span>03</span><strong>Assets</strong><small>Images et avis liés</small></div><i>→</i>
        <div class="result"><span>04</span><strong>Assemblage</strong><small>Ordre + variantes locales</small></div>
      </section>
      <div class="assembly-workbench">
        <div class="assembly-table">
          <div class="assembly-head"><span>ID</span><span>Hero</span><span>Ordre des sections</span><span>Assets</span><span>Variations</span></div>
          ${assemblyEntries.map((assembly, assemblyIndex) => {
            const seed = scenarioSeeds.find((candidate) => candidate.key === assembly.key);
            const assets = assetUsageForAssembly(assembly).length;
            return `<button type="button" class="assembly-row ${assembly.key === selectedAssembly?.key ? "active" : ""} ${seed ? "" : "draft"}" data-assembly-select="${assembly.key}">
              <span><i class="registry-order">ASM ${String(assemblyIndex + 1).padStart(2, "0")}</i><strong>${assembly.id}</strong><small>${seed?.title || `${assembly.label} · brouillon de session`}</small></span>
              <span><b>${assembly.nodes[0]?.layoutId || "—"}</b><small>${assembly.nodes[0]?.blockId || assembly.nodes[0]?.layoutVariant || "vide"}</small></span>
              <span class="assembly-flow">${assembly.nodes.slice(1).map((section) => `<i title="${esc(section.blockId || "")}">${section.blockId?.replace("block.", "") || section.layoutId}</i>`).join("<em>→</em>")}</span>
              <span><strong>${assets}</strong><small>liés</small></span>
              <span><strong>${assembly.variants.length || 0}</strong><small>${seed ? "déclarées" : "draft"}</small></span>
            </button>`;
          }).join("")}
        </div>
        <aside class="assembly-inspector">
          <div class="assembly-inspector-head"><span>ASSEMBLAGE SÉLECTIONNÉ</span><h3>${selectedAssembly?.id}</h3><p>${selected ? `Associé à <b>${selected.title}</b>` : "<b>Non associé</b> · brouillon de session"} · marque <b data-brand-name>${esc(brand.name)}</b></p><div class="assembly-binding-summary"><span>${selectedInstances.length} instances</span><span>${selectedAssets.length} images</span><span>${selectedReviews.length} avis</span></div></div>
          <nav class="assembly-inspector-tabs" aria-label="Vue du détail de l’assemblage">
            <button type="button" data-assembly-inspector-view="layouts" class="${inspectorView === "layouts" ? "active" : ""}" aria-pressed="${inspectorView === "layouts"}">Par layout</button>
            <button type="button" data-assembly-inspector-view="content" class="${inspectorView === "content" ? "active" : ""}" aria-pressed="${inspectorView === "content"}">Contenu groupé</button>
          </nav>
          ${inspectorView === "layouts"
            ? `<section class="assembly-instance-section"><header><strong>01 · Instances + contenu lié</strong><span>${selectedInstances.length}</span></header><div class="assembly-instance-stack">${selectedInstances.map(renderAssemblyInstance).join("")}</div></section>`
            : renderGroupedAssemblyContent(selectedInstances, selectedAssets, selectedReviews)}
          <section class="assembly-variants"><header><strong>02 · Variantes déclarées</strong><span>${selectedAssembly?.variants.length || 0}</span></header><div class="system-tags">${(selectedAssembly?.variants || []).map((variant) => `<span>${esc(variant.label)}</span>`).join("")}</div><p>Une variante peut patcher les props, les références d’images ou d’avis, retirer, ajouter ou déplacer une instance sans recopier l’assemblage.</p></section>
          ${selected ? `<button type="button" class="system-primary" data-open-preview="${selected.key}">Ouvrir cet assemblage dans Preview</button>` : '<button type="button" class="system-primary" disabled>Associer à un scénario avant Preview</button>'}
        </aside>
      </div>
    </div>`;
}
