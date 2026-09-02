import { join, normalize } from "node:path";
import { profiles, resolveProfileVariant } from "./src/data/profiles.js";
import { findBlockByPurpose, instantiateBlock } from "./src/data/block-registry.js";
import { experiencePath, parseExperiencePath } from "./src/core/experience-route.js";
import { translateText } from "./src/core/i18n.js";

const root = import.meta.dir;
const entry = "prsim-wireframe-preview.html";
const hostname = Bun.env.PRSIM_HOST || "localhost";
const port = Number(Bun.env.PRSIM_PORT || 4173);
const entryFile = Bun.file(join(root, entry));
const hasScenario = (key) => Boolean(profiles[key]);
const socialColorLabels = Object.freeze({
  black: { fr: "noir", en: "black" },
  cream: { fr: "crème", en: "cream" },
  "liberty-blue": { fr: "Liberty bleu", en: "Liberty blue" },
  "liberty-burgundy": { fr: "Liberty bordeaux", en: "Liberty burgundy" },
});

const escapeAttribute = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

function absoluteAssetUrl(path, origin) {
  const cleanPath = String(path || "").replace(/^\.\//, "/");
  return new URL(cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`, origin).href;
}

function socialExperience(route, origin) {
  const language = route.language || "en";
  const profile = route.scenarioKey === "classic"
    ? profiles.classic
    : resolveProfileVariant(route.scenarioKey, route.variantId) || profiles[route.scenarioKey] || profiles.classic;
  const heroDefinition = route.heroPurpose && findBlockByPurpose("hero", route.heroPurpose);
  const hero = heroDefinition ? instantiateBlock(heroDefinition, profiles) : profile.hero;
  const colorway = route.colorway || profile.colorway || "black";
  const image = hero.colorAssets?.[colorway]
    || hero.asset
    || `./assets/products/72h-${colorway}/01-hero-three-quarter.png`;
  const heading = translateText(hero.title || profile.title || "PORT 70", language);
  const body = translateText(hero.body || profile.sub || "Adaptive shopping experience by PORT 70.", language);
  const colorLabel = socialColorLabels[colorway]?.[language] || colorway;
  const bundleEnabled = route.bundleEnabled ?? Boolean(profile.hero.bundle && profile.hero.bundle.selected !== false);
  const bundleName = translateText(hero.bundle?.name || profile.hero.bundle?.name || "Pack organisation", language);
  const selection = language === "fr"
    ? `Coloris : ${colorLabel}.${bundleEnabled ? ` ${bundleName} sélectionné.` : ""}`
    : `Color: ${colorLabel}.${bundleEnabled ? ` ${bundleName} selected.` : ""}`;
  const description = `${body} ${selection}`;
  return {
    language,
    title: `PORT 70 | ${heading}`,
    description,
    image: absoluteAssetUrl(image, origin),
    imageAlt: `${translateText(hero.media || heading, language)} · ${socialColorLabels[colorway]?.[language] || colorway}`,
    canonical: new URL(experiencePath(route.code), origin).href,
  };
}

async function renderExperienceHtml(route, origin) {
  const social = socialExperience(route, origin);
  const meta = `
    <link rel="canonical" href="${escapeAttribute(social.canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="PORT 70" />
    <meta property="og:locale" content="${social.language === "fr" ? "fr_FR" : "en_US"}" />
    <meta property="og:url" content="${escapeAttribute(social.canonical)}" />
    <meta property="og:title" content="${escapeAttribute(social.title)}" />
    <meta property="og:description" content="${escapeAttribute(social.description)}" />
    <meta property="og:image" content="${escapeAttribute(social.image)}" />
    <meta property="og:image:alt" content="${escapeAttribute(social.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(social.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(social.description)}" />
    <meta name="twitter:image" content="${escapeAttribute(social.image)}" />`;
  return (await entryFile.text())
    .replace('<html lang="en">', `<html lang="${social.language}">`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttribute(social.description)}" />`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttribute(social.title)}</title>`)
    .replace("</head>", `${meta}\n  </head>`);
}

const server = Bun.serve({
  hostname,
  port,
  async fetch(request) {
    const url = new URL(request.url);
    const isExperiencePage = url.pathname === "/"
      || url.pathname === `/${entry}`
      || /^\/s\d/i.test(url.pathname);

    if (isExperiencePage) {
      const route = parseExperiencePath(url.pathname, { hasScenario });
      if (!route.valid) return Response.redirect(`${url.origin}/#preview`, 302);
      const canonicalPath = experiencePath(route.code);
      if (url.pathname !== "/" && url.pathname !== `/${entry}` && canonicalPath !== url.pathname) {
        return Response.redirect(`${url.origin}${canonicalPath}`, 302);
      }
      return new Response(await renderExperienceHtml(route, url.origin), {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    const requestedPath = decodeURIComponent(url.pathname).replace(/^\/+/, "") || entry;
    const relativePath = normalize(requestedPath);

    if (relativePath.startsWith("..")) {
      return new Response("Forbidden", { status: 403 });
    }

    const file = Bun.file(join(root, relativePath));
    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(file, {
      headers: { "Cache-Control": "no-store" },
    });
  },
});

console.log(`PRSIM disponible sur ${server.url}`);
