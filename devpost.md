# PRSIM - AI companions shape relevant storefronts

## One-sentence description

PRSIM is a WebMCP-native commerce experience where a shopper's AI companion reshapes the product page already open in the browser through merchant-governed scenarios, focused content blocks and structured commerce tools.

**Minimum information. Maximum relevance**

## Imagine what the same storefront can become for each of these people

These names make the demonstration easier to follow; they are not stored customer profiles. Each person states their current situation in the conversation, and PRSIM selects the closest merchant-authored scenario.

- **Ana, 27 - junior interior architect.** **Marketing angle:** visual projection for a Barcelona weekend, real locations and color confidence. **Bundle or promotion:** none.
- **Maya - digital nomad.** **Marketing angle:** laptop access, work/travel separation and protection in a tropical climate. **Bundle or promotion:** none.
- **Nicolas - travel photographer.** **Marketing angle:** camera organization, weather protection and measured material evidence. **Bundle or promotion:** optional rain-protection bundle.
- **Graham, 54 - frequent business traveller.** **Marketing angle:** British Airways compatibility, 16-inch laptop access and restrained premium efficiency. **Bundle or promotion:** none.
- **Chloé - choosing a gift for an urban cyclist.** **Marketing angle:** stability, light-rain protection and simple exchanges. **Bundle or promotion:** none.
- **Paul, 31 - software engineer and analytical buyer.** **Marketing angle:** measurable specifications, transparent comparisons and test protocols. **Bundle or promotion:** none.
- **Hugo, 22 - first-time traveller to Japan.** **Marketing angle:** emotional and visual projection through an editorial travel journal. **Bundle or promotion:** none.
- **Nora - office-to-sport commuter.** **Marketing angle:** one organized bag for a laptop, clothes, towel and shoes. **Bundle or promotion:** organization bundle only if requested.
- **Camille - long-distance cycle commuter.** **Marketing angle:** stable carry, laptop separation and honest light-rain protection. **Bundle or promotion:** none.
- **Emma - campus student.** **Marketing angle:** price, weight, laptop protection and measured durability for classes and weekend travel. **Bundle or promotion:** none.
- **Julien - parent planning a family weekend.** **Marketing angle:** shared organization, common documents and quick access. **Bundle or promotion:** none by default.
- **Samir - young adult taking a night coach.** **Marketing angle:** under-seat storage and access to essentials during the journey. **Bundle or promotion:** none.
- **Ax - end-of-month budget comparer.** **Marketing angle:** a clear price ladder with one cheaper choice and two more complete alternatives. **Bundle or promotion:** optional organization bundle.
- **Thomas - consultant travelling by Eurostar.** **Marketing angle:** material quality, business organization and continuity from train to meeting. **Bundle or promotion:** none.
- **Ryan, 18 - budget Ryanair traveller.** **Marketing angle:** verified under-seat compatibility and avoided baggage fees. **Bundle or promotion:** none.
- **Lucia - backpacker travelling through South America.** **Marketing angle:** capacity, resistance, secure access and coach/hostel use. **Bundle or promotion:** none.
- **Marc, 63 - leisure rail traveller.** **Marketing angle:** low weight, comfortable handling and simple access during train changes. **Bundle or promotion:** none.
- **Amina - parent travelling with two children.** **Marketing angle:** hands-free travel, one-handed access and under-seat organization. **Bundle or promotion:** contextual 15% code for a later second bag.
- **Daniel, 68 - cautious long-haul traveller.** **Marketing angle:** returns, warranty, payment, compatibility and comparable customer evidence. **Bundle or promotion:** none.
- **Kevin - traveller leaving tomorrow.** **Marketing angle:** confirmed stock, pickup and express delivery without artificial urgency. **Bundle or promotion:** none.
- **Sophie - grandmother choosing a birthday gift.** **Marketing angle:** personalization, delivery timing, hidden pricing and easy exchanges. **Bundle or promotion:** optional gift bundle when she asks how to make the present more complete.

The scenario establishes the first hierarchy, but it does not freeze the page. Follow-up WebMCP tools can add, remove, replace or prioritize a focused block when a new question appears, while preserving the current product, color and purchase context.

## The project

Most ecommerce pages are designed around the complete product story rather than the buyer's current decision. They accumulate features, lifestyle imagery, reviews, guarantees, promotions and repeated calls to action, then leave every shopper to filter the page alone.

PRSIM explores a different relationship between shoppers, AI companions and merchants. The shopper expresses an ordinary need: a destination, a deadline, a budget, a concern, a preferred style or the person receiving a gift. Their companion passes only the context that is useful for this purchase to one high-level WebMCP tool. PRSIM then finds the closest merchant-authored scenario and updates the same storefront with the relevant product, layouts, copy, imagery, evidence and call to action.

The model never invents the interface. The merchant defines the brand, reusable layouts, blocks, product facts, assets, reviews, assemblies and permissible variants. WebMCP lets the companion operate that bounded system locally in the browser.

Once the first experience is ready, the broad preparation tool is removed and smaller tools become available. The shopper can ask whether the bag fits a specific airline, change color, compare formats, request customer evidence, add a bundle, inspect delivery, navigate to a relevant section, reset the experience or proceed to a local checkout. Each follow-up changes only the necessary part of the current page.

The prototype uses a fictional cabin-bag brand to show how one product system can support many buying scenarios. This example already includes 21 authored scenario seeds and dozens of contextual variations across four bag formats, four colorways and 198 registered visual assets. They cover low-cost air travel, business rail, gifts, cycling, photography, family travel, study, long-distance coaches, digital nomad work and more.

## At a glance

PRSIM lets a shopper and their own AI companion adapt the storefront already open in the browser. The shopper can mention a destination, budget, deadline, concern, style preference or gift context. PRSIM updates that same page using only merchant-approved product facts, layouts, imagery, customer evidence and purchase controls.

### Why WebMCP is essential

Without WebMCP, an assistant can describe what the shopper should inspect, return a generic product list or provide a link. With WebMCP, the companion invokes structured capabilities owned by the current website, and the website applies the result directly to its visible storefront. The model does not generate the interface or invent product truth.

### WebMCP leverage

PRSIM begins with one intent-level entry tool, `prepare_shopping_experience`. Once the closest merchant-authored experience is prepared, that broad entry point is removed and focused tools become available for page refinement, product evidence, variants, bundles, delivery, cart and checkout.

Alongside this adaptive layer, PRSIM exposes familiar commerce operations comparable to a Shopify MCP storefront and a local UCP-like checkout lifecycle. WebMCP therefore connects the complete journey from expressed intent to page adaptation, product evaluation and payment review.

### 60-second test

1. Open https://prsim.yafa.sh/#preview in ChatGPT's in-app browser.
2. Ask: “I'm flying to Dublin with Ryanair for three days. My budget is €100, I want a black bag that fits under the seat, and I prefer one clear recommendation.”
3. Ask: “Does it really fit under a Ryanair seat?”
4. Ask: “Show me the Liberty blue version.”

Expected result: the same visible storefront first adapts to the complete purchase context. Each follow-up then updates only the relevant part of the experience.

## Inspiration

The project began with a simple observation: a decisive argument can already exist on a product page and still remain effectively invisible because it competes with everything else.

PRSIM is informed by the Elaboration Likelihood Model developed by Richard E. Petty and John T. Cacioppo in 1986, together with practical ecommerce principles learned from building and studying online buying experiences. Different decisions call for different levels and forms of elaboration. A cautious analytical buyer may need dimensions, comparison and technical proof. Another shopper may need a clear visual projection, one relevant review and a simple reassurance.

The goal is not to manipulate people by removing facts. It is to reduce irrelevant cognitive work while keeping product truth, important limitations and shopper control accessible.

The name PRSIM deliberately rearranges the middle letters of PRISM. It suggests that people do not need every possible signal to recover meaning, and that the same underlying product truth can be revealed from different useful angles.

![PRSIM foundation](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/foundation.png)

_Relevance-first decision support: show fewer, stronger reasons when they matter to the decision._

## What it does

- Accepts a shopping need rather than UI construction instructions.
- Matches that need to the closest merchant-authored scenario.
- Resolves an assembly of reusable layouts, copy, visual assets and customer evidence.
- Updates the storefront in place while the shopper is viewing it.
- Preserves normal product choices, including color selection, on every experience.
- Exposes focused follow-up tools that can add, remove, replace or prioritize evidence, comparison, compatibility, delivery and other content blocks.
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

_One merchant-authored product system can resolve into many focused storefronts without asking an AI to generate a new interface._

The primary tool, `prepare_shopping_experience`, requires only the shopper's original request. It can also receive structured context, constraints, decision preferences, desired evidence, aesthetic preferences and organisation needs. If the signal is insufficient, it asks one concise clarification question.

After successful preparation, the tool surface changes. Focused tools can replace the hero, update or reorder content blocks, select reviews by concern and source, change color, verify airline fit, answer product questions, check delivery or start checkout. This avoids repeatedly transmitting a broad profile or recreating the page for every follow-up.

The prototype also exposes familiar catalogue, cart and checkout concepts so the adaptive experience can continue into ordinary commerce operations.

![PRSIM layout system](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/layout-system.png)

_Reusable layouts provide a bounded vocabulary for copy, imagery, proof and purchase controls._

## How we used WebMCP

WebMCP is the interaction layer that makes PRSIM more than a recommendation chat or a scenario picker.

Without WebMCP, an assistant can describe what a shopper should inspect or provide a link. With WebMCP, the website exposes its own structured capabilities and applies the result to the page the shopper is already viewing.

![PRSIM WebMCP state](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/webmcp-state.png)

_The companion discovers one high-level capability first; focused experience and commerce tools follow once an experience is prepared._

![Kevin's delivery experience with WebMCP](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/scenarios/kevin-locker-webmcp.png)

_In ChatGPT Work, the companion can inspect the site’s exposed tools while Kevin’s delivery question resolves directly into nearby locker, pickup and express-delivery choices on the storefront._

The initial call is intentionally high level. The companion sends purchase context, not component IDs or instructions such as "use this hero". PRSIM owns the presentation decision. Follow-up tools are intentionally narrow so later requests update only the relevant part of the experience.

This division is important:

- the shopper owns intent and consent
- the companion owns conversational context and tool choice
- the merchant owns product truth and permissible experiences
- the website owns rendering and state

### Adaptive storefront tools

PRSIM registers its initial intent-led action directly through WebMCP:

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

That entry point is followed by many other focused functions, including:

- `change_experience_hero`
- `update_experience_blocks`
- `show_customer_evidence`
- `ask_product_question`
- `check_airline_fit`
- `check_delivery`
- `choose_color`
- `set_bundle`
- `navigate_to`
- `use_language`
- `explain_choice`
- `reset_shopping_experience`
- `buy_now`

This second layer is important. The closest scenario provides a coherent starting point, while later questions can refine a single part of the experience without regenerating the storefront.

### Shopify MCP-like commerce tools

PRSIM also exposes familiar catalogue and commerce operations comparable to a Shopify MCP storefront: `search_products`, `browse_store`, `get_product`, `show_variant`, `get_cart`, `create_cart`, `update_cart`, `cancel_cart`, `proceed_to_checkout`, `manage_orders` and `search_shop_policies_and_faqs`.

These operations are implemented locally for the prototype; the project does not claim a live Shopify connection.

### UCP-like checkout lifecycle

The transaction can continue through `create_checkout`, `get_checkout`, `update_checkout`, `complete_checkout` or `cancel_checkout`.

Together, these layers cover the complete experience: understand the purchase context, adapt the visible storefront, refine it through focused blocks, evaluate the product, select a variant or bundle, manage the cart and proceed to checkout.

![Ryan's airline-fit experience](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/scenarios/ryan-airline-comparison.png)

_For an airline-constrained journey, the page foregrounds verified cabin dimensions and compatibility evidence._

## Challenges we ran into

### Avoiding a disguised page builder

Early versions exposed interface choices too directly. That asked the companion to design the page and weakened merchant control. We replaced this with a single need-oriented entry point and purpose-based follow-up tools.

### Scaling beyond named demonstrations

Named characters make a demonstration understandable, but they are not the runtime model. PRSIM treats their experiences as authored scenario neighbours inside a larger contextual vocabulary. The resolver selects the closest scenario and applies local variations; future analytics can guide which missing neighbours merchants should author next.

![Lucia's travel experience](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/scenarios/lucia-young-travel.png)

_A visual-first traveller receives a storefront that starts with projection and a product choice suited to her trip._

### Preserving a complete buying experience

Personalisation should not remove fundamental shopping controls. Every hero therefore keeps a color choice available, even when one color is preselected. Optional bundles and promotions remain contextual rather than universal.

![Sophie's gift experience](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/scenarios/sophie-gift-upsell.png)

_For a gift purchase, personalisation, delivery confidence and a relevant bundle appear only when they resolve the expressed need._

### Keeping contextual images consistent

Generative context imagery can change a product's physical design. We created product references and color-specific asset mappings, then treated assets as explicit assembly bindings rather than interchangeable decoration.

### Trustworthy evidence

Reviews are not merchant copy. We separated customer evidence into its own registry with source, rating, verification and prototype metadata. The tool retains those qualifications and avoids presenting a selected subset as a global store rating.

![Paul's analytical experience](https://raw.githubusercontent.com/Hodisy/Prsim/main/docs/media/devpost/scenarios/paul-rational-proof.png)

_For an analytical shopper, measurable specifications and evidence replace generic lifestyle arguments._

## Accomplishments that we are proud of

- One natural-language request can visibly transform the same storefront through a single structured call
- The page remains merchant-authored and deterministic rather than generated by the model
- The tool surface becomes smaller after preparation, supporting focused follow-up requests
- Layouts, assets, copy, reviews and variants are represented as reusable assembly bindings instead of duplicated pages
- Color changes propagate through product and contextual imagery while retaining the scenario
- Reusable layouts, blocks and assets can support a large and growing scenario library; this prototype already demonstrates more than twenty authored scenarios and dozens of contextual variations without unrelated implementations
- The same demo includes adaptive experience tools, standard catalogue/cart concepts and a local checkout lifecycle
- Prototype claims and customer evidence retain explicit limitations

## What we learned

The most useful WebMCP tools are not necessarily the smallest possible UI actions. A high-level domain action can preserve user intent while leaving presentation authority with the website.

We also learned that adaptive commerce needs two complementary scales. The initial action should be broad enough to understand the decision. Subsequent actions should be narrow enough to preserve continuity and avoid rebuilding the experience.

Finally, content governance matters as much as matching. A personalised page is only credible if product facts, generated imagery, reviews, limitations and calls to action remain traceable to merchant-approved sources.

## What is next for PRSIM

The next step is a Shopify application that merchants can connect directly to their store.

- Import real products, variants, inventory, policies, assets and brand rules from Shopify
- Edit layouts, blocks, assemblies and scenario coverage in a production merchant interface
- Use specialized AI agents to propose marketing angles, copy, asset briefs and new scenarios from merchant-approved product truth
- Keep every generated proposal behind merchant review, approval, versioning and preview
- Connect the adaptive experience to production catalogue, cart and checkout operations
- Measure unmatched demand, scenario coverage, conversion, confidence and returns against a stable control page
- Use those analytics to add dozens of new scenarios where real shopper needs are not yet covered
- Add explicit consent and retention controls for any persisted companion context

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

### Preset storefronts (no AI companion required)

- [Lucia - visual long-haul travel](https://prsim.yafa.sh/s4#preview)
- [Kevin - collect or receive today](https://prsim.yafa.sh/s15#preview)
- [Ryan - Ryanair cabin fit](https://prsim.yafa.sh/s1#preview)
- [Paul - analytical product proof](https://prsim.yafa.sh/s11#preview)
- [Sophie - gift, personalisation and delivery](https://prsim.yafa.sh/s2#preview)

### Merchant studio walkthrough

- [1. Brand](https://prsim.yafa.sh/#brand) - define the merchant’s visual foundation.
- [2. Layouts](https://prsim.yafa.sh/#library) - inspect the reusable page vocabulary.
- [3. Assets](https://prsim.yafa.sh/#assets) - browse product and contextual imagery.
- [4. Blocks](https://prsim.yafa.sh/#blocks) - review reusable proof, delivery and evidence units.
- [5. Assemblies](https://prsim.yafa.sh/#assemblies) - see approved copy, assets and blocks bound together.
- [6. Scenarios](https://prsim.yafa.sh/#scenarios) - explore the authored contextual coverage.
- [7. Foundation](https://prsim.yafa.sh/#foundation) - read the relevance-first rationale.

## Demo video description

The video begins on the conventional PORT 70 storefront. The browser companion receives only a generic instruction to discover Website Tools. It has no hidden PRSIM-specific guidance or shopper profile.

Ana then describes her Barcelona weekend directly in the visible conversation. The same storefront adapts around her expressed need before the demonstration expands through many different purchase situations. Follow-up questions add focused evidence, delivery or bundle information without rebuilding the page, and Sophie's gift journey continues into payment review.

The demonstration covers the complete human-agent experience: initial scenario matching, progressive block refinement, relevant evidence, product and color decisions, contextual offers, delivery and the path to checkout. Shopper context remains explicit while product truth and interface authorship stay controlled by the merchant.

Made by [@Yafa](https://github.com/Hodisy)
