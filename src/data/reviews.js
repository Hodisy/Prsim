const registry = [];
const byId = new Map();

const genericProofs = [
  "La taille correspond exactement à ce qui est annoncé.",
  "Les accès sont simples à comprendre dès le premier trajet.",
];

const commentProofs = [
  "Le format est passé sans supplément.",
  "Le tissu a tenu pendant deux jours de pluie.",
  "Ne pas trop remplir la poche avant.",
];

const sourceCycle = ["post_purchase", "trustpilot", "survey"];

function cleanTags(values = []) {
  return [...new Set(values.map((value) => String(value).trim().toLocaleLowerCase("fr").replaceAll(/[^a-z0-9à-ÿ]+/g, "_")).filter(Boolean))];
}

function addReview(review) {
  if (byId.has(review.id)) return review.id;
  const normalized = Object.freeze({
    rating: 5,
    verifiedPurchase: false,
    kind: "review",
    source: "prototype",
    prototype: true,
    tags: [],
    ...review,
    tags: cleanTags(review.tags),
  });
  registry.push(normalized);
  byId.set(normalized.id, normalized);
  return normalized.id;
}

function recordFromText({ id, body, author, source, kind = "review", tags = [], meta = "" }) {
  return addReview({
    id,
    body,
    author: author || "Profil comparable · prototype",
    rating: kind === "comment" ? null : 5,
    verifiedPurchase: /vérifi|verified/i.test(`${author} ${meta}`),
    source,
    kind,
    tags,
    context: meta || undefined,
  });
}

const evidenceSeedReviews = [
  {
    id: "EVD-LONG-01",
    body: "Après huit mois de trajets quotidiens, la structure garde sa forme et les fermetures coulissent comme au premier jour.",
    author: "Nora D. · usage quotidien",
    rating: 5,
    verifiedPurchase: true,
    source: "post_purchase",
    context: "Retour après huit mois · contenu de démonstration",
    tags: ["long_term", "durability", "daily_use", "black"],
  },
  {
    id: "EVD-LONG-02",
    body: "La toile et les coutures n’ont pas bougé en six mois. Le dessous marque légèrement quand je le pose souvent au sol.",
    author: "Antoine R. · déplacement professionnel",
    rating: 4,
    source: "survey",
    context: "Retour après six mois · contenu de démonstration",
    tags: ["long_term", "durability", "balanced", "business"],
  },
  {
    id: "EVD-BIKE-01",
    body: "Sur quarante minutes de vélo, le sac reste stable et je retrouve l’ordinateur sans vider le compartiment principal.",
    author: "Élise M. · vélotaf",
    rating: 5,
    verifiedPurchase: true,
    source: "post_purchase",
    context: "Trajet vélo quotidien · contenu de démonstration",
    tags: ["cycling", "comfort", "organization", "laptop", "liberty_blue"],
  },
  {
    id: "EVD-BIKE-02",
    body: "Confortable pour le trajet, mais je desserre les bretelles dès que le sac est chargé avec des chaussures et un ordinateur.",
    author: "Camille P. · vélo et sport",
    rating: 4,
    source: "trustpilot",
    context: "Usage mixte · contenu de démonstration",
    tags: ["cycling", "comfort", "balanced", "sport"],
  },
  {
    id: "EVD-WEATHER-01",
    body: "Une averse d’une vingtaine de minutes n’a pas atteint mes affaires. Pour une pluie continue, j’ajoute toujours une housse.",
    author: "Lina B. · trajet urbain",
    rating: 4,
    verifiedPurchase: true,
    source: "post_purchase",
    context: "Pluie légère · contenu de démonstration",
    tags: ["weather", "rain", "balanced", "daily_use"],
  },
  {
    id: "EVD-CABIN-01",
    body: "Le Passage 24 est entré sous le siège sur mon vol Ryanair, sans forcer le gabarit.",
    author: "Léo B. · voyageur Ryanair",
    rating: 5,
    source: "trustpilot",
    context: "Ryanair · accessoire personnel · contenu de démonstration",
    tags: ["cabin", "airline", "ryanair", "passage_24"],
  },
  {
    id: "EVD-CABIN-02",
    body: "En cabine Air France, le Passage 32 s’est rangé facilement et la poche passeport est restée accessible jusqu’à l’embarquement.",
    author: "Marc V. · voyageur Air France",
    rating: 5,
    verifiedPurchase: true,
    source: "post_purchase",
    context: "Air France · bagage cabine · contenu de démonstration",
    tags: ["cabin", "airline", "air_france", "passage_32", "organization"],
  },
  {
    id: "EVD-COLOR-01",
    body: "Le liberty bleu est plus doux en lumière naturelle que sur mon écran, tout en restant suffisamment lisible avec un manteau sombre.",
    author: "Inès G. · liberty bleu",
    rating: 5,
    source: "survey",
    context: "Retour coloris · contenu de démonstration",
    tags: ["color", "liberty_blue", "style"],
  },
  {
    id: "EVD-COLOR-02",
    body: "Le crème est lumineux et sobre. Il demande simplement un nettoyage plus régulier autour de la base.",
    author: "Sarah T. · crème",
    rating: 4,
    source: "trustpilot",
    context: "Retour coloris · contenu de démonstration",
    tags: ["color", "cream", "care", "balanced"],
  },
  {
    id: "EVD-COLOR-03",
    body: "Le noir reste mat même sous une lumière forte et passe facilement du bureau au train.",
    author: "Julien F. · noir",
    rating: 5,
    verifiedPurchase: true,
    source: "post_purchase",
    context: "Retour coloris · contenu de démonstration",
    tags: ["color", "black", "business", "train"],
  },
  {
    id: "EVD-COLOR-04",
    body: "Le liberty bordeaux paraît profond plutôt que rouge vif. Le motif reste discret à distance.",
    author: "Maud C. · liberty bordeaux",
    rating: 5,
    source: "survey",
    context: "Retour coloris · contenu de démonstration",
    tags: ["color", "liberty_burgundy", "style"],
  },
  {
    id: "EVD-GIFT-01",
    body: "Le coloris ne lui convenait pas, mais elle a pu l’échanger sans voir le montant que j’avais payé.",
    author: "Claire M. · achat cadeau",
    rating: 5,
    verifiedPurchase: true,
    source: "post_purchase",
    context: "Échange cadeau · contenu de démonstration",
    tags: ["gift", "returns", "color", "exchange"],
  },
  {
    id: "EVD-RETURN-01",
    body: "Le format était trop grand pour mon usage quotidien. Le retour a été enregistré le jour même et remboursé quatre jours plus tard.",
    author: "Hugo N. · retour client",
    rating: 4,
    verifiedPurchase: true,
    source: "post_purchase",
    context: "Retour produit · contenu de démonstration",
    tags: ["returns", "balanced", "size", "refund"],
  },
  {
    id: "EVD-VALUE-01",
    body: "Je l’ai trouvé cher au départ, mais il remplace maintenant mon sac de travail et mon bagage de week-end.",
    author: "Nicolas A. · usage mixte",
    rating: 4,
    source: "trustpilot",
    context: "Rapport qualité-prix · contenu de démonstration",
    tags: ["value", "price", "business", "weekend", "balanced"],
  },
  {
    id: "EVD-FAMILY-01",
    body: "Les papiers, les goûters et les écouteurs restent dans la poche avant ; je n’ouvre plus tout le sac dans le terminal.",
    author: "Amina K. · voyage en famille",
    rating: 5,
    verifiedPurchase: true,
    source: "post_purchase",
    context: "Voyage avec enfants · contenu de démonstration",
    tags: ["family", "organization", "children_items", "airport"],
  },
];

evidenceSeedReviews.forEach(addReview);

const evidenceFocusDefinitions = Object.freeze({
  overall: { label: "Note et avis", title: "Ce que disent les clients.", summary: "Une lecture transparente des notes et de leurs sources.", terms: ["avis", "note", "client", "trustpilot"] },
  similar_use: { label: "Usage comparable", title: "Des retours proches de votre usage.", summary: "Les expériences les plus proches du besoin exprimé.", terms: ["usage", "trajet", "voyage", "quotidien", "travail"] },
  long_term: { label: "Après plusieurs mois", title: "Le produit jugé dans la durée.", summary: "Des retours après plusieurs mois, y compris les réserves signalées.", terms: ["long_term", "mois", "durability", "durable", "solid", "fermeture", "couture"] },
  balanced: { label: "Retours nuancés", title: "Ce qui plaît — et ce qui plaît moins.", summary: "Une sélection qui conserve aussi les limites et les motifs de retour.", terms: ["balanced", "retour", "rembours", "trop", "mais", "limite"] },
  color: { label: "Avis sur le coloris", title: "La couleur, vue par ses utilisateurs.", summary: "Rendu réel, entretien et perception du coloris sélectionné.", terms: ["color", "couleur", "coloris", "noir", "cream", "creme", "liberty", "motif"] },
  durability: { label: "Solidité vécue", title: "La solidité après usage.", summary: "Les mesures produit complétées par des retours d’utilisation.", terms: ["durability", "solid", "structure", "fermeture", "couture", "toile"] },
  weather: { label: "Pluie et protection", title: "Ce qui se passe quand il pleut.", summary: "Des retours concrets, avec la limite entre déperlant et imperméable.", terms: ["weather", "rain", "pluie", "averse", "eau", "housse"] },
  comfort: { label: "Confort réel", title: "Le confort pendant le trajet.", summary: "Portage, stabilité et charge racontés par des usages comparables.", terms: ["comfort", "confort", "bretelle", "dos", "velo", "cycling", "marche"] },
  cabin: { label: "Retours cabine", title: "Des voyageurs sur les mêmes trajets.", summary: "Les avis complètent les dimensions officielles sans les remplacer.", terms: ["cabin", "cabine", "airline", "compagnie", "ryanair", "easyjet", "air_france", "british_airways", "vol"] },
  organization: { label: "Organisation vécue", title: "Ce qui reste accessible en mouvement.", summary: "Des retours sur le rangement et les accès au quotidien.", terms: ["organization", "organisation", "poche", "compartiment", "ordinateur", "laptop", "passeport"] },
  gift: { label: "Confiance cadeau", title: "Offert, essayé, parfois échangé.", summary: "Les retours d’acheteurs cadeau, sans masquer les conditions d’échange.", terms: ["gift", "cadeau", "offert", "exchange", "echange", "destinataire"] },
  returns: { label: "Retours clients", title: "Quand le produit ne convient pas.", summary: "Motifs de retour et expérience de remboursement, sans les effacer.", terms: ["returns", "retour", "refund", "rembours", "echange", "exchange"] },
  value: { label: "Valeur perçue", title: "Le prix, après plusieurs usages.", summary: "Ce que les clients retiennent du rapport entre prix et usage.", terms: ["value", "price", "prix", "cher", "rentable", "qualite"] },
});

export const customerEvidenceFocuses = Object.freeze(Object.keys(evidenceFocusDefinitions));
export const customerEvidenceSources = Object.freeze(["auto", "all", "verified_purchase", "trustpilot", "post_purchase", "survey"]);

const normalizeSearch = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("fr")
  .replaceAll(/[^a-z0-9]+/g, " ")
  .trim();

export function inferCustomerEvidenceFocus(concern = "") {
  const query = normalizeSearch(concern);
  const rules = [
    ["color", /\b(couleur|coloris|noir|creme|bleu|bordeaux|liberty|motif)\b/],
    ["cabin", /\b(cabine|vol|compagnie|ryanair|easyjet|air france|british airways|avion|flight)\b/],
    ["weather", /\b(pluie|averse|eau|etanche|impermeable|deperlant)\b/],
    ["comfort", /\b(confort|bretelle|dos|velo|marche|porter|portage)\b/],
    ["gift", /\b(cadeau|offrir|destinataire|anniversaire)\b/],
    ["returns", /\b(retours?|rembours\w*|echange\w*|garantie\w*|problemes?|defauts?)\b/],
    ["organization", /\b(rangement|poche|compartiment|ordinateur|affaires|accessible)\b/],
    ["value", /\b(prix|cher|rentable|rapport qualite|vaut)\b/],
    ["long_term", /\b(longtemps|duree|mois|annee|vieillit|usure)\b/],
    ["durability", /\b(solide|solidite|resistant|durable|fermeture|couture|toile)\b/],
    ["balanced", /\b(defauts?|limites?|negatif|moins bien|decu|inconvenients?)\b/],
    ["overall", /\b(note|etoile|trustpilot|avis global|globalement)\b/],
  ];
  return rules.find(([, pattern]) => pattern.test(query))?.[0] || "similar_use";
}

export function selectCustomerEvidence({ concern = "", focus = "auto", source = "auto", profileKey = "", color = "", limit = 3 } = {}) {
  const resolvedFocus = focus === "auto" || !evidenceFocusDefinitions[focus] ? inferCustomerEvidenceFocus(concern) : focus;
  const definition = evidenceFocusDefinitions[resolvedFocus];
  const queryTerms = normalizeSearch(concern).split(" ").filter((term) => term.length > 2);
  const normalizedConcern = normalizeSearch(concern);
  const expandedTerms = [...queryTerms];
  [
    [/\b(velo|velotaf|cycl\w*)\b/, ["velo", "velotaf", "cycling"]],
    [/\b(avion|vol|cabine|compagnie)\b/, ["airline", "cabin"]],
    [/\b(pluie|averse|etanche|impermeable)\b/, ["rain", "weather"]],
    [/\b(solide|solidite|durable|duree|mois)\b/, ["durability", "long term"]],
    [/\b(cadeau|offrir|anniversaire)\b/, ["gift", "exchange"]],
    [/\b(retour\w*|rembours\w*|defaut\w*)\b/, ["returns", "refund", "balanced"]],
    [/\b(sali\w*|tache\w*|nettoy\w*|entretien)\b/, ["care"]],
  ].forEach(([pattern, terms]) => { if (pattern.test(normalizedConcern)) expandedTerms.push(...terms); });
  const focusTerms = definition.terms.map(normalizeSearch);
  const colorTag = normalizeSearch(color);
  const profileTag = normalizeSearch(profileKey);
  const eligible = registry.filter((review) => {
    if (source === "verified_purchase") return review.verifiedPurchase;
    if (!["auto", "all"].includes(source)) return review.source === source;
    return true;
  });
  const ranked = eligible.map((review, index) => {
    const haystack = normalizeSearch([review.body, review.context, review.author, ...(review.tags || [])].filter(Boolean).join(" "));
    const haystackWords = new Set(haystack.split(" "));
    const tags = (review.tags || []).map(normalizeSearch);
    let score = 0;
    if (profileTag && tags.includes(profileTag)) score += 5;
    if (colorTag && tags.includes(colorTag)) score += resolvedFocus === "color" ? 8 : 2;
    focusTerms.forEach((term) => { if (haystack.includes(term)) score += 4; });
    [...new Set(expandedTerms)].forEach((term) => {
      if (term.includes(" ") ? haystack.includes(term) : haystackWords.has(term)) score += 3;
    });
    if (review.verifiedPurchase) score += 1;
    if (resolvedFocus === "balanced" && (review.rating || 5) < 5) score += 5;
    return { review, score, index };
  }).sort((a, b) => b.score - a.score || a.index - b.index);

  const selected = [];
  const usedSources = new Set();
  if (["auto", "all"].includes(source)) {
    ranked.forEach(({ review }) => {
      if (selected.length >= limit || usedSources.has(review.source)) return;
      selected.push(review);
      usedSources.add(review.source);
    });
  }
  ranked.forEach(({ review }) => {
    if (selected.length >= limit || selected.some((item) => item.id === review.id)) return;
    selected.push(review);
  });

  const ratings = selected.map((review) => Number(review.rating)).filter(Boolean);
  const average = ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : null;
  return {
    focus: resolvedFocus,
    label: definition.label,
    title: definition.title,
    summary: definition.summary,
    reviews: selected,
    reviewIds: selected.map((review) => review.id),
    averageRating: average ? Number(average.toFixed(1)) : null,
    ratedCount: ratings.length,
    verifiedCount: selected.filter((review) => review.verifiedPurchase).length,
    sources: [...new Set(selected.map((review) => review.source))],
    prototype: selected.some((review) => review.prototype),
  };
}

export function registerProfileReviews(profile) {
  const profileTag = profile.key;
  const declared = profile.reviewQuotes?.length ? profile.reviewQuotes : [profile.quote, ...genericProofs].filter(Boolean);
  const profileReviewIds = declared.slice(0, 3).map((body, index) => recordFromText({
    id: `REV-${profile.key.toUpperCase()}-${String(index + 1).padStart(2, "0")}`,
    body,
    author: index === 0 ? profile.author : `Client comparable 0${index + 1} · prototype`,
    source: sourceCycle[index] || "prototype",
    tags: [profileTag, profile.colorway || "black", ...(profile.sequence || []).slice(0, 2)],
  }));

  const nodeReviewIds = new Map();
  [profile.hero, ...(profile.sections || [])].forEach((node, index) => {
    if (!node || !["reviews", "comments"].includes(node.variant)) return;
    if (node.variant === "reviews") {
      nodeReviewIds.set(index, profileReviewIds);
      return;
    }

    const tags = node.tags || [];
    const entries = node.entries || (node.quotes || commentProofs).map((body, entryIndex) => ({
      tag: tags[entryIndex] || tags.at(-1) || "Contexte comparable",
      quote: body,
      meta: node.source || "Profil comparable · contenu de prototype",
    }));
    const ids = entries.map((entry, entryIndex) => recordFromText({
      id: `REV-${profile.key.toUpperCase()}-C${String(entryIndex + 1).padStart(2, "0")}`,
      body: entry.quote,
      author: entry.author || "Profil comparable · prototype",
      source: entry.source || (entryIndex === 1 ? "trustpilot" : "prototype"),
      kind: "comment",
      tags: [profileTag, entry.tag, ...(tags || [])],
      meta: entry.meta,
    }));
    nodeReviewIds.set(index, ids);
  });

  return { profileReviewIds, nodeReviewIds };
}

export const reviewManifest = registry;

export function getReview(id) {
  return byId.get(id) || null;
}

export function getReviews(ids = []) {
  return ids.map(getReview).filter(Boolean);
}

export const reviewSourceLabels = Object.freeze({
  post_purchase: "Après-achat",
  trustpilot: "Trustpilot",
  survey: "Enquête client",
  instagram: "Instagram",
  prototype: "Prototype",
});
