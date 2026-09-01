import { renderHero } from "../components/heroes.js";
import { shopFooter, shopHeader, stickyBar } from "../components/primitives.js";
import { renderSection } from "../components/sections.js";

export function renderProfilePage(profile) {
  return `
    <div class="shop-page" data-profile="${profile.key}">
      ${shopHeader()}
      ${renderHero(profile.hero, profile)}
      ${profile.sections.map((node) => renderSection(node, profile)).join("")}
      ${stickyBar(profile)}
      ${profile.key === "p15" ? "" : shopFooter()}
    </div>`;
}
