export const navigationAnchors = Object.freeze([
  { id: "overview", label: "Vue d’ensemble" },
  { id: "recommendation", label: "Recommandation" },
  { id: "colors", label: "Coloris" },
  { id: "bundle", label: "Bundle" },
  { id: "dimensions", label: "Dimensions" },
  { id: "organization", label: "Organisation" },
  { id: "materials", label: "Matières" },
  { id: "airline_compatibility", label: "Compatibilité aérienne" },
  { id: "delivery", label: "Livraison" },
  { id: "comparison", label: "Comparaison" },
  { id: "reviews", label: "Avis" },
  { id: "warranty", label: "Garantie" },
  { id: "faq", label: "Questions fréquentes" },
  { id: "purchase", label: "Achat" },
]);

const variantAnchors = Object.freeze({
  table: ["dimensions"],
  "airline-compare": ["airline_compatibility", "dimensions"],
  "airline-card": ["airline_compatibility", "dimensions"],
  packing: ["organization"],
  "loadout-switch": ["organization"],
  cards: ["organization"],
  hotspots: ["organization"],
  metrics: ["materials"],
  material: ["materials"],
  timeline: ["delivery"],
  delivery: ["delivery"],
  comparison: ["comparison"],
  "product-grid": ["comparison"],
  "before-after": ["comparison"],
  reviews: ["reviews"],
  comments: ["reviews"],
  "customer-evidence": ["reviews"],
  "photo-proof": ["reviews"],
  "commute-proof": ["reviews"],
  trust: ["warranty"],
  warranty: ["warranty"],
  faq: ["faq"],
  final: ["purchase"],
});

const keywordAnchors = [
  [["cabine", "compagnie", "ryanair", "easyjet", "air france", "avion"], "airline_compatibility"],
  [["dimension", "format", "volume", "litre", "poids"], "dimensions"],
  [["matière", "toile", "tissu", "solid", "résistan", "couture"], "materials"],
  [["livraison", "recevoir", "délai"], "delivery"],
  [["avis", "témoign", "étoile", "client"], "reviews"],
  [["garantie", "retour", "échange"], "warranty"],
  [["question", "réponse", "faq"], "faq"],
  [["compar", "choisir", "modèle"], "comparison"],
  [["rangement", "organis", "compartiment", "charger"], "organization"],
];

export function anchorsForNode(node = {}, kind = "section") {
  if (kind === "hero") return ["overview", "recommendation", "colors", "bundle", "purchase"];
  const anchors = new Set(variantAnchors[node.variant] || []);
  const haystack = [node.id, node.label, node.title, node.body, node.copy, node.variant]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("fr");
  keywordAnchors.forEach(([keywords, anchor]) => {
    if (keywords.some((keyword) => haystack.includes(keyword))) anchors.add(anchor);
  });
  if (node.id === "CTA") anchors.add("purchase");
  return [...anchors];
}

export function attachNavigationAnchors(markup, anchors = []) {
  if (!anchors.length) return markup;
  return markup.replace(/<(section|article|div)(\s)/, `<$1 data-prsim-anchor="${anchors.join(" ")}"$2`);
}

export function availableAnchorsForProfile(profile) {
  if (!profile) return [];
  const available = new Set(anchorsForNode(profile.hero, "hero"));
  profile.sections?.forEach((section) => anchorsForNode(section).forEach((anchor) => available.add(anchor)));
  return navigationAnchors.filter((anchor) => available.has(anchor.id));
}
