// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.SITE_URL,

  // -------------------
  // アナリティクス設定
  // -------------------
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
