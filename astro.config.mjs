// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/data/site.ts';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/llms'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
