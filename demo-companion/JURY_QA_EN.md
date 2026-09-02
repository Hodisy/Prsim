# PRSIM — Jury Q&A cheat sheet

Keep answers short during the live Q&A. Lead with the distinction between **shopper intent**, **companion context**, **merchant control** and **website rendering**.

## 20-second summary

PRSIM lets a shopper express a normal purchase need to their AI companion. Through one high-level WebMCP call, the site finds the closest merchant-authored experience and updates the storefront in place. The agent does not generate the page: the merchant controls the layouts, copy, assets, evidence and product truth. Focused follow-up tools then support questions, color changes, comparisons and checkout.

## Why does this need WebMCP?

Chat alone can recommend a product or tell the shopper where to click. WebMCP lets the site expose structured actions that change the page the shopper is already viewing. The companion contributes context; the website contributes product truth, authorised presentation and state. The result is a shared human-agent interface rather than a detached recommendation.

## Why not expose only tiny UI actions?

That would turn the model into a page builder and force it to know the merchant’s component system. PRSIM exposes a domain action: prepare the shopping experience around this need. The website decides how that need maps to layouts, copy and evidence. Smaller tools are exposed only after preparation, when the shopper asks for a focused change.

## Is the AI generating the storefront?

No. The AI supplies structured context and chooses an available tool. PRSIM deterministically selects and resolves merchant-authored scenarios, assemblies, layouts, copy, assets and evidence. The model cannot inject arbitrary HTML, CSS, claims or component identifiers.

## What is the single most important design decision?

The initial API is need-oriented, not profile-oriented and not UI-oriented. `prepare_shopping_experience` accepts what the shopper is trying to do. It avoids asking users to “set a profile,” and it prevents the companion from instructing the website which hero or section to render.

## Is this behavioural tracking with another name?

The prototype starts from user-expressed or companion-known context that is relevant to the current purchase. The tool explicitly instructs the companion not to send an entire profile. State is session-local and resettable. A production system would need clear consent, purpose limitation, retention controls and an explanation of which context was applied.

## Why include age or gender representation?

They are optional, low-weight creative signals for requested on-page representation. They never determine product eligibility and never override an explicit product or color choice. Context such as airline, deadline, equipment, budget and intended use has much more decision value.

## Are color recommendations based on stereotypes?

No color is restricted by age or gender. The current merchandising affinities are explicitly marked as merchant-authored prototype hypotheses and are used only as tie-breakers for imagery or tone. An explicit shopper color preference always wins, and all four colorways remain selectable in every hero.

## How does matching work?

The prototype assigns weighted scores to explicit signals such as context, buying situation, decision style, desired projection, content preference, tone, constraints, destination and color. It selects the closest authored scenario, records the reasons, and can apply bounded local variations. It is deterministic and explainable, not a trained recommendation model.

## You only have 21 scenarios. How can this scale?

The 21 scenarios are authored neighbours, not the total addressable space. The vocabulary already combines context, buying situation, decision style, projection, content, tone, age band, representation, color, language and local section variations. PRSIM chooses the nearest useful neighbour instead of requiring every combination to be authored. In production, unmatched-request analytics would tell the merchant which new scenarios are worth creating next.

## Why not generate every possible combination?

The theoretical cross-product is enormous and mostly meaningless. Most combinations do not justify a distinct page. Authoring should follow real demand clusters and meaningful decision differences. Reusable layouts and local variants cover small differences without pretending each one is a new persona.

## What exactly is an assembly?

An assembly is an ordered list of layout instances. Each instance has editable props plus explicit bindings to assets and customer evidence. A variant can patch those fields, insert, remove or move a layout, or change the active product color without duplicating the base assembly.

## What is the difference between a layout, block and scenario?

- A **layout** is the reusable visual structure.
- A **block** represents a content purpose, such as airline compatibility or material proof.
- An **assembly** binds ordered layout instances to copy, assets and evidence.
- A **scenario** describes a recognisable buying context and points to an authored assembly.

## Can the shopper correct the result?

Yes. The shopper can change color, request a different comparison or proof block, ask product questions, navigate to information, change language, remove a bundle or reset the experience. The companion can also explain the selection when explicitly asked.

## What prevents hallucinated product claims?

Product facts, dimensions, policies and compatibility rules come from structured local data. The model invokes tools but does not write product claims. The airline-fit tool compares structured dimensions. Generated contextual images are explicit assets, not evidence. A production version would connect dated authoritative sources and show provenance.

## Are the reviews real?

No. They are prototype demonstration content. The evidence registry stores source, rating, verification status and a prototype flag. The WebMCP result explicitly warns the companion not to describe them as live or independently verified. A production deployment would ingest genuine review sources and retain the same provenance fields.

## Is the airline compatibility guaranteed?

The prototype compares known local product dimensions against locally stored airline allowances. Airline policies can change, and physical acceptance can depend on packing and enforcement. A production implementation would use dated official airline data and preserve the relevant caveat.

## Is this manipulating shoppers into impulse purchases?

The goal is to reduce irrelevant work, not hide material information. Fundamental choices remain available, limitations remain visible, and checkout requires confirmation. The project also exposes how quickly the decision occurred as a provocative design element. A responsible production evaluation should measure confidence, returns and regret alongside conversion.

## How does the Elaboration Likelihood Model apply?

ELM suggests that persuasion differs with motivation and ability to elaborate. PRSIM uses it as a design hypothesis: a high-involvement analytical decision may need stronger arguments, comparison and evidence, while another decision may benefit from a concise visual path and lighter reassurance. We do not claim that more information is always rational or that less information automatically causes impulse buying.

## Why is it called PRSIM rather than PRISM?

The middle letters are deliberately displaced. It is a visual wordplay: readers can often recover the familiar word from partial structure. The prism metaphor also fits the product. PRSIM does not create a new source; it reveals the most relevant view of the same merchant-controlled product truth.

## How is this different from ordinary personalisation?

Ordinary personalisation is often hidden, segment-based and controlled by the platform. PRSIM makes the companion an explicit participant. The shopper can express context conversationally, watch the site adapt, correct it and reset it. The merchant still controls what may be shown.

## How is this different from a recommendation engine?

A recommendation engine mainly ranks products. PRSIM can select a product, but its distinctive job is to adapt the decision interface: the order, depth and form of arguments, proof, contextual imagery and reassurance around that product.

## What happens after the first call?

`prepare_shopping_experience` returns a terminal success response and is removed from the active tool surface. The companion should reply and wait. Later shopper requests use focused tools such as `choose_color`, `check_airline_fit`, `show_customer_evidence` or `update_experience_blocks`, preserving continuity.

## Why expose Shopify-like and UCP-like tools?

Adaptive presentation should connect to familiar commerce operations rather than becoming an isolated demo. The catalogue, cart and checkout tools show how PRSIM can coexist with common commerce concepts. They are local simulations in this prototype, not claims of certified Shopify or UCP integration.

## What data persists?

Current state is stored locally in the browser for the prototype, including selected display settings and demo analytics. There is no remote user database. The active shopping experience can be reset. A production system would need explicit policies for consent, retention and cross-session context.

## What is technically novel here?

The novelty is the contract between companion and storefront: one high-level need-oriented entry point, a merchant-governed assembly resolver, and a staged tool surface that becomes narrower after initial preparation. This lets the agent contribute context without becoming the page designer.

## What would you build next?

First, live authoritative product, inventory, policy and airline sources. Second, merchant analytics for unmatched needs and scenario coverage. Third, an assembly editor with approvals and versioning. Fourth, a controlled evaluation measuring decision confidence, conversion, returns and regret—not conversion alone.

## What should judges watch during the demo?

Watch the same storefront rather than the assistant’s prose. One natural request changes the page through one initial tool call. A follow-up changes only one local concern. The color remains shopper-selectable, evidence keeps its qualifications, and checkout remains a separate confirmed action.

## If WebMCP is unavailable during the presentation

Say:

> The page registers the same structured tools when the browser exposes the WebMCP model context. The local fallback lets me inspect the deterministic tool results, but the intended experience is the companion invoking them inside the supported in-app browser.

Then show the prepared recording rather than spending presentation time debugging browser permissions.

## Final answer to “Why should this exist?”

Because shoppers should not have to read a universal page or surrender to invisible profiling to get a relevant buying experience. WebMCP creates a third option: the shopper’s own companion can bring explicit context to a storefront that remains truthful, bounded and controlled by the merchant.
