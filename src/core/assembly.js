import { assetManifest, scenarioSeeds } from "../data/scenario-system.js";
import { getLayoutDefinition } from "../data/layout-registry.js";
import { getReview, getReviews, registerProfileReviews } from "../data/reviews.js";
import { inferBlockForNode } from "../data/block-registry.js";

const assetByPath = new Map(assetManifest.map((asset) => [asset.path, asset]));
const assetById = new Map(assetManifest.map((asset) => [asset.id, asset]));
const omitted = Symbol("asset-reference");

const clone = (value) => value == null ? value : structuredClone(value);

function extractAssetReferences(value, path, bindings) {
  if (typeof value === "string" && value.startsWith("./assets/")) {
    const asset = assetByPath.get(value);
    bindings[path.join(".")] = asset?.id || value;
    return omitted;
  }
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      const next = extractAssetReferences(item, [...path, index], bindings);
      return next === omitted ? null : next;
    });
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).flatMap(([key, item]) => {
      const next = extractAssetReferences(item, [...path, key], bindings);
      return next === omitted ? [] : [[key, next]];
    }));
  }
  return value;
}

function setAtPath(target, path, value) {
  const parts = path.split(".");
  let cursor = target;
  parts.forEach((part, index) => {
    const isLast = index === parts.length - 1;
    if (isLast) cursor[part] = value;
    else {
      const nextIsIndex = /^\d+$/.test(parts[index + 1]);
      if (cursor[part] == null) cursor[part] = nextIsIndex ? [] : {};
      cursor = cursor[part];
    }
  });
}

function resolveAssetReference(reference) {
  return assetById.get(reference)?.path || reference;
}

export function createLayoutInstance(node, assemblyKey, index) {
  const layoutId = node.id;
  const layoutVariant = node.variant;
  const definition = getLayoutDefinition(layoutId, layoutVariant);
  const blockTemplate = inferBlockForNode(node);
  const rawProps = Object.fromEntries(Object.entries(node).filter(([key]) => !["id", "variant", "type", "blockId", "templateBlockId", "blockPurpose", "contentBindings"].includes(key)));
  const assetBindings = {};
  const props = extractAssetReferences(rawProps, [], assetBindings);
  const position = index === 0 ? "hero" : `section-${String(index).padStart(2, "0")}`;
  return {
    instanceId: `${assemblyKey}-${position}`,
    templateId: definition.templateId,
    layoutId,
    layoutVariant,
    type: definition.type,
    blockId: node.blockId || `block.${assemblyKey}.${position}`,
    templateBlockId: node.templateBlockId || blockTemplate?.id || null,
    props,
    assetBindings,
    contentBindings: clone(node.contentBindings) || {},
    enabled: true,
  };
}

export function resolveLayoutInstance(instance) {
  const node = clone(instance.props) || {};
  Object.entries(instance.assetBindings || {}).forEach(([slot, reference]) => {
    setAtPath(node, slot, resolveAssetReference(reference));
  });
  return {
    id: instance.layoutId,
    variant: instance.layoutVariant,
    type: instance.type,
    blockId: instance.blockId || null,
    templateBlockId: instance.templateBlockId || null,
    contentBindings: clone(instance.contentBindings) || {},
    content: {
      reviews: getReviews(instance.contentBindings?.reviews || []),
    },
    ...node,
  };
}

export function createAssemblyFromProfile(profile) {
  const { hero, sections, ...profileProps } = profile;
  const { profileReviewIds, nodeReviewIds } = registerProfileReviews(profile);
  delete profileProps.reviewQuotes;
  delete profileProps.quote;
  delete profileProps.author;
  profileProps.reviewRefs = profileReviewIds;
  const nodes = [hero, ...(sections || [])].map((node, index) => createLayoutInstance(node, profile.key, index));
  nodes.forEach((instance, index) => {
    if (nodeReviewIds.has(index)) instance.contentBindings.reviews = nodeReviewIds.get(index);
    if (instance.type === "hero" && instance.layoutVariant === "trust" && profileReviewIds.length) instance.contentBindings.reviews = profileReviewIds.slice(0, 1);
    if (instance.layoutVariant === "comments") {
      delete instance.props.entries;
      delete instance.props.quotes;
      delete instance.props.tags;
    }
  });
  const scenario = scenarioSeeds.find((seed) => seed.key === profile.key);
  return {
    id: scenario ? `ASM-${scenario.code}` : `ASM-${profile.key.toUpperCase()}`,
    key: profile.key,
    label: profile.title,
    profileProps: clone(profileProps),
    nodes,
    blockRefs: nodes.map((node) => node.blockId),
    variants: [
      { id: "black", label: "Coloris noir", profilePatch: { colorway: "black" }, operations: [] },
      { id: "cream", label: "Coloris crème", profilePatch: { colorway: "cream" }, operations: [] },
      { id: "liberty-blue", label: "Liberty bleu", profilePatch: { colorway: "liberty-blue" }, operations: [] },
      { id: "liberty-burgundy", label: "Liberty bordeaux", profilePatch: { colorway: "liberty-burgundy" }, operations: [] },
    ],
  };
}

export function createAssemblyVariant({ id, label, profilePatch = {}, operations = [] }) {
  return { id, label, profilePatch, operations };
}

export function applyAssemblyVariant(assembly, variant) {
  const next = clone(assembly);
  if (!variant) return next;
  next.profileProps = { ...next.profileProps, ...(variant.profilePatch || {}) };
  for (const operation of variant.operations || []) {
    if (operation.op === "patch") {
      const node = next.nodes.find((candidate) => candidate.instanceId === operation.instanceId);
      if (!node) continue;
      node.props = { ...node.props, ...(operation.props || {}) };
      node.assetBindings = { ...node.assetBindings, ...(operation.assets || {}) };
      node.contentBindings = { ...node.contentBindings, ...(operation.content || {}) };
    }
    if (operation.op === "remove") next.nodes = next.nodes.filter((node) => node.instanceId !== operation.instanceId);
    if (operation.op === "insert" && operation.instance) next.nodes.splice(operation.index ?? next.nodes.length, 0, clone(operation.instance));
    if (operation.op === "move") {
      const from = next.nodes.findIndex((node) => node.instanceId === operation.instanceId);
      if (from < 0) continue;
      const [node] = next.nodes.splice(from, 1);
      next.nodes.splice(Math.max(0, Math.min(operation.index, next.nodes.length)), 0, node);
    }
  }
  next.blockRefs = next.nodes.map((node) => node.blockId);
  next.activeVariant = variant.id;
  return next;
}

export function resolveAssembly(assembly, variant = null) {
  const source = applyAssemblyVariant(assembly, variant);
  const activeNodes = source.nodes.filter((node) => node.enabled !== false).map(resolveLayoutInstance);
  const profileReviews = getReviews(source.profileProps.reviewRefs || []);
  return {
    ...clone(source.profileProps),
    key: source.key,
    assemblyId: source.id,
    assemblyVariant: source.activeVariant || "base",
    reviews: profileReviews,
    quote: profileReviews[0]?.body || "",
    author: profileReviews[0]?.author || "",
    hero: activeNodes[0],
    sections: activeNodes.slice(1),
  };
}

export function assetUsageForAssembly(assembly) {
  return assembly.nodes.flatMap((instance) => Object.entries(instance.assetBindings || {}).map(([slot, reference]) => ({
    instanceId: instance.instanceId,
    templateId: instance.templateId,
    slot,
    assetId: reference,
    asset: assetById.get(reference) || { id: reference, path: reference, type: "unknown" },
  })));
}

export function contentUsageForAssembly(assembly) {
  return assembly.nodes.flatMap((instance) => Object.entries(instance.contentBindings || {}).flatMap(([slot, references]) =>
    (Array.isArray(references) ? references : [references]).map((reference) => ({
      instanceId: instance.instanceId,
      templateId: instance.templateId,
      slot,
      reviewId: reference,
      review: getReview(reference),
    }))));
}
