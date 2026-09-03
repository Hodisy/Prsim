# Graham — premium business-flight demo

## On-screen card

- Display: GRAHAM, 54
- Tag: FREQUENT BUSINESS FLYER

## Known context

- Graham travels regularly for work between London and Singapore.
- His current airline is British Airways and he is taking a cabin bag, not relying on the smaller under-seat hand-bag allowance.
- He carries a 16-inch laptop, travel documents and three days of clothing.
- He prefers black and wants a restrained, professional silhouette.
- His first priority is cabin compatibility; his next concern is immediate laptop access between security, the lounge and the meeting after landing.
- He values concise measured evidence more than promotional copy.

## Relevant use

For a request about this journey, pass `air_business`, `british_airways`, `cabin_bag`, Singapore, black, laptop and business-appearance signals to `prepare_shopping_experience`. Do not turn the experience into a low-cost or discount story.

The authored page should be the closest match, not a claim that Graham is the page or that the merchant knows his identity.

================================================================

## RECORDING RUN — OPENING TAKE

### You paste

> Use the built-in browser to open https://prsim.yafa.sh/#preview. I’m flying from London to Singapore with British Airways for work. Help me choose a restrained black cabin bag for my 16-inch laptop and three days, directly on the page.

### Expected WebMCP call

Call `prepare_shopping_experience` once with English, `air_business`, British Airways, `cabin_bag`, Singapore, black, laptop, business appearance, a premium projection and concise technical evidence. Do not call a catalogue or airline tool immediately afterwards.

### Expected companion reply

> I recommend the Passage 32 in black. I’ve prepared the store around your British Airways cabin allowance, laptop access and arrival-ready business use.

### What must be visible

- The storefront changes in place to the London–Singapore business-flight experience.
- The hero stays light and restrained, with the black bag, British Airways allowance and Buy CTA visible without a long scroll.
- The body prioritises cabin fit, business packing, technical material, measured specifications and comparable frequent-flyer evidence.
- The color remains changeable; the recommendation is not a lock-in.

================================================================

## RECORDING RUN — FOLLOW-UP TAKE

### You paste

> At security, can I take the laptop out without opening the compartment with my clothes?

### Expected WebMCP call

Call `update_experience_blocks` once with `purpose: laptop_access`, `operation: auto`, `placement: best` and the shopper’s question as `request`. Do not call `prepare_shopping_experience` again and do not replace the hero.

### Expected companion reply

> Yes. I’ve added the dedicated laptop-access sequence: the 16-inch laptop lifts from its separate sleeve while the main clothing compartment stays closed.

### What must be visible

- A three-step technical diagram appears immediately after the British Airways compatibility section.
- The sequence shows open access, lift laptop and main volume closed.
- The diagram uses no product photo and can replay its motion.
- The Buy CTA and selected black color remain unchanged.
