# Shiki Transformer Icon Highlight

A transformer for [Shiki](https://shiki.style) that highlights icon names like `i-lucide-rocket`, `lucide:rocket` or `i-lucide:rocket`. For example:

```vue
<template>
  <UButton icon="i-lucide-rocket" label="Launch" />
  <UButton icon="i-simple-icons-github" label="GitHub" />
  <UIcon name="i-vscode-icons-file-type-vue" />
  <UIcon name="tabler:alarm" />
  <UIcon name="ph:hand-waving" />
  <UIcon name="logos:nuxt-icon" />
</template>
```

## Install

```sh
npm i shiki-transformer-icon-highlight
```

## Usage

The transformer prepends an `<i class="shiki-icon-highlight">` element to tokens containing an icon name, with the icon URL exposed as a `--shiki-icon-url` CSS variable. Add this CSS to render the icons:

```css
.shiki-icon-highlight {
  display: inline-block;
  width: 1.25em;
  height: 1.25em;
  vertical-align: -0.25em;
  margin-right: 0.125em;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-image: var(--shiki-icon-url);
  mask-image: var(--shiki-icon-url);
}
```

Usages for some popular frameworks:

### Shiki

Here is an example of how to use the [transformer](https://shiki.style/guide/transformers) with Shiki:

```ts
import { createHighlighter } from 'shiki'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

const shiki = await createHighlighter({
  themes: [/* ... */],
  langs: [/* ... */],
})

const html = shiki.codeToHtml(code, {
  lang: 'vue',
  theme: 'nord',
  transformers: [
    transformerIconHighlight() // [!code hl]
  ],
})
```

### VitePress

In VitePress, you can use the transformer in the configuration file:

```ts [.vitepress/config.ts]
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'
import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    codeTransformers: [
      transformerIconHighlight(), // [!code hl]
    ],
  },
})
```

### Nuxt Content

In Nuxt Content, you can use the transformer by creating a `mdc.config.ts` file as follows:

```ts [mdc.config.ts]
import { defineConfig } from '@nuxtjs/mdc/config'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

export default defineConfig({
  shiki: {
    transformers: [
      transformerIconHighlight(), // [!code hl]
    ]
  }
})
```

## Options

### `collections`

Icon collections to detect, in every format: `i-{collection}-{name}`, `{collection}:{name}` and `i-{collection}:{name}`. The last one settles a collection whose name would otherwise read as part of another, `i-material-symbols:light-mode` rather than `i-material-symbols-light-mode`, which resolves against `material-symbols-light`.

Defaults to `simple-icons`, `vscode-icons`, `tabler`, `lucide`, `logos` and `ph`:

```ts
transformerIconHighlight({
  collections: ['heroicons', 'lucide'],
})
```

### `class`

Class name applied to the generated icon element. Defaults to `shiki-icon-highlight`.

### `iconUrl`

Custom function to resolve the icon URL set in the `--shiki-icon-url` CSS variable. Defaults to the [Iconify API](https://iconify.design/docs/api/) SVG URL:

```ts
transformerIconHighlight({
  iconUrl: icon => `https://api.iconify.design/${icon}.svg?color=%23000`,
})
```

### `htmlIcon`

Custom function to render the icon HTML, replaces the default element entirely:

```ts
transformerIconHighlight({
  htmlIcon: icon => `<span class="iconify" data-icon="${icon}"></span>`,
})
```

> [!WARNING]
> `htmlIcon` emits a hast `raw` node, which is only rendered in pipelines that support raw HTML, such as [MDC](https://github.com/nuxt-modules/mdc) or rehype with `allowDangerousHtml`. With plain `codeToHtml`, the HTML will be escaped.
