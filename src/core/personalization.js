const emptyProfile = () => ({
  purchase_intent: "explore",
  use_cases: [],
  travel: {},
  constraints: {},
  priorities: [],
  evidence_preferences: [],
  style_preferences: {},
  inferred_fields: [],
});

let shopperProfile = emptyProfile();

const includes = (values = [], value) => values.includes(value);

function mergeProfile(current, incoming) {
  return {
    ...current,
    ...incoming,
    use_cases: incoming.use_cases ?? current.use_cases,
    priorities: incoming.priorities ?? current.priorities,
    evidence_preferences: incoming.evidence_preferences ?? current.evidence_preferences,
    inferred_fields: incoming.inferred_fields ?? current.inferred_fields,
    travel: { ...current.travel, ...(incoming.travel || {}) },
    constraints: { ...current.constraints, ...(incoming.constraints || {}) },
    style_preferences: { ...current.style_preferences, ...(incoming.style_preferences || {}) },
  };
}

export function resolveShopperProfile(profile = shopperProfile) {
  const uses = profile.use_cases || [];
  const priorities = profile.priorities || [];
  const evidence = profile.evidence_preferences || [];
  const travel = profile.travel || {};
  const constraints = profile.constraints || {};
  const intent = profile.purchase_intent;
  const reasons = [];
  let profileKey = "classic";
  let productId = "passage-32";

  if (includes(uses, "cycling") && intent === "gift") {
    profileKey = "p8";
    reasons.push("cadeau destiné à un usage vélo", "projection en situation prioritaire");
  } else if (includes(uses, "photography") || constraints.camera_equipment) {
    profileKey = "p9";
    productId = "passage-42";
    reasons.push("protection du matériel photo", "capacité et météo prioritaires");
  } else if (includes(uses, "family_travel")) {
    profileKey = "p10";
    reasons.push("voyage avec enfants", "accès rapide et mains libres");
  } else if (includes(uses, "digital_nomad")) {
    profileKey = "p14";
    productId = "passage-36";
    reasons.push("ordinateur utilisé en déplacement", "organisation travail et voyage");
  } else if (includes(uses, "business") && ["train", "mixed"].includes(travel.transport)) {
    profileKey = "p3";
    reasons.push("déplacement professionnel en train", "apparence et organisation business");
  } else if (intent === "gift") {
    profileKey = "p2";
    reasons.push("achat cadeau", "livraison et échange à rassurer");
  } else if (intent === "urgent" || constraints.needed_by) {
    profileKey = "p15";
    reasons.push("date de réception contraignante", "disponibilité immédiate prioritaire");
  } else if (includes(uses, "air_travel") && (travel.airline === "ryanair" || Number(constraints.budget_max_eur) <= 120)) {
    profileKey = "p1";
    productId = "passage-24";
    reasons.push("contrainte de bagage personnel", "budget prioritaire");
  } else if (intent === "compare" || includes(priorities, "price")) {
    profileKey = "p6";
    reasons.push("comparaison avant achat", "rapport qualité-prix prioritaire");
  } else if (includes(uses, "long_trip")) {
    profileKey = "p4";
    productId = "passage-36";
    reasons.push("voyage prolongé", "capacité et résistance prioritaires");
  } else if (includes(priorities, "weight") || includes(priorities, "comfort")) {
    profileKey = "p5";
    reasons.push("poids et confort prioritaires");
  } else if (includes(evidence, "specifications")) {
    profileKey = "p11";
    reasons.push("preuves techniques demandées");
  } else if (includes(priorities, "style") || includes(evidence, "visual_story")) {
    profileKey = "p12";
    reasons.push("projection visuelle prioritaire");
  } else if (intent === "validate") {
    profileKey = "p13";
    reasons.push("besoin de réassurance avant achat");
  }

  const missingInformation = [];
  if (includes(uses, "air_travel") && !travel.airline) missingInformation.push("travel.airline");
  if (intent === "urgent" && !constraints.needed_by) missingInformation.push("constraints.needed_by");
  if (intent === "gift" && !constraints.needed_by) missingInformation.push("constraints.needed_by");

  return {
    matched_experience: profileKey,
    recommended_product: productId,
    confidence: Math.max(0.55, Math.min(0.96, 0.62 + reasons.length * 0.11 - missingInformation.length * 0.08)),
    reasons,
    missing_information: missingInformation,
  };
}

export function setShopperProfile(incoming = {}, mode = "merge") {
  shopperProfile = mode === "replace" ? mergeProfile(emptyProfile(), incoming) : mergeProfile(shopperProfile, incoming);
  return { profile: structuredClone(shopperProfile), decision: resolveShopperProfile(shopperProfile) };
}

export function getShopperProfile() {
  return { profile: structuredClone(shopperProfile), decision: resolveShopperProfile(shopperProfile) };
}

export function clearShopperProfile() {
  shopperProfile = emptyProfile();
  return getShopperProfile();
}
