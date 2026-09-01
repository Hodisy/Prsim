import { renderHero } from "./heroes.js";
import { renderSection } from "./sections.js";

export function renderNode(node, profile) {
  return node.type === "hero" || node.id?.startsWith("H")
    ? renderHero(node, profile)
    : renderSection(node, profile);
}
