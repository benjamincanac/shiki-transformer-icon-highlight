import { createHighlighter } from 'shiki'
import { expect, it } from 'vitest'
import { transformerIconHighlight } from '../src'

it('case1', async () => {
  const shiki = await createHighlighter({
    langs: ['vue'],
    themes: ['vitesse-dark'],
  })

  const code = `
<template>
  <UButton icon="i-lucide-rocket" label="Launch" />
  <UButton icon="lucide:rocket" label="Launch" />
  <UIcon name="i-simple-icons-github" />
  <UIcon name="i-vscode-icons-file-type-vue" />
  <UIcon name="tabler:alarm" />
  <UIcon name="not-an-icon" />
</template>
  `.trim()

  const result = shiki.codeToHtml(code, {
    lang: 'vue',
    theme: 'vitesse-dark',
    transformers: [
      transformerIconHighlight(),
    ],
  })

  await expect(result).toMatchFileSnapshot('./output/case1.html')
})

it('custom class and iconUrl', async () => {
  const shiki = await createHighlighter({
    langs: ['ts'],
    themes: ['vitesse-dark'],
  })

  const code = `const icon = 'i-lucide-rocket'`

  const result = shiki.codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformerIconHighlight({
        class: 'my-icon',
        iconUrl: icon => `/icons/${icon.replace(':', '/')}.svg`,
      }),
    ],
  })

  await expect(result).toMatchFileSnapshot('./output/case2.html')
})

it('custom htmlIcon emits a raw hast node', async () => {
  const shiki = await createHighlighter({
    langs: ['ts'],
    themes: ['vitesse-dark'],
  })

  const code = `const icon = 'i-lucide-rocket'`

  const hast = shiki.codeToHast(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformerIconHighlight({
        htmlIcon: icon => `<span class="iconify" data-icon="${icon}"></span>`,
      }),
    ],
  })

  expect(JSON.stringify(hast)).toContain(
    JSON.stringify({ type: 'raw', value: '<span class="iconify" data-icon="lucide:rocket"></span>' }),
  )
})
