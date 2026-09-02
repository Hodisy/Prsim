import { createAssemblyFromProfile, resolveAssembly } from "../core/assembly.js";
import { assemblyVariantPresets } from "./assembly-variants.js";

const section = (id, variant, label, title, extra = {}) => ({ id, variant, label, title, ...extra });

const contextualColorAssets = (original, colorwaysRoot, filename, originalColor) => Object.fromEntries(
  ["black", "cream", "liberty-blue", "liberty-burgundy"].map((color) => [
    color,
    color === originalColor ? original : `${colorwaysRoot}/${color}/${filename}`,
  ]),
);

const productColorAssets = (filename) => Object.fromEntries(
  ["black", "cream", "liberty-blue", "liberty-burgundy"].map((color) => [
    color,
    `./assets/products/72h-${color}/${filename}`,
  ]),
);

const editorialVariantColorAssets = (root, filename) => Object.fromEntries(
  ["black", "cream", "liberty-blue", "liberty-burgundy"].map((color) => [
    color,
    `${root}/colorways/${color}/${filename}`,
  ]),
);

const japanColorAssets = (filename) => contextualColorAssets(
  `./assets/editorial/japan/${filename}`,
  "./assets/editorial/japan/colorways",
  filename,
  "cream",
);

const thomasColorAssets = (filename) => contextualColorAssets(
  `./assets/editorial/thomas/${filename}`,
  "./assets/editorial/thomas/colorways",
  filename,
  "black",
);

const barcelonaColorAssets = (filename) => contextualColorAssets(
  `./assets/editorial/barcelona/${filename}`,
  "./assets/editorial/barcelona/colorways",
  filename,
  "liberty-burgundy",
);

const giftFamilyColorAssets = (filename) => contextualColorAssets(
  `./assets/editorial/gift-family/${filename}`,
  "./assets/editorial/gift-family/colorways",
  filename,
  "cream",
);

const ryanEditorialColorAssets = (filename) => contextualColorAssets(
  `./assets/editorial/ryan/${filename}`,
  "./assets/editorial/ryan/colorways",
  filename.replace("-black", ""),
  "black",
);

const cyclingCommuteColorAssets = (filename) => contextualColorAssets(
  `./assets/editorial/cycling-commute/${filename}`,
  "./assets/editorial/cycling-commute/colorways",
  filename,
  "black",
);

const workSportColorAssets = (filename) => contextualColorAssets(
  `./assets/editorial/work-sport/${filename}`,
  "./assets/editorial/work-sport/colorways",
  filename,
  "black",
);

const packingItem = (label, specification, icon) => ({
  label,
  specification,
  asset: `./assets/icons/packing/${icon}.svg`,
});

const cabinPacking = () => [
  packingItem("Laptop", "Jusqu’à 16 pouces", "laptop"),
  packingItem("Deux chemises", "Pliage à plat", "shirt"),
  packingItem("Chaussures", "Une paire séparée", "shoes"),
  packingItem("Trousse", "Accès direct", "pouch"),
  packingItem("Passeport", "Poche avant", "passport"),
  packingItem("Câbles", "Poche zippée", "cables"),
];

const longTripPacking = () => [
  packingItem("Laptop", "Compartiment suspendu", "laptop"),
  packingItem("Quatre tenues", "Volume principal", "shirt"),
  packingItem("Chaussures", "Une paire séparée", "shoes"),
  packingItem("Trousse", "Format voyage", "pouch"),
  packingItem("Documents", "Accès sécurisé", "passport"),
  packingItem("Accessoires", "Organisation modulaire", "layers"),
];

const photoPacking = () => [
  packingItem("Deux boîtiers", "Compartiment modulable", "camera"),
  packingItem("Trois objectifs", "Cloisons rembourrées", "layers"),
  packingItem("Laptop 15 pouces", "Compartiment suspendu", "laptop"),
  packingItem("Batteries", "Poche zippée", "cables"),
  packingItem("Chiffon et filtres", "Trousse dédiée", "pouch"),
  packingItem("Documents", "Accès rapide", "passport"),
];

const workSportPacking = () => [
  packingItem("Laptop 16 pouces", "Housse séparée", "laptop"),
  packingItem("Tenue de sport", "Pliée dans le volume principal", "shirt"),
  packingItem("Baskets", "Une paire séparée", "shoes"),
  packingItem("Serviette", "Accès immédiat", "pouch"),
  packingItem("Gourde", "Poche extérieure", "pouch"),
  packingItem("Câbles", "Poche zippée", "cables"),
];

const familySharedPacking = () => [
  packingItem("Documents famille", "Poche côté corps", "passport"),
  packingItem("Deux changes", "Zones séparées", "shirt"),
  packingItem("Trousse commune", "Accès supérieur", "pouch"),
  packingItem("Une paire légère", "Fond du volume", "shoes"),
  packingItem("Chargeurs", "Poche zippée", "cables"),
  packingItem("Petits essentiels", "Chacun retrouve sa zone", "layers"),
];

const coachPacking = () => [
  packingItem("Billet et papiers", "Poche avant", "passport"),
  packingItem("Téléphone et câble", "Accès sans vider", "cables"),
  packingItem("Trousse de trajet", "Ouverture supérieure", "pouch"),
  packingItem("Deux tenues", "Volume principal", "shirt"),
  packingItem("Chaussures", "Une paire séparée", "shoes"),
  packingItem("Couche légère", "Prête pour l’arrivée", "layers"),
];

const campusPacking = () => [
  packingItem("Laptop 16 pouces", "Compartiment suspendu", "laptop"),
  packingItem("Deux cahiers", "À plat contre le dos", "layers"),
  packingItem("Chargeur et câbles", "Poche zippée", "cables"),
  packingItem("Trousse", "Accès direct", "pouch"),
  packingItem("Déjeuner", "Volume principal", "pouch"),
  packingItem("Tenue 48 h", "Pour rentrer le week-end", "shirt"),
];

const classic = {
  key: "classic",
  colorway: "black",
  name: "Site classique",
  title: "PDP Shopify classique",
  sub: "Page exhaustive, pensée pour couvrir tous les acheteurs.",
  sequence: ["Hero produit", "Bénéfices", "Features", "Usage", "Dimensions", "Matériaux", "Compagnies", "Comparaison", "UGC", "Avis", "FAQ", "CTA"],
  price: "149 €",
  facts: ["Format cabine vérifié", "Retours pendant 30 jours", "Garantie structure deux ans"],
  quote: "Il remplace mon sac de travail et mon bagage cabine sans ressembler à un équipement de randonnée.",
  author: "Mathieu L. · achat vérifié",
  hero: {
    id: "H1", variant: "classic", label: "PDP Shopify classique", kicker: "Collection permanente",
    title: "Le sac unique pour partir trois jours.",
    body: "Un format cabine sobre, organisé et conçu pour rester avec vous du départ au retour.",
    cta: "Acheter ce sac · 149 €", media: "Galerie produit",
    bundle: {
      name: "Pack organisation",
      description: "Module compressible assorti",
      basePrice: 149,
      addonPrice: 20,
      totalPrice: 169,
      baseCta: "Acheter ce sac · 149 €",
      cta: "Acheter le pack · 169 €",
      selected: false,
    },
    promotion: {
      title: "−15 % sur votre prochain achat",
      detail: "Code personnel envoyé après cette commande",
      code: "RETOUR15",
      durationSeconds: 28799,
    },
  },
  sections: [
    section("S1", "split", "Proposition de valeur", "Un volume net, plusieurs façons de voyager.", { media: "Lifestyle" }),
    section("S3", "cards", "Grille caractéristiques", "Tout ce qui compte, sans bruit."),
    section("S10", "packing", "Capacité / organisation", "Trois jours rangés en un regard.", { items: cabinPacking() }),
    section("S2", "split", "Dimensions et poids", "Pensé à partir des gabarits cabine.", { media: "Schéma dimensions", reverse: true }),
    section("S1", "split", "Matériaux et résistance", "Dense, mat, réparable.", { media: "Macro matière" }),
    section("S7", "table", "Compatibilité compagnies", "Les formats vérifiés avant votre départ."),
    section("S8", "product-grid", "Comparaison modèles", "Choisir le bon volume."),
    section("S15", "mosaic", "Usages réels", "Porté dans la vraie vie.", {
      images: [
        { label: "Départ", image: "./assets/editorial/ryan/01-airport-candid-black.png", caption: "AÉROPORT / BAGAGE PERSONNEL", alt: "Voyageur avec le sac noir dans un terminal" },
        { label: "Cabine", image: "./assets/context/ryan-airplane-seat-black.png", colorAssets: contextualColorAssets("./assets/context/ryan-airplane-seat-black.png", "./assets/context/ryan/colorways", "ryan-airplane-seat.png", "black"), caption: "AVION / SOUS LE SIÈGE", alt: "Sac noir posé sur un siège d’avion" },
        { label: "Eurostar", image: "./assets/editorial/thomas/01-eurostar-platform-consultant.png", colorAssets: thomasColorAssets("01-eurostar-platform-consultant.png"), caption: "QUAI / PORTÉ MAIN", alt: "Voyageur en costume tenant le sac noir devant un Eurostar" },
        { label: "Bureau", image: "./assets/editorial/paul/01-la-defense-commute.png", caption: "VILLE / PORTÉ DOS", alt: "Voyageur portant le sac noir à La Défense" },
        { label: "Vélo", image: "./assets/context/chloe-paris-bike-liberty-blue.png", colorAssets: contextualColorAssets("./assets/context/chloe-paris-bike-liberty-blue.png", "./assets/context/chloe/colorways", "chloe-paris-bike.png", "liberty-blue"), caption: "PARIS / LIBERTY BLEU", alt: "Cycliste portant le sac Liberty bleu dans Paris" },
      ],
    }),
    section("S13", "reviews", "Avis clients", "Les retours qui aident vraiment."),
    section("S3", "trust", "Livraison / retours / garantie", "Acheter sans zone grise."),
    section("S20", "faq", "FAQ", "Questions fréquentes."),
    section("CTA", "final", "CTA final", "Prêt pour le prochain départ ?", { cta: "Acheter ce sac · 149 €" }),
  ],
};

const adaptive = [
  {
    key: "p1", name: "Ryan", title: "Ryan — 18 ans · Ryanair · Dublin", sub: "Petit budget, pluie, supplément bagage.", price: "89 €",
    sequence: ["Compagnies compatibles", "Scène aéroport", "Pluie", "Commentaires ciblés", "CTA"],
    hero: { id: "H12", variant: "airline", label: "Compagnie vérifiée", kicker: "Ryan · Ryanair · Dublin", title: "Votre aller-retour tient sous le siège.", body: "Le format sélectionné respecte la contrainte du vol et évite le supplément cabine.", cta: "Acheter pour mon vol", media: "Sac noir dans une cabine d’avion", asset: "./assets/context/ryan-airplane-seat-black.png", colorAssets: {
      black: "./assets/context/ryan-airplane-seat-black.png",
      cream: "./assets/context/ryan/colorways/cream/ryan-airplane-seat.png",
      "liberty-blue": "./assets/context/ryan/colorways/liberty-blue/ryan-airplane-seat.png",
      "liberty-burgundy": "./assets/context/ryan/colorways/liberty-burgundy/ryan-airplane-seat.png",
    }, airline: "RYANAIR", dimensions: "40 × 20 × 25 cm", showTrust: true },
    sections: [
      section("S24", "airline-compare", "Compagnies compatibles", "Compatible aujourd’hui, prêt pour les prochains vols.", {
        airline: "Ryanair", model: "Passage 24", modelDimensions: "40 × 20 × 25 cm",
        futureNote: "Ryanair est la règle la plus stricte : le Passage 24 y passe sous le siège et reste compatible avec les trois autres formats affichés.",
      }),
      section("S8", "airport-story", "Aéroport / coût évité", "Il traverse l’aéroport avec son seul bagage.", {
        media: "Ryan dans le terminal avec le sac noir",
        asset: "./assets/editorial/ryan/01-airport-candid-black.png",
        colorAssets: ryanEditorialColorAssets("01-airport-candid-black.png"),
        assetCaption: "DÉPART / BAGAGE PERSONNEL / DUBLIN",
        body: "Une scène de départ ordinaire : le sac reste sur le dos, passe avec lui jusqu’à la porte et ne crée aucune étape supplémentaire au comptoir bagage.",
        costs: [["Sac sous le siège", "Inclus"], ["Option bagage aller-retour", "84 €"], ["Coût évité", "84 €"]],
      }),
      section("S1", "split", "Protection pluie", "Dublin peut changer d’avis. Le tissu aussi.", { media: "Sac sous la pluie" }),
      section("S22", "comments", "Commentaires Ryanair", "Des avis qui ont pris le même vol.", { tags: ["Même compagnie", "Pluie à Dublin", "Premier vol"] }),
    ],
    facts: ["Aucun supplément cabine", "Tissu déperlant", "Poids contenu à 980 g"],
    quote: "Même rempli, il est passé sous le siège sans discussion à l’embarquement.", author: "Léo B. · même compagnie",
  },
  {
    key: "p2", name: "Sophie", title: "Sophie — grand-mère · cadeau pour sa petite-fille", sub: "Anniversaire, date de livraison, choix cadeau rassurant.", price: "159 €",
    colorway: "cream",
    productName: "Passage 32 · Crème",
    sequence: ["Cadeau prêt", "Livraison", "Moment du cadeau", "Ses prochains week-ends", "Échange", "Avis cadeau", "CTA"],
    hero: {
      id: "H13", variant: "gift", label: "Cadeau prêt à offrir", kicker: "Anniversaire · pour sa petite-fille",
      title: "Un cadeau prêt à temps, même si elle change d’avis.",
      body: "La date est confirmée avant l’achat. La carte est offerte, le prix reste masqué et sa petite-fille pourra choisir un échange ou un bon d’achat.",
      cta: "Acheter ce cadeau · 159 €", media: "Cadeau prêt à offrir",
      asset: "./assets/editorial/gift-family/01-gift-ready.png",
      colorAssets: giftFamilyColorAssets("01-gift-ready.png"),
      assetCaption: "CADEAU / CARTE PERSONNALISÉE / PRIX MASQUÉ",
      showTrust: true, giftExperience: true,
      deliveryDate: "Vendredi 4 septembre",
      deliveryNote: "Deux jours avant son anniversaire",
      giftMessage: "Bon anniversaire. Pour tous tes prochains week-ends.",
      bundle: {
        name: "Pack cadeau week-end",
        description: "Module compressible assorti · carte personnalisée offerte",
        basePrice: 159,
        addonPrice: 20,
        totalPrice: 179,
        baseCta: "Acheter ce cadeau · 159 €",
        cta: "Acheter le pack cadeau · 179 €",
      },
    },
    sections: [
      section("S17", "timeline", "Livraison avant anniversaire", "Commandé aujourd’hui, offert dimanche.", {
        steps: ["Aujourd’hui · 1 sept.", "Expédié · 2 sept.", "Livré · 4 sept."],
        details: ["Commande et carte confirmées", "Suivi envoyé à Sophie", "Deux jours avant l’anniversaire"],
      }),
      section("S21", "journal", "Moment du cadeau", "Une grand-mère offre un départ, pas seulement un objet.", {
        media: "Une grand-mère offre le sac à sa petite-fille",
        asset: "./assets/editorial/gift-family/02-grandmother-gift.png",
        colorAssets: giftFamilyColorAssets("02-grandmother-gift.png"),
        assetCaption: "ANNIVERSAIRE / GRAND-MÈRE / PETITE-FILLE",
        eyebrow: "UN CADEAU QUI LUI RESSEMBLE",
        body: "Le sac arrive sans prix, accompagné du message choisi. Sa petite-fille peut essayer le coloris chez elle et l’échanger simplement s’il ne lui convient pas.",
        quote: "J’ai pu lui offrir quelque chose de personnel sans lui demander chaque détail à l’avance.",
        author: "Achat cadeau · avis vérifié",
      }),
      section("S10", "packing", "Ses prochains week-ends", "Un cadeau qu’elle pourra vraiment utiliser.", {
        media: "Sac prêt pour un week-end",
        asset: "./assets/editorial/gift-family/01-gift-ready.png",
        colorAssets: giftFamilyColorAssets("01-gift-ready.png"),
        assetCaption: "WEEK-END / ÉTUDES / PREMIERS DÉPARTS",
        items: cabinPacking(),
      }),
      section("S23", "gift-reassurance", "Échange cadeau", "Si elle préfère autre chose, le cadeau reste simple.", {
        assurances: [
          ["30 jours", "Pour essayer tranquillement après l’anniversaire."],
          ["Échange libre", "Un autre coloris ou un autre modèle, sans afficher le prix offert."],
          ["Bon d’achat", "Le montant peut être converti en crédit boutique à son nom."],
        ],
      }),
      section("S14", "reviews", "Avis acheteurs cadeau", "Offert, essayé, gardé."),
      section("CTA", "final", "CTA cadeau", "Son cadeau peut être prêt aujourd’hui.", { body: "Carte offerte, prix masqué et échange pendant 30 jours.", cta: "Acheter ce cadeau · 159 €" }),
    ],
    facts: ["Livré vendredi 4 septembre", "Échange ou bon d’achat pendant 30 jours", "Carte offerte et emballage sans prix"],
    reviewQuotes: [
      "La date annoncée a été respectée et aucun prix n’apparaissait dans le colis.",
      "La carte était sobre et personnelle. Elle a pu changer de coloris sans me demander la facture.",
      "J’avais peur de choisir le mauvais sac : l’option bon d’achat a rendu le cadeau beaucoup plus simple.",
    ],
    quote: "Elle l’a utilisé dès le week-end suivant. La présentation était vraiment sobre.", author: "Claire M. · achat cadeau vérifié",
  },
  {
    key: "p3", name: "Thomas", title: "Thomas — consultant · Eurostar", sub: "Organisation, vitesse, apparence premium.", price: "189 €",
    sequence: ["Hero Eurostar", "Matière & solidité", "Organisation business", "Quai Eurostar", "Parcours cadre", "Avis qualité", "CTA"],
    hero: { id: "H7", variant: "premium", label: "Hero Eurostar", kicker: "Consultant · Eurostar", title: "Du bureau à l’Eurostar sans changer de sac.", body: "Une toile dense, une structure qui garde sa ligne et une organisation pensée pour arriver directement au rendez-vous.", cta: "Acheter maintenant", media: "Sac noir dans l’Eurostar", asset: "./assets/context/thomas-eurostar-business-black.png", colorAssets: {
      black: "./assets/context/thomas-eurostar-business-black.png",
      cream: "./assets/context/thomas/colorways/cream/thomas-eurostar-business.png",
      "liberty-blue": "./assets/context/thomas/colorways/liberty-blue/thomas-eurostar-business.png",
      "liberty-burgundy": "./assets/context/thomas/colorways/liberty-burgundy/thomas-eurostar-business.png",
    }, showTrust: true },
    sections: [
      section("S1", "split", "Matière et solidité", "Une toile dense qui garde sa ligne.", { media: "Macro matière", body: "La toile mate résiste aux frottements du quotidien, tandis que les zones sollicitées sont doublées et conçues pour durer." }),
      section("S2", "split", "Organisation business", "Tout reste net jusqu’au rendez-vous.", { media: "Vue intérieure", body: "Ordinateur, chemise, documents et chargeurs disposent chacun d’un accès direct, sans vider le sac dans le train.", reverse: true }),
      section("S21", "journal", "Quai Eurostar", "Du quai à la réunion, sans transition.", {
        media: "Consultant sur le quai avec le sac noir",
        asset: "./assets/editorial/thomas/01-eurostar-platform-consultant.png",
        colorAssets: thomasColorAssets("01-eurostar-platform-consultant.png"),
        assetCaption: "QUAI / EUROSTAR / RENDEZ-VOUS",
        eyebrow: "ENTRE DEUX RENDEZ-VOUS",
        body: "Une silhouette nette à la main, une organisation accessible dès le siège et aucun bagage à reprendre avant de rejoindre le client.",
        quote: "Je descends du train prêt à rejoindre le client, sans repasser par l’hôtel.",
        author: "Consultant · trajet vérifié",
      }),
      section("S18", "journey", "Bureau → Eurostar → meeting → hôtel", "Une journée de cadre, quatre transitions sans rupture."),
      section("S12", "reviews", "Avis qualité", "La qualité remarquée après des semaines de déplacements."),
    ],
    facts: ["Toile haute densité et renforts structurels", "Zips métal conçus pour l’usage répété", "Silhouette stable, même chargée"],
    quote: "Après six mois d’Eurostar, la structure n’a pas bougé et les zips restent nets.",
    reviewQuotes: [
      "Après six mois d’Eurostar, la structure n’a pas bougé et les zips restent nets.",
      "La matière est dense, mate et ne se déforme pas, même avec l’ordinateur et deux jours de vêtements.",
      "En réunion, il ressemble à une pièce de travail, pas à un sac de voyage.",
    ],
    author: "Julien P. · consultant · achat vérifié",
  },
  {
    key: "p4", name: "Lucia", title: "Lucia — backpacking · Amérique du Sud", sub: "Long voyage, capacité, résistance.", price: "179 €",
    colorway: "liberty-burgundy",
    sequence: ["Hero contexte", "Packing", "Tests", "Carnet de voyage", "CTA"],
    hero: {
      id: "H3", variant: "split", label: "Hero contexte", kicker: "Long trajet · Amérique du Sud",
      title: "Plus de route, moins d’objets à surveiller.",
      body: "Un accès sécurisé, un volume généreux et des zones renforcées pour les bus et auberges.",
      cta: "Acheter pour mon voyage", media: "Départ en car dans les Andes",
      asset: "./assets/editorial/long-trip/colorways/liberty-burgundy/01-andes-coach.png",
      colorAssets: editorialVariantColorAssets("./assets/editorial/long-trip", "01-andes-coach.png"),
      assetCaption: "ANDES / CAR LONGUE DISTANCE / DÉPART",
      showTrust: true,
    },
    sections: [
      section("S10", "packing", "Capacité long voyage", "Trente-huit litres, sans devenir un coffre.", { items: longTripPacking() }),
      section("S11", "metrics", "Tests de résistance", "Les contraintes mesurées."),
      section("S21", "journal", "Carnet Amérique du Sud", "Douze jours sur la route.", { media: "Rio / Andes" }),
    ],
    facts: ["Charge testée à 17 kg", "Fond anti-abrasion", "Ouverture verrouillable"],
    quote: "Deux bus, une nuit en auberge, et le passeport toujours accessible.", author: "Ana C. · voyage longue durée",
  },
  {
    key: "p5", name: "Marc", title: "Marc — 63 ans · Italie en train", sub: "Poids, confort et simplicité.", price: "139 €",
    colorway: "cream",
    sequence: ["Hero poids", "Confort", "Train", "Avis senior", "CTA"],
    hero: {
      id: "H2", variant: "center", label: "Poids comme argument unique", kicker: "Train · Italie",
      title: "Un bagage léger avant même de le remplir.",
      body: "Le poids, la prise en main et l’accès supérieur simplifient chaque changement de train.",
      cta: "Acheter un sac léger", media: "Correspondance ferroviaire en Italie",
      asset: "./assets/editorial/rail-leisure/colorways/cream/01-italian-connection.png",
      colorAssets: editorialVariantColorAssets("./assets/editorial/rail-leisure", "01-italian-connection.png"),
      assetCaption: "ITALIE / CORRESPONDANCE / BAGAGE LÉGER",
      showTrust: true, compactMedia: true,
    },
    sections: [
      section("S1", "split", "Confort de portage", "Le poids reste près du corps.", { media: "Dos / bretelles" }),
      section("S2", "split", "Usage train", "Se lève et se range sans lutte.", { media: "Au-dessus du siège", reverse: true }),
      section("S12", "reviews", "Avis voyageur senior", "Simple à porter, simple à ouvrir."),
    ],
    facts: ["980 g à vide", "Poignées souples", "Intérieur contrasté"],
    quote: "Je le soulève facilement dans le train et je retrouve tout sans le vider.", author: "Philippe D. · 64 ans",
  },
  {
    key: "p6", name: "Emma", title: "Emma — Erasmus · easyJet", sub: "Budget serré, format cabine, validation sociale.", price: "149 €",
    colorway: "liberty-blue",
    sequence: ["Comparateur prix", "Compagnies compatibles", "Économie", "Commentaires ciblés", "CTA"],
    hero: {
      id: "H11", variant: "price", label: "Meilleur rapport qualité / prix", kicker: "Erasmus · easyJet",
      title: "Le meilleur rapport qualité-prix, déjà situé.",
      body: "Quatre options comparables : un modèle moins cher, le choix recommandé, puis deux options plus complètes.",
      cta: "Acheter le modèle recommandé · 149 €", media: "Comparateur de modèles",
      bundle: {
        name: "Pack Erasmus",
        description: "Module compressible assorti",
        basePrice: 149,
        addonPrice: 20,
        totalPrice: 169,
        baseCta: "Acheter le sac · 149 €",
        cta: "Acheter le pack Erasmus · 169 €",
      },
    },
    sections: [
      section("S24", "airline-compare", "Compagnies compatibles", "Votre easyJet aujourd’hui, les autres vols après.", {
        airline: "easyJet", model: "Passage 32", modelDimensions: "44 × 34 × 19 cm",
        futureNote: "Le Passage 32 est vérifié pour easyJet, Air France et Lufthansa. Pour un prochain Ryanair, le tableau vous indique tout de suite le Passage 24 à choisir.",
      }),
      section("S5", "before-after", "Supplément bagage vs un sac", "Le coût réel après deux allers-retours."),
      section("S22", "comments", "Commentaires petit budget", "Des avis qui comparent le même compromis.", { tags: ["Même budget", "Vol easyJet", "Usage Erasmus"] }),
    ],
    facts: ["Un choix moins cher", "Deux options plus complètes", "Format easyJet vérifié"],
    quote: "J’ai compris en quelques secondes pourquoi le deuxième modèle était le bon choix.", author: "Inès R. · étudiante Erasmus",
  },
  {
    key: "p7", name: "Hugo", title: "Hugo — 22 ans · premier voyage au Japon", sub: "Dix jours, Tokyo, Kyoto et un récit de voyage.", price: "159 €",
    colorway: "cream",
    productName: "Passage 32 · Crème",
    sequence: ["Mont Fuji", "Kyoto en fleurs", "Tokyo à pied", "Dernier dîner", "CTA"],
    hero: {
      id: "H3", variant: "split", label: "Hero carnet Japon", kicker: "Premier voyage · Japon",
      title: "Dix jours pour oublier qu’on porte un bagage.",
      body: "Un carnet de voyage en quatre images : le Japon reste le sujet, le sac devient simplement l’objet qui suit l’histoire.",
      cta: "Acheter pour mon voyage", media: "Sac posé face au mont Fuji",
      asset: "./assets/editorial/japan/colorways/cream/00-hero-fuji-flat-v2.png",
      colorAssets: {
        black: "./assets/editorial/japan/colorways/black/00-hero-fuji-flat-v2.png",
        cream: "./assets/editorial/japan/colorways/cream/00-hero-fuji-flat-v2.png",
        "liberty-blue": "./assets/editorial/japan/colorways/liberty-blue/00-hero-fuji-flat-v2.png",
        "liberty-burgundy": "./assets/editorial/japan/colorways/liberty-burgundy/00-hero-fuji-flat-v2.png",
      },
      assetCaption: "KAWAGUCHIKO / MATIN 03",
      showTrust: true,
    },
    sections: [
      section("J01", "journal", "Kyoto en fleurs", "À Kyoto, le bagage disparaît derrière le voyage.", {
        media: "Promenade sous les cerisiers à Kyoto",
        asset: "./assets/editorial/japan/01-kyoto-sakura.png",
        colorAssets: japanColorAssets("01-kyoto-sakura.png"),
        assetCaption: "KYOTO / CANAL / JOUR 05",
        eyebrow: "CHAPITRE 01 · KYOTO EN FLEURS",
        body: "Hugo quitte l’hôtel tôt, longe le canal et garde seulement une veste, son appareil photo et un carnet. Le sac reste présent, mais l’image raconte d’abord la ville et le printemps.",
        quote: "Au bout d’une heure, je ne pensais plus à ce que je portais. Je regardais juste les pétales tomber sur le canal.",
        author: "Hugo, 22 ans · récit fictif de prototype",
      }),
      section("J02", "journal", "Tokyo à pied", "Du premier café au dernier métro.", {
        media: "Marche du soir dans une rue de Tokyo",
        asset: "./assets/editorial/japan/02-tokyo-evening.png",
        colorAssets: japanColorAssets("02-tokyo-evening.png"),
        assetCaption: "TOKYO / 19:42 / JOUR 08",
        eyebrow: "CHAPITRE 02 · TOKYO À PIED",
        body: "La journée s’étire dans les rues secondaires, entre les vélos, les petites adresses et les lumières qui s’allument. Le sac suit le mouvement sans transformer la scène en démonstration produit.",
        quote: "On a marché jusqu’à ne plus savoir dans quel quartier on était. J’avais les mains libres et rien à réorganiser.",
        author: "Hugo, 22 ans · récit fictif de prototype",
        reverse: true,
      }),
      section("J03", "journal", "Dernier dîner", "Le voyage tient aussi dans les pauses.", {
        media: "Dîner improvisé dans un izakaya",
        asset: "./assets/editorial/japan/03-izakaya-dinner.png",
        colorAssets: japanColorAssets("03-izakaya-dinner.png"),
        assetCaption: "TOKYO / IZAKAYA / JOUR 09",
        eyebrow: "CHAPITRE 03 · UN DERNIER DÎNER",
        body: "Le sac est posé derrière la chaise pendant que la table se remplit. Ce dernier chapitre parle d’un souvenir ordinaire : des assiettes partagées, une conversation trop longue et le retour à pied.",
        quote: "C’est la photo que je préfère. Le sac est presque hors champ, mais il me rappelle exactement cette soirée.",
        author: "Hugo, 22 ans · récit fictif de prototype",
      }),
      section("CTA", "final", "CTA voyage", "Prêt pour votre propre départ ?", { cta: "Acheter pour ce voyage · 159 €" }),
    ],
    facts: ["Format cabine", "980 g à vide", "Retours pendant 30 jours"],
    quote: "C’est la photo que je préfère. Le sac est presque hors champ, mais il me rappelle exactement cette soirée.", author: "Hugo, 22 ans · récit fictif de prototype",
  },
  {
    key: "p8", name: "Chloé", title: "Chloé — cadeau pour un cycliste", sub: "Adéquation cadeau, vélo, pluie.", price: "169 €",
    colorway: "liberty-blue",
    sequence: ["Cadeau prêt", "Vélo", "Pluie", "Avis cadeau", "CTA"],
    hero: { id: "H13", variant: "gift", label: "Cadeau contextualisé", kicker: "Cadeau cycliste", title: "Un cadeau qui reste stable à vélo.", body: "Portage près du dos, pluie maîtrisée et échange simple si le volume doit être ajusté.", cta: "Acheter ce cadeau · 169 €", media: "Chloé à vélo dans Paris", asset: "./assets/context/chloe-paris-bike-liberty-blue.png", colorAssets: {
      black: "./assets/context/chloe/colorways/black/chloe-paris-bike.png",
      cream: "./assets/context/chloe/colorways/cream/chloe-paris-bike.png",
      "liberty-blue": "./assets/context/chloe-paris-bike-liberty-blue.png",
      "liberty-burgundy": "./assets/context/chloe/colorways/liberty-burgundy/chloe-paris-bike.png",
    }, assetCaption: "LIBERTY BLEU / PARIS / À VÉLO" },
    sections: [
      section("S1", "split", "Stabilité vélo", "La charge ne danse pas dans les virages.", { media: "Sac porté à vélo" }),
      section("S1", "split", "Résistance pluie", "Les détails utiles restent ton sur ton.", { media: "Cycliste sous la pluie", reverse: true }),
      section("S14", "reviews", "Avis cadeau cycliste", "Offert sans connaître chaque préférence."),
    ],
    facts: ["Sangle poitrine amovible", "Housse pluie intégrée", "Échange 30 jours"],
    quote: "Il ne bouge pas en roulant et ne fait pas sac de sport une fois posé.", author: "Émile V. · cycliste urbain",
  },
  {
    key: "p9", name: "Nicolas", title: "Nicolas — photographe · Islande", sub: "Protection du matériel et météo.", price: "219 €",
    sequence: ["Hero appareil + sac", "Matériel organisé", "Eau perlante", "Tests", "Notes ciblées", "CTA"],
    hero: {
      id: "H16", variant: "immersive", label: "Protection matériel", kicker: "Photographe · Islande",
      title: "Votre matériel reste sec, stable et accessible.",
      body: "Deux boîtiers, trois objectifs et un laptop protégés dans un sac pensé pour les changements de météo.",
      cta: "Acheter le sac", media: "Sac et appareil photo sous la pluie en Islande",
      asset: "./assets/editorial/nicolas/01-hero-camera-rain.png",
      colorAssets: {
        black: "./assets/editorial/nicolas/01-hero-camera-rain.png",
        cream: "./assets/editorial/nicolas/colorways/cream/01-hero-camera-rain.png",
        "liberty-blue": "./assets/editorial/nicolas/colorways/liberty-blue/01-hero-camera-rain.png",
        "liberty-burgundy": "./assets/editorial/nicolas/colorways/liberty-burgundy/01-hero-camera-rain.png",
      },
      assetCaption: "ISLANDE / APPAREIL + SAC / PLUIE FINE",
      bundle: {
        name: "Pack pluie Islande",
        description: "Housse pluie renforcée · protection pour les longues averses",
        basePrice: 219,
        addonPrice: 10,
        totalPrice: 229,
        baseCta: "Acheter le sac · 219 €",
        cta: "Acheter le pack pluie · 229 €",
      },
    },
    sections: [
      section("S10", "packing", "Matériel photo organisé", "Deux boîtiers, trois objectifs, un laptop.", {
        media: "Sac photo ouvert et entièrement organisé",
        asset: "./assets/editorial/nicolas/02-camera-packing.png",
        assetCaption: "2 BOÎTIERS / 3 OBJECTIFS / LAPTOP 15 POUCES",
        items: photoPacking(),
      }),
      section("S1", "split", "Eau perlante", "La pluie reste à la surface.", {
        media: "Macro de la toile noire sous la pluie",
        asset: "./assets/editorial/nicolas/03-water-beading-macro.png",
        assetCaption: "TOILE DÉPERLANTE / ZIP PROTÉGÉ / PLUIE FINE",
        body: "Les gouttes perlent sur la toile dense et s’éloignent du zip protégé. Une première barrière pensée pour les averses, sans transformer la déperlance en promesse d’immersion.",
        reverse: true,
      }),
      section("S11", "metrics", "Test pluie / charge / chocs", "Une protection mesurée."),
      section("S22", "comments", "Notes de photographes", "Les remarques des mêmes usages.", { tags: ["Même matériel", "Pluie islandaise", "Point de vigilance"] }),
    ],
    facts: ["Cloisons repositionnables", "Fond absorbant", "Zip protégé"],
    quote: "Sous la pluie islandaise, j’accédais au boîtier sans exposer tout le compartiment.", author: "Noah S. · photographe",
  },
  {
    key: "p10", name: "Amina", title: "Amina — voyage avec deux enfants", sub: "Accès rapide, mains libres, sous-siège.", price: "149 €",
    colorway: "cream",
    sequence: ["Hero accès", "Hotspots", "Sous-siège", "Avis parent", "CTA"],
    hero: {
      id: "H2", variant: "center", label: "Accès immédiat", kicker: "Deux enfants · aéroport",
      title: "Les mains libres, les essentiels à portée.",
      body: "Passeports, gourde et change rapide sont accessibles sans poser le sac.",
      cta: "Acheter pour mon voyage", media: "Parent et enfants dans un aéroport",
      asset: "./assets/editorial/family-airport/colorways/cream/01-terminal-hands-free.png",
      colorAssets: editorialVariantColorAssets("./assets/editorial/family-airport", "01-terminal-hands-free.png"),
      assetCaption: "AÉROPORT / DEUX ENFANTS / MAINS LIBRES",
      showTrust: true, compactMedia: true,
      promotionPlacement: "top",
      promotion: {
        title: "−15 % sur votre prochain achat",
        detail: "Pour équiper un autre membre de la famille · débloqué après cette commande",
        code: "FAMILLE15",
        durationSeconds: 28799,
      },
    },
    sections: [
      section("S9", "hotspots", "Organisation par accès rapide", "Quatre accès utilisables porté."),
      section("S2", "split", "Sous le siège", "Le sac reste avec vous pendant le vol.", { media: "Sac sous siège avion", reverse: true }),
      section("S12", "reviews", "Avis parent", "Une main suffit."),
    ],
    facts: ["Passeports côté corps", "Ouverture à une main", "Sous le siège"],
    quote: "J’ai sorti les passeports sans lâcher la main de mes enfants.", author: "Sarah K. · voyage en famille",
  },
  {
    key: "p11", name: "Paul", title: "Paul — ingénieur · acheteur analytique", sub: "Specs, comparaison et preuve objective.", price: "159 €",
    colorway: "black",
    sequence: ["Hero technique", "Trajet de travail", "Tableau", "Tests", "Avis expert", "CTA"],
    hero: { id: "H15", variant: "guided", label: "Questions guidées", kicker: "Analyse technique", title: "Les questions qui comptent, avec une réponse nette.", body: "Choisissez une objection : la réponse reste courte, vérifiable et reliée aux spécifications du produit.", cta: "Acheter ce modèle · 159 €", media: "Inspection de la matière et des fermetures",
      asset: "./assets/editorial/technical-buyer/colorways/black/01-material-check.png",
      colorAssets: editorialVariantColorAssets("./assets/editorial/technical-buyer", "01-material-check.png"),
      assetCaption: "MATIÈRE / ZIP / COUTURES / CONTRÔLE",
      questions: [
      { label: "Passe-t-il vraiment en cabine ?", answer: "Le format compact est pensé pour rester sous le siège sur le trajet sélectionné. Les dimensions exactes figurent dans le tableau comparatif. Elles sont à vérifier avec la règle associée au billet avant le départ." },
      { label: "Que signifie 1 200 cycles ?", answer: "C’est le résultat du protocole d’abrasion appliqué au tissu. Il sert à comparer la tenue de surface dans le temps, sans transformer une mesure en promesse vague. Les zones de frottement reçoivent aussi un renfort." },
      { label: "Que couvre la garantie ?", answer: "La garantie couvre les défauts de structure et de fabrication pendant deux ans. L’usure normale et les dommages causés par un usage non prévu sont examinés séparément. Un diagnostic est proposé avant toute réparation." },
      { label: "Quel est son poids réel ?", answer: "Le sac pèse 1,18 kg à vide, renforts et séparations inclus. Cette valeur permet de comparer directement le poids de structure avant d’ajouter l’ordinateur et les vêtements." },
      { label: "Comment le tissu vieillit-il ?", answer: "Le protocole d’abrasion mesure la tenue de surface, tandis que les zones de frottement reçoivent un renfort. Les résultats décrivent une résistance comparée, pas une promesse d’usure nulle." },
      { label: "Est-il réparable ?", answer: "Les défauts de structure sont diagnostiqués avant remplacement. Les tirettes, certaines sangles et plusieurs éléments de quincaillerie peuvent être changés séparément." },
    ] },
    sections: [
      section("S27", "commute-proof", "Trajet de travail", "Du parvis au métro, sans réorganiser sa journée.", {
        body: "Une situation de travail ordinaire : ordinateur, transports, rendez-vous. Le sac garde une ligne nette et reste proche du corps au lieu de devenir un objet à gérer.",
        scenes: [
          { label: "Parvis de La Défense", image: "./assets/editorial/paul/01-la-defense-commute.png", alt: "Paul marche sur le parvis de La Défense avec un sac noir compact sur le dos", caption: "PARVIS / LA DÉFENSE", time: "08:40" },
          { label: "Métro", image: "./assets/editorial/paul/02-metro-commute.png", alt: "Paul dans le métro parisien avec le sac noir porté près du corps", caption: "MÉTRO / TRAJET", time: "08:54" },
          { label: "Quai du métro", image: "./assets/editorial/paul/03-metro-platform-arrival.png", alt: "Paul attend un métro parisien bleu sur le quai, sac noir tenu à la main", caption: "QUAI / MÉTRO", time: "08:56" },
        ],
        proofs: ["1,18 kg à vide", "17 kg de charge testée", "1 200 cycles d’abrasion"],
        proofNotes: ["Le poids de structure avant l’ordinateur, les câbles et la journée.", "Une charge mesurée pour les journées où le sac porte réellement plus.", "Un protocole de résistance visible derrière une scène d’usage simple."],
      }),
      section("S19", "comparison", "Tableau comparatif complet", "Poids, volume, matière : les compromis visibles."),
      section("S11", "metrics", "Protocoles de test", "La méthode derrière les chiffres."),
      section("S12", "reviews", "Avis expert détaillé", "La lecture d’un acheteur analytique."),
    ],
    facts: ["1 200 cycles abrasion", "17 kg de charge", "1,18 kg total"],
    quote: "Le tableau ne masque pas les compromis entre poids et résistance.", author: "Paul G. · ingénieur",
  },
  {
    key: "p12", name: "Léa", title: "Léa — Instagram · Barcelone", sub: "Style, projection et couleur.", price: "159 €",
    colorway: "liberty-burgundy",
    productName: "Passage 32 · Liberty bordeaux",
    sequence: ["Parc Güell", "Look × lieu", "Rendu photo", "Packing", "Inspiration", "Commentaires", "CTA"],
    hero: {
      id: "H3", variant: "split", label: "Hero Parc Güell", kicker: "Barcelone · inspiration éditoriale",
      title: "Un motif qui trouve sa place dans l’image.",
      body: "Le Liberty bordeaux accompagne les couleurs de Barcelone sans voler la tenue — du matin au flash du soir.",
      cta: "Acheter · {color} · 159 €", media: "Parc Güell au lever du jour",
      asset: "./assets/editorial/barcelona/00-hero-park-guell.png",
      colorAssets: {
        black: "./assets/editorial/barcelona/colorways/black/00-hero-park-guell.png",
        cream: "./assets/editorial/barcelona/colorways/cream/00-hero-park-guell.png",
        "liberty-blue": "./assets/editorial/barcelona/colorways/liberty-blue/00-hero-park-guell.png",
        "liberty-burgundy": "./assets/editorial/barcelona/00-hero-park-guell.png",
      },
      assetCaption: "PARK GÜELL / LUMIÈRE DU MATIN",
      showTrust: true,
    },
    sections: [
      section("S25", "scene-selector", "Look × lieu", "Trois tenues. Trois images qui restent justes.", {
        cta: "Acheter · {color} · 159 €",
        scenes: [
          { label: "Blanc + denim", place: "Terrasse · El Born", note: "Le bordeaux donne un point d’ancrage à une silhouette claire, sans transformer la photo en placement produit.", image: "./assets/editorial/barcelona/01-cafe-el-born.png", colorAssets: barcelonaColorAssets("01-cafe-el-born.png"), alt: "Femme à une terrasse d’El Born avec le sac Liberty bordeaux posé sur une chaise", caption: "EL BORN / FIN DE MATINÉE" },
          { label: "Noir", place: "Quartier gothique", note: "Dans les ombres de la vieille ville, le motif reste lisible et apporte la seule couleur forte de la silhouette.", image: "./assets/editorial/barcelona/02-gothic-quarter.png", colorAssets: barcelonaColorAssets("02-gothic-quarter.png"), alt: "Femme en robe noire marchant dans le quartier gothique avec le sac Liberty bordeaux", caption: "BARRI GÒTIC / OMBRES DU MATIN" },
          { label: "Chemise + denim", place: "Barceloneta", note: "Face à la mer et aux tons très clairs, le bordeaux conserve sa profondeur sans devenir trop vif.", image: "./assets/editorial/barcelona/03-barceloneta.png", colorAssets: barcelonaColorAssets("03-barceloneta.png"), alt: "Femme en chemise blanche et jean sur la promenade de Barceloneta avec le sac bordeaux", caption: "BARCELONETA / LUMIÈRE CLAIRE" },
        ],
      }),
      section("S26", "photo-proof", "Rendu photo", "Le bordeaux reste profond quand la lumière change.", {
        proofs: [
          { label: "Lumière naturelle", note: "Couleur fidèle · détail lisible", image: "./assets/editorial/barcelona/05-sun-shade-detail.png", colorAssets: barcelonaColorAssets("05-sun-shade-detail.png"), alt: "Sac Liberty bordeaux sur un banc entre soleil et ombre" },
          { label: "Golden hour", note: "Chaleur sans sursaturation", image: "./assets/editorial/barcelona/00-hero-park-guell.png", colorAssets: barcelonaColorAssets("00-hero-park-guell.png"), alt: "Sac Liberty bordeaux porté au Parc Güell dans la lumière du matin" },
          { label: "Flash du soir", note: "Bordeaux, jamais rouge criard", image: "./assets/editorial/barcelona/04-evening-flash.png", colorAssets: barcelonaColorAssets("04-evening-flash.png"), alt: "Sac Liberty bordeaux porté à la main le soir sous un flash direct" },
        ],
      }),
      section("S10", "packing", "Beau même rempli", "Trois jours sans déformer la silhouette.", { items: cabinPacking() }),
      section("S15", "mosaic", "Inspiration Barcelone", "Des cadrages à reprendre, pas un faux mur Instagram.", {
        images: [
          { label: "Parc Güell", image: "./assets/editorial/barcelona/00-hero-park-guell.png", colorAssets: barcelonaColorAssets("00-hero-park-guell.png"), caption: "PARK GÜELL / 08:12" },
          { label: "Terrasse", image: "./assets/editorial/barcelona/01-cafe-el-born.png", colorAssets: barcelonaColorAssets("01-cafe-el-born.png"), caption: "EL BORN / CAFÉ" },
          { label: "Quartier gothique", image: "./assets/editorial/barcelona/02-gothic-quarter.png", colorAssets: barcelonaColorAssets("02-gothic-quarter.png"), caption: "BARRI GÒTIC / OMBRE" },
          { label: "Barceloneta", image: "./assets/editorial/barcelona/03-barceloneta.png", colorAssets: barcelonaColorAssets("03-barceloneta.png"), caption: "BARCELONETA / MATIN" },
          { label: "Après dîner", image: "./assets/editorial/barcelona/04-evening-flash.png", colorAssets: barcelonaColorAssets("04-evening-flash.png"), caption: "EL BORN / 23:08" },
        ],
      }),
      section("S22", "comments", "Commentaires ciblés", "Les remarques qui aident vraiment à choisir ce motif.", {
        tags: ["Couleur fidèle", "Silhouette stable", "Motif photogénique"],
        quotes: ["Le bordeaux est plus profond que rouge : il reste élégant même au flash.", "Une fois rempli, le sac ne gonfle pas au milieu de la silhouette.", "Le motif reste visible dans les photos larges sans attirer toute l’attention."],
        source: "Exemples de retours · contenu de prototype",
      }),
      section("CTA", "final", "CTA coloris", "Prête à l’emmener dans le cadre ?", { cta: "Acheter · {color} · 159 €" }),
    ],
    facts: ["Trois portages", "Liberty bordeaux photographié en lumière réelle", "32 litres"],
    quote: "Le motif reste visible dans mes photos larges sans attirer toute l’attention.", author: "Profil style similaire · prototype",
  },
  {
    key: "p13", name: "Daniel", title: "Daniel — 68 ans · voyage aux États-Unis", sub: "Confiance, garantie et compatibilité.", price: "149 €",
    colorway: "cream",
    sequence: ["Hero confiance", "Réassurance", "Garantie", "Compagnies", "Avis 55+", "CTA"],
    hero: {
      id: "H14", variant: "trust", label: "Confiance avant achat", kicker: "Premier achat · États-Unis",
      title: "Les garanties importantes, avant le bouton.",
      body: "Compatibilité, livraison, retours et avis vérifiés sont regroupés avant la commande.",
      cta: "Acheter en confiance · 149 €", media: "Voyageurs à la porte d’embarquement",
      asset: "./assets/editorial/trust-travel/colorways/cream/01-airport-gate.png",
      colorAssets: editorialVariantColorAssets("./assets/editorial/trust-travel", "01-airport-gate.png"),
      assetCaption: "AÉROPORT / PREMIER ACHAT / DÉPART",
    },
    sections: [
      section("S3", "trust", "Garantie / retour / paiement", "Trois conditions, écrites clairement."),
      section("S3", "warranty", "Garantie simple en 3 étapes", "Un problème ne devient pas un parcours."),
      section("S7", "table", "Compagnies USA sélectionnées", "Les règles des vols choisis."),
      section("S13", "reviews", "Avis voyageurs 55+", "Des retours comparables au profil."),
    ],
    facts: ["Retours gratuits 30 jours", "Paiement protégé", "Garantie deux ans"],
    quote: "Les dimensions et le retour gratuit étaient visibles avant l’achat.", author: "Robert T. · achat vérifié",
  },
  {
    key: "p14", name: "Maya", title: "Maya — digital nomad · Asie", sub: "Laptop, pluie tropicale et usage long.", price: "159 €",
    colorway: "liberty-blue",
    productName: "Passage 32 · Liberty bleu",
    sequence: ["Bangkok", "Routine", "Travail / 3 jours", "Protection", "Preuves", "Journal", "Retours ciblés", "CTA"],
    hero: {
      id: "H3", variant: "split", label: "Bureau mobile", kicker: "Bangkok · 08:12 · journée de travail",
      title: "Son bureau tient dans le trajet.",
      body: "Laptop suspendu, câbles accessibles et toile déperlante pour passer du transport au coworking sans réorganiser sa journée.",
      cta: "Acheter · {color} · 159 €", media: "Nora rejoint son coworking après la pluie à Bangkok", reverse: true,
      asset: "./assets/editorial/maya/00-hero-bangkok-rain.png", assetCaption: "BANGKOK / APRÈS LA PLUIE / 08:12",
      colorAssets: {
        black: "./assets/editorial/maya/colorways/black/00-hero-bangkok-rain.png",
        cream: "./assets/editorial/maya/colorways/cream/00-hero-bangkok-rain.png",
        "liberty-blue": "./assets/editorial/maya/00-hero-bangkok-rain.png",
        "liberty-burgundy": "./assets/editorial/maya/colorways/liberty-burgundy/00-hero-bangkok-rain.png",
      },
      proofs: ["Laptop jusqu’à 16 pouces", "Compartiment suspendu", "Travail / vêtements séparés"],
    },
    sections: [
      section("S28", "routine-selector", "Routine nomade", "Une journée, trois transitions.", {
        moments: [
          { time: "08:12", label: "Transport", proof: "Laptop protégé pendant le trajet", note: "Nora rejoint le train avec son ordinateur et tout son matériel déjà rangés pour le premier call.", image: "./assets/editorial/maya/07-transit-platform.png", alt: "Nora attend un train urbain à Bangkok avec le sac Liberty bleu", caption: "BANGKOK / TRANSPORT / 08:12" },
          { time: "09:03", label: "Coworking", proof: "Accès direct au matériel", note: "L’ordinateur, le chargeur et le carnet sortent sans ouvrir ni déplacer le compartiment vêtements.", image: "./assets/editorial/maya/02-coworking-bangkok.png", alt: "Nora travaille dans un coworking de Bangkok avec le sac près de sa chaise", caption: "COWORKING / PREMIER CALL / 09:03" },
          { time: "15:26", label: "Averse", proof: "Déperlant, pas imperméable", note: "La toile ralentit une pluie légère : le temps de rejoindre un abri, sans prétendre remplacer une housse sous une forte averse.", image: "./assets/editorial/maya/06-rain-fabric-detail.png", alt: "Gouttes de pluie sur la toile Liberty bleu", caption: "MATIÈRE / PLUIE LÉGÈRE / 15:26" },
        ],
      }),
      section("S29", "loadout-switch", "Chargement travail / voyage", "Le contenu change. Pas le sac.", {
        modes: [
          { key: "work", label: "Journée de travail", title: "Le bureau essentiel.", body: "Le matériel reste accessible sans ouvrir le volume principal.", image: "./assets/editorial/maya/01-pack-mobile-office.png", alt: "Nora range son laptop dans le sac Liberty bleu", caption: "CHARGEMENT / TRAVAIL", items: ["Laptop 16 pouces", "Chargeur", "Casque", "Carnet"] },
          { key: "travel", label: "Déplacement 3 jours", title: "Le même sac, après le travail.", body: "Le laptop reste dans sa zone pendant que les vêtements occupent le volume principal.", image: "./assets/editorial/maya/04-pack-three-days.png", alt: "Sac Liberty bleu préparé pour trois jours avec laptop et vêtements", caption: "CHARGEMENT / 3 JOURS", items: ["Laptop 16 pouces", "Deux tenues", "Trousse", "Câbles"] },
        ],
      }),
      section("S2", "split", "Protection ordinateur", "L’ordinateur ne touche pas le fond du sac.", {
        media: "Gros plan du compartiment ordinateur", asset: "./assets/editorial/maya/05-laptop-sleeve-detail.png", assetCaption: "COMPARTIMENT DÉDIÉ / 16 POUCES",
        body: "La housse rembourrée maintient l’ordinateur séparé du volume principal et de la base extérieure pendant les transitions.",
      }),
      section("S11", "metrics", "Preuves utiles", "Seulement les caractéristiques qui changent sa journée.", {
        metrics: [
          { value: "16\"", label: "Format laptop accueilli dans la zone dédiée", note: "COMPATIBILITÉ" },
          { value: "2 ZONES", label: "Matériel de travail séparé des vêtements", note: "ORGANISATION" },
          { value: "DÉPERLANT", label: "Protection de surface pour une pluie légère", note: "PAS IMPERMÉABLE" },
        ],
      }),
      section("S21", "journal", "Journal de travail nomade", "18:40 — Le bureau redevient bagage.", {
        media: "Nora dans un train du soir", asset: "./assets/editorial/maya/03-evening-train.png", assetCaption: "TRANSFERT DU SOIR / 18:40",
        eyebrow: "CHAPITRE 03 · APRÈS LE DERNIER CALL",
        body: "Le dernier appel est terminé. Le laptop retourne dans sa zone, le carnet dans la poche avant et le sac part avec elle sans nouvelle session de rangement.",
        quote: "Je ferme le sac et je pars. Mon bureau ne devient pas un problème de voyage.", author: "Nora · scénario éditorial",
      }),
      section("S22", "comments", "Retours de profils comparables", "Le métier, l’appareil et le contexte comptent plus qu’une note moyenne.", {
        entries: [
          { tag: "PRODUCT DESIGNER · 16\"", quote: "Je sors l’ordinateur et le chargeur sans toucher au compartiment vêtements.", meta: "Bangkok · quatre mois d’usage · exemple de prototype" },
          { tag: "DÉVELOPPEUSE · TRANSPORT", quote: "Sous une pluie légère, j’ai eu le temps de rejoindre un abri sans retrouver mes affaires humides.", meta: "Da Nang · trajets quotidiens · exemple de prototype" },
          { tag: "CONSULTANTE · CLIENTS", quote: "Il contient mon matériel sans donner l’impression que j’arrive avec un sac de randonnée.", meta: "Singapour / Bali · exemple de prototype" },
        ],
      }),
      section("CTA", "final", "CTA Liberty bleu", "Prête pour la prochaine journée de travail ?", { cta: "Acheter · {color} · 159 €" }),
    ],
    facts: ["Laptop suspendu 16 pouces", "Travail et vêtements séparés", "Tissu déperlant"],
    quote: "Mon bureau reste organisé du transport au coworking.", author: "Profil nomade similaire · prototype",
  },
  {
    key: "p15", name: "Kevin", title: "Kevin — départ demain", sub: "Disponibilité immédiate. Rien d’autre.", price: "149 €",
    sequence: ["Choix livraison", "Coursier domicile", "Timeline", "CTA"],
    hero: {
      id: "H17", variant: "delivery", label: "Livraison aujourd’hui", kicker: "Départ demain",
      title: "Choisissez où le récupérer aujourd’hui.",
      body: "Casier 24/24, point relais ou domicile express : les trois options sont disponibles, gratuites et confirmées avant l’achat.",
      cta: "Acheter avec cette livraison · 149 €", media: "Retrait du sac dans un casier 24/24",
      asset: "./assets/editorial/kevin/01-locker-pickup.png",
      colorAssets: {
        black: "./assets/editorial/kevin/01-locker-pickup.png",
        cream: "./assets/editorial/kevin/colorways/cream/01-locker-pickup.png",
        "liberty-blue": "./assets/editorial/kevin/colorways/liberty-blue/01-locker-pickup.png",
        "liberty-burgundy": "./assets/editorial/kevin/colorways/liberty-burgundy/01-locker-pickup.png",
      },
      assetCaption: "CASIER 24/24 / DISPONIBLE À 18:10 / GRATUIT",
    },
    sections: [
      section("S1", "split", "Domicile express", "Un coursier à votre porte avant 22:00.", {
        media: "Livraison express à domicile",
        asset: "./assets/editorial/kevin/02-home-courier.png",
        colorAssets: Object.fromEntries(["black", "cream", "liberty-blue", "liberty-burgundy"].map((color) => [color, "./assets/editorial/kevin/02-home-courier.png"])),
        assetCaption: "DOMICILE / AVANT 22:00 / EXPRESS OFFERT",
        body: "Le créneau est confirmé au moment de la commande. Le colis reste protégé jusqu’à la remise en main propre, sans supplément express.",
        reverse: true,
      }),
      section("S17", "timeline", "Commandé → disponible → départ", "Trois étapes, aucune incertitude.", {
        steps: ["Commandé · 16:20", "Préparé · 17:05", "Disponible · 18:10"],
        details: ["Option et transporteur confirmés", "Notification de suivi envoyée", "Retrait possible toute la nuit"],
      }),
      section("CTA", "final", "CTA final unique", "Votre option reste réservée pendant 15 minutes.", { body: "Casier, relais ou domicile express · livraison offerte.", cta: "Acheter avec cette livraison · 149 €" }),
    ],
    facts: ["Stock local confirmé", "Trois modes gratuits", "Choix du transporteur"],
    quote: "J’ai choisi le casier près du métro et récupéré le sac après le travail, sans surveiller l’heure de fermeture.", author: "Kevin A. · retrait express",
  },
  {
    key: "p16", name: "Atelier", title: "Atelier — construire son sac soi-même", sub: "Plans, proportions et logique de construction.", price: "149 €",
    colorway: "black",
    productName: "Passage 32 · Étude",
    sketchMode: true,
    sequence: ["Trois angles", "Patron", "Proportions", "Construction", "CTA"],
    hero: {
      id: "H18", variant: "sketch", label: "Étude de construction", kicker: "Atelier · Passage 32",
      title: "Construisez votre Passage.",
      body: "Trois vues montrent la forme, les volumes et les points d’assemblage. À vous de l’étudier — ou de nous laisser le fabriquer.",
      cta: "Acheter le sac déjà construit · 149 €", media: "Étude du Passage sous trois angles",
    },
    sections: [
      section("S2", "split", "Patron principal", "La forme tient dans trois volumes.", {
        media: "Vue de face du Passage 32",
        asset: "./assets/sketch/passage-front.png",
        assetCaption: "ÉTUDE 02 / FACE / PROPORTIONS",
        body: "Le corps principal, la poche avant et le couvercle restent lisibles séparément avant l’assemblage.",
      }),
      section("S11", "metrics", "Proportions utiles", "Les mesures avant les effets de style.", {
        metrics: [
          { value: "40 × 20 × 25", label: "Gabarit compact de référence", note: "CENTIMÈTRES" },
          { value: "32 L", label: "Volume intérieur cible", note: "CAPACITÉ" },
          { value: "3 VUES", label: "Face, trois-quarts et dos", note: "CONSTRUCTION" },
        ],
      }),
      section("S1", "split", "Dos et portage", "Les bretelles suivent la structure.", {
        media: "Vue arrière trois-quarts du Passage 32",
        asset: "./assets/sketch/passage-rear-three-quarter.png",
        assetCaption: "ÉTUDE 03 / DOS / PORTAGE",
        body: "Le dessin arrière positionne les bretelles, la poignée et les zones de renfort sans masquer la silhouette générale.",
        reverse: true,
      }),
      section("CTA", "final", "CTA atelier", "Vous préférez partir plutôt que le fabriquer ?", {
        body: "Le Passage 32 est disponible déjà assemblé, vérifié et garanti deux ans.",
        cta: "Acheter le sac déjà construit · 149 €",
      }),
    ],
    facts: ["Trois vues de construction", "Gabarit 40 × 20 × 25 cm", "Structure garantie deux ans"],
    quote: "Les trois vues rendent immédiatement la forme et les proportions compréhensibles.", author: "Étude atelier · prototype",
  },
  {
    key: "p17", name: "Vélotaf", title: "Vélotaf long · pluie légère", sub: "Trajet sportif, météo changeante, arrivée au bureau.", price: "149 €",
    colorway: "black",
    sequence: ["Retour sous la pluie", "Stabilité", "Laptop", "Avis vélotaf", "CTA"],
    hero: {
      id: "H3", variant: "split", label: "Vélotaf campagne-pluie", kicker: "Vélotaf long · retour du bureau",
      title: "Quarante minutes de vélo. Une journée intacte.",
      body: "Un portage stable, une toile déperlante pour l’averse légère et un laptop séparé du trajet comme de la pluie.",
      cta: "Acheter pour mes trajets", media: "Cycliste sur route mouillée", reverse: true,
      asset: "./assets/editorial/cycling-commute/01-rain-ride.png",
      colorAssets: cyclingCommuteColorAssets("01-rain-ride.png"),
      assetCaption: "VÉLOTAF / ROUTE HUMIDE / RETOUR 18:20",
    },
    sections: [
      section("S11", "metrics", "Les preuves du trajet", "Ce qui compte quand le trajet se répète.", {
        metrics: [
          { value: "45 MIN", label: "Un portage qui reste près du dos", note: "TRAJET" },
          { value: "16\"", label: "Laptop dans sa zone dédiée", note: "SÉPARATION" },
          { value: "DÉPERLANT", label: "Pour une pluie légère, pas pour une tempête", note: "MÉTÉO" },
        ],
      }),
      section("S1", "split", "Arriver sans tout réorganiser", "Le bureau reprend sa place en deux gestes.", {
        media: "Laptop séparé du volume principal",
        asset: "./assets/products/72h-black/04-open-interior.png",
        assetCaption: "LAPTOP / VÊTEMENTS / ACCÈS DIRECT",
        body: "L’ordinateur reste dans sa housse pendant que le reste du volume absorbe la journée : veste de pluie, repas ou change léger.",
      }),
      section("S22", "comments", "Avis de trajets comparables", "Des retours sur le trajet, pas sur une promesse abstraite.", {
        entries: [
          { tag: "42 MIN · VÉLOTAF", quote: "Même mouillé à l’extérieur, le contenu est resté organisé et le sac ne se balade pas au dos.", meta: "Trajet quotidien · exemple de prototype" },
          { tag: "LAPTOP · ROUTE", quote: "Je peux arriver au bureau, sortir l’ordinateur et oublier qu’il a plu pendant le retour.", meta: "Usage travail · exemple de prototype" },
          { tag: "PLUIE LÉGÈRE", quote: "La toile encaisse une averse normale. Pour un vrai déluge, je prends quand même une housse.", meta: "Retour honnête · exemple de prototype" },
        ],
      }),
      section("CTA", "final", "CTA vélotaf", "Prêt pour le prochain trajet ?", { body: "Livraison offerte · retours 30 jours · coloris au choix.", cta: "Acheter pour mes trajets · 149 €" }),
    ],
    facts: ["Portage près du dos", "Laptop séparé", "Toile déperlante"],
    quote: "Je l’oublie pendant le trajet, puis je retrouve le bureau exactement comme je l’ai rangé.", author: "Vélotaf longue distance · exemple de prototype",
  },
  {
    key: "p18", name: "Bureau + sport", title: "Bureau + sport · après le travail", sub: "Laptop, tenue, chaussures et retour simple.", price: "149 €",
    colorway: "black",
    sequence: ["Sortie du bureau", "Rangement séparé", "Tenue", "Avis comparables", "CTA"],
    hero: {
      id: "H3", variant: "split", label: "Bureau + sport", kicker: "Après le travail · sans second sac",
      title: "Le bureau finit. La soirée commence.",
      body: "Laptop, tenue de sport, serviette et baskets dans le même volume — sans les mélanger ni porter un second sac.",
      cta: "Acheter pour ma journée", media: "Arrivée au sport après le bureau",
      asset: "./assets/editorial/work-sport/01-gym-arrival.png",
      colorAssets: workSportColorAssets("01-gym-arrival.png"),
      assetCaption: "BUREAU → SPORT / 19:05 / UN SEUL SAC",
    },
    sections: [
      section("S1", "split", "Une tenue de sport ne remplace pas le laptop", "Chaque chose garde sa zone.", {
        media: "Rangement bureau et sport séparé",
        asset: "./assets/editorial/work-sport/02-sport-packing.png",
        colorAssets: workSportColorAssets("02-sport-packing.png"),
        assetCaption: "LAPTOP / TENUE / SERVIETTE / BASKETS",
        body: "La housse ordinateur reste à part. Le volume principal reçoit la tenue pliée, la serviette et une paire de baskets propres, sans faire basculer le sac dans le désordre.",
      }),
      section("S10", "packing", "La journée, puis la séance", "Ce qui entre sans compromis.", {
        asset: "./assets/editorial/work-sport/02-sport-packing.png",
        colorAssets: workSportColorAssets("02-sport-packing.png"),
        assetCaption: "VOLUME PRINCIPAL / APRÈS LE TRAVAIL",
        items: workSportPacking(),
      }),
      section("S22", "comments", "Avis de journées doubles", "Le vrai sujet : ne pas repasser chez soi.", {
        entries: [
          { tag: "BUREAU → SALLE", quote: "Je garde le laptop protégé jusqu’au soir et je n’ai pas besoin d’un sac de sport à côté.", meta: "Trois séances par semaine · exemple de prototype" },
          { tag: "CHAUSSURES SÉPARÉES", quote: "Les baskets et la serviette ont leur place sans s’écraser contre l’ordinateur.", meta: "Usage quotidien · exemple de prototype" },
          { tag: "RETOUR MAISON", quote: "Il reste assez sobre pour passer toute la journée au bureau avant la séance.", meta: "Profil comparable · exemple de prototype" },
        ],
      }),
      section("CTA", "final", "CTA bureau + sport", "Prêt à ne plus faire l’aller-retour ?", { body: "Une seule journée, un seul sac · livraison offerte.", cta: "Acheter pour ma journée · 149 €" }),
    ],
    facts: ["Laptop séparé", "Tenue et chaussures organisées", "Un seul sac pour la journée"],
    quote: "Le soir, je vais directement à la séance : rien à transférer, rien à oublier.", author: "Bureau + sport · exemple de prototype",
  },
  {
    key: "p19", name: "Famille 45–54", title: "Parent 45–54 ans · week-end avec ses enfants", sub: "Organisation partagée, documents communs et accès simple.", price: "149 €",
    colorway: "liberty-burgundy",
    productName: "Passage 32 · Liberty bordeaux",
    sequence: ["Départ familial", "Rangement partagé", "Accès commun", "Avis famille", "CTA"],
    hero: {
      id: "H3", variant: "split", label: "Départ familial", kicker: "Deux enfants · week-end partagé",
      title: "Les affaires communes ont enfin une place commune.",
      body: "Documents, chargeurs, trousse et change de secours restent accessibles sans mélanger les affaires de toute la famille.",
      cta: "Acheter pour nos départs · 149 €", media: "Départ familial sur le quai",
      asset: "./assets/editorial/family-shared/colorways/liberty-burgundy/01-platform-departure.png",
      colorAssets: editorialVariantColorAssets("./assets/editorial/family-shared", "01-platform-departure.png"),
      assetCaption: "QUAI / WEEK-END FAMILIAL / RANGEMENT PARTAGÉ",
      showTrust: true,
    },
    sections: [
      section("S10", "packing", "Rangement partagé", "Chacun sait où retrouver l’essentiel.", {
        media: "Passage 32 ouvert et organisé",
        asset: "./assets/products/72h-liberty-burgundy/04-open-interior.png",
        colorAssets: productColorAssets("04-open-interior.png"),
        assetCaption: "DOCUMENTS / CHANGES / TROUSSE / CHARGEURS",
        items: familySharedPacking(),
      }),
      section("S9", "hotspots", "Accès commun", "Pas besoin de vider le sac pour aider quelqu’un.", {
        body: "Les documents restent côté corps, les petits essentiels dans la poche avant et le change de secours dans le volume principal.",
      }),
      section("S22", "comments", "Avis de départs en famille", "Des retours sur l’organisation, pas sur un portrait type.", {
        entries: [
          { tag: "DEUX ENFANTS · WEEK-END", quote: "Les papiers et chargeurs communs restent au même endroit : personne ne fouille dans trois sacs.", meta: "Organisation familiale · exemple de prototype" },
          { tag: "ACCÈS RAPIDE", quote: "Je retrouve une trousse ou un change de secours sans sortir tout le contenu sur le quai.", meta: "Trajet en famille · exemple de prototype" },
          { tag: "COLORIS AU CHOIX", quote: "Le format reste sobre, mais le motif permet aussi de le reconnaître immédiatement parmi les bagages.", meta: "Usage partagé · exemple de prototype" },
        ],
      }),
      section("CTA", "final", "CTA famille", "Prêt pour le prochain départ à plusieurs ?", { body: "Livraison offerte · retours 30 jours · quatre coloris.", cta: "Acheter pour nos départs · 149 €" }),
    ],
    facts: ["Documents communs accessibles", "Organisation lisible par toute la famille", "Coloris modifiable"],
    reviewQuotes: [
      "Tout le monde sait où sont les papiers, la trousse et les chargeurs.",
      "Je peux aider l’un des enfants sans poser le sac ni déplacer les affaires des autres.",
      "Le motif bordeaux est facile à reconnaître sur le quai, tout en restant sobre une fois porté.",
    ],
    quote: "Tout le monde sait où sont les papiers, la trousse et les chargeurs.", author: "Voyage en famille · exemple de prototype",
  },
  {
    key: "p20", name: "Car longue distance", title: "Jeune adulte · car longue distance", sub: "Essentiels accessibles, format sous-siège et arrivée organisée.", price: "149 €",
    colorway: "black",
    sequence: ["Trajet de nuit", "Accès assis", "Sous le siège", "Packing", "Avis car", "CTA"],
    hero: {
      id: "H3", variant: "split", label: "Car longue distance", kicker: "Trajet de nuit · bagage à portée",
      title: "Le nécessaire reste avec vous, pas dans la soute.",
      body: "Billet, téléphone, câble et trousse de trajet restent accessibles depuis le siège. Le reste attend l’arrivée sans être défait.",
      cta: "Acheter pour mon trajet · 149 €", media: "Accès au sac depuis un siège de car",
      asset: "./assets/editorial/coach-youth/colorways/black/01-night-coach-access.png",
      colorAssets: editorialVariantColorAssets("./assets/editorial/coach-youth", "01-night-coach-access.png"),
      assetCaption: "CAR DE NUIT / SOUS LE SIÈGE / ACCÈS DIRECT",
      showTrust: true,
    },
    sections: [
      section("S9", "hotspots", "Accès depuis le siège", "Quatre essentiels sans ouvrir tout le volume.", {
        body: "Le billet, le téléphone, le câble et la petite trousse restent dans les accès supérieurs et avant.",
      }),
      section("S2", "split", "Rangement sous le siège", "Le sac reste accessible pendant le trajet.", {
        media: "Profil compact du Passage 32",
        asset: "./assets/products/72h-black/02-front.png",
        colorAssets: productColorAssets("02-front.png"),
        assetCaption: "44 × 34 × 19 CM / 32 L / FORMAT COMPACT",
        body: "Sa profondeur contenue évite de transformer l’espace aux pieds en zone de stockage désordonnée. Les règles du transporteur restent à vérifier avant le départ.",
        reverse: true,
      }),
      section("S10", "packing", "Le trajet et l’arrivée", "Ce qui doit rester disponible, puis ce qui peut attendre.", {
        media: "Sac ouvert avant un trajet en car",
        asset: "./assets/products/72h-black/04-open-interior.png",
        colorAssets: productColorAssets("04-open-interior.png"),
        assetCaption: "TRAJET / NUIT / ARRIVÉE",
        items: coachPacking(),
      }),
      section("S22", "comments", "Avis de trajets comparables", "Les détails qui comptent après plusieurs heures assis.", {
        entries: [
          { tag: "CAR DE NUIT", quote: "J’ai gardé téléphone, écouteurs et papiers accessibles sans rallumer tout le car pour chercher.", meta: "Trajet longue distance · exemple de prototype" },
          { tag: "SOUS LE SIÈGE", quote: "Le sac reste avec moi et je n’ai pas besoin d’ouvrir le compartiment principal pendant les pauses.", meta: "Bagage à portée · exemple de prototype" },
          { tag: "ARRIVÉE", quote: "À l’arrivée, les vêtements sont encore rangés : seuls les essentiels du trajet ont bougé.", meta: "Usage jeune adulte · exemple de prototype" },
        ],
      }),
      section("CTA", "final", "CTA car", "Prêt pour le prochain départ de nuit ?", { body: "Format compact · accès direct · quatre coloris.", cta: "Acheter pour mon trajet · 149 €" }),
    ],
    facts: ["Accès assis aux essentiels", "Format compact sous le siège", "Volume principal préservé"],
    reviewQuotes: [
      "Je garde ce dont j’ai besoin à portée sans défaire le sac pendant le trajet.",
      "La poche avant s’ouvre depuis le siège et le compartiment principal reste fermé jusqu’à l’arrivée.",
      "Après sept heures de car, mes vêtements étaient encore rangés et le sac se relevait facilement.",
    ],
    quote: "Je garde ce dont j’ai besoin à portée sans défaire le sac pendant le trajet.", author: "Car longue distance · exemple de prototype",
  },
  {
    key: "p21", name: "Campus étudiant", title: "Campus étudiant · cours et retours le week-end", sub: "Budget, poids, solidité et ordinateur réunis.", price: "149 €",
    colorway: "liberty-blue",
    productName: "Passage 32 · Liberty bleu",
    sequence: ["Choix budget", "Contenu campus", "Poids et résistance", "Comparaison", "Avis étudiant", "CTA"],
    hero: {
      id: "H3", variant: "split", label: "Campus entre deux cours", kicker: "Cours · bibliothèque · retour le week-end",
      title: "Le même sac du campus au train du vendredi.",
      body: "Le Passage 32 garde l’ordinateur séparé et assez de place pour rentrer deux jours, sans porter un deuxième bagage.",
      cta: "Acheter pour le campus · 149 €", media: "Étudiante traversant le campus avec le Passage 32",
      asset: "./assets/editorial/campus/colorways/liberty-blue/01-campus-walk.png",
      colorAssets: editorialVariantColorAssets("./assets/editorial/campus", "01-campus-walk.png"),
      assetCaption: "CAMPUS / ENTRE DEUX COURS / LAPTOP + 48 H",
      showTrust: true,
    },
    sections: [
      section("S10", "packing", "Contenu campus", "Cours la semaine, retour deux jours sans changer de sac.", {
        media: "Passage 32 Liberty bleu ouvert",
        asset: "./assets/products/72h-liberty-blue/04-open-interior.png",
        colorAssets: productColorAssets("04-open-interior.png"),
        assetCaption: "LAPTOP / CAHIERS / 48 H / 32 L",
        items: campusPacking(),
      }),
      section("S11", "metrics", "Poids et résistance", "Des chiffres comparables avant de le porter tous les jours.", {
        metrics: [
          { value: "1,18 KG", label: "Poids du Passage 32 à vide", note: "STRUCTURE" },
          { value: "16\"", label: "Laptop dans un compartiment suspendu", note: "PROTECTION" },
          { value: "1 200", label: "Cycles d’abrasion du protocole tissu", note: "RÉSISTANCE" },
        ],
      }),
      section("S19", "comparison", "Comparaison utile", "Prix, poids, volume : voir le compromis avant de choisir."),
      section("S22", "comments", "Avis d’usages étudiants", "Le sac jugé après les cours, le train et le week-end.", {
        entries: [
          { tag: "CAMPUS · 5 J/7", quote: "L’ordinateur ne flotte pas dans le volume et je garde assez de place pour les cahiers et le déjeuner.", meta: "Usage étudiant · exemple de prototype" },
          { tag: "RETOUR 48 H", quote: "Le vendredi, j’ajoute deux tenues sans transférer mes affaires dans un autre bagage.", meta: "Train + campus · exemple de prototype" },
          { tag: "BUDGET", quote: "Le comparateur montre clairement ce que les formats plus grands ajoutent — et ce dont je n’ai pas besoin.", meta: "Choix rationnel · exemple de prototype" },
        ],
      }),
      section("CTA", "final", "CTA campus", "Prêt pour les cours et le prochain week-end ?", { body: "Laptop séparé · 32 L · livraison offerte.", cta: "Acheter pour le campus · 149 €" }),
    ],
    facts: ["Laptop jusqu’à 16 pouces", "1,18 kg à vide", "Résistance mesurée"],
    reviewQuotes: [
      "Je passe des cours au train du vendredi sans refaire mon sac.",
      "Le compartiment ordinateur reste stable même quand j’ajoute mes cahiers et le déjeuner.",
      "Le comparateur m’a évité de payer pour un volume plus grand que ce dont j’ai besoin.",
    ],
    quote: "Je passe des cours au train du vendredi sans refaire mon sac.", author: "Usage campus · exemple de prototype",
  },
];

const profileSeeds = [classic, ...adaptive];

const colorSelectorByProfile = {
  classic: "swatches",
  p1: "menu",
  p2: "swatches",
  p3: "links",
  p4: "menu",
  p5: "menu",
  p6: "swatches",
  p7: "links",
  p8: "swatches",
  p9: "links",
  p10: "menu",
  p11: "links",
  p12: "swatches",
  p13: "menu",
  p14: "links",
  p15: "menu",
  p16: "links",
  p17: "swatches",
  p18: "swatches",
  p19: "swatches",
  p20: "menu",
  p21: "swatches",
};

profileSeeds.forEach((profile) => {
  profile.hero.colorSelector = colorSelectorByProfile[profile.key] || "swatches";
});

export const assemblies = Object.freeze(Object.fromEntries(profileSeeds.map((profile) => {
  const assembly = createAssemblyFromProfile(profile);
  assembly.variants.push(...(assemblyVariantPresets[profile.key] || []));
  return [assembly.key, assembly];
})));

export const profiles = Object.freeze(Object.fromEntries(Object.values(assemblies).map((assembly) => [assembly.key, resolveAssembly(assembly)])));

export function getAssembly(key) {
  return assemblies[key] || null;
}

export function resolveProfileVariant(key, variantId = "base") {
  const assembly = getAssembly(key);
  if (!assembly) return null;
  const variant = variantId === "base" ? null : assembly.variants.find((candidate) => candidate.id === variantId);
  return resolveAssembly(assembly, variant);
}

export const views = [
  { key: "foundation", index: "01", label: "Fondation", title: "Fondation de personnalisation", sub: "La forêt de signaux, le calcul du potentiel et le contrat de prepare_shopping_experience.", sequence: ["Forêt", "Signatures", "Voisinage", "Variations"] },
  { key: "brand", index: "02", label: "Brand", title: "Brand system", sub: "Charte de référence avec édition ponctuelle depuis le hero.", sequence: ["Fondations", "Typographie", "Composants", "Preuves", "Commerce"] },
  { key: "library", index: "03", label: "Layouts", title: "Catalogue de layouts", sub: "Les squelettes canoniques héritent de la Brand en UI et restent neutres en Wireframe.", sequence: ["Heroes", "Arguments", "Preuves", "CTA"] },
  { key: "assets", index: "04", label: "Assets", title: "Registre des assets", sub: "Deux familles réutilisables : images et avis, chacune liée par référence.", sequence: ["Images", "Avis", "Sources", "Tags"] },
  { key: "blocks", index: "05", label: "Blocs", title: "Registre des blocs", sub: "Les blocs concrets des assemblages, avec leurs variantes proof/switch exposées au WebMCP.", sequence: ["Proof / switch", "Heroes", "Sections", "Assemblages"] },
  { key: "assemblies", index: "06", label: "Assemblages", title: "Registre des assemblages", sub: "Blocs, copy, images, avis et variantes locales réunis avant leur association aux scénarios.", sequence: ["Blocs", "Copy", "Images", "Avis", "Variantes"] },
  { key: "scenarios", index: "07", label: "Scénarios", title: "Forêt de scénarios", sub: "Les besoins ciblés associés aux assemblages édités et aux prochains trous à mesurer.", sequence: ["Familles", "Assemblages", "Tags", "Analytics"] },
  { key: "mcp", index: "08", label: "MCP State", title: "État interne MCP", sub: "Le sandbox de session, les fonctions exposées et les ancres disponibles dans l’expérience active.", sequence: ["Scénario", "État", "Fonctions", "Ancres"] },
  { key: "preview", index: "09", label: "Preview", title: "Preview adaptative", sub: "La boutique rendue en place. Les fonctions WebMCP ne sont exposées qu’ici.", sequence: ["Préparer l’expérience", "Voisin le plus proche", "Variations", "Achat"] },
  ...Object.values(profiles).map((profile, index) => ({ key: profile.key, hidden: true, index: String(index), label: profile.name, title: profile.title, sub: profile.sub, sequence: profile.sequence })),
  { key: "payment", hidden: true, label: "Payment", title: "Paiement direct", sub: "Le temps de décision est figé au clic : rouge pour l’état enregistré, bleu pour le chiffre qui vient de changer.", sequence: ["Décision", "Temps de conversion", "Paiement"] },
];
