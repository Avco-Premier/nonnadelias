#!/usr/bin/env node
// Regenerate public/sitemap.xml from the real public routes and the images each page shows.
// Usage: npm run sitemap (run after committing page changes so <lastmod> reflects git history).
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const DOMAIN = "https://nonnadelias.com";

const pages = [
  {
    path: "/",
    sources: ["src/pages/index.astro", "src/layouts/Base.astro"],
    changefreq: "weekly",
    priority: "1.0",
    images: [
      ["/images/storefront-sign.jpg", "The Nonna Delia's sign on the restaurant's greenery wall"],
      ["/images/pizza-slice.jpg", "A slice of Nonna Delia's pizza on a green-rimmed plate"],
      ["/images/grandma-square.jpg", "Square slice of Nonna Delia's pizza with tomato and basil"],
      ["/logo.png", "Nonna Delia's logo"],
    ],
  },
  {
    path: "/menu/",
    sources: ["src/pages/menu.astro", "src/data/menu.json"],
    changefreq: "weekly",
    priority: "0.9",
    images: [["/images/pizza-slice.jpg", "A slice of Nonna Delia's pizza"]],
  },
  {
    path: "/order/",
    sources: ["src/pages/order.astro"],
    changefreq: "monthly",
    priority: "0.8",
    images: [
      ["/images/grandma-square.jpg", "Square slice of Nonna Delia's pizza"],
      ["/images/pizza-slice.jpg", "A slice of Nonna Delia's pizza ready for pickup"],
      ["/images/storefront-sign.jpg", "The Nonna Delia's sign inside the restaurant"],
    ],
  },
  {
    path: "/catering/",
    sources: ["src/pages/catering.astro", "src/data/menu.json"],
    changefreq: "monthly",
    priority: "0.7",
    images: [["/images/grandma-square.jpg", "Square slice of Nonna Delia's pizza"]],
  },
  {
    path: "/location/",
    sources: ["src/pages/location.astro", "src/data/site.ts"],
    changefreq: "yearly",
    priority: "0.6",
    images: [["/images/storefront-sign.jpg", "The Nonna Delia's sign at 18-32 College Point Blvd"]],
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;");

function lastmod(files) {
  const dates = files
    .map((f) => {
      try {
        return execFileSync("git", ["log", "-1", "--format=%cI", "--", f], { encoding: "utf8" }).trim();
      } catch {
        return "";
      }
    })
    .filter(Boolean)
    .sort();
  return dates.at(-1) || new Date().toISOString();
}

const urls = pages
  .map((p) => {
    const images = p.images
      .map(
        ([src, title]) =>
          `    <image:image>\n      <image:loc>${DOMAIN}${src}</image:loc>\n      <image:title>${esc(title)}</image:title>\n    </image:image>`,
      )
      .join("\n");
    return `  <url>
    <loc>${DOMAIN}${p.path}</loc>
    <lastmod>${lastmod(p.sources)}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
${images}
  </url>`;
  })
  .join("\n");

writeFileSync(
  new URL("../public/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`,
);
console.log(`Wrote public/sitemap.xml with ${pages.length} URLs.`);
