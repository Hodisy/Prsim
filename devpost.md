# PRSIM - AI companions shape relevant storefronts

## One-sentence description

PRSIM uses WebMCP to let a shopper's AI companion turn a conventional product page into the closest merchant-authored buying experience, directly inside the page and without hidden behavioural profiling

**Minimum information. Maximum relevance**

## The project

Most ecommerce pages are designed around the complete product story rather than the buyer's current decision. They accumulate features, lifestyle imagery, reviews, guarantees, promotions and repeated calls to action, then leave every shopper to filter the page alone.

PRSIM explores a different relationship between shoppers, AI companions and merchants. The shopper expresses an ordinary need: a destination, a deadline, a budget, a concern, a preferred style or the person receiving a gift. Their companion passes only the context that is useful for this purchase to one high-level WebMCP tool. PRSIM then finds the closest merchant-authored scenario and updates the same storefront with the relevant product, layouts, copy, imagery, evidence and call to action.

The model never invents the interface. The merchant defines the brand, reusable layouts, blocks, product facts, assets, reviews, assemblies and permissible variants. WebMCP lets the companion operate that bounded system locally in the browser.

Once the first experience is ready, the broad preparation tool is removed and smaller tools become available. The shopper can ask whether the bag fits a specific airline, change color, compare formats, request customer evidence, add a bundle, inspect delivery, navigate to a relevant section, reset the experience or proceed to a local checkout. Each follow-up changes only the necessary part of the current page.

The prototype uses a fictional cabin-bag brand, to demonstrate dozens authored shopping scenarios for 1 bag formats with 4 colorways and 198 registered visual assets for testing different marketing approaches. Scenarios cover low-cost air travel, business rail, gifts, cycling, photography, family travel, study, long-distance coaches, digital nomad work and more.

## Inspiration

The project began with a simple observation: a decisive argument can already exist on a product page and still remain effectively invisible because it competes with everything else.

PRSIM is informed by the "Elaboration Likelihood Model" developed by Richard E. Petty and John T. Cacioppo, 1986. And a bunch of best practices, Reddit tips, and other things I've learned over the past few years. Different decisions call for different levels and forms of elaboration. A cautious analytical buyer may need dimensions, comparison and technical proof. Another shopper may need a clear visual projection, one relevant review and a simple reassurance.

The goal is not to manipulate people by removing facts. It is to reduce irrelevant cognitive work while keeping product truth, important limitations and shopper control accessible.

The name PRSIM deliberately rearranges the middle letters of PRISM. It suggests that people do not need every possible signal to recover meaning, and that the same underlying product truth can be revealed from different useful angles.

![PRSIM foundation](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/foundation.png)

*Relevance-first persuasion: show fewer, stronger reasons when they matter to the decision.*

## What it does

- Accepts a shopping need rather than UI construction instructions.
- Matches that need to the closest merchant-authored scenario.
- Resolves an assembly of reusable layouts, copy, visual assets and customer evidence.
- Updates the storefront in place while the shopper is viewing it.
- Preserves normal product choices, including color selection, on every experience.
- Exposes focused follow-up tools for evidence, comparison, compatibility, delivery and commerce.
- Simulates Shopify-like catalogue/cart operations and a UCP-like checkout lifecycle.
- Gives merchants a visible studio for brand tokens, layouts, assets, blocks, assemblies and scenarios.
- Keeps session state local and provides an explicit reset.

## How we built it

PRSIM is implemented with semantic HTML, plain JavaScript modules, plain CSS and a small Bun server. There is no frontend framework and no required build step.

The browser application is organised into four layers:

1. A commerce truth layer containing products, variants, dimensions, policies and airline rules.
2. A merchant-authored content system containing brand tokens, layouts, purpose-based blocks, assets, reviews and assemblies.
3. A deterministic resolver that scores explicit shopping signals against scenario neighbours and applies bounded local variations.
4. A WebMCP layer that registers structured tools through the page's model context.

![PRSIM storefront system](https://raw.githubusercontent.com/Hodisy/Prsim/main/assets/brand/prsim-system-mosaic.png)

*One merchant-authored product system can resolve into many focused storefronts without asking an AI to generate a new interface.*

The primary tool, `prepare_shopping_experience`, requires only the shopper's original request. It can also receive structured context, constraints, decision preferences, desired evidence, aesthetic preferences and organisation needs. If the signal is insufficient, it asks one concise clarification question.

After successful preparation, the tool surface changes. Focused tools can replace the hero, update or reorder content blocks, select reviews by concern and source, change color, verify airline fit, answer product questions, check delivery or start checkout. This avoids repeatedly transmitting a broad profile or recreating the page for every follow-up.

The prototype also exposes familiar catalogue, cart and checkout concepts so the adaptive experience can continue into ordinary commerce operations.

![PRSIM layout system](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/layout-system.png)

*Reusable layouts provide a bounded vocabulary for copy, imagery, proof and purchase controls.*

## How we used WebMCP

WebMCP is the interaction layer that makes PRSIM more than a recommendation chat.

Without WebMCP, an assistant can describe what a shopper should inspect or provide a link. With WebMCP, the website exposes its own structured capabilities and applies the result to the page the shopper is already viewing.

![PRSIM WebMCP state](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/webmcp-state.png)

*The companion discovers one high-level capability first; focused tools follow once an experience is prepared.*

The initial call is intentionally high level. The companion sends purchase context, not component IDs or instructions such as "use this hero" PRSIM owns the presentation decision. Follow-up tools are intentionally narrow so later requests update only the relevant part of the experience.

This division is important:

- the shopper owns intent and consent
- the companion owns conversational context and tool choice
- the merchant owns product truth and permissible experiences
- the website owns rendering and state

### How WebMCP changes the storefront

PRSIM uses WebMCP for one high-level, intent-led action:

```js
document.modelContext.registerTool({
  name: "prepare_shopping_experience",
  inputSchema: experienceRequestSchema,
  execute: async (want) => {
    const experience = resolveWant(want);
    return applyExperienceToTheVisibleStorefront(experience);
  },
});
```

The companion receives what the shopper voluntarily expressed, for example a
Ryanair fare, a budget, a gift deadline or a need for customer proof, not
instructions such as "use this hero" or "add this section"

PRSIM resolves that need against merchant-authored scenarios and updates the
same visible storefront with the relevant product, evidence, imagery and
purchase path. The shopper remains in control, the companion understands the
conversation, and the merchant retains control over the page and product truth.

![Ryan's airline-fit experience](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/scenarios/ryan-airline-comparison.png)

*For an airline-constrained journey, the page foregrounds verified cabin dimensions and compatibility evidence.*

## Challenges we ran into

### Avoiding a disguised page builder

Early versions exposed interface choices too directly. That asked the companion to design the page and weakened merchant control. We replaced this with a single need-oriented entry point and purpose-based follow-up tools.

### Scaling beyond named personas

Fifteen or twenty hard-coded personas are useful for demonstration but not a sustainable model. We reframed them as authored scenario neighbours inside a much larger contextual vocabulary. The resolver selects the closest scenario and applies local variations; future analytics can guide which missing neighbours merchants should author next.

![Lucia's travel experience](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/scenarios/lucia-young-travel.png)

*A visual-first traveller receives a storefront that starts with projection and a product choice suited to her trip.*

### Preserving a complete buying experience

Personalisation should not remove fundamental shopping controls. Every hero therefore keeps a color choice available, even when one color is preselected. Optional bundles and promotions remain contextual rather than universal.

![Sophie's gift experience](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/scenarios/sophie-gift-upsell.png)

*For a gift purchase, personalisation, delivery confidence and a relevant bundle appear only when they resolve the expressed need.*

### Keeping contextual images consistent

Generative context imagery can change a product's physical design. We created product references and color-specific asset mappings, then treated assets as explicit assembly bindings rather than interchangeable decoration.

### Trustworthy evidence

Reviews are not merchant copy. We separated customer evidence into its own registry with source, rating, verification and prototype metadata. The tool retains those qualifications and avoids presenting a selected subset as a global store rating.

![Paul's analytical experience](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/scenarios/paul-rational-proof.png)

*For an analytical shopper, measurable specifications and evidence replace generic lifestyle arguments.*

## Accomplishments that we are proud of

- One natural-language request can visibly transform the same storefront through a single structured call
- The page remains merchant-authored and deterministic rather than generated by the model
- The tool surface becomes smaller after preparation, supporting focused follow-up requests
- Layouts, assets, copy, reviews and variants are represented as reusable assembly bindings instead of duplicated pages
- Color changes propagate through product and contextual imagery while retaining the scenario
- The prototype supports 21 distinct authored scenarios without requiring 21 unrelated implementations
- The same demo includes adaptive experience tools, standard catalogue/cart concepts and a local checkout lifecycle
- Prototype claims and customer evidence retain explicit limitations

![Kevin's active-city experience](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/scenarios/kevin-locker.png)

*A practical city scenario makes secure storage and quick access tangible, rather than burying them in a generic feature list.*

## What we learned

The most useful WebMCP tools are not necessarily the smallest possible UI actions. A high-level domain action can preserve user intent while leaving presentation authority with the website.

We also learned that adaptive commerce needs two complementary scales. The initial action should be broad enough to understand the decision. Subsequent actions should be narrow enough to preserve continuity and avoid rebuilding the experience.

Finally, content governance matters as much as matching. A personalised page is only credible if product facts, generated imagery, reviews, limitations and calls to action remain traceable to merchant-approved sources.

## What is next for PRSIM

- Connect real inventory, product, policy and airline data
- Measure unmatched demand and scenario coverage for merchants
- Build a production assembly editor with approvals, versioning and previews
- Test relevance, confidence, conversion and returns against a stable control page
- Add explicit consent and retention controls for any persisted companion context
- Integrate a secure production checkout
- Expand beyond bags into products where context meaningfully changes the decision

## Built with

- WebMCP / `document.modelContext.registerTool`
- HTML
- JavaScript
- CSS
- Bun
- Docker
- Coolify

## Links

- Live application: https://prsim.yafa.sh/#preview
- Repository: https://github.com/Hodisy/Prsim
- OpenAI WebMCP Challenge: https://openai.com/webmcp-challenge/
- WebMCP documentation: https://learn.chatgpt.com/docs/webmcp
- Research reference: https://doi.org/10.1016/S0065-2601(08)60214-2

## Demo video description

The video begins on the conventional PORT 70 storefront. The browser companion receives only a generic instruction to discover Website Tools. It has no hidden PRSIM-specific guidance or shopper profile.

Ana then states her Barcelona weekend, occupation and visual concern directly in the visible conversation. The companion discovers the live page capabilities and the same storefront adapts around the expressed need. Natural follow-up questions test color confidence and returns without any pre-scripted tool choice or response.

The demonstration shows the companion and storefront collaborating in the same browser session while shopper context remains explicit and product truth and interface authorship remain controlled by the merchant.
