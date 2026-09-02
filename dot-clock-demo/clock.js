const canvas = document.querySelector("#dot-clock");
const context = canvas.getContext("2d");
const shuffleButton = document.querySelector("#shuffle");
const timeAnnouncement = document.querySelector("#screen-reader-time");
const dateLabel = document.querySelector("#date-label");
const holdDispersedToggle = document.querySelector("#hold-dispersed");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pointer = { x: -1000, y: -1000, active: false };
let particles = [];
let particleGroups = [];
let width = 0;
let height = 0;
let pixelRatio = 1;
let previousTime = "";
let previousDisplayTime = "";
let renderedText = "";
let keepDispersed = false;
let lastFrame = performance.now();

function formatTime(now = new Date()) {
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function displayTime(formatted) {
  return width < 580 ? formatted.slice(0, 5) : formatted;
}

function refreshLabels(now = new Date()) {
  const formatted = formatTime(now);
  if (formatted !== previousTime) {
    previousTime = formatted;
    const [hours, minutes, seconds] = formatted.split(":");
    timeAnnouncement.textContent = `Il est ${hours} heures ${minutes} minutes et ${seconds} secondes.`;
    const visibleTime = displayTime(formatted);
    if (visibleTime !== previousDisplayTime) {
      rebuildTargets(visibleTime);
      previousDisplayTime = visibleTime;
    }
  }
  dateLabel.textContent = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  }).format(now);
}

function createTargetGroups(text) {
  const fontSize = Math.min(width / (text.length * .64), height * .46);
  const layer = document.createElement("canvas");
  layer.width = Math.max(1, Math.floor(width * pixelRatio));
  layer.height = Math.max(1, Math.floor(height * pixelRatio));
  const layerContext = layer.getContext("2d", { willReadFrequently: true });
  const scaledSize = fontSize * pixelRatio;
  layerContext.font = `700 ${scaledSize}px ui-sans-serif, system-ui, sans-serif`;
  layerContext.textBaseline = "middle";
  layerContext.fillStyle = "white";
  const glyphWidths = [...text].map((glyph) => layerContext.measureText(glyph).width);
  const lineWidth = glyphWidths.reduce((total, glyphWidth) => total + glyphWidth, 0);
  let cursor = (layer.width - lineWidth) / 2;
  const ranges = glyphWidths.map((glyphWidth) => {
    const range = { start: cursor, end: cursor + glyphWidth };
    cursor += glyphWidth;
    return range;
  });
  layerContext.textAlign = "left";
  layerContext.fillText(text, ranges[0].start, layer.height / 2 + scaledSize * .02);

  const data = layerContext.getImageData(0, 0, layer.width, layer.height).data;
  const step = Math.max(5, Math.round(fontSize / 43)) * pixelRatio;
  const groups = [...text].map(() => []);
  for (let y = 0; y < layer.height; y += step) {
    for (let x = 0; x < layer.width; x += step) {
      if (data[(Math.floor(y) * layer.width + Math.floor(x)) * 4 + 3] > 90) {
        const groupIndex = ranges.findIndex((range) => x >= range.start && x <= range.end);
        if (groupIndex >= 0) groups[groupIndex].push({ x: x / pixelRatio, y: y / pixelRatio });
      }
    }
  }

  const maximum = Math.min(3800, Math.floor((width * height) / 480));
  const total = groups.reduce((count, group) => count + group.length, 0);
  if (total <= maximum) return groups;
  return groups.map((group) => {
    const limit = Math.max(1, Math.round((group.length / total) * maximum));
    const stride = group.length / limit;
    return Array.from({ length: limit }, (_, index) => group[Math.floor(index * stride)]);
  });
}

function newParticle(target, settled = false) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.max(width, height) * (.15 + Math.random() * .4);
  return {
    x: settled ? target.x : width / 2 + Math.cos(angle) * radius,
    y: settled ? target.y : height / 2 + Math.sin(angle) * radius,
    vx: 0,
    vy: 0,
    tx: target.x,
    ty: target.y,
    size: .9 + Math.random() * 1.25,
    seed: Math.random() * Math.PI * 2,
    burst: 0,
  };
}

function rebuildTargets(text, force = false) {
  const targetGroups = createTargetGroups(text);
  particleGroups = targetGroups.map((targets, groupIndex) => {
    const isChanged = force || renderedText[groupIndex] !== text[groupIndex];
    const current = particleGroups[groupIndex] || [];

    if (!isChanged) return current;
    if (!current.length) return targets.map((target) => newParticle(target, !renderedText));

    while (current.length < targets.length) {
      const origin = current[Math.floor(Math.random() * current.length)];
      const particle = newParticle(targets[current.length], false);
      particle.x = origin.x;
      particle.y = origin.y;
      current.push(particle);
    }
    current.length = targets.length;
    current.forEach((particle, index) => {
      const target = targets[Math.floor((index / current.length) * targets.length)];
      particle.tx = target.x;
      particle.ty = target.y;
      particle.vx += (Math.random() - .5) * 7;
      particle.vy += (Math.random() - .5) * 7;
      particle.burst = prefersReducedMotion ? 0 : 1;
    });
    return current;
  });
  particles = particleGroups.flat();
  renderedText = text;
}

function resize() {
  const box = canvas.getBoundingClientRect();
  width = box.width;
  height = box.height;
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const visibleTime = displayTime(previousTime || formatTime());
  previousDisplayTime = visibleTime;
  rebuildTargets(visibleTime, true);
  if (keepDispersed) scatterParticles(true);
}

function scatterParticles(holdPosition = false) {
  particles.forEach((particle) => {
    const angle = Math.random() * Math.PI * 2;
    const force = 11 + Math.random() * 28;
    const holdDistance = 42 + Math.random() * 110;
    if (holdPosition) {
      particle.holdX = particle.tx + Math.cos(angle) * holdDistance;
      particle.holdY = particle.ty + Math.sin(angle) * holdDistance;
    }
    particle.vx += Math.cos(angle) * force;
    particle.vy += Math.sin(angle) * force;
    particle.burst = holdPosition || prefersReducedMotion ? 0 : 1.25;
  });
}

function setKeepDispersed(enabled) {
  keepDispersed = enabled;
  if (enabled) {
    scatterParticles(true);
    return;
  }
  particles.forEach((particle) => {
    particle.holdX = undefined;
    particle.holdY = undefined;
    particle.burst = prefersReducedMotion ? 0 : .45;
  });
}

function shuffle() {
  scatterParticles(keepDispersed);
}

function draw(time) {
  const delta = Math.min(32, time - lastFrame) / 16.667;
  lastFrame = time;
  context.clearRect(0, 0, width, height);
  const motion = prefersReducedMotion ? 0 : 1;
  particles.forEach((particle) => {
    particle.burst *= Math.pow(.84, delta);
    const baseX = keepDispersed && particle.holdX !== undefined ? particle.holdX : particle.tx;
    const baseY = keepDispersed && particle.holdY !== undefined ? particle.holdY : particle.ty;
    const targetX = baseX + Math.sin(time * .0011 + particle.seed) * particle.burst * 34;
    const targetY = baseY + Math.cos(time * .0008 + particle.seed * 1.7) * particle.burst * 24;
    particle.vx += (targetX - particle.x) * .075 * delta;
    particle.vy += (targetY - particle.y) * .075 * delta;

    if (pointer.active && motion) {
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

    const shimmer = .76 + Math.sin(time * .003 + particle.seed * 9) * .16;
    context.beginPath();
    context.fillStyle = `rgba(217, 47, 40, ${shimmer})`;
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(draw);
}

canvas.addEventListener("pointermove", (event) => {
  const bounds = canvas.getBoundingClientRect();
  pointer.x = event.clientX - bounds.left;
  pointer.y = event.clientY - bounds.top;
  pointer.active = true;
});
canvas.addEventListener("pointerleave", () => { pointer.active = false; });
canvas.addEventListener("pointerdown", (event) => {
  canvas.setPointerCapture(event.pointerId);
  shuffle();
});
shuffleButton.addEventListener("click", shuffle);
holdDispersedToggle.addEventListener("change", () => setKeepDispersed(holdDispersedToggle.checked));
window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && event.target === document.body) {
    event.preventDefault();
    shuffle();
  }
});

resize();
refreshLabels();
setInterval(refreshLabels, 250);
requestAnimationFrame(draw);
