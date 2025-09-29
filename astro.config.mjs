// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
// import vercel from '@astrojs/vercel/serverless'; // Need to install first

// https://astro.build/config
export default defineConfig({
  site: 'https://relocation.quest',
  output: 'static', // Keep static for now - need Vercel adapter for hybrid
  // adapter: vercel(), // Uncomment when package is installed
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
        'https://relocation.quest/tools/',
        'https://relocation.quest/llms.txt',
        'https://relocation.quest/robots.txt',
        'https://relocation.quest/ai.txt'
      ],
      serialize(item) {
        // High priority for AI files
        if (item.url.includes('llms.txt') || item.url.includes('ai.txt')) {
          item.priority = 1.0;
          item.changefreq = 'monthly';
        }
        // High priority for exit tax and digital nomad content
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