# Ana — cautious cream Barcelona variation

## On-screen card

- Display: ANA, 27
- Tag: JUNIOR INTERIOR ARCHITECT
- Portrait: portrait-v2.png

## Known context

- Ana is 25–34 and is planning a weekend in Barcelona.
- She explicitly prefers cream and wants to see it in real locations and natural light.
- She is cautious about maintenance, online color rendering and returns.
- She likes visual-first content but needs balanced evidence before buying.

## Relevant use

Use the Barcelona visual context while preserving the cream preference and request for care, color and return evidence. Do not switch her to the default burgundy color.

## Recorded demo choreography

This persona is used for a recorded, turn-by-turn shopping demonstration. Make the interaction reliable and natural, but never run the whole sequence automatically. Act only on the shopper's latest message, complete the corresponding page action, reply briefly, and wait for the next shopper input.

### Opening the experience

When the shopper asks you to open https://prsim.yafa.sh/#preview and help with the Barcelona weekend:

1. Open that exact URL in the built-in browser if it is not already open.
2. Inspect the website tools exposed by the active page before recommending anything.
3. If prepare_shopping_experience is available, call it exactly once.
4. Send only the relevant known context:
   - request: choosing a bag for a Barcelona weekend, with concern about buying a light-colored bag online;
   - use_language: en;
   - contexts: short_city_trip;
   - person.age_group: 25_34;
   - context_details.destination: Barcelona;
   - decision_preferences.style: cautious;
   - decision_preferences.confidence_needed: high;
   - decision_preferences.useful_evidence: customer_reviews and returns_and_warranty;
   - experience_desires.projection: photogenic;
   - experience_desires.content: visual_first and customer_proof;
   - experience_desires.tone: warm and reassuring;
   - aesthetic_preferences.color: cream;
   - aesthetic_preferences.setting: city;
   - aesthetic_preferences.product_expression: balanced.
5. Do not say that this context came from a profile or instruction file.
6. After EXPERIENCE_READY, use the tool's suggested reply or an equally concise recommendation. Do not call another tool. Let the transformed page create the surprise, then wait.

A suitable visible reply is:

> I recommend the Passage 32 in cream. I've prepared the store around your Barcelona weekend, with the visual context and reassurance that matter for this choice.

### Follow-up: why this page?

If the shopper asks why the page changed or why this version was selected:

- call explain_choice with short detail;
- mention only the Barcelona setting, explicit cream preference and need for reassurance;
- never reveal a profile, score, scenario ID, layout ID or matching mechanism;
- reply briefly and wait.

Suggested reply:

> You wanted to see the bag in a real Barcelona setting, but you also needed more confidence about choosing a light color online.

### Follow-up: cream in natural light

If the shopper asks to see cream in natural light or different locations:

- call update_experience_blocks with the shopper's own wording;
- choose the closest visual, editorial or real-life product purpose offered by the tool;
- prefer operation auto;
- preserve the current product, cream color and Barcelona context;
- never describe generated contextual imagery as an independently verified color measurement;
- reply briefly and wait.

Suggested reply:

> I've brought the real-life views forward so you can compare the cream color across different Barcelona settings.

### Follow-up: shape when packed

If the shopper asks whether the bag keeps its shape when packed:

- call update_experience_blocks with the closest packing, organisation or product-proof purpose;
- preserve the Barcelona experience and cream selection;
- present the view as a realistic three-day illustration, not a universal capacity guarantee;
- reply briefly and wait.

Suggested reply:

> I've shown the packed version so you can judge the shape with a realistic three-day load.

### Follow-up: color, maintenance or customer opinion

If the shopper asks what people say about cream, maintenance or real-life color:

- call show_customer_evidence;
- pass the shopper's concern in their own words;
- use focus color and source auto unless a source was explicitly requested;
- preserve each item's rating, source, verification state and prototype disclosure;
- mention the useful reservation that cream needs more regular cleaning around the base;
- never describe prototype evidence as live or independently verified customer data;
- reply briefly and wait.

Suggested reply:

> I've shown the most relevant feedback on the cream color. It looks bright and understated, but the base needs more regular cleaning than the darker versions.

### Follow-up: returns

If the shopper asks about returns:

- use search_shop_policies_and_faqs with the returns topic;
- answer from the returned policy rather than memory;
- do not combine this with a color change or checkout;
- reply briefly and wait.

Suggested reply:

> Returns and exchanges are available for 30 days after delivery, so you can still reconsider the color after seeing it in person.

### Follow-up: compare with black

If the shopper asks to see black:

- call choose_color with black;
- preserve the Barcelona experience and all current content;
- confirm the local change in one sentence and wait.

Suggested reply:

> Here is the same Barcelona experience with the black version.

If the shopper then asks to return to cream:

- call choose_color with cream;
- confirm the change and wait.

Suggested reply:

> Done—the cream version is selected again.

### Purchase and payment

If the shopper says they think they will take it, that they are ready, or uses similarly tentative wording:

- do not call buy_now yet;
- summarise the selected Passage model and cream color in one short sentence;
- ask for explicit confirmation to open the payment page;
- wait.

Suggested reply:

> The Passage 32 in cream is selected. Would you like me to open the payment page for this version?

Only after the shopper explicitly confirms:

- call buy_now with the currently selected product, cream color and current bundle state;
- let the site navigate to the payment page;
- explain that the payment page is open for review;
- do not claim that money was charged or that an order was completed;
- stop and wait.

Suggested reply:

> The payment page is open with the cream version for your review.

### General constraints for the take

- Never anticipate the next scripted question.
- Never issue two follow-up tool calls from one shopper message unless the request genuinely requires both; when possible, ask the shopper to proceed one change at a time.
- Never call prepare_shopping_experience again after EXPERIENCE_READY.
- Keep the same browser tab and let the page update in place.
- Keep shopper-facing replies to one or two sentences.
- Do not mention WebMCP, tools, layouts, scenarios, scoring or internal IDs unless the shopper explicitly asks how the system works.
- Preserve honest caveats about contextual imagery, color rendering, prototype reviews and returns.

================================================================

## RECORDING RUN — COPY ONE SHOPPER LINE AT A TIME

This is the complete Ana take. It has six shopper messages, including the required final confirmation. Wait for the agent reply and visible page update after each message.

### 01 — Prepare the experience

**You paste**

> Use the built-in browser to open https://prsim.yafa.sh/#preview. Help me choose the right bag for the Barcelona weekend we discussed, directly on the page.

**Expected WebMCP call**

prepare_shopping_experience, once only. It should receive Barcelona, a short city trip, cream, visual-first preference, caution around online color, customer evidence and return reassurance.

**Expected companion reply**

> I recommend the Passage 32 in cream. I've prepared the store around your Barcelona weekend, with the visual context and reassurance that matter for this choice.

**What must be visible**

- The classic page is replaced in place by the Barcelona experience.
- The cream color is selected.
- The hero, Look × place selector, photo proof, three-day packing view, Barcelona inspiration, targeted comments and Buy CTA are already present.
- Do not ask for natural-light images next: the initial Barcelona experience already contains them.

### 02 — Break the color-confidence lock

**You paste**

> It looks great, but cream can be hard to keep clean. What do people actually say about that?

**Expected WebMCP call**

show_customer_evidence with the concern in the shopper's words, focus color and source auto.

**Expected companion reply**

> I've shown the most relevant feedback on the cream color. It looks bright and understated, but the base needs more regular cleaning than the darker versions.

**What must be visible**

- A customer-evidence block is inserted or replaces the previous dynamic evidence block.
- It scrolls into view.
- Reviews keep their source, rating, verification state and prototype disclosure.
- The answer gives Ana a real trade-off, not a perfect product claim.

### 03 — Break the return-risk lock

**You paste**

> If it looks different in real life, can I return it easily?

**Expected WebMCP call**

search_shop_policies_and_faqs with topic returns.

**Expected companion reply**

> Returns and exchanges are available for 30 days after delivery, so you can still reconsider the color after seeing it in person.

**What must be visible**

- The page stays on the same Barcelona experience.
- No new scenario is selected and no generic product grid appears.
- This is a short factual reassurance moment; it does not need a large page animation.

### 04 — Demonstrate that the recommendation is not a lock-in

**You paste**

> Before I decide, show me the exact same experience with the black bag.

**Expected WebMCP call**

choose_color with black.

**Expected companion reply**

> Here is the same Barcelona experience with the black version.

**What must be visible**

- The Barcelona story and page order stay unchanged.
- Hero, contextual photography, color swatches and CTA update to black.
- This is the clearest proof that PRSIM proposes a color but does not trap the shopper in it.

### 05 — Return to cream and signal intent

**You paste**

> Black is safer, but cream feels more like the trip. Switch back to cream—I think I’m ready to buy it.

**Expected WebMCP call**

choose_color with cream. Do not call buy_now yet.

**Expected companion reply**

> The cream version is selected again. Would you like me to open the payment page for this version?

**What must be visible**

- Contextual images and CTA return to cream.
- The agent does not purchase automatically just because Ana said she is ready.

### 06 — Confirm opening payment

**You paste**

> Yes, open the payment page for the cream version.

**Expected WebMCP call**

buy_now with the selected Passage 32, cream and the current bundle state.

**Expected companion reply**

> The payment page is open with the cream version for your review.

**What must be visible**

- The page navigates to payment.
- Passage 32, cream, price and selected bundle state are visible.
- The purchase trigger time is fixed as the red reference.
- The decision clock continues to run; characters change blue when they differ from the frozen reference.
- Do not say payment succeeded: this prototype opens a payment review, it does not charge Ana.
