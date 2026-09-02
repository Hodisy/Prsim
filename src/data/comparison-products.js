const colors = ["black", "cream", "liberty-blue", "liberty-burgundy"];

const comparisonColorAssets = (filename) => Object.fromEntries(
  colors.map((color) => [color, `./assets/products/comparison/${color}/${filename}`]),
);

const passage32ColorAssets = Object.fromEntries(
  colors.map((color) => [color, `./assets/products/72h-${color}/01-hero-three-quarter.png`]),
);

export const comparisonProducts = Object.freeze([
  {
    name: "Passage 24", price: "119 €", size: "24 L", note: "Le moins cher",
    image: "./assets/products/comparison/liberty-blue/compact-24l.png",
    colorAssets: comparisonColorAssets("compact-24l.png"),
  },
  {
    name: "Passage 32", price: "149 €", size: "32 L", note: "Recommandé",
    image: "./assets/products/72h-liberty-blue/01-hero-three-quarter.png",
    colorAssets: passage32ColorAssets,
    recommended: true,
  },
  {
    name: "Passage 36", price: "169 €", size: "36 L", note: "Plus de place",
    image: "./assets/products/comparison/liberty-blue/expandable-36l.png",
    colorAssets: comparisonColorAssets("expandable-36l.png"),
  },
  {
    name: "Passage 42", price: "189 €", size: "42 L", note: "Plus grand",
    image: "./assets/products/comparison/liberty-blue/weekender-42l.png",
    colorAssets: comparisonColorAssets("weekender-42l.png"),
  },
]);
