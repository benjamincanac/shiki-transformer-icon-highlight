# shiki-transformer-icon-highlight

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Shiki transformer that highlights icons like `i-lucide-rocket`, `lucide:rocket` or `i-lucide:rocket`, inspired by [shiki-transformer-color-highlight](https://github.com/antfu/shiki-transformer-color-highlight).

Please check the docs: https://shiki-transformer-icon-highlight.vercel.app/

## Install

```sh
npm i shiki-transformer-icon-highlight
```

## Usage

```ts
import { createHighlighter } from 'shiki'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

const shiki = await createHighlighter({
  themes: [/* ... */],
  langs: [/* ... */],
})

const html = shiki.codeToHtml(code, {
  lang: 'vue',
  theme: 'vitesse-dark',
  transformers: [
    transformerIconHighlight()
  ],
})
```

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

## License

[MIT](./LICENSE.md) License © 2026-PRESENT [Benjamin Canac](https://github.com/benjamincanac)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/shiki-transformer-icon-highlight?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/shiki-transformer-icon-highlight
[npm-downloads-src]: https://img.shields.io/npm/dm/shiki-transformer-icon-highlight?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/shiki-transformer-icon-highlight
[bundle-src]: https://img.shields.io/bundlephobia/minzip/shiki-transformer-icon-highlight?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=shiki-transformer-icon-highlight
[license-src]: https://img.shields.io/github/license/benjamincanac/shiki-transformer-icon-highlight.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/benjamincanac/shiki-transformer-icon-highlight/blob/main/LICENSE.md
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/shiki-transformer-icon-highlight
