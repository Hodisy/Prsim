const colorCodes = Object.freeze({
  1: "black",
  2: "cream",
  3: "liberty-blue",
  4: "liberty-burgundy",
});

const modelCodes = Object.freeze({
  1: "passage-24",
  2: "passage-32",
  3: "passage-36",
  4: "passage-42",
});

// These aliases are deliberately explicit. Adding a merchant-authored variant
// must never change the meaning of an already shared URL.
const authoredVariantCodes = Object.freeze({
  p1: Object.freeze({ a: "airport-departure" }),
  p2: Object.freeze({ a: "gift-essential" }),
});

const heroPurposes = Object.freeze([
  "product_overview",
  "compare_models",
  "compare_prices",
  "airline_compatibility",
  "gift_reassurance",
  "material_quality",
  "urgent_delivery",
]);

const sectionPurposes = Object.freeze([
  "model_comparison",
  "technical_comparison",
  "price_comparison",
  "airline_compatibility",
  "weather_proof",
  "durability_proof",
  "customer_reviews",
  "customer_rating",
  "customer_context",
  "customer_long_term",
  "customer_balanced",
  "customer_color",
  "gift_reassurance",
  "returns_warranty",
  "organization",
  "delivery",
  "material_quality",
  "editorial_story",
  "product_overview",
  "laptop_access",
]);

const variationSlots = Object.freeze(["weather", "durability", "proof", "utility", "story", "offer"]);
const evidenceFocuses = Object.freeze([
  "overall",
  "similar_use",
  "long_term",
  "balanced",
  "color",
  "durability",
  "weather",
  "comfort",
  "cabin",
  "organization",
  "gift",
  "returns",
  "value",
]);
const evidenceSources = Object.freeze(["auto", "all", "verified_purchase", "trustpilot", "post_purchase", "survey"]);

const reverse = (record) => Object.fromEntries(Object.entries(record).map(([key, value]) => [value, key]));
const colorCodeByValue = Object.freeze(reverse(colorCodes));
const modelCodeByValue = Object.freeze(reverse(modelCodes));
const twoDigits = (value) => String(value).padStart(2, "0");
const purposeCode = (list, purpose) => {
  const index = list.indexOf(purpose);
  return index < 0 ? null : index + 1;
};
const purposeFromCode = (list, code) => list[Number(code) - 1] || null;

function variantCodeFor(scenarioKey, variantId) {
  if (!variantId || variantId === "base") return "";
  return Object.entries(authoredVariantCodes[scenarioKey] || {}).find(([, id]) => id === variantId)?.[0] || "";
}

function variationMask(localVariations = []) {
  const slots = new Set(localVariations.map((variation) => typeof variation === "string" ? variation : variation.slot));
  return variationSlots.reduce((mask, slot, index) => slots.has(slot) ? mask | (1 << index) : mask, 0);
}

function variationsFromMask(mask) {
  return variationSlots.filter((_, index) => mask & (1 << index)).map((slot) => ({ slot }));
}

function parseNumberAt(source, index, maximumDigits = 2) {
  const match = source.slice(index).match(new RegExp(`^\\d{1,${maximumDigits}}`));
  if (!match) return null;
  return { value: Number(match[0]), next: index + match[0].length };
}

function parseOperation(source, index) {
  const operationCodes = { o: "auto", a: "add", r: "replace", d: "remove", u: "prioritize" };
  const code = source[index];
  const operation = operationCodes[code];
  if (!operation) return null;
  let cursor = index + 1;

  if (["remove", "prioritize"].includes(operation) && source[cursor] === "p") {
    const position = parseNumberAt(source, cursor + 1, 1);
    if (!position || position.value < 1 || position.value > 5) return null;
    return { mutation: { operation, position: position.value }, next: position.next };
  }

  const block = parseNumberAt(source, cursor, 2);
  if (!block) return null;
  const purpose = purposeFromCode(sectionPurposes, block.value);
  if (!purpose) return null;
  cursor = block.next;
  const mutation = { operation, purpose };

  if (source[cursor] === "x") {
    const replacement = parseNumberAt(source, cursor + 1, 2);
    const replacePurpose = replacement && purposeFromCode(sectionPurposes, replacement.value);
    if (!replacePurpose) return null;
    mutation.replacePurpose = replacePurpose;
    cursor = replacement.next;
  }
  if (source[cursor] === "p") {
    const position = parseNumberAt(source, cursor + 1, 1);
    if (!position || position.value < 1 || position.value > 5) return null;
    mutation.position = position.value;
    cursor = position.next;
  }
  if (source[cursor] === "h") {
    mutation.placement = "after_hero";
    cursor += 1;
  } else if (source[cursor] === "t") {
    mutation.placement = "before_cta";
    cursor += 1;
  }
  return { mutation, next: cursor };
}

export function parseExperienceCode(rawCode = "", { hasScenario = () => true } = {}) {
  let code = "";
  try { code = decodeURIComponent(String(rawCode)).toLowerCase().replaceAll(/[^a-z0-9]/g, ""); }
  catch { return { valid: false, code: "", scenarioKey: "classic" }; }
  if (!code) return { valid: true, code: "", scenarioKey: "classic", language: null, operations: [] };

  const scenarioMatch = code.match(/^s(\d+)/);
  if (!scenarioMatch) return { valid: false, code: "", scenarioKey: "classic" };
  const scenarioNumber = Number(scenarioMatch[1]);
  const scenarioKey = `p${scenarioNumber}`;
  if (!scenarioNumber || !hasScenario(scenarioKey)) return { valid: false, code: "", scenarioKey: "classic" };

  let cursor = scenarioMatch[0].length;
  let variantCode = "";
  const possibleVariant = code[cursor];
  if (authoredVariantCodes[scenarioKey]?.[possibleVariant]) {
    variantCode = possibleVariant;
    cursor += 1;
  }

  const parsed = {
    valid: true,
    scenarioKey,
    scenarioNumber,
    variantId: authoredVariantCodes[scenarioKey]?.[variantCode] || "base",
    language: null,
    colorway: null,
    bundleEnabled: null,
    productId: null,
    heroPurpose: null,
    localVariations: [],
    operations: [],
    evidence: null,
  };

  while (cursor < code.length) {
    const tail = code.slice(cursor);
    if (tail.startsWith("fr") || tail.startsWith("en")) {
      parsed.language = tail.slice(0, 2);
      cursor += 2;
      continue;
    }
    const color = tail.match(/^c([1-4])/);
    if (color) {
      parsed.colorway = colorCodes[color[1]];
      cursor += color[0].length;
      continue;
    }
    const bundle = tail.match(/^b([01])/);
    if (bundle) {
      parsed.bundleEnabled = bundle[1] === "1";
      cursor += bundle[0].length;
      continue;
    }
    const model = tail.match(/^m([1-4])/);
    if (model) {
      parsed.productId = modelCodes[model[1]];
      cursor += model[0].length;
      continue;
    }
    const hero = tail.match(/^h(\d{1,2})/);
    if (hero) {
      parsed.heroPurpose = purposeFromCode(heroPurposes, hero[1]);
      if (!parsed.heroPurpose) break;
      cursor += hero[0].length;
      continue;
    }
    const variations = tail.match(/^v([0-9a-f]{2})/);
    if (variations) {
      parsed.localVariations = variationsFromMask(Number.parseInt(variations[1], 16));
      cursor += variations[0].length;
      continue;
    }
    if (/^[oardu]/.test(tail)) {
      const operation = parseOperation(code, cursor);
      if (!operation) break;
      parsed.operations.push(operation.mutation);
      cursor = operation.next;
      continue;
    }
    const evidence = tail.match(/^e(\d{1,2})(?:z([0-5]))?/);
    if (evidence) {
      const focus = evidenceFocuses[Number(evidence[1]) - 1];
      if (!focus) break;
      parsed.evidence = { focus, source: evidenceSources[Number(evidence[2] || 0)] || "auto" };
      cursor += evidence[0].length;
      continue;
    }
    // A hand-written unknown suffix falls back to the authored base scenario.
    break;
  }

  if (cursor < code.length) {
    return {
      valid: true,
      code: `s${scenarioNumber}`,
      scenarioKey,
      scenarioNumber,
      variantId: "base",
      language: null,
      colorway: null,
      bundleEnabled: null,
      productId: null,
      heroPurpose: null,
      localVariations: [],
      operations: [],
      evidence: null,
    };
  }

  parsed.code = serializeExperienceCode(parsed);
  return parsed;
}

export function parseExperiencePath(pathname = "/", options = {}) {
  const segment = String(pathname).replace(/^\/+|\/+$/g, "");
  if (!segment || segment === "prsim-wireframe-preview.html") {
    return { valid: true, code: "", scenarioKey: "classic", language: null, operations: [] };
  }
  if (segment.includes("/")) return { valid: false, code: "", scenarioKey: "classic" };
  return parseExperienceCode(segment, options);
}

function serializeOperation(mutation = {}) {
  const operationCodes = { auto: "o", add: "a", replace: "r", remove: "d", prioritize: "u" };
  const operation = operationCodes[mutation.operation] || "o";
  if (["remove", "prioritize"].includes(mutation.operation) && mutation.position) return `${operation}p${mutation.position}`;
  const block = purposeCode(sectionPurposes, mutation.purpose);
  if (!block) return "";
  let token = `${operation}${twoDigits(block)}`;
  const replacement = purposeCode(sectionPurposes, mutation.replacePurpose);
  if (replacement) token += `x${twoDigits(replacement)}`;
  if (mutation.position) token += `p${mutation.position}`;
  if (mutation.placement === "after_hero") token += "h";
  if (mutation.placement === "before_cta") token += "t";
  return token;
}

export function serializeExperienceCode(experience = {}) {
  const scenarioNumber = Number(experience.scenarioNumber || String(experience.scenarioKey || "").replace(/^p/, ""));
  if (!scenarioNumber) return "";
  const scenarioKey = `p${scenarioNumber}`;
  let code = `s${scenarioNumber}${variantCodeFor(scenarioKey, experience.variantId)}`;
  if (experience.language === "fr") code += "fr";
  if (experience.language === "en" && experience.includeEnglish) code += "en";
  if (experience.colorway && experience.colorway !== experience.defaultColorway) code += `c${colorCodeByValue[experience.colorway]}`;
  if (typeof experience.bundleEnabled === "boolean" && experience.bundleEnabled !== experience.defaultBundleEnabled) code += `b${experience.bundleEnabled ? 1 : 0}`;
  if (experience.productId && experience.productId !== experience.defaultProductId) code += `m${modelCodeByValue[experience.productId]}`;
  const hero = purposeCode(heroPurposes, experience.heroPurpose);
  if (hero) code += `h${hero}`;
  const mask = variationMask(experience.localVariations || []);
  if (mask) code += `v${mask.toString(16).padStart(2, "0")}`;
  code += (experience.operations || []).map(serializeOperation).join("");
  if (experience.evidence?.focus) {
    const focus = evidenceFocuses.indexOf(experience.evidence.focus) + 1;
    const source = Math.max(0, evidenceSources.indexOf(experience.evidence.source || "auto"));
    if (focus) code += `e${twoDigits(focus)}${source ? `z${source}` : ""}`;
  }
  return code;
}

export function experiencePath(code = "") {
  return code ? `/${code}` : "/";
}

export const routeCatalog = Object.freeze({
  colors: colorCodes,
  models: modelCodes,
  heroPurposes,
  sectionPurposes,
  variationSlots,
  evidenceFocuses,
  evidenceSources,
});
