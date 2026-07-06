import { defineConfig } from 'vitepress'
import { transformerIconHighlight } from '../../src/'

export default defineConfig({
  title: 'Shiki Icon Highlight',
  cleanUrls: true,
  description: 'Shiki transformer to highlight icons in code',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/benjamincanac/shiki-transformer-icon-highlight' },
    ],
  },
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    codeTransformers: [
      transformerIconHighlight(),
    ],
  },
})
