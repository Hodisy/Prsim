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

## SHOPPER LINES — COPY AND PASTE ONE AT A TIME

These lines are written for the human playing Ana. Wait for the companion and the page to finish updating after each line. Do not paste the next line until the current response has visibly completed.

### 01 — Start

> Use the built-in browser to open https://prsim.yafa.sh/#preview. Help me choose the right bag for the Barcelona weekend we discussed, directly on the page.

### 02 — Notice the change

> Oh—the whole page changed. Why did you show me this version?

### 03 — Ask for visual proof

> It looks good here, but cream can be misleading online. Show me how it looks in natural light and in different places.

### 04 — Ask about the real product

> That helps. But does it still look this clean when it is actually packed for three days?

### 05 — Ask for customer evidence

> My concern is keeping a cream bag clean. What do people actually say about that?

### 06 — Prove freedom of choice

> Before I decide, show me the exact same experience with the black bag.

### 07 — Return to the chosen color

> Black is safer, but cream feels more like the trip. Switch back to cream.

### 08 — Resolve the final risk

> If it looks different when it arrives, can I return it easily?

### 09 — Signal purchase intent

> Okay. The cream one feels right. I think I’ll take it.

### 10 — Confirm payment-page opening

Only send this after the companion explicitly asks whether to open payment:

> Yes, continue with the cream version.

### Optional short version

Use this shorter sequence if the full take feels too long:

> Use the built-in browser to open https://prsim.yafa.sh/#preview. Help me choose the right bag for the Barcelona weekend we discussed, directly on the page.

> It looks good here, but cream can be misleading online. Show me how it looks in natural light and in different places.

> My concern is keeping a cream bag clean. What do people actually say about that?

> If it looks different when it arrives, can I return it easily?

> Okay. The cream one feels right. I think I’ll take it.

> Yes, continue with the cream version.
