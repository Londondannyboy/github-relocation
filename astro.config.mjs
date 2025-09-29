// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://relocation.quest',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        'https://relocation.quest/visas/',
        'https://relocation.quest/taxes/',
        'https://relocation.quest/insurance/',
        'https://relocation.quest/countries/',
        'https://relocation.quest/tools/'
      ],
      serialize(item) {
        if (item.url.includes('/exit-tax/')) {
          item.priority = 0.9;
        }
        if (item.url.includes('/digital-nomad/')) {
          item.priority = 0.9;
        }
        return item;
      }
    })
  ]
});