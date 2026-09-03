import { colorMerchandisingSpecs } from "./shop.js";

export const forestDimensions = {
  contexts: [
    "air_low_cost", "air_standard", "air_business", "rail_business", "rail_leisure",
    "coach_travel", "road_trip", "multimodal", "cycling_commute", "public_transit",
    "walking_city", "office", "study", "short_city_trip", "long_trip", "family_trip",
    "photography", "digital_nomad", "sport",
  ],
  buyingFor: ["self", "gift", "shared", "several_people"],
  decisionStyles: ["rational", "comparative", "cautious", "intuitive", "exploratory"],
  projections: ["discreet", "professional", "premium", "photogenic", "expressive", "adventurous", "practical", "responsible"],
  contentAffinities: ["visual_first", "editorial_story", "technical_detail", "comparison", "customer_proof", "guided_questions", "concise"],
  tones: ["restrained", "serious", "warm", "joyful", "energetic", "reassuring"],
  ageGroups: ["under_18", "18_24", "25_34", "35_44", "45_54", "55_64", "65_plus", "unknown"],
  genderRepresentations: ["woman", "man", "other", "unspecified"],
  colorPreferences: ["black", "cream", "liberty_blue", "liberty_burgundy", "no_preference"],
  languages: ["fr", "en"],
};

export const baseSignatureCount = [
  forestDimensions.contexts,
  forestDimensions.buyingFor,
  forestDimensions.decisionStyles,
  forestDimensions.projections,
  forestDimensions.contentAffinities,
  forestDimensions.tones,
  forestDimensions.ageGroups,
  forestDimensions.genderRepresentations,
  forestDimensions.colorPreferences,
  forestDimensions.languages,
].reduce((total, values) => total * values.length, 1);

export const localVariationTypes = [
  "reviews_proof", "technical_proof", "comparison", "editorial_story",
  "organization_bundle", "repeat_purchase_offer", "urgent_delivery", "weather_protection",
];

// Zero, one or two local section variations can be applied to one base signature.
export const localVariationCombinationCount = 1
  + localVariationTypes.length
  + (localVariationTypes.length * (localVariationTypes.length - 1)) / 2;

export const potentialScenarioCount = baseSignatureCount * localVariationCombinationCount;

export const scenarioSeeds = [
  { key: "p1", code: "AIR-LOWCOST-01", title: "Vol low-cost · contrainte cabine", family: "Voyage", context: "air_low_cost", buyingFor: "self", decision: "rational", projection: "practical", content: "concise", tone: "serious", tags: ["ryanair", "budget", "underseat", "dublin", "rain", "compatibility"] },
  { key: "p2", code: "GIFT-FAMILY-01", title: "Grand-mère · cadeau pour sa petite-fille", family: "Cadeau", context: "short_city_trip", buyingFor: "gift", decision: "cautious", projection: "responsible", content: "customer_proof", tone: "warm", tags: ["gift", "grandmother", "granddaughter", "birthday", "deadline", "delivery", "exchange", "message", "weekend"] },
  { key: "p3", code: "RAIL-BUSINESS-01", title: "Rail business · matière premium", family: "Travail", context: "rail_business", buyingFor: "self", decision: "rational", projection: "premium", content: "technical_detail", tone: "restrained", tags: ["eurostar", "business", "materials", "quality", "black"] },
  { key: "p4", code: "LONGTRIP-01", title: "Long voyage · résistance", family: "Voyage", context: "long_trip", buyingFor: "self", decision: "rational", projection: "adventurous", content: "technical_detail", tone: "energetic", tags: ["backpacking", "coach", "hostel", "capacity", "security"] },
  { key: "p5", code: "RAIL-COMFORT-01", title: "Train loisir · légèreté", family: "Voyage", context: "rail_leisure", buyingFor: "self", decision: "cautious", projection: "practical", content: "concise", tone: "reassuring", tags: ["train", "comfort", "weight", "easy_access", "older_adult"] },
  { key: "p6", code: "AIR-VALUE-01", title: "Vol étudiant · rapport qualité-prix", family: "Comparaison", context: "air_standard", buyingFor: "self", decision: "comparative", projection: "responsible", content: "comparison", tone: "warm", tags: ["easyjet", "erasmus", "budget", "reviews", "price_ladder"] },
  { key: "p7", code: "TRAVEL-EDITORIAL-01", title: "Voyage inspiration · carnet visuel", family: "Inspiration", context: "short_city_trip", buyingFor: "self", decision: "intuitive", projection: "photogenic", content: "editorial_story", tone: "joyful", tags: ["japan", "travel_story", "visual_first", "walking", "cream"] },
  { key: "p8", code: "GIFT-CYCLING-01", title: "Cadeau · usage vélo", family: "Cadeau", context: "cycling_commute", buyingFor: "gift", decision: "cautious", projection: "expressive", content: "customer_proof", tone: "warm", tags: ["cycling", "gift", "rain", "liberty_blue", "fit"] },
  { key: "p9", code: "PHOTO-WEATHER-01", title: "Photographie · protection météo", family: "Équipement", context: "photography", buyingFor: "self", decision: "rational", projection: "adventurous", content: "technical_detail", tone: "serious", tags: ["camera", "iceland", "rain", "protection", "packing"] },
  { key: "p10", code: "FAMILY-TRAVEL-01", title: "Voyage famille · accès rapide", family: "Famille", context: "family_trip", buyingFor: "shared", decision: "cautious", projection: "practical", content: "guided_questions", tone: "reassuring", tags: ["family", "children", "hands_free", "quick_access", "underseat"] },
  { key: "p11", code: "PROOF-ANALYTICAL-01", title: "Acheteur analytique · preuve", family: "Décision", context: "office", buyingFor: "self", decision: "rational", projection: "professional", content: "guided_questions", tone: "serious", tags: ["specifications", "comparison", "questions", "proof", "commute"] },
  { key: "p12", code: "SOCIAL-CITY-01", title: "Week-end social · projection visuelle", family: "Inspiration", context: "short_city_trip", buyingFor: "self", decision: "intuitive", projection: "photogenic", content: "visual_first", tone: "joyful", tags: ["barcelona", "instagrammable", "style", "city", "liberty_blue"] },
  { key: "p13", code: "TRUST-TRAVEL-01", title: "Voyage · confiance avant achat", family: "Décision", context: "air_standard", buyingFor: "self", decision: "cautious", projection: "practical", content: "customer_proof", tone: "reassuring", tags: ["warranty", "reviews", "compatibility", "returns", "older_adult"] },
  { key: "p14", code: "NOMAD-WORK-01", title: "Travail nomade · laptop et climat", family: "Travail", context: "digital_nomad", buyingFor: "self", decision: "rational", projection: "professional", content: "editorial_story", tone: "energetic", tags: ["laptop", "asia", "humid", "organization", "long_use"] },
  { key: "p15", code: "URGENT-DELIVERY-01", title: "Départ imminent · disponibilité", family: "Urgence", context: "multimodal", buyingFor: "self", decision: "cautious", projection: "practical", content: "concise", tone: "energetic", tags: ["urgent", "same_day", "delivery", "pickup", "stock"] },
  { key: "p16", code: "DIY-STUDY-01", title: "Atelier · construire soi-même", family: "Atelier", context: "creative_project", buyingFor: "self", decision: "exploratory", projection: "expressive", content: "technical_detail", tone: "joyful", tags: ["diy", "make_it_myself", "pattern", "construction", "sketch", "prototype"] },
  { key: "p17", code: "CYCLING-COMMUTE-01", title: "Vélotaf long · pluie légère", family: "Usage quotidien", context: "cycling_commute", buyingFor: "self", decision: "rational", projection: "practical", content: "technical_detail", tone: "serious", tags: ["cycling", "commute", "rain", "laptop", "stability", "country_lane"] },
  { key: "p18", code: "WORK-SPORT-01", title: "Bureau + sport · après le travail", family: "Usage quotidien", context: "sport", buyingFor: "self", decision: "rational", projection: "practical", content: "customer_proof", tone: "energetic", tags: ["office", "sport", "laptop", "shoes", "change", "organization"] },
  { key: "p19", code: "FAMILY-SHARED-02", title: "Famille · organisation partagée", family: "Famille", context: "family_trip", buyingFor: "shared", decision: "cautious", projection: "practical", content: "guided_questions", tone: "reassuring", tags: ["family", "children", "shared", "weekend", "documents", "organization", "quick_access"] },
  { key: "p20", code: "COACH-YOUTH-01", title: "Car longue distance · accès sous-siège", family: "Voyage", context: "coach_travel", buyingFor: "self", decision: "rational", projection: "practical", content: "concise", tone: "energetic", tags: ["coach", "bus", "night_bus", "underseat", "quick_access", "young_adult", "essentials"] },
  { key: "p21", code: "CAMPUS-VALUE-01", title: "Campus · budget, laptop et résistance", family: "Études", context: "study", buyingFor: "self", decision: "comparative", projection: "responsible", content: "comparison", tone: "warm", tags: ["campus", "student", "budget", "weight", "durability", "laptop", "weekend"] },
  { key: "p22", code: "AIR-BUSINESS-01", title: "Business flight · London to Singapore", family: "Work", context: "air_business", buyingFor: "self", decision: "rational", projection: "premium", content: "technical_detail", tone: "restrained", tags: ["british_airways", "london", "singapore", "business", "long_haul", "cabin", "laptop", "black"] },
];

const representationByScenario = {
  p1: ["18_24", "man", "black"],
  p2: ["65_plus", "woman", "cream"],
  p3: ["35_44", "man", "black"],
  p4: ["25_34", "woman", "liberty_burgundy"],
  p5: ["55_64", "man", "cream"],
  p6: ["18_24", "woman", "liberty_blue"],
  p7: ["18_24", "man", "cream"],
  p8: ["25_34", "woman", "liberty_blue"],
  p9: ["35_44", "man", "black"],
  p10: ["35_44", "woman", "cream"],
  p11: ["35_44", "man", "black"],
  p12: ["25_34", "woman", "liberty_burgundy"],
  p13: ["65_plus", "man", "cream"],
  p14: ["25_34", "woman", "liberty_blue"],
  p15: ["25_34", "man", "black"],
  p16: ["unknown", "unspecified", "black"],
  p17: ["25_34", "man", "black"],
  p18: ["25_34", "unspecified", "black"],
  p19: ["45_54", "woman", "liberty_burgundy"],
  p20: ["18_24", "unspecified", "black"],
  p21: ["18_24", "woman", "liberty_blue"],
  p22: ["45_54", "man", "black"],
};

export const scenarioColorwaySpecs = Object.freeze({
  p18: {
    black: {
      ...colorMerchandisingSpecs.black,
      age_groups: ["25_34", "35_44"],
      gender_representations: ["man"],
      projections: ["professional", "practical", "discreet"],
      product_expressions: ["discreet"],
      tones: ["serious", "energetic"],
      asset_representation: "man_25_34",
    },
    cream: {
      ...colorMerchandisingSpecs.cream,
      age_groups: ["25_34", "35_44"],
      gender_representations: ["man"],
      projections: ["professional", "premium", "practical"],
      product_expressions: ["balanced"],
      tones: ["restrained", "warm"],
      asset_representation: "man_25_34",
    },
    "liberty-blue": {
      ...colorMerchandisingSpecs["liberty-blue"],
      age_groups: ["18_24", "25_34"],
      gender_representations: ["woman"],
      projections: ["expressive", "photogenic", "practical"],
      product_expressions: ["statement", "balanced"],
      tones: ["joyful", "energetic"],
      asset_representation: "woman_25_34",
    },
    "liberty-burgundy": {
      ...colorMerchandisingSpecs["liberty-burgundy"],
      age_groups: ["25_34", "35_44"],
      gender_representations: ["woman"],
      projections: ["premium", "expressive", "practical"],
      product_expressions: ["statement", "balanced"],
      tones: ["warm", "energetic"],
      asset_representation: "woman_35_44",
    },
  },
});

scenarioSeeds.forEach((scenario) => {
  const [ageGroup, genderRepresentation, color] = representationByScenario[scenario.key];
  Object.assign(scenario, {
    ageGroup,
    genderRepresentation,
    color,
    colorwaySpecs: scenarioColorwaySpecs[scenario.key] || null,
  });
});

export const gapCandidates = [
  { context: "public_transit", label: "Métro / bus quotidien", demand: "Sécurité, faible encombrement, ouverture debout" },
  { context: "road_trip", label: "Voiture / road trip", demand: "Transitions coffre, hôtel et ouverture complète" },
  { context: "multimodal", label: "Vélo + train", demand: "Poignées, portage et changement rapide" },
  { context: "office", label: "Bureau quotidien", demand: "Laptop, documents et silhouette compacte" },
  { context: "walking_city", label: "Journée urbaine à pied", demand: "Confort, accès et expression visuelle" },
  { context: "several_people", label: "Foyer / achat multiple", demand: "Quantités, coloris et offre de réachat" },
];

const assetFiles = [
  "sketch/passage-front-three-quarter.png", "sketch/passage-front.png", "sketch/passage-rear-three-quarter.png",
  "context/chloe-paris-bike-liberty-blue.png", "context/ryan-airplane-seat-black.png", "context/thomas-eurostar-business-black.png",
  "context/ryan/colorways/cream/ryan-airplane-seat.png", "context/ryan/colorways/liberty-blue/ryan-airplane-seat.png", "context/ryan/colorways/liberty-burgundy/ryan-airplane-seat.png",
  "context/thomas/colorways/cream/thomas-eurostar-business.png", "context/thomas/colorways/liberty-blue/thomas-eurostar-business.png", "context/thomas/colorways/liberty-burgundy/thomas-eurostar-business.png",
  "context/chloe/colorways/black/chloe-paris-bike.png", "context/chloe/colorways/cream/chloe-paris-bike.png", "context/chloe/colorways/liberty-burgundy/chloe-paris-bike.png",
  "editorial/barcelona/00-hero-park-guell.png", "editorial/barcelona/01-cafe-el-born.png", "editorial/barcelona/02-gothic-quarter.png", "editorial/barcelona/03-barceloneta.png", "editorial/barcelona/04-evening-flash.png", "editorial/barcelona/05-sun-shade-detail.png",
  "editorial/barcelona/colorways/black/00-hero-park-guell.png", "editorial/barcelona/colorways/cream/00-hero-park-guell.png", "editorial/barcelona/colorways/liberty-blue/00-hero-park-guell.png",
  "editorial/gift-japan/01-gift-hero.png", "editorial/gift-japan/02-shinkansen-fuji.png", "editorial/gift-japan/03-kyoto-packing.png",
  "editorial/gift-japan/colorways/black/01-gift-hero.png", "editorial/gift-japan/colorways/liberty-blue/01-gift-hero.png", "editorial/gift-japan/colorways/liberty-burgundy/01-gift-hero.png",
  "editorial/gift-family/01-gift-ready.png", "editorial/gift-family/02-grandmother-gift.png",
  "editorial/gift-family/colorways/black/01-gift-ready.png", "editorial/gift-family/colorways/black/02-grandmother-gift.png",
  "editorial/gift-family/colorways/liberty-blue/01-gift-ready.png", "editorial/gift-family/colorways/liberty-blue/02-grandmother-gift.png",
  "editorial/gift-family/colorways/liberty-burgundy/01-gift-ready.png", "editorial/gift-family/colorways/liberty-burgundy/02-grandmother-gift.png",
  "editorial/japan/01-kyoto-sakura.png", "editorial/japan/02-tokyo-evening.png", "editorial/japan/03-izakaya-dinner.png",
  "editorial/japan/colorways/black/00-hero-fuji-bench.png", "editorial/japan/colorways/cream/00-hero-fuji-bench.png", "editorial/japan/colorways/liberty-blue/00-hero-fuji-bench.png", "editorial/japan/colorways/liberty-burgundy/00-hero-fuji-bench.png",
  "editorial/japan/colorways/black/00-hero-fuji-flat-v2.png", "editorial/japan/colorways/cream/00-hero-fuji-flat-v2.png", "editorial/japan/colorways/liberty-blue/00-hero-fuji-flat-v2.png", "editorial/japan/colorways/liberty-burgundy/00-hero-fuji-flat-v2.png",
  "editorial/kevin/01-locker-pickup.png", "editorial/kevin/02-home-courier.png",
  "editorial/kevin/colorways/cream/01-locker-pickup.png", "editorial/kevin/colorways/liberty-blue/01-locker-pickup.png", "editorial/kevin/colorways/liberty-burgundy/01-locker-pickup.png",
  "editorial/maya/00-hero-bangkok-rain.png", "editorial/maya/01-pack-mobile-office.png", "editorial/maya/02-coworking-bangkok.png", "editorial/maya/03-evening-train.png", "editorial/maya/04-pack-three-days.png", "editorial/maya/05-laptop-sleeve-detail.png", "editorial/maya/06-rain-fabric-detail.png", "editorial/maya/07-transit-platform.png",
  "editorial/maya/colorways/black/00-hero-bangkok-rain.png", "editorial/maya/colorways/cream/00-hero-bangkok-rain.png", "editorial/maya/colorways/liberty-burgundy/00-hero-bangkok-rain.png",
  "editorial/nicolas/01-hero-camera-rain.png", "editorial/nicolas/02-camera-packing.png", "editorial/nicolas/03-water-beading-macro.png",
  "editorial/nicolas/colorways/cream/01-hero-camera-rain.png", "editorial/nicolas/colorways/liberty-blue/01-hero-camera-rain.png", "editorial/nicolas/colorways/liberty-burgundy/01-hero-camera-rain.png",
  "editorial/paul/01-la-defense-commute.png", "editorial/paul/02-metro-commute.png", "editorial/paul/03-metro-platform-arrival.png",
  "editorial/cycling-commute/01-rain-ride.png", "editorial/cycling-commute/colorways/cream/01-rain-ride.png", "editorial/cycling-commute/colorways/liberty-blue/01-rain-ride.png", "editorial/cycling-commute/colorways/liberty-burgundy/01-rain-ride.png",
  "editorial/work-sport/01-gym-arrival.png", "editorial/work-sport/02-sport-packing.png", "editorial/work-sport/colorways/cream/01-gym-arrival.png", "editorial/work-sport/colorways/liberty-blue/01-gym-arrival.png", "editorial/work-sport/colorways/liberty-burgundy/01-gym-arrival.png",
  "editorial/work-sport/colorways/cream/02-sport-packing.png", "editorial/work-sport/colorways/liberty-blue/02-sport-packing.png", "editorial/work-sport/colorways/liberty-burgundy/02-sport-packing.png",
  "editorial/family-shared/01-platform-departure.png",
  "editorial/family-shared/colorways/black/01-platform-departure.png", "editorial/family-shared/colorways/cream/01-platform-departure.png", "editorial/family-shared/colorways/liberty-blue/01-platform-departure.png", "editorial/family-shared/colorways/liberty-burgundy/01-platform-departure.png",
  "editorial/coach-youth/01-night-coach-access.png",
  "editorial/coach-youth/colorways/black/01-night-coach-access.png", "editorial/coach-youth/colorways/cream/01-night-coach-access.png", "editorial/coach-youth/colorways/liberty-blue/01-night-coach-access.png", "editorial/coach-youth/colorways/liberty-burgundy/01-night-coach-access.png",
  "editorial/campus/01-campus-walk.png",
  "editorial/campus/colorways/black/01-campus-walk.png", "editorial/campus/colorways/cream/01-campus-walk.png", "editorial/campus/colorways/liberty-blue/01-campus-walk.png", "editorial/campus/colorways/liberty-burgundy/01-campus-walk.png",
  "editorial/ryan/01-airport-candid-black.png",
  "editorial/ryan/colorways/cream/01-airport-candid.png", "editorial/ryan/colorways/liberty-blue/01-airport-candid.png", "editorial/ryan/colorways/liberty-burgundy/01-airport-candid.png",
  "context/graham-business/premium-seat-black.png", "context/graham-business/colorways/cream/premium-seat.png", "context/graham-business/colorways/liberty-blue/premium-seat.png", "context/graham-business/colorways/liberty-burgundy/premium-seat.png",
  "editorial/thomas/01-eurostar-platform-consultant.png",
  "materials/cream-ecru.png", "materials/ink-black.png", "materials/liberty-blue.png", "materials/liberty-burgundy.png",
  "products/72h-black/01-hero-three-quarter.png", "products/72h-black/02-front.png", "products/72h-black/03-rear-three-quarter.png", "products/72h-black/04-open-interior.png", "products/72h-black/05-macro-fabric-seam.png", "products/72h-black/06-macro-top-zip.png", "products/72h-black/07-macro-handle.png", "products/72h-black/09-detail-rear-carry.png", "products/72h-black/10-detail-top-construction.png",
  "products/72h-cream/01-hero-three-quarter.png", "products/72h-cream/02-front.png", "products/72h-cream/03-rear-three-quarter.png", "products/72h-cream/04-open-interior.png",
  "products/72h-liberty-blue/01-hero-three-quarter.png", "products/72h-liberty-blue/02-front.png", "products/72h-liberty-blue/03-rear-three-quarter.png", "products/72h-liberty-blue/04-open-interior.png",
  "products/72h-liberty-burgundy/01-hero-three-quarter.png", "products/72h-liberty-burgundy/02-front.png", "products/72h-liberty-burgundy/03-rear-three-quarter.png", "products/72h-liberty-burgundy/04-open-interior.png",
  "products/comparison/liberty-blue/compact-24l.png", "products/comparison/liberty-blue/expandable-36l.png", "products/comparison/liberty-blue/weekender-42l.png",
  "icons/packing/laptop.svg", "icons/packing/shirt.svg", "icons/packing/shoes.svg", "icons/packing/pouch.svg",
  "icons/packing/passport.svg", "icons/packing/cables.svg", "icons/packing/camera.svg", "icons/packing/layers.svg",
];

assetFiles.push(
  ...[
    ["long-trip", "01-andes-coach.png"],
    ["rail-leisure", "01-italian-connection.png"],
    ["family-airport", "01-terminal-hands-free.png"],
    ["technical-buyer", "01-material-check.png"],
    ["trust-travel", "01-airport-gate.png"],
  ].flatMap(([folder, filename]) =>
    ["black", "cream", "liberty-blue", "liberty-burgundy"].map((color) =>
      `editorial/${folder}/colorways/${color}/${filename}`)),
  ...["black", "cream", "liberty-burgundy"].flatMap((color) =>
    ["compact-24l.png", "expandable-36l.png", "weekender-42l.png"].map((filename) =>
      `products/comparison/${color}/${filename}`)),
  ...["01-kyoto-sakura.png", "02-tokyo-evening.png", "03-izakaya-dinner.png"].flatMap((filename) =>
    ["black", "liberty-blue", "liberty-burgundy"].map((color) => `editorial/japan/colorways/${color}/${filename}`)),
  ...["cream", "liberty-blue", "liberty-burgundy"].map((color) =>
    `editorial/thomas/colorways/${color}/01-eurostar-platform-consultant.png`),
  ...["01-cafe-el-born.png", "02-gothic-quarter.png", "03-barceloneta.png", "04-evening-flash.png", "05-sun-shade-detail.png"].flatMap((filename) =>
    ["black", "cream", "liberty-blue"].map((color) => `editorial/barcelona/colorways/${color}/${filename}`)),
);

const tagAliases = {
  airplane: "air", airport: "air", bike: "cycling", chloe: "cycling", thomas: "business", eurostar: "rail",
  barcelona: "social_city", japan: "editorial_travel", gift: "gift", maya: "digital_nomad", paul: "public_transit",
  metro: "public_transit", nicolas: "photography", camera: "photography", ryan: "low_cost", liberty: "expressive",
  black: "black", cream: "cream", burgundy: "liberty_burgundy", blue: "liberty_blue", rain: "wet_weather",
};

const editorialColors = {
  barcelona: "liberty-burgundy",
  "gift-family": "cream",
  "gift-japan": "cream",
  japan: "cream",
  kevin: "black",
  maya: "liberty-blue",
  nicolas: "black",
  paul: "black",
  "cycling-commute": "black",
  "work-sport": "black",
  "family-shared": "liberty-burgundy",
  "coach-youth": "black",
  campus: "liberty-blue",
  ryan: "black",
  thomas: "black",
};

function inferAssetColor(path) {
  if (path.includes("/black/")) return "black";
  if (path.includes("/cream/")) return "cream";
  if (path.includes("liberty-blue")) return "liberty-blue";
  if (path.includes("liberty-burgundy")) return "liberty-burgundy";
  if (path.includes("72h-cream") || path.includes("cream-ecru")) return "cream";
  if (path.includes("72h-black") || path.includes("ink-black") || path.includes("seat-black") || path.includes("business-black")) return "black";
  const editorialFolder = path.startsWith("editorial/") ? path.split("/")[1] : "";
  return editorialColors[editorialFolder] || "unspecified";
}

function inferAsset(path, index) {
  const [folder] = path.split("/");
  const rawTokens = path.replace(/\.(png|svg)$/, "").split(/[\/-]/).filter((token) => !/^\d+$/.test(token) && token !== "72h");
  const tags = [...new Set(rawTokens.map((token) => tagAliases[token] || token).filter((token) => !["assets", "products", "editorial", "context", "materials"].includes(token)))];
  return {
    id: `A${String(index + 1).padStart(3, "0")}`,
    path: `./assets/${path}`,
    type: folder === "products" ? "product" : folder === "materials" ? "material" : folder === "icons" ? "icon" : folder,
    role: folder === "sketch" ? "easter-egg" : path.includes("hero") || folder === "context" ? "hero" : path.includes("macro") || path.includes("detail") ? "detail" : folder === "products" ? "gallery" : "section",
    color: inferAssetColor(path),
    tags,
  };
}

export const assetManifest = assetFiles.map(inferAsset);

function includesAny(values = [], candidates = []) {
  return values.some((value) => candidates.includes(value));
}

function normalizeSignalText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsSignal(text, aliases = []) {
  const padded = ` ${text} `;
  return aliases.some((alias) => padded.includes(` ${normalizeSignalText(alias)} `));
}

const destinationSignals = [
  { key: "japan", scenarioKey: "p7", labels: { fr: "Japon", en: "Japan" }, trip: { fr: "votre voyage au Japon", en: "your trip to Japan" }, aliases: ["japon", "japan", "tokyo", "kyoto", "osaka", "fuji", "hakone"] },
  { key: "barcelona", scenarioKey: "p12", labels: { fr: "Barcelone", en: "Barcelona" }, trip: { fr: "votre séjour à Barcelone", en: "your trip to Barcelona" }, aliases: ["barcelone", "barcelona"] },
  { key: "iceland", scenarioKey: "p9", labels: { fr: "Islande", en: "Iceland" }, trip: { fr: "votre voyage en Islande", en: "your trip to Iceland" }, aliases: ["islande", "iceland", "reykjavik"] },
  { key: "dublin", scenarioKey: "p1", labels: { fr: "Dublin", en: "Dublin" }, trip: { fr: "votre séjour à Dublin", en: "your trip to Dublin" }, aliases: ["dublin"] },
  { key: "bangkok", scenarioKey: "p14", labels: { fr: "Bangkok", en: "Bangkok" }, trip: { fr: "votre séjour à Bangkok", en: "your trip to Bangkok" }, aliases: ["bangkok", "thailande", "thailand"] },
  { key: "singapore", scenarioKey: "p22", labels: { fr: "Singapour", en: "Singapore" }, trip: { fr: "votre déplacement professionnel à Singapour", en: "your business trip to Singapore" }, aliases: ["singapour", "singapore", "changi"] },
];

const needSignalAliases = {
  weatherProtection: ["etanche", "impermeable", "pluie", "averse", "averses", "waterproof", "rain", "wet weather", "weather protection"],
  durability: ["solide", "solidite", "robuste", "resistant", "resistance", "durable", "durabilite", "strong", "durability"],
};

const contextSubjects = {
  short_city_trip: { fr: "votre week-end", en: "your weekend trip" },
  long_trip: { fr: "votre long voyage", en: "your longer trip" },
  air_low_cost: { fr: "votre vol low-cost", en: "your low-cost flight" },
  air_standard: { fr: "votre voyage en avion", en: "your flight" },
  air_business: { fr: "votre déplacement professionnel en avion", en: "your business flight" },
  rail_business: { fr: "votre déplacement professionnel en train", en: "your business train journey" },
  rail_leisure: { fr: "votre voyage en train", en: "your train trip" },
  coach_travel: { fr: "votre trajet longue distance en car", en: "your long-distance coach trip" },
  cycling_commute: { fr: "vos trajets à vélo", en: "your cycling commute" },
  public_transit: { fr: "vos trajets quotidiens", en: "your daily commute" },
  office: { fr: "votre quotidien au bureau", en: "your workday" },
  study: { fr: "votre quotidien sur le campus", en: "your campus routine" },
  family_trip: { fr: "vos départs en famille", en: "your family trips" },
  photography: { fr: "votre matériel photo", en: "your photography kit" },
  digital_nomad: { fr: "votre quotidien nomade", en: "your remote-work routine" },
};

export function inferNeedSignals(need = {}) {
  const destinationText = normalizeSignalText(need.context_details?.destination || "");
  const requestText = normalizeSignalText(need.request || "");
  const combinedText = `${destinationText} ${requestText}`.trim();
  const structuredNeeds = [
    ...(need.practical_needs || []),
    ...(need.decision_preferences?.priorities || []),
  ];
  const destination = destinationSignals.find((candidate) => containsSignal(combinedText, candidate.aliases)) || null;
  return {
    destination,
    weatherProtection: need.context_details?.climate === "wet"
      || includesAny(structuredNeeds, ["weather_protection"])
      || containsSignal(combinedText, needSignalAliases.weatherProtection),
    durability: includesAny(structuredNeeds, ["durability"])
      || containsSignal(combinedText, needSignalAliases.durability),
  };
}

export function findClosestScenario(need = {}) {
  const contextValues = need.contexts || (need.primary_context ? [need.primary_context] : []);
  const projections = need.experience_desires?.projection || [];
  const content = need.experience_desires?.content || [];
  const tones = need.experience_desires?.tone || [];
  const ageGroup = need.person?.age_group;
  const genderRepresentation = need.person?.gender_representation;
  const color = need.aesthetic_preferences?.color;
  const request = normalizeSignalText(need.request || "");
  const requestTokens = request.split(/\s+/).filter(Boolean);
  const signals = inferNeedSignals(need);

  // p16 is an authored easter egg, not a neighbour in the commercial scenario forest.
  const ranked = scenarioSeeds.filter((scenario) => scenario.key !== "p16").map((scenario) => {
    let score = 0;
    const reasons = [];
    if (contextValues.includes(scenario.context)) { score += 8; reasons.push("contexte exact"); }
    if (need.buying_for === scenario.buyingFor) { score += 4; reasons.push("situation d’achat"); }
    if (need.decision_preferences?.style === scenario.decision) { score += 4; reasons.push("manière de décider"); }
    if (projections.includes(scenario.projection)) { score += 3; reasons.push("projection recherchée"); }
    if (content.includes(scenario.content)) { score += 3; reasons.push("langage de contenu"); }
    if (tones.includes(scenario.tone)) { score += 1; reasons.push("ton"); }
    if (ageGroup && ageGroup !== "unknown" && ageGroup === scenario.ageGroup) { score += 1.5; reasons.push("tranche d’âge"); }
    if (genderRepresentation && genderRepresentation !== "unspecified" && genderRepresentation === scenario.genderRepresentation) { score += 1; reasons.push("représentation"); }
    if (color && color !== "no_preference" && color === scenario.color) { score += 1.5; reasons.push("coloris"); }
    if (signals.destination?.scenarioKey === scenario.key) {
      score += 24;
      reasons.push(`destination explicite : ${signals.destination.labels.fr}`);
    }
    if (signals.weatherProtection && ["p1", "p8", "p9", "p14"].includes(scenario.key)) {
      score += scenario.key === "p9" ? 5 : 1;
      reasons.push("protection météo");
    }
    if (signals.durability && ["p3", "p4", "p9"].includes(scenario.key)) {
      score += scenario.key === "p4" ? 5 : 2;
      reasons.push("solidité");
    }
    const tagMatches = scenario.tags.filter((tag) => {
      const normalizedTag = normalizeSignalText(tag);
      return requestTokens.includes(normalizedTag) || containsSignal(request, [normalizedTag]);
    });
    score += Math.min(4, tagMatches.length * 2);
    if (tagMatches.length) reasons.push(`tags : ${tagMatches.join(", ")}`);
    return { scenario, score, reasons };
  }).sort((a, b) => b.score - a.score);

  const winner = ranked[0];
  return {
    matchedScenario: winner?.scenario || scenarioSeeds[10],
    score: winner?.score || 0,
    confidence: Math.min(0.97, 0.46 + (winner?.score || 0) * 0.035),
    reasons: winner?.reasons || [],
    alternatives: ranked.slice(1, 4).map(({ scenario, score }) => ({ key: scenario.key, title: scenario.title, score })),
    signals,
  };
}

const toCommerceColor = (color = "black") => String(color).replaceAll("_", "-");

export function recommendScenarioColorway(need = {}, scenario) {
  const explicitColor = need.aesthetic_preferences?.color;
  const defaultColor = toCommerceColor(scenario?.color || "black");
  const colorwaySpecs = scenario?.colorwaySpecs;

  if (explicitColor && explicitColor !== "no_preference") {
    const color = toCommerceColor(explicitColor);
    return {
      color,
      source: "explicit_preference",
      confidence: 1,
      reasons: ["préférence de coloris explicite"],
      spec: colorwaySpecs?.[color] || colorMerchandisingSpecs[color] || null,
    };
  }

  if (!colorwaySpecs) {
    return {
      color: defaultColor,
      source: "scenario_default",
      confidence: 0.5,
      reasons: ["coloris éditorial par défaut"],
      spec: colorMerchandisingSpecs[defaultColor] || null,
    };
  }

  const ageGroup = need.person?.age_group;
  const genderRepresentation = need.person?.gender_representation;
  const projections = need.experience_desires?.projection || [];
  const tones = need.experience_desires?.tone || [];
  const productExpression = need.aesthetic_preferences?.product_expression;
  const settings = need.aesthetic_preferences?.setting || [];
  const hasCreativeSignals = (ageGroup && ageGroup !== "unknown")
    || (genderRepresentation && genderRepresentation !== "unspecified")
    || projections.length
    || tones.length
    || (productExpression && productExpression !== "no_preference")
    || settings.some((setting) => setting !== "no_preference");

  if (!hasCreativeSignals) {
    return {
      color: defaultColor,
      source: "scenario_default",
      confidence: 0.5,
      reasons: ["aucun signal créatif déclaré"],
      spec: colorwaySpecs[defaultColor] || colorMerchandisingSpecs[defaultColor] || null,
    };
  }

  const ranked = Object.entries(colorwaySpecs).map(([color, spec]) => {
    let score = color === defaultColor ? 0.25 : 0;
    const reasons = [];
    if (ageGroup && ageGroup !== "unknown" && spec.age_groups?.includes(ageGroup)) {
      score += 2;
      reasons.push("tranche d’âge de la création");
    }
    if (genderRepresentation && genderRepresentation !== "unspecified" && spec.gender_representations?.includes(genderRepresentation)) {
      score += 1;
      reasons.push("représentation visuelle demandée");
    }
    const projectionMatches = projections.filter((projection) => spec.projections?.includes(projection));
    score += projectionMatches.length * 1.25;
    if (projectionMatches.length) reasons.push("projection recherchée");
    const toneMatches = tones.filter((tone) => spec.tones?.includes(tone));
    score += toneMatches.length * 0.5;
    if (toneMatches.length) reasons.push("ton souhaité");
    if (productExpression && productExpression !== "no_preference" && spec.product_expressions?.includes(productExpression)) {
      score += 1.5;
      reasons.push("expression du produit");
    }
    const settingMatches = settings.filter((setting) => spec.contexts?.includes(setting));
    score += settingMatches.length * 0.5;
    if (settingMatches.length) reasons.push("décor souhaité");
    return { color, spec, score, reasons };
  }).sort((a, b) => b.score - a.score);

  const winner = ranked[0];
  return {
    color: winner?.color || defaultColor,
    source: "creative_variant_affinity",
    confidence: Math.min(0.85, 0.45 + (winner?.score || 0) * 0.08),
    reasons: winner?.reasons || [],
    spec: winner?.spec || colorwaySpecs[defaultColor] || null,
  };
}

export function deriveLocalVariations(need = {}, scenario, signals = inferNeedSignals(need)) {
  const variations = [];
  const evidence = need.decision_preferences?.useful_evidence || [];
  const content = need.experience_desires?.content || [];
  const organization = need.organization_need?.level;
  const purchasePossibility = need.purchase_scope?.possibility;

  if (signals.weatherProtection && scenario.key !== "p9") {
    variations.push({ slot: "weather", action: "replace", component: "S1 · Protection contre la pluie", reason: "protection météo prioritaire" });
  }
  if (signals.durability && !["p3", "p4", "p9"].includes(scenario.key)) {
    variations.push({ slot: "durability", action: "replace", component: "S11 · Tests de résistance", reason: "solidité prioritaire" });
  }

  if (includesAny(evidence, ["customer_reviews", "returns_and_warranty"]) && scenario.content !== "customer_proof") {
    variations.push({ slot: "proof", action: "replace", component: "S13 · Avis contextualisés", reason: "réassurance demandée" });
  }
  if (organization === "high") {
    variations.push({ slot: "utility", action: "replace", component: "S10 · Organisation + bundle", reason: "besoin de rangement élevé" });
  }
  if (includesAny(content, ["visual_first", "editorial_story"]) && !["p7", "p12", "p14"].includes(scenario.key)) {
    variations.push({ slot: "story", action: "replace", component: "S21 · Scène éditoriale", reason: "projection visuelle prioritaire" });
  }
  if (["might_buy_again", "several_people"].includes(purchasePossibility)) {
    variations.push({ slot: "offer", action: "insert_if_relevant", component: "Offre prochain achat", reason: "achat répété ou collectif possible" });
  }
  return variations.slice(0, 2);
}

function buildExperienceCopy(need, signals, variations) {
  const highlightsFr = [];
  const highlightsEn = [];
  if (signals.weatherProtection) {
    highlightsFr.push("la protection contre la pluie");
    highlightsEn.push("rain protection");
  }
  if (signals.durability) {
    highlightsFr.push("la solidité mesurée");
    highlightsEn.push("measured durability");
  }
  const primaryContext = (need.contexts || [])[0];
  const fallbackSubject = need.buying_for === "gift"
    ? { fr: "ce cadeau", en: "this gift" }
    : contextSubjects[primaryContext] || { fr: "votre besoin", en: "your needs" };
  const subjectFr = signals.destination?.trip.fr || fallbackSubject.fr;
  const subjectEn = signals.destination?.trip.en || fallbackSubject.en;
  const detailFr = highlightsFr.length ? `, avec une priorité donnée à ${highlightsFr.join(" et ")}` : "";
  const detailEn = highlightsEn.length ? `, highlighting ${highlightsEn.join(" and ")}` : "";
  const caveatFr = signals.weatherProtection
    ? " La toile est déperlante pour les pluies légères ; une housse reste recommandée pour une forte averse."
    : "";
  const caveatEn = signals.weatherProtection
    ? " The fabric repels light rain; a rain cover is still recommended for heavy showers."
    : "";
  return {
    summary: {
      fr: `Une expérience centrée sur ${subjectFr}${detailFr}.`,
      en: `An experience built around ${subjectEn}${detailEn}.`,
    },
    shopper_message: {
      fr: `J’ai préparé une sélection centrée sur ${subjectFr}${detailFr}.${caveatFr}`,
      en: `I’ve prepared a selection built around ${subjectEn}${detailEn}.${caveatEn}`,
    },
    destination: signals.destination?.key || null,
    highlights: variations.map((variation) => variation.slot),
    important_note: signals.weatherProtection ? "water_repellent_not_waterproof" : null,
  };
}

export function resolveWant(need = {}) {
  const match = findClosestScenario(need);
  const scenario = match.matchedScenario;
  const colorRecommendation = recommendScenarioColorway(need, scenario);
  const localVariations = deriveLocalVariations(need, scenario, match.signals);
  const experience = buildExperienceCopy(need, match.signals, localVariations);
  return {
    request: need,
    scenario,
    confidence: match.confidence,
    score: match.score,
    reasons: match.reasons,
    alternatives: match.alternatives,
    colorRecommendation,
    localVariations,
    signals: {
      destination: match.signals.destination?.key || null,
      weather_protection: match.signals.weatherProtection,
      durability: match.signals.durability,
    },
    experience,
    status: "ready_to_present",
    stop_tool_calls: true,
    next_action: "present_recommendation_and_wait",
    agent_guidance: {
      instruction: "Present the shopper_message once, briefly mention the visible priorities, then wait for the shopper. Do not reset, rematch, explain the algorithm, or validate with another tool unless the shopper explicitly asks.",
      do_not_mention: ["scenario IDs", "matching score", "profile", "personalization engine"],
    },
    presentationMode: "storefront",
    renderScenarioKey: scenario.key,
    sessionOnly: true,
  };
}

export function resolveMakeItMyself() {
  const scenario = scenarioSeeds.find((candidate) => candidate.key === "p16");
  return {
    request: {},
    scenario,
    confidence: 1,
    score: 100,
    reasons: ["easter egg explicitement demandé"],
    alternatives: [],
    localVariations: [],
    presentationMode: "sketch_study",
    renderScenarioKey: scenario.key,
    sessionOnly: true,
    easterEgg: true,
  };
}
