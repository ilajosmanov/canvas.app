import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            ['feDiffuseLighting', 'feDistantLight'].includes(tag),
        },
      },
    }),
  ],
})
