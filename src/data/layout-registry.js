import { catalogGroups } from "./catalog.js";

const field = (key, type = "text", label = key) => ({ key, type, label });

const commonFields = [
  field("label", "text", "Nom interne"),
  field("kicker", "text", "Surtitre"),
  field("eyebrow", "text", "Repère éditorial"),
  field("title", "text", "Titre"),
  field("body", "textarea", "Texte"),
  field("cta", "text", "CTA"),
  field("media", "text", "Description du média"),
  field("assetCaption", "text", "Légende de l’asset"),
  field("reverse", "boolean", "Disposition inversée"),
  field("showTrust", "boolean", "Afficher la preuve de confiance"),
  field("colorSelector", "select", "Présentation du sélecteur de coloris"),
];

const variantFields = {
  airline: [field("airline", "text", "Compagnie"), field("dimensions", "text", "Dimensions")],
  "airline-compare": [field("model", "text", "Modèle"), field("modelDimensions", "text", "Dimensions du modèle"), field("futureNote", "textarea", "Note de compatibilité")],
  gift: [field("deliveryDate", "text", "Date de livraison"), field("deliveryNote", "text", "Promesse de livraison"), field("giftMessage", "textarea", "Message cadeau")],
  timeline: [field("steps", "list", "Étapes"), field("details", "list", "Détails")],
  reviews: [],
  comments: [],
  packing: [field("items", "collection", "Éléments illustrés")],
  mosaic: [field("images", "collection", "Images")],
  "scene-selector": [field("scenes", "collection", "Scènes")],
  "routine-selector": [field("moments", "collection", "Moments")],
  "loadout-switch": [field("loadouts", "collection", "Configurations")],
  final: [field("body", "textarea", "Texte final"), field("cta", "text", "CTA final")],
};

const supplementalLayouts = [
  ["H16", "immersive", "Hero immersif", "hero"], ["H17", "delivery", "Hero livraison", "hero"],
  ["S3", "cards", "Grille caractéristiques", "section"], ["S3", "trust", "Réassurance", "section"], ["S3", "warranty", "Garantie", "section"],
  ["S8", "airport-story", "Récit aéroport", "section"], ["S9", "hotspots", "Points fonctionnels", "section"],
  ["S11", "metrics", "Métriques", "section"], ["S20", "faq", "FAQ", "section"], ["S22", "comments", "Commentaires contextuels", "section"],
  ["S23", "gift-reassurance", "Réassurance cadeau", "section"], ["CTA", "final", "CTA final", "section"],
  ["J01", "journal", "Chapitre éditorial 01", "section"], ["J02", "journal", "Chapitre éditorial 02", "section"], ["J03", "journal", "Chapitre éditorial 03", "section"],
];

const registry = new Map();

function register(layoutId, variant, label, type) {
  const templateId = `${layoutId}:${variant}`;
  if (registry.has(templateId)) return;
  registry.set(templateId, {
    templateId,
    layoutId,
    variant,
    label,
    type,
    fields: [...commonFields, ...(variantFields[variant] || [])],
    assetSlots: [
      { key: "asset", label: "Asset principal", accepts: ["product", "context", "editorial", "sketch"] },
      ...(variant === "packing" ? [{ key: "items.*.asset", label: "Illustrations des éléments", accepts: ["icon"] }] : []),
    ],
    contentSlots: ["reviews", "comments"].includes(variant) ? [{ key: "reviews", label: "Avis liés", accepts: ["review", "comment", "ugc"] }] : [],
  });
}

catalogGroups.forEach((group) => group.items.forEach((item) => register(item.id, item.variant, item.label, item.type)));
supplementalLayouts.forEach(([layoutId, variant, label, type]) => register(layoutId, variant, label, type));

export const layoutRegistry = Object.freeze(Object.fromEntries(registry));

export function getLayoutDefinition(layoutId, variant) {
  return layoutRegistry[`${layoutId}:${variant}`] || {
    templateId: `${layoutId}:${variant}`,
    layoutId,
    variant,
    label: `${layoutId} · ${variant}`,
    type: layoutId.startsWith("H") ? "hero" : "section",
    fields: commonFields,
    assetSlots: [{ key: "asset", label: "Asset principal", accepts: ["product", "context", "editorial", "sketch"] }],
    contentSlots: ["reviews", "comments"].includes(variant) ? [{ key: "reviews", label: "Avis liés", accepts: ["review", "comment", "ugc"] }] : [],
  };
}

export function editableFieldsFor(instance) {
  const definition = getLayoutDefinition(instance.layoutId, instance.layoutVariant);
  const known = new Set(definition.fields.map((item) => item.key));
  const inferred = Object.keys(instance.props || {})
    .filter((key) => !known.has(key))
    .map((key) => field(key, Array.isArray(instance.props[key]) ? "collection" : typeof instance.props[key] === "boolean" ? "boolean" : typeof instance.props[key] === "object" ? "object" : "text"));
  return [...definition.fields, ...inferred];
}
