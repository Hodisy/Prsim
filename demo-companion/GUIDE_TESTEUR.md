# Guide testeur — PRSIM companion

Ce dossier sert à démontrer un companion qui connaît déjà quelques préférences utiles, découvre les outils du site et prépare la boutique sans que l'humain demande explicitement « utilise WebMCP ».

## 1. Choisir le mode de démonstration

### Codex local

Ouvrir une nouvelle tâche Codex avec l'un de ces dossiers comme répertoire de travail :

- `demo-companion/personas/ryan`
- `demo-companion/personas/hugo`
- `demo-companion/personas/thomas`
- `demo-companion/personas/chloe`

Codex chargera les règles communes de `demo-companion/AGENTS.md`, puis le contexte du persona sélectionné.

### Projet ChatGPT Work

Créer un projet ChatGPT Work par persona. Copier dans ses instructions :

1. le contenu de `demo-companion/AGENTS.md` ;
2. le contenu du fichier `AGENTS.md` du persona choisi.

Dans ce mode, les fichiers locaux `AGENTS.md` ne constituent pas automatiquement les instructions du projet Work : il faut copier leur contenu dans les instructions du projet ou les fournir comme contexte.

## 2. Préparer le site

1. Depuis la racine PRSIM, lancer `bun run dev`.
2. Ouvrir `http://localhost:4173/#preview` dans le navigateur intégré de l'application ChatGPT.
3. Vérifier que les Website Tools sont activés dans les permissions du navigateur.
4. Vérifier que `prepare_shopping_experience` apparaît parmi les outils disponibles de la page.
5. Pour WebMCP, utiliser un modèle compatible tel que GPT-5.6 Sol ou GPT-5.6 Terra.
6. Revenir à l'expérience classique avant chaque nouveau persona.

## 3. Test principal — sans prononcer WebMCP

Message humain :

> Aide-moi à choisir un sac pour ce voyage.

Résultat attendu :

- le companion inspecte les outils de la page ;
- il appelle `prepare_shopping_experience` une seule fois ;
- il complète la demande avec le strict minimum provenant du persona actif ;
- la Preview change en place ;
- il présente une seule recommandation courte ;
- il ne dit ni « WebMCP », ni « profil », ni « scénario », ni « score » ;
- il n'énumère pas les autres modèles et s'arrête après la proposition.

Si le persona ne fournit pas assez de contexte, une seule question est acceptable :

> C'est pour quel type de trajet, et qu'est-ce qui compte le plus pour toi ?

## 4. Prompts par persona

### Ryan

> Trouve-moi le bon sac pour mon voyage, sans me faire lire dix options.

Attendu : Dublin, Ryanair, moins de 100 EUR, noir, compatibilité sous-siège prioritaire.

### Hugo

> Prépare-moi quelque chose pour ce voyage. Je veux surtout me projeter.

Attendu : Japon, crème, expérience visuelle et éditoriale. La réponse ne doit pas dévoiler les scènes avant que la page les montre.

### Thomas

> J'ai besoin du bon sac pour mon prochain déplacement professionnel.

Attendu : Eurostar, noir, matière, solidité, laptop et preuves professionnelles.

### Chloé

> Aide-moi à choisir ce cadeau, je veux éviter de me tromper.

Attendu : cadeau pour cycliste, liberty bleu, pluie légère, stabilité, avis et échange simple.

## 5. Tests de suivi

Après la préparation réussie, envoyer un seul de ces messages :

| Message humain | Outil attendu |
| --- | --- |
| « Finalement, montre-moi le noir. » | `choose_color` |
| « Il passe vraiment chez Ryanair ? » | `check_airline_fit` |
| « Est-ce réellement étanche ? » | `ask_product_question` |
| « Qu’en pensent les personnes qui l’utilisent tous les jours ? » | `show_customer_evidence` |
| « Et après plusieurs mois, il tient vraiment ? » | `show_customer_evidence` avec `focus: "auto"` |
| « Je veux seulement voir les avis Trustpilot. » | `show_customer_evidence` avec `source: "trustpilot"` |
| « Pourquoi as-tu choisi cette présentation ? » | `explain_choice` |
| « Ajoute le pack organisation. » | `set_bundle` |
| « Je veux repartir de zéro. » | `reset_shopping_experience` |
| « Je le prends. » | `buy_now`, puis confirmation avant paiement |

Le companion ne doit pas rappeler `prepare_shopping_experience` pour ces demandes locales.

### Test de réassurance : faire remonter les bons avis

Après une première expérience préparée, demander : « Il tient vraiment après plusieurs mois ? »

Le comportement attendu est :

- le companion appelle `show_customer_evidence` avec la question originale ;
- une seule section de preuve client apparaît ou remplace les avis existants ;
- la page défile jusqu’à cette section ;
- les avis conservent leur note, leur source, leur statut d’achat vérifié et leur mention de prototype ;
- une seconde question sur le coloris remplace ce bloc au lieu d’allonger la page.

### Test de continuité : comparer après la recommandation

Après une première expérience préparée, demander : « Il y a d’autres formats ? Je peux voir les quatre ? »

Le comportement attendu est :

- `prepare_shopping_experience` n’est plus exposé ;
- le companion appelle `change_experience_hero({ goal: "compare_models" })` ou `update_experience_blocks({ purpose: "model_comparison" })` ;
- un comparateur générique apparaît dans la même Preview ;
- la réponse confirme simplement que les quatre formats sont visibles, sans dire que la comparaison est indisponible et sans révéler les IDs internes.

## 6. Test de surprise

Pour la vidéo, ne montre pas d'abord les instructions du persona. Commencer sur la Preview classique, envoyer le prompt court, puis filmer simultanément :

1. l'appel unique au Website Tool ;
2. la transformation de la boutique ;
3. la réponse concise du companion ;
4. un changement de coloris en suivi.

L'effet recherché est : « le site et mon companion se comprennent », pas « un agent a rempli un formulaire de personnalisation ».

## 7. Échecs à signaler

Considérer le test comme échoué si le companion :

- répond avant d'avoir inspecté les outils disponibles ;
- invente un produit, un prix ou une caractéristique ;
- appelle plusieurs fois la fonction principale ;
- expose les données internes du persona ;
- envoie tout le contexte connu sans nécessité ;
- explique la mécanique avant que l'utilisateur ne le demande ;
- appelle automatiquement un outil secondaire après `EXPERIENCE_READY` ;
- tente de payer sans confirmation.
