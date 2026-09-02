# Vision — génération assistée de scénarios PRSIM

## Statut

Cette vision est documentée pour une phase ultérieure. Elle ne crée aucun onglet, aucune page d’administration et aucun outil WebMCP supplémentaire dans le prototype actuel.

## Objectif

Accélérer la création de nouveaux scénarios à partir des demandes réellement observées, sans générer librement une boutique à chaque visite et sans rendre le parcours d’achat imprévisible.

Le rendu en temps réel reste piloté par un moteur programmatique. Un agent IA intervient seulement pour préparer de nouveaux contenus marchands que le merchant peut relire et intégrer.

## Boucle proposée

1. `prepare_shopping_experience` transforme la demande du shopper en signaux structurés.
2. Le moteur programmatique choisit toujours le scénario disponible le plus pertinent et applique ses variations locales.
3. La page Scénarios agrège les signatures observées et remonte les contextes insuffisamment couverts.
4. Un job d’auteur, déclenché séparément, regroupe les trous récurrents et prépare un brouillon de scénario.
5. Le rules harness vérifie le brouillon.
6. Un humain relit le copy, les preuves, les assets et l’assemblage avant toute intégration.
7. Le scénario validé rejoint la forêt et devient disponible pour le moteur déterministe.

## Répartition des responsabilités

### Moteur programmatique en temps réel

- normaliser les valeurs reçues par `prepare_shopping_experience` ;
- respecter les contraintes vérifiables ;
- choisir une structure et un scénario de référence ;
- activer au maximum quelques variations locales ;
- garantir un hero, un choix de coloris, un prix et un CTA d’achat ;
- ne jamais produire une page vide ;
- enregistrer anonymement la signature de demande pour mesurer les trous.

### Rules harness

- interdire les affirmations produit non documentées ;
- vérifier prix, dimensions, livraison et compatibilité ;
- limiter le nombre de sections et supprimer les doublons ;
- vérifier que l’ordre correspond à la manière de décider ;
- imposer les états mobile, desktop, wireframe, UI, français et anglais ;
- contrôler la présence des assets nécessaires ;
- refuser toute publication automatique.

### Agent IA d’auteur

- proposer un titre et un objectif de scénario ;
- sélectionner un ou plusieurs assemblages de référence ;
- suggérer un ordre de sections ;
- rédiger le copy à partir de faits autorisés ;
- lister les assets manquants et leurs briefs de génération ;
- expliquer pourquoi le nouveau scénario mérite d’exister ;
- produire un diff relisible, jamais une modification silencieuse.

## Critère de création d’un nouveau scénario

Un nouveau scénario est pertinent lorsque plusieurs demandes partagent :

- le même contexte principal ;
- une contrainte ou un blocage d’achat commun ;
- une manière de décider similaire ;
- un assemblage actuel insuffisant malgré les variations locales ;
- un volume de demandes ou une valeur commerciale suffisante.

Les coloris seuls ne justifient pas un nouveau scénario : ils restent des variantes de l’expérience. Un changement important de contexte, de preuve, de projection ou d’ordre de décision peut en justifier un.

## Sortie attendue d’un futur job d’auteur

```json
{
  "status": "draft",
  "observed_gap": "public_transit",
  "source_scenarios": ["p11", "p8"],
  "proposed_scenario": {
    "title": "Métro quotidien · accès et faible encombrement",
    "context": "public_transit",
    "section_order": [
      "hero",
      "upright_access",
      "laptop_organization",
      "compact_proof",
      "contextual_reviews",
      "purchase"
    ]
  },
  "missing_assets": [
    "hero métro en heure de pointe",
    "détail ouverture utilisable debout"
  ],
  "validation": {
    "facts_verified": false,
    "assets_complete": false,
    "human_review_required": true
  }
}
```

## Hors périmètre actuel

- génération automatique depuis un nouvel onglet PRSIM ;
- publication autonome par un agent ;
- embeddings ou appel modèle à chaque affichage ;
- création libre de layouts non présents dans la bibliothèque ;
- modification silencieuse de la Brand ou des faits produit.
