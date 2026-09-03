const heroDefinitions = [
  {
    id: "hero.product-overview",
    role: "hero",
    purpose: "product_overview",
    label: "Présentation produit",
    description: "Présente le Passage 32, son prix, ses preuves et le choix de coloris.",
    sourceProfile: "classic",
    sourceVariant: "classic",
    tags: ["product", "overview", "default"],
  },
  {
    id: "hero.compare-models",
    role: "hero",
    purpose: "compare_models",
    label: "Comparateur de formats",
    description: "Compare immédiatement les quatre volumes Passage et met en avant le choix recommandé.",
    sourceProfile: "p6",
    sourceVariant: "price",
    props: {
      label: "Comparer les formats",
      kicker: "24 L · 32 L · 36 L · 42 L",
      title: "Quatre formats, un choix plus simple.",
      body: "Comparez le volume, le prix et l’usage de chaque format. Le Passage 32 reste recommandé pour deux à trois jours.",
      cta: "Acheter le format recommandé · 149 €",
      bundle: null,
    },
    tags: ["comparison", "models", "volume", "price"],
  },
  {
    id: "hero.compare-prices",
    role: "hero",
    purpose: "compare_prices",
    label: "Comparateur de prix",
    description: "Situe le produit entre une option moins chère et des formats plus complets.",
    sourceProfile: "p6",
    sourceVariant: "price",
    props: {
      label: "Comparer les prix",
      kicker: "À partir de 119 €",
      title: "Le bon prix, avec les compromis visibles.",
      body: "Quatre options comparables, du format le plus léger au plus généreux.",
      cta: "Acheter le meilleur compromis · 149 €",
      bundle: null,
    },
    tags: ["comparison", "price", "value"],
  },
  {
    id: "hero.airline-fit",
    role: "hero",
    purpose: "airline_compatibility",
    label: "Compatibilité compagnie",
    description: "Met la dimension cabine et la compagnie au premier plan.",
    sourceProfile: "p1",
    sourceVariant: "airline",
    props: {
      label: "Compatibilité cabine",
      kicker: "Dimensions vérifiées",
      title: "Le format cabine, vérifié avant le départ.",
      body: "Les dimensions du sac sont comparées à la règle du billet sélectionné.",
      cta: "Acheter pour ce trajet",
    },
    tags: ["airline", "compatibility", "dimensions"],
  },
  {
    id: "hero.gift",
    role: "hero",
    purpose: "gift_reassurance",
    label: "Cadeau rassurant",
    description: "Rend visibles livraison, échange et présentation cadeau.",
    sourceProfile: "p2",
    sourceVariant: "gift",
    props: {
      kicker: "Prêt à offrir",
      title: "Un cadeau juste, même sans tout deviner.",
      body: "La date, la carte et les conditions d’échange sont confirmées avant l’achat.",
      cta: "Acheter ce cadeau",
    },
    tags: ["gift", "delivery", "returns", "reassurance"],
  },
  {
    id: "hero.material-quality",
    role: "hero",
    purpose: "material_quality",
    label: "Qualité matière",
    description: "Cadre le produit par sa matière, sa tenue et sa durabilité.",
    sourceProfile: "p3",
    sourceVariant: "premium",
    props: {
      kicker: "Toile technique · structure renforcée",
      title: "Une matière qui garde sa ligne.",
      body: "La densité de la toile, les coutures et les zones sollicitées deviennent les preuves principales.",
      cta: "Acheter pour sa qualité",
      media: "Macro de la toile technique et de la couture renforcée",
      asset: "./assets/products/72h-black/05-macro-fabric-seam.png",
      assetCaption: "TOILE TECHNIQUE / TISSAGE / COUTURE RENFORCÉE",
      colorAssets: {
        black: "./assets/products/72h-black/05-macro-fabric-seam.png",
        cream: "./assets/materials/cream-ecru.png",
        "liberty-blue": "./assets/materials/liberty-blue.png",
        "liberty-burgundy": "./assets/materials/liberty-burgundy.png",
      },
    },
    tags: ["material", "quality", "durability", "premium"],
  },
  {
    id: "hero.urgent-delivery",
    role: "hero",
    purpose: "urgent_delivery",
    label: "Livraison urgente",
    description: "Présente les options de retrait ou de livraison avant l’achat.",
    sourceProfile: "p15",
    sourceVariant: "delivery",
    tags: ["delivery", "urgent", "pickup"],
  },
];

const contentDefinitions = [
  {
    id: "block.model-comparison",
    role: "section",
    purpose: "model_comparison",
    label: "Comparaison des formats",
    description: "Tableau pragmatique des quatre volumes, prix et usages.",
    sourceProfile: "classic",
    sourceVariant: "product-grid",
    props: { title: "Choisir le bon format.", body: "Volume, prix et usage : les différences utiles en un regard." },
    tags: ["comparison", "models", "volume", "images"],
  },
  {
    id: "block.technical-comparison",
    role: "section",
    purpose: "technical_comparison",
    label: "Comparaison technique",
    description: "Compare poids, volume, matière et prix dans un tableau rationnel.",
    sourceProfile: "p11",
    sourceVariant: "comparison",
    tags: ["comparison", "technical", "specifications"],
  },
  {
    id: "block.price-comparison",
    role: "section",
    purpose: "price_comparison",
    label: "Comparaison de valeur",
    description: "Compare le coût et les compromis plutôt que d’afficher une remise seule.",
    sourceProfile: "p6",
    sourceVariant: "before-after",
    props: { title: "Ce que le prix change vraiment." },
    tags: ["comparison", "price", "value"],
  },
  {
    id: "block.airline-compatibility",
    role: "section",
    purpose: "airline_compatibility",
    label: "Compatibilité compagnies",
    description: "Compare les dimensions du sac aux règles des compagnies connues.",
    sourceProfile: "p1",
    sourceVariant: "airline-compare",
    props: { title: "Les dimensions vérifiées avant votre départ." },
    tags: ["airline", "compatibility", "dimensions"],
  },
  {
    id: "block.weather-proof",
    role: "section",
    purpose: "weather_proof",
    label: "Protection météo",
    description: "Montre le comportement de la toile sous une pluie légère et ses limites.",
    sourceProfile: "p9",
    sourceVariant: "split",
    sourceTitle: "La pluie reste à la surface.",
    tags: ["rain", "weather", "material"],
  },
  {
    id: "block.durability-proof",
    role: "section",
    purpose: "durability_proof",
    label: "Solidité mesurée",
    description: "Rassemble les métriques de structure et de résistance.",
    sourceProfile: "p9",
    sourceVariant: "metrics",
    tags: ["durability", "technical", "proof"],
  },
  {
    id: "block.customer-reviews",
    role: "section",
    purpose: "customer_reviews",
    label: "Avis clients ciblés",
    description: "Affiche les avis les plus proches de l’usage discuté.",
    sourceProfile: "p11",
    sourceVariant: "reviews",
    props: { title: "Les retours qui répondent à la même question." },
    tags: ["reviews", "trust", "social-proof"],
  },
  {
    id: "block.customer-rating",
    role: "section",
    purpose: "customer_rating",
    label: "Note client documentée",
    description: "Présente la note des avis sélectionnés, leur volume et leurs sources sans inventer de note globale.",
    sourceProfile: "classic",
    sourceVariant: "reviews",
    props: { variant: "customer-evidence", evidenceFocus: "overall", title: "Ce que disent les clients." },
    tags: ["reviews", "rating", "sources", "trust"],
  },
  {
    id: "block.customer-context",
    role: "section",
    purpose: "customer_context",
    label: "Avis d’usages comparables",
    description: "Sélectionne des retours proches du trajet, de l’usage ou de la contrainte exprimée.",
    sourceProfile: "p11",
    sourceVariant: "reviews",
    props: { variant: "customer-evidence", evidenceFocus: "similar_use", title: "Des retours proches de votre usage." },
    tags: ["reviews", "context", "similar-use", "trust"],
  },
  {
    id: "block.customer-long-term",
    role: "section",
    purpose: "customer_long_term",
    label: "Avis après plusieurs mois",
    description: "Fait remonter les retours sur la tenue du sac et ses marques d’usage dans la durée.",
    sourceProfile: "p3",
    sourceVariant: "reviews",
    props: { variant: "customer-evidence", evidenceFocus: "long_term", title: "Le produit jugé dans la durée." },
    tags: ["reviews", "long-term", "durability", "trust"],
  },
  {
    id: "block.customer-balanced",
    role: "section",
    purpose: "customer_balanced",
    label: "Retours clients nuancés",
    description: "Conserve les limites, les notes inférieures à cinq et les motifs de retour utiles à la décision.",
    sourceProfile: "p13",
    sourceVariant: "reviews",
    props: { variant: "customer-evidence", evidenceFocus: "balanced", title: "Ce qui plaît — et ce qui plaît moins." },
    tags: ["reviews", "balanced", "returns", "trust"],
  },
  {
    id: "block.customer-color",
    role: "section",
    purpose: "customer_color",
    label: "Avis liés au coloris",
    description: "Rassemble les retours sur le rendu, l’entretien et la perception du coloris sélectionné.",
    sourceProfile: "p12",
    sourceVariant: "comments",
    props: { variant: "customer-evidence", evidenceFocus: "color", title: "La couleur, vue par ses utilisateurs." },
    tags: ["reviews", "color", "care", "trust"],
  },
  {
    id: "block.gift-reassurance",
    role: "section",
    purpose: "gift_reassurance",
    label: "Réassurance cadeau",
    description: "Explique l’échange, le prix masqué et la carte cadeau.",
    sourceProfile: "p2",
    sourceVariant: "gift-reassurance",
    tags: ["gift", "returns", "delivery"],
  },
  {
    id: "block.returns-warranty",
    role: "section",
    purpose: "returns_warranty",
    label: "Retours et garantie",
    description: "Répond de façon neutre aux questions sur les retours, la garantie et le paiement.",
    sourceProfile: "classic",
    sourceVariant: "trust",
    props: { title: "Acheter sans zone grise." },
    tags: ["returns", "warranty", "payment", "trust"],
  },
  {
    id: "block.organization",
    role: "section",
    purpose: "organization",
    label: "Organisation intérieure",
    description: "Visualise ce qui tient dans le sac et comment le ranger.",
    sourceProfile: "classic",
    sourceVariant: "packing",
    tags: ["packing", "organization", "capacity"],
  },
  {
    id: "block.laptop-access",
    role: "section",
    purpose: "laptop_access",
    label: "Accès ordinateur séparé",
    description: "Montre comment sortir l’ordinateur sans ouvrir le compartiment vêtements.",
    sourceProfile: "p22",
    sourceVariant: "packing",
    props: {
      id: "S25",
      variant: "laptop-access",
      label: "Laptop access",
      eyebrow: "SECURITY ACCESS / ONE MOTION",
      title: "Laptop out. Clothing compartment closed.",
      body: "Open the dedicated rear access, lift the 16-inch laptop, and keep the three-day load untouched.",
      media: null,
      asset: null,
      assetCaption: null,
      colorAssets: null,
      steps: [
        { number: "01", label: "Open laptop access", note: "Dedicated rear zip" },
        { number: "02", label: "Lift 16-inch laptop", note: "One direct motion" },
        { number: "03", label: "Main volume stays closed", note: "Clothing remains packed" },
      ],
      proofs: ["Separate access", "Suspended sleeve", "Clothes remain packed"],
    },
    tags: ["laptop", "security", "access", "business", "organization"],
  },
  {
    id: "block.delivery",
    role: "section",
    purpose: "delivery",
    label: "Livraison et retrait",
    description: "Présente une chronologie de livraison ou de retrait vérifiable.",
    sourceProfile: "p15",
    sourceVariant: "timeline",
    tags: ["delivery", "timeline", "certainty"],
  },
  {
    id: "block.material-quality",
    role: "section",
    purpose: "material_quality",
    label: "Matière et construction",
    description: "Détaille toile, coutures, structure et réparabilité.",
    sourceProfile: "p3",
    sourceVariant: "split",
    sourceTitle: "Une toile dense qui garde sa ligne.",
    tags: ["material", "quality", "construction"],
  },
  {
    id: "block.editorial-story",
    role: "section",
    purpose: "editorial_story",
    label: "Projection éditoriale",
    description: "Projette le produit dans un trajet ou un usage réel avec une courte narration.",
    sourceProfile: "p7",
    sourceVariant: "journal",
    tags: ["editorial", "projection", "travel"],
  },
  {
    id: "block.product-overview",
    role: "section",
    purpose: "product_overview",
    label: "Arguments essentiels",
    description: "Bloc de repli universel : volume, poids, matière et usage sans contexte imposé.",
    sourceProfile: "classic",
    sourceVariant: "cards",
    tags: ["product", "overview", "fallback"],
  },
];

const coreBlockIds = new Set(["hero.product-overview", "hero.gift", "block.gift-reassurance", "block.editorial-story", "block.product-overview"]);

const shopperQuestions = {
  "hero.compare-models": "Quels sont les autres formats ?",
  "hero.compare-prices": "Quelle option offre le meilleur rapport qualité-prix ?",
  "hero.airline-fit": "Est-ce que ce sac convient à ma compagnie ?",
  "hero.material-quality": "Est-ce vraiment solide et qualitatif ?",
  "hero.urgent-delivery": "Puis-je l’avoir à temps ?",
  "block.model-comparison": "Je peux comparer les quatre formats ?",
  "block.technical-comparison": "Quelles différences de poids, volume, matière et prix ?",
  "block.price-comparison": "Est-ce rentable par rapport aux frais de bagage ?",
  "block.airline-compatibility": "Passe-t-il avec les règles de ma compagnie ?",
  "block.weather-proof": "Résiste-t-il à la pluie ?",
  "block.durability-proof": "Est-il vraiment solide ?",
  "block.customer-reviews": "Qu’en disent les personnes avec le même usage ?",
  "block.customer-rating": "Quelle note donnent réellement les clients ?",
  "block.customer-context": "Qu’en disent les personnes avec un usage comparable ?",
  "block.customer-long-term": "Comment le sac vieillit-il après plusieurs mois ?",
  "block.customer-balanced": "Quels sont aussi les défauts et motifs de retour ?",
  "block.customer-color": "Que disent les clients de ce coloris ?",
  "block.returns-warranty": "Comment fonctionnent les retours et la garantie ?",
  "block.organization": "Qu’est-ce qui rentre dedans ?",
  "block.laptop-access": "Puis-je sortir l’ordinateur sans ouvrir les vêtements ?",
  "block.delivery": "Quand puis-je le recevoir ?",
  "block.material-quality": "Comment est-il fabriqué ?",
};

function argumentTypeFor(block) {
  if (coreBlockIds.has(block.id)) return block.id === "block.editorial-story" ? "projection" : "foundation";
  if (block.purpose.startsWith("customer_") || ["gift_reassurance", "returns_warranty"].includes(block.purpose)) return "trust";
  if (["organization", "laptop_access", "delivery", "urgent_delivery"].includes(block.purpose)) return "operational";
  return "rational";
}

export const blockRegistry = Object.freeze([...heroDefinitions, ...contentDefinitions].map((block) => Object.freeze({
  ...block,
  usage: coreBlockIds.has(block.id) ? "core" : "switchable",
  argumentType: argumentTypeFor(block),
  shopperQuestion: shopperQuestions[block.id] || null,
  assemblyReady: true,
})));
export const heroBlocks = Object.freeze(blockRegistry.filter((block) => block.role === "hero"));
export const sectionBlocks = Object.freeze(blockRegistry.filter((block) => block.role === "section"));
export const contentBlocks = sectionBlocks;
export const coreBlocks = Object.freeze(blockRegistry.filter((block) => block.usage === "core"));
export const switchableBlocks = Object.freeze(blockRegistry.filter((block) => block.usage === "switchable"));
export const heroBlockPurposes = Object.freeze(heroBlocks.filter((block) => block.usage === "switchable").map((block) => block.purpose));
export const contentBlockPurposes = Object.freeze(sectionBlocks.filter((block) => block.usage === "switchable").map((block) => block.purpose));

const byId = new Map(blockRegistry.map((block) => [block.id, block]));

export function getBlockDefinition(id) {
  return byId.get(id) || null;
}

export function findBlockByPurpose(role, purpose) {
  const candidates = role === "hero" ? heroBlocks : sectionBlocks;
  return candidates.find((block) => block.purpose === purpose)
    || candidates.find((block) => block.purpose === "product_overview")
    || candidates[0];
}

export function inferBlockForNode(node = {}) {
  if (node.templateBlockId && byId.has(node.templateBlockId)) return byId.get(node.templateBlockId);
  if (node.blockId && byId.has(node.blockId)) return byId.get(node.blockId);
  const role = node.type === "hero" || String(node.id || "").startsWith("H") ? "hero" : "section";
  const candidates = role === "hero" ? heroBlocks : sectionBlocks;
  return candidates.find((block) => block.sourceVariant === node.variant && (!block.sourceTitle || block.sourceTitle === node.title))
    || findBlockByPurpose(role, "product_overview");
}

export function instantiateBlock(blockOrId, profiles) {
  const block = typeof blockOrId === "string" ? getBlockDefinition(blockOrId) : blockOrId;
  const fallback = findBlockByPurpose(block?.role || "content", "product_overview");
  const definition = block || fallback;
  const profile = profiles[definition.sourceProfile] || profiles.classic;
  const candidates = definition.role === "hero" ? [profile.hero] : (profile.sections || []);
  const source = candidates.find((node) => node.variant === definition.sourceVariant && (!definition.sourceTitle || node.title === definition.sourceTitle))
    || candidates[0]
    || profiles.classic.sections[0];
  return {
    ...structuredClone(source),
    ...structuredClone(definition.props || {}),
    blockId: definition.id,
    templateBlockId: definition.id,
    blockPurpose: definition.purpose,
  };
}

export function blockPurposeList(role) {
  const candidates = (role === "hero" ? heroBlocks : sectionBlocks).filter((block) => block.usage === "switchable");
  return candidates.map((block) => `${block.purpose} — answers “${block.shopperQuestion}” with ${block.label}`).join("; ");
}
