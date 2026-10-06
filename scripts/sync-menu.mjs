#!/usr/bin/env node
// Refresh src/data/menu.json from the restaurant's live ordering menu.
// Usage: npm run sync-menu
// Item names, descriptions, and prices are copied verbatim; inactive/deleted items are dropped.
import { writeFileSync } from "node:fs";

const SUBDOMAIN = "nonnadelias";
const res = await fetch(`https://${SUBDOMAIN}.direct-ordering.com/api/menus/1/light`);
if (!res.ok) {
  console.error(`Menu fetch failed: ${res.status}`);
  process.exit(1);
}

const menus = await res.json();
const byOrder = (a, b) => a.displayOrder - b.displayOrder;

const categories = menus
  .filter((m) => m.isActive && !m.isDeleted)
  .flatMap((m) => m.subcategories)
  .filter((c) => !c.isDeleted)
  .sort(byOrder)
  .map((c) => {
    const seen = new Set();
    const items = c.items
      .filter((i) => i.isActive && !i.isDeleted)
      .sort(byOrder)
      .map((i) => ({
        name: i.name.replace(/\s+/g, " ").trim(),
        description: (i.description || "").replace(/\s+/g, " ").trim(),
        price: i.price,
      }))
      // The ordering system lists a few items twice; show each one once.
      .filter((i) => {
        const key = `${i.name}|${i.price}|${i.description}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    return { name: c.name.trim(), description: (c.description || "").trim(), items };
  })
  .filter((c) => c.items.length > 0);

writeFileSync(
  new URL("../src/data/menu.json", import.meta.url),
  JSON.stringify({ fetchedAt: new Date().toISOString(), categories }, null, 2) + "\n",
);
console.log(`Wrote ${categories.length} categories, ${categories.reduce((n, c) => n + c.items.length, 0)} items.`);
