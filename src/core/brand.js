export const defaultBrand = Object.freeze({
  name: "PORT 70",
  ink: "#0a0a0a",
  graphite: "#272727",
  fog: "#e8e8e3",
  paper: "#f7f7f2",
  review: "#f4b740",
  trust: "#00b67a",
  titleFont: "georgia",
});

export const titleFonts = Object.freeze({
  georgia: { label: "Georgia · éditoriale", stack: 'Georgia, "Times New Roman", serif' },
  times: { label: "Times · classique", stack: '"Times New Roman", Times, serif' },
  helvetica: { label: "Helvetica · moderniste", stack: 'Helvetica, Arial, sans-serif' },
  system: { label: "System · fonctionnelle", stack: 'system-ui, -apple-system, sans-serif' },
});

const colorPattern = /^#[0-9a-f]{6}$/i;

export function normalizeBrand(value = {}) {
  const brand = { ...defaultBrand, ...value };
  brand.name = String(brand.name || defaultBrand.name).trim().slice(0, 32) || defaultBrand.name;
  ["ink", "graphite", "fog", "paper", "review", "trust"].forEach((key) => {
    if (!colorPattern.test(brand[key])) brand[key] = defaultBrand[key];
    brand[key] = brand[key].toLowerCase();
  });
  if (!titleFonts[brand.titleFont]) brand.titleFont = defaultBrand.titleFont;
  return brand;
}

export function applyBrandTokens(value) {
  const brand = normalizeBrand(value);
  const root = document.documentElement;
  root.style.setProperty("--brand-ink", brand.ink);
  root.style.setProperty("--brand-graphite", brand.graphite);
  root.style.setProperty("--brand-fog", brand.fog);
  root.style.setProperty("--brand-paper", brand.paper);
  root.style.setProperty("--review", brand.review);
  root.style.setProperty("--trust", brand.trust);
  root.style.setProperty("--brand-title-font", titleFonts[brand.titleFont].stack);
  document.querySelectorAll("[data-brand-name]").forEach((element) => {
    element.textContent = brand.name;
  });
  return brand;
}
