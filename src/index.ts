import type { ShikiTransformer } from '@shikijs/types'
import type { ElementContent } from 'hast'

export interface TransformerIconHighlightOptions {
  /**
   * Icon collections to detect, matched in `i-{collection}-{name}`
   * and `{collection}:{name}` formats
   *
   * @default defaultIconCollections
   */
  collections?: string[]
  /**
   * Class name applied to the generated icon element
   *
   * @default 'shiki-icon-highlight'
   */
  class?: string
  /**
   * Custom function to resolve the icon URL set in the `--shiki-icon-url` CSS variable
   *
   * @default Iconify API SVG URL
   */
  iconUrl?: (icon: string) => string
  /**
   * Custom function to render the icon HTML, replaces the default element entirely
   */
  htmlIcon?: (icon: string) => string
}

export const defaultIconCollections: string[] = [
  'simple-icons',
  'vscode-icons',
  'tabler',
  'lucide',
  'logos',
  'ph',
]

const iconNameRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

export interface ParsedIconName {
  collection: string
  name: string
  format: 'i' | 'colon'
}

export function parseIconName(
  text: string,
  collections: string[] = defaultIconCollections,
): ParsedIconName | null {
  // Strip quotes if present (single, double, or backticks)
  let cleanText = text
  if (/^['"`].*['"`]$/.test(text)) {
    cleanText = text.slice(1, -1)
  }

  // Try i-{collection}-{name} format, longest collection first so
  // `i-simple-icons-github` doesn't match a hypothetical `simple` collection
  if (cleanText.startsWith('i-')) {
    const rest = cleanText.slice(2)
    const sorted = [...collections].sort((a, b) => b.length - a.length)
    for (const collection of sorted) {
      if (rest.startsWith(`${collection}-`)) {
        const name = rest.slice(collection.length + 1)
        if (name && iconNameRegex.test(name)) {
          return { collection, name, format: 'i' }
        }
      }
    }
  }

  // Try {collection}:{name} format
  const colonIndex = cleanText.indexOf(':')
  if (colonIndex > 0) {
    const collection = cleanText.slice(0, colonIndex)
    const name = cleanText.slice(colonIndex + 1)
    if (collections.includes(collection) && name && iconNameRegex.test(name)) {
      return { collection, name, format: 'colon' }
    }
  }

  return null
}

export function transformerIconHighlight(
  options: TransformerIconHighlightOptions = {},
): ShikiTransformer {
  const {
    collections = defaultIconCollections,
    class: className = 'shiki-icon-highlight',
    // color=black is required for mask-image to work properly (mask uses luminance)
    iconUrl = icon => `https://api.iconify.design/${icon}.svg?color=%23000`,
    htmlIcon,
  } = options

  return {
    name: 'shiki-transformer-icon-highlight',
    span(hast, _line, _col, _lineElement, token) {
      const parsed = parseIconName(token.content, collections)
      if (!parsed) {
        return
      }

      const icon = `${parsed.collection}:${parsed.name}`

      const iconElement = htmlIcon
        ? { type: 'raw', value: htmlIcon(icon) } as unknown as ElementContent
        : {
          type: 'element',
          tagName: 'i',
          properties: {
            class: className,
            style: `--shiki-icon-url:url(${iconUrl(icon)})`,
          },
          children: [],
        } satisfies ElementContent

      // Prepend the icon to the span content
      hast.children.unshift(iconElement)
    },
  }
}
