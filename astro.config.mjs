// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://nonnadelias.com",
  output: "static",
  trailingSlash: "ignore",
  build: { format: "directory" },
});
