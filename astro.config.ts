import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import icon from "astro-icon";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  site: "https://aimhighbni.com",
  integrations: [tailwind(), sitemap(), react(), icon()],
  image: {
    domains: ["caeiaprjizteokoenzad.supabase.co"],
  },
});
