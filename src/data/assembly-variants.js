import { createAssemblyVariant } from "../core/assembly.js";

// Merchant-authored examples. A variant only stores its differences from the base
// assembly: profile metadata and/or operations on stable layout instance IDs.
export const assemblyVariantPresets = Object.freeze({
  p1: [
    createAssemblyVariant({
      id: "airport-departure",
      label: "Départ aéroport",
      operations: [
        {
          op: "patch",
          instanceId: "p1-hero",
          props: {
            kicker: "Départ imminent · Dublin",
            title: "Un seul sac jusqu’à la porte d’embarquement.",
            body: "La même compatibilité cabine, présentée par une scène de départ plus éditoriale.",
          },
          assets: { asset: "A036" },
        },
      ],
    }),
  ],
  p2: [
    createAssemblyVariant({
      id: "gift-essential",
      label: "Cadeau essentiel",
      operations: [
        { op: "patch", instanceId: "p2-hero", props: { title: "Un cadeau prêt à offrir, sans choisir chaque détail.", cta: "Acheter ce cadeau" } },
        { op: "remove", instanceId: "p2-section-03" },
      ],
    }),
  ],
});
