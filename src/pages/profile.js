import { renderHero } from "../components/heroes.js";
import { shopFooter, shopHeader, stickyBar } from "../components/primitives.js";
import { renderSection } from "../components/sections.js";
import { anchorsForNode, attachNavigationAnchors } from "../core/navigation-anchors.js";

export function renderProfilePage(profile) {
  return `
    <div class="shop-page ${profile.sketchMode ? "sketch-experience" : ""}" data-profile="${profile.key}">
      ${shopHeader()}
      ${attachNavigationAnchors(renderHero(profile.hero, profile), anchorsForNode(profile.hero, "hero"))}
      ${profile.sections.map((node) => attachNavigationAnchors(renderSection(node, profile), anchorsForNode(node))).join("")}
      ${stickyBar(profile)}
      ${profile.key === "p15" ? "" : shopFooter()}
    </div>`;
}
