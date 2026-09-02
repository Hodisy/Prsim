import { esc, productImages, shopHeader } from "../components/primitives.js";

let clockInstance = 0;

export function formatElapsed(milliseconds = 0) {
  const safe = Math.max(0, Number(milliseconds) || 0);
  const minutes = String(Math.floor(safe / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((safe % 60000) / 1000)).padStart(2, "0");
  const millis = String(Math.floor(safe % 1000)).padStart(3, "0");
  return `${minutes}:${seconds}.${millis}`;
}

function formatDecisionTime(milliseconds = 0) {
  const total = Math.floor(Math.max(0, Number(milliseconds) || 0) / 1000);
  const hours = String(Math.floor(total / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function benchmarkCopy(milliseconds) {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  if (seconds < 5 * 60) return "Décision éclair. Vous êtes largement sous le repère retail.";
  if (seconds < 17 * 60 + 46) return "Vous êtes sous le repère retail observé.";
  if (seconds < 30 * 60) return "Vous avez pris le temps juste nécessaire pour décider.";
  return "Décision mûrement réfléchie. Merci d’avoir pris le temps.";
}

const conversionRemarks = {
  instant: [
    "Une décision mûrement réfléchie… en vingt secondes, vraiment ?",
    "Coup de cœur ou embuscade marketing ?",
    "Tu étais venu regarder. C’est ce qu’ils disent tous.",
  ],
  quick: [
    "Pas besoin d’insister longtemps, visiblement.",
    "On appelle ça de l’efficacité. Ton relevé bancaire, peut-être moins.",
    "Le besoin était peut-être flou. L’envie, beaucoup moins.",
  ],
  considered: [
    "Tu as comparé. Tu as réfléchi. Tu as quand même acheté.",
    "Un clic très sûr de lui pour quelqu’un qui hésitait il y a trois minutes.",
    "Tu avais besoin d’un sac. Enfin, c’est la version officielle.",
  ],
  long: [
    "Tu as pris ton temps. Le produit a fini par gagner à l’usure.",
    "Tu n’étais pas convaincu. Jusqu’à ce que tu le sois assez pour payer.",
    "À ce stade, ce n’est plus un achat impulsif : c’est de la négociation intérieure.",
    "Il a fallu du temps, mais visiblement pas assez pour renoncer.",
  ],
};

const bundleRemarks = [
  "Et tant qu’à faire, autant prendre le pack.",
  "Le sac seul aurait été une décision trop raisonnable.",
  "Tu as optimisé ton achat. C’est une façon élégante de le dire.",
];

function randomRemark(milliseconds, bundleEnabled) {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const tier = seconds < 30 ? "instant" : seconds < 3 * 60 ? "quick" : seconds < 15 * 60 ? "considered" : "long";
  const main = conversionRemarks[tier];
  return {
    main: main[Math.floor(Math.random() * main.length)],
    bundle: bundleEnabled ? bundleRemarks[Math.floor(Math.random() * bundleRemarks.length)] : "",
  };
}

// Same particle engine as the standalone Dot Clock, adapted to keep each digit as its own group.
function createTargetGroups(canvas, context, text, width, height, ratio) {
  const fontSize = Math.min(width / (text.length * .66), height * .68);
  const layer = document.createElement("canvas");
  layer.width = Math.max(1, Math.floor(width * ratio));
  layer.height = Math.max(1, Math.floor(height * ratio));
  const layerContext = layer.getContext("2d", { willReadFrequently: true });
  const scaledSize = fontSize * ratio;
  layerContext.font = `700 ${scaledSize}px ui-sans-serif, system-ui, sans-serif`;
  layerContext.textBaseline = "middle";
  const glyphWidths = [...text].map((glyph) => layerContext.measureText(glyph).width);
  const lineWidth = glyphWidths.reduce((total, glyphWidth) => total + glyphWidth, 0);
  let cursor = (layer.width - lineWidth) / 2;
  const ranges = glyphWidths.map((glyphWidth) => {
    const range = { start: cursor, end: cursor + glyphWidth };
    cursor += glyphWidth;
    return range;
  });
  layerContext.fillStyle = "#000";
  layerContext.textAlign = "left";
  layerContext.fillText(text, ranges[0].start, layer.height / 2 + scaledSize * .02);

  const data = layerContext.getImageData(0, 0, layer.width, layer.height).data;
  const step = Math.max(4, Math.round(fontSize / 43)) * ratio;
  const groups = [...text].map(() => []);
  for (let y = 0; y < layer.height; y += step) {
    for (let x = 0; x < layer.width; x += step) {
      if (data[(Math.floor(y) * layer.width + Math.floor(x)) * 4 + 3] < 90) continue;
      const groupIndex = ranges.findIndex((range) => x >= range.start && x <= range.end);
      if (groupIndex >= 0) groups[groupIndex].push({ x: x / ratio, y: y / ratio });
    }
  }
  const maximum = Math.min(2400, Math.floor((width * height) / 135));
  const total = groups.reduce((count, group) => count + group.length, 0);
  if (total <= maximum) return groups;
  return groups.map((group) => {
    const limit = Math.max(1, Math.round((group.length / total) * maximum));
    const stride = group.length / limit;
    return Array.from({ length: limit }, (_, index) => group[Math.floor(index * stride)]);
  });
}

function newParticle(target, group, width, height, settled = false) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.max(width, height) * (.14 + Math.random() * .34);
  return {
    x: settled ? target.x : width / 2 + Math.cos(angle) * radius,
    y: settled ? target.y : height / 2 + Math.sin(angle) * radius,
    vx: 0, vy: 0, tx: target.x, ty: target.y, group,
    size: .9 + Math.random() * 1.25,
    seed: Math.random() * Math.PI * 2,
    burst: 0,
  };
}

export function startPaymentExperience({ frozenMs, sessionStartedAt = performance.now() } = {}) {
  const canvas = document.querySelector("[data-decision-canvas]");
  const liveText = document.querySelector("[data-decision-live]");
  if (!canvas || !liveText) return;

  const context = canvas.getContext("2d");
  const instance = ++clockInstance;
  const hasPurchaseReference = Number.isFinite(frozenMs);
  const origin = hasPurchaseReference ? frozenMs : performance.now() - sessionStartedAt;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: -1000, y: -1000, active: false };
  let width = 0;
  let height = 0;
  let ratio = 1;
  let groups = [];
  let particles = [];
  let renderedText = "";
  let previous = "";
  let lastSecond = -1;
  let keepDispersed = false;
  let lastFrame = performance.now();
  const changedGroups = [];

  const rebuildTargets = (text, force = false) => {
    const targets = createTargetGroups(canvas, context, text, width, height, ratio);
    groups = targets.map((targetGroup, groupIndex) => {
      const changed = force || renderedText[groupIndex] !== text[groupIndex];
      const current = groups[groupIndex] || [];
      if (!changed) return current;
      if (renderedText[groupIndex] && renderedText[groupIndex] !== text[groupIndex]) changedGroups[groupIndex] = true;
      if (!current.length) return targetGroup.map((target) => newParticle(target, groupIndex, width, height, !renderedText));
      while (current.length < targetGroup.length) {
        const originParticle = current[Math.floor(Math.random() * current.length)];
        const particle = newParticle(targetGroup[current.length], groupIndex, width, height, false);
        particle.x = originParticle.x;
        particle.y = originParticle.y;
        current.push(particle);
      }
      current.length = targetGroup.length;
      current.forEach((particle, index) => {
        const target = targetGroup[Math.floor((index / current.length) * targetGroup.length)];
        particle.tx = target.x;
        particle.ty = target.y;
        particle.group = groupIndex;
        particle.vx += (Math.random() - .5) * 7;
        particle.vy += (Math.random() - .5) * 7;
        particle.burst = reduceMotion ? 0 : 1;
      });
      return current;
    });
    particles = groups.flat();
    renderedText = text;
  };

  const scatterParticles = (hold = false) => {
    particles.forEach((particle) => {
      const angle = Math.random() * Math.PI * 2;
      const force = 11 + Math.random() * 28;
      if (hold) {
        const distance = 36 + Math.random() * 96;
        particle.holdX = particle.tx + Math.cos(angle) * distance;
        particle.holdY = particle.ty + Math.sin(angle) * distance;
      }
      particle.vx += Math.cos(angle) * force;
      particle.vy += Math.sin(angle) * force;
      particle.burst = hold || reduceMotion ? 0 : 1.25;
    });
  };

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    rebuildTargets(previous || formatDecisionTime(origin), true);
    if (keepDispersed) scatterParticles(true);
  };

  const updateTime = (now) => {
    // The purchase time is only the red reference. The clock itself keeps following
    // the session; each character turns blue the first time it differs from that reference.
    const elapsed = performance.now() - sessionStartedAt;
    const seconds = Math.floor(elapsed / 1000);
    const next = formatDecisionTime(elapsed);
    if (seconds !== lastSecond) {
      liveText.textContent = next;
      rebuildTargets(next);
      previous = next;
      lastSecond = seconds;
    }
    return now;
  };

  const draw = (time) => {
    if (instance !== clockInstance || !canvas.isConnected) return;
    const delta = Math.min(32, time - lastFrame) / 16.667;
    lastFrame = time;
    updateTime(time);
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.burst *= Math.pow(.84, delta);
      const targetX = (keepDispersed && particle.holdX !== undefined ? particle.holdX : particle.tx) + Math.sin(time * .0011 + particle.seed) * particle.burst * 34;
      const targetY = (keepDispersed && particle.holdY !== undefined ? particle.holdY : particle.ty) + Math.cos(time * .0008 + particle.seed * 1.7) * particle.burst * 24;
      particle.vx += (targetX - particle.x) * .075 * delta;
      particle.vy += (targetY - particle.y) * .075 * delta;
      if (pointer.active && !reduceMotion) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        const radius = Math.min(68, width * .06);
        if (distance < radius) {
          const push = (1 - distance / radius) * 3.2 * delta;
          particle.vx += (dx / distance) * push;
          particle.vy += (dy / distance) * push;
        }
      }
      particle.vx *= Math.pow(.72, delta);
      particle.vy *= Math.pow(.72, delta);
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      const blue = changedGroups[particle.group] ? 1 : 0;
      const alpha = .72 + Math.sin(time * .003 + particle.seed * 9) * .16;
      const red = [217, 47, 40];
      const blueRgb = [24, 85, 255];
      const rgb = red.map((channel, index) => Math.round(channel * (1 - blue) + blueRgb[index] * blue));
      context.beginPath();
      context.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(draw);
  };

  canvas.addEventListener("pointermove", (event) => {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  });
  canvas.addEventListener("pointerleave", () => { pointer.active = false; });
  canvas.addEventListener("pointerdown", (event) => { canvas.setPointerCapture(event.pointerId); scatterParticles(keepDispersed); });
  window.addEventListener("resize", resize, { once: true });
  resize();
  requestAnimationFrame(draw);
}

export function renderPaymentPage(purchase) {
  const hasPurchase = Number.isFinite(purchase?.elapsedMs);
  const elapsedMs = hasPurchase ? purchase.elapsedMs : 0;
  const product = purchase?.productLabel || "Passage 32";
  const color = purchase?.colorLabel || "Noir";
  const price = purchase?.price || "149 €";
  const bundle = purchase?.bundleEnabled ? "Pack organisation" : "Sac seul";
  const time = formatDecisionTime(elapsedMs);
  const remark = randomRemark(elapsedMs, purchase?.bundleEnabled);
  return `
    <div class="shop-page payment-page" data-profile="payment">
      ${shopHeader()}
      <main class="payment-shell">
        <section class="payment-decision" aria-labelledby="payment-decision-title">
          <div class="payment-decision-copy">
            <p class="payment-kicker">PREUVE DE DÉCISION · ${hasPurchase ? esc(purchase.conversionType) : "SESSION EN COURS"}</p>
            <p class="payment-comment">${esc(remark.main)}${remark.bundle ? ` <span>(${esc(remark.bundle)})</span>` : ""}</p>
            <h2 id="payment-decision-title">Votre décision a pris.</h2>
          </div>
          <div class="payment-clock-wrap" aria-label="Temps de décision en points rouges et bleus">
            <span class="sr-only" data-decision-live>${time}</span>
            <canvas data-decision-canvas></canvas>
            <div class="payment-decision-note"><p class="payment-benchmark">${benchmarkCopy(elapsedMs)}</p><p class="payment-reference">Repère indicatif&nbsp;: 17&nbsp;min&nbsp;46&nbsp;s pour une session d’achat retail.</p></div>
          </div>
          <div class="payment-decision-foot"><span>Déplacez le curseur dans l’heure.</span><span>${hasPurchase ? `Déclenché par ${esc(purchase.sourceLabel || "votre sélection")}` : "En attente de votre sélection"}</span></div>
        </section>
        <section class="payment-checkout" aria-label="Récapitulatif et paiement">
          <div class="payment-checkout-top"><p>VOTRE PANIER</p><span>PAIEMENT SÉCURISÉ</span></div>
          <div class="payment-product"><div class="payment-product-image"><img src="${esc(purchase?.image || productImages.hero)}" alt="${esc(product)} · ${esc(color)}" /></div><div class="payment-product-copy"><h3>${esc(product)}</h3><p>${esc(color)} · ${esc(bundle)}</p><strong>${esc(price)}</strong></div></div>
          <dl class="payment-totals"><div><dt>Sous-total</dt><dd>${esc(price)}</dd></div><div><dt>Livraison</dt><dd class="payment-free">Offerte</dd></div><div class="payment-total"><dt>Total</dt><dd>${esc(price)}</dd></div></dl>
          <form class="payment-form" data-payment-form>
            <div class="payment-form-head"><span>Coordonnées de paiement</span><small>Prototype sécurisé</small></div>
            <label><span>Numéro de carte</span><input type="text" inputmode="numeric" placeholder="4242 4242 4242 4242" autocomplete="cc-number" /></label>
            <div class="payment-form-row"><label><span>Expiration</span><input type="text" placeholder="MM / AA" autocomplete="cc-exp" /></label><label><span>CVC</span><input type="text" inputmode="numeric" placeholder="123" autocomplete="cc-csc" /></label></div>
            <label><span>Nom sur la carte</span><input type="text" placeholder="Votre nom" autocomplete="cc-name" /></label>
            <button class="payment-submit" type="button" data-complete-payment>Payer ${esc(price)}</button>
            <p class="payment-disclaimer">Démonstration uniquement — aucune donnée bancaire n’est envoyée ni enregistrée.</p>
          </form>
        </section>
      </main>
    </div>`;
}
