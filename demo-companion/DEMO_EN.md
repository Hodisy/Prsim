# PRSIM — WebMCP challenge demo

## Opening talk track

Hi, I’m Jules. I’m a developer working across ecommerce, adtech and AI.

For the WebMCP challenge, I wanted to explore a use case that creates value for both the shopper and the merchant.

WebMCP is a proposed web standard that lets a website expose useful actions as local tools to an AI companion inside the browser. The assistant does not only talk about the page: it can work with the page, in the same session, while the shopper is looking at it.

This is PRSIM, an adaptive commerce prototype. Instead of asking people to complete a profile or configure a landing page, the shopper simply expresses a need. Their companion shares only the context that matters for this purchase. In one call, PRSIM selects an authored experience and assembles the right layouts, copy, imagery, proof and call to action.

The merchant stays in control: the model never invents the interface. It selects and adjusts approved components.

The idea is inspired by the Elaboration Likelihood Model from Petty and Cacioppo. When involvement is high, strong arguments and evidence matter more. When involvement is lower, clear cues, confidence and projection can carry more weight. PRSIM adapts the density and order of information to the way the shopper is deciding.

Let me show you.

## First prompt — with a demo companion

Replace `DEMO_URL` with the hosted Preview URL.

> I found this store: DEMO_URL. Open it in the built-in browser and help me find the right bag for my next trip without making me compare ten options.

Expected result: the companion opens Preview and calls `prepare_shopping_experience` once. With the Ryan context, the page should resolve to a three-day Dublin trip on Ryanair, a maximum budget of EUR 100, a black bag and under-seat compatibility as the main concern.

## First prompt — without companion context

> I found this store: DEMO_URL. Open it in the built-in browser and help me choose directly on the page. I’m flying to Dublin with Ryanair for three days, my budget is EUR 100, I want a black bag that fits under the seat, and I would rather get one clear recommendation than compare ten options.

## Follow-up sequence

Ask one question at a time and leave the same page open.

1. **Cabin proof**

   > Does it really fit under a Ryanair seat?

2. **Local page adaptation**

   > Show me the four formats side by side.

3. **Color change**

   > Now show me the Liberty blue version.

4. **Trust and evidence**

   > I’d like to see reviews from people who travel often before I decide.

5. **Purchase**

   > I’ll take it.

Expected behavior: the initial preparation tool is used only once. Follow-up tools change the relevant hero, section, color, evidence or commerce state without rematching or rebuilding the whole page.

## What to say while the page changes

The first transformation comes from a single high-level need, not a list of UI instructions. PRSIM finds the closest authored assembly and applies it in place.

Now the initial tool has disappeared. The companion gets smaller, focused tools for cabin compatibility, color, evidence, layout emphasis and checkout. Each question changes only the relevant part of the same storefront.

## Closing line

PRSIM turns personalization from hidden tracking into visible collaboration: one merchant-controlled storefront, shaped in real time by the context the shopper chooses to bring.

## Recording checklist

- Use GPT-5.6 Sol or GPT-5.6 Terra in the desktop app.
- Keep the hosted `#preview` page open in the built-in browser.
- Confirm Website Tools are enabled before recording.
- Start from the classic Preview and reset between personas.
- Record the chat and storefront together.
- Show the initial transformation, one section update, one color change and the purchase transition.
- Inspect the Website Tools activity log after the take if you need technical proof of the calls.

## Sources

- OpenAI, “Site tools (WebMCP)”: https://learn.chatgpt.com/docs/webmcp
- Petty, R. E. & Cacioppo, J. T. (1986), “The Elaboration Likelihood Model of Persuasion”: https://doi.org/10.1016/S0065-2601(08)60214-2
