export const colors = ["black", "cream", "liberty-blue", "liberty-burgundy"];

export const colorMerchandisingSpecs = Object.freeze({
  black: {
    label: "Noir",
    age_groups: ["25_34", "35_44", "45_54", "55_64"],
    gender_representations: ["woman", "man", "other"],
    projections: ["discreet", "professional", "premium", "practical"],
    product_expressions: ["discreet", "balanced"],
    contexts: ["office", "sport", "rail_business", "photography", "cycling_commute"],
    tones: ["restrained", "serious", "energetic"],
    evidence: { source: "merchant_authored_hypothesis", confidence: "prototype", use: "creative_tie_breaker_only" },
  },
  cream: {
    label: "Crème",
    age_groups: ["18_24", "25_34", "35_44", "45_54", "55_64", "65_plus"],
    gender_representations: ["woman", "man", "other"],
    projections: ["discreet", "photogenic", "responsible", "practical"],
    product_expressions: ["discreet", "balanced"],
    contexts: ["office", "sport", "rail_leisure", "short_city_trip", "family_trip"],
    tones: ["restrained", "warm", "reassuring"],
    evidence: { source: "merchant_authored_hypothesis", confidence: "prototype", use: "creative_tie_breaker_only" },
  },
  "liberty-blue": {
    label: "Liberty bleu",
    age_groups: ["18_24", "25_34", "35_44"],
    gender_representations: ["woman", "man", "other"],
    projections: ["photogenic", "expressive", "responsible"],
    product_expressions: ["balanced", "statement"],
    contexts: ["sport", "study", "cycling_commute", "short_city_trip", "walking_city"],
    tones: ["warm", "joyful", "energetic"],
    evidence: { source: "merchant_authored_hypothesis", confidence: "prototype", use: "creative_tie_breaker_only" },
  },
  "liberty-burgundy": {
    label: "Liberty bordeaux",
    age_groups: ["25_34", "35_44", "45_54", "55_64"],
    gender_representations: ["woman", "man", "other"],
    projections: ["premium", "photogenic", "expressive"],
    product_expressions: ["balanced", "statement"],
    contexts: ["sport", "office", "family_trip", "short_city_trip", "walking_city"],
    tones: ["warm", "joyful", "energetic"],
    evidence: { source: "merchant_authored_hypothesis", confidence: "prototype", use: "creative_tie_breaker_only" },
  },
});

const variantsFor = (productId, price) => colors.map((color) => ({
  id: `${productId}-${color}`,
  product_id: productId,
  color,
  price_eur: price,
  available: true,
  merchandising: colorMerchandisingSpecs[color],
}));

export const products = [
  {
    id: "passage-24",
    title: "Passage 24",
    volume_l: 24,
    price_eur: 119,
    weight_kg: 0.98,
    dimensions_cm: [40, 20, 25],
    description: "Le format personnel compact, pensé pour passer sous le siège.",
    use_cases: ["air_travel", "city_commute"],
    variants: variantsFor("passage-24", 119),
  },
  {
    id: "passage-32",
    title: "Passage 32",
    volume_l: 32,
    price_eur: 149,
    weight_kg: 1.18,
    dimensions_cm: [44, 34, 19],
    description: "Le format cabine polyvalent pour deux à trois jours.",
    use_cases: ["air_travel", "train_travel", "business", "cycling"],
    variants: variantsFor("passage-32", 149),
  },
  {
    id: "passage-36",
    title: "Passage 36",
    volume_l: 36,
    price_eur: 169,
    weight_kg: 1.34,
    dimensions_cm: [50, 36, 20],
    description: "Un peu plus de place pour les voyages prolongés.",
    use_cases: ["train_travel", "long_trip", "digital_nomad"],
    variants: variantsFor("passage-36", 169),
  },
  {
    id: "passage-42",
    title: "Passage 42",
    volume_l: 42,
    price_eur: 189,
    weight_kg: 1.48,
    dimensions_cm: [54, 38, 22],
    description: "Le plus grand Passage pour les trajets sans contrainte sous-siège.",
    use_cases: ["long_trip", "photography"],
    variants: variantsFor("passage-42", 189),
  },
];

export const airlineRules = {
  ryanair: { personal_item: [40, 20, 25], cabin_bag: [55, 40, 20] },
  easyjet: { personal_item: [45, 36, 20], cabin_bag: [56, 45, 25] },
  air_france: { personal_item: [40, 30, 15], cabin_bag: [55, 35, 25] },
  lufthansa: { personal_item: [40, 30, 10], cabin_bag: [55, 40, 23] },
  british_airways: { personal_item: [40, 30, 15], cabin_bag: [56, 45, 25] },
};

export const shopPolicies = {
  delivery: "La livraison standard est offerte. Les créneaux express dépendent du stock local et du code postal.",
  returns: "Les retours et échanges sont acceptés pendant 30 jours après réception.",
  gift: "Les cadeaux sont expédiés sans prix. Le destinataire peut changer de coloris ou recevoir un bon d’achat pendant 30 jours.",
  warranty: "La structure et les défauts de fabrication sont couverts pendant deux ans. L’usure naturelle reste exclue.",
  payment: "Le paiement final doit toujours être confirmé par l’acheteur dans une interface sécurisée.",
  product_care: "Nettoyer la toile à la main avec un chiffon humide. Ne pas passer le sac en machine.",
};

export const productFacts = [
  {
    keys: ["cabine", "siège", "siege", "ryanair", "easyjet", "british airways", "compagnie"],
    answer: "La compatibilité dépend du modèle, de la compagnie et du tarif. Le Passage 24 mesure 40 × 20 × 25 cm ; le Passage 32 mesure 44 × 34 × 19 cm.",
    anchor: "airline_compatibility",
  },
  {
    keys: ["1200", "1 200", "cycle", "abrasion", "test"],
    answer: "Les 1 200 cycles correspondent à un protocole comparatif d’abrasion de surface. C’est une mesure de test, pas une promesse de durée exacte.",
    anchor: "materials",
  },
  {
    keys: ["garantie", "réparer", "reparer", "réparation", "reparation"],
    answer: shopPolicies.warranty,
    anchor: "warranty",
  },
  {
    keys: ["pluie", "eau", "imperméable", "impermeable", "déperlant", "deperlant"],
    answer: "La toile ralentit la pénétration d’une pluie légère. Le sac est déperlant, mais il n’est pas présenté comme totalement étanche sous une exposition longue.",
    anchor: "materials",
  },
  {
    keys: ["poids", "léger", "leger"],
    answer: "Le Passage 24 pèse 980 g à vide et le Passage 32 pèse 1,18 kg à vide.",
    anchor: "dimensions",
  },
  {
    keys: ["bundle", "pack", "module", "organisation"],
    answer: "Le pack organisation ajoute un module compressible assorti pour 20 €. Il reste facultatif et peut être activé ou retiré avant l’achat.",
    anchor: "bundle",
  },
];

export function getProduct(productId = "passage-32") {
  return products.find((product) => product.id === productId) || products[1];
}

export function getVariant(productId = "passage-32", color = "black") {
  const product = getProduct(productId);
  return product.variants.find((variant) => variant.color === color) || product.variants[0];
}
