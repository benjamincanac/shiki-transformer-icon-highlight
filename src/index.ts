import type { ShikiTransformer } from '@shikijs/types'
import type { ElementContent } from 'hast'
import { allIconCollections } from './collections'

export { allIconCollections }

export interface TransformerIconHighlightOptions {
  /**
   * Icon collections to detect, matched in `i-{collection}-{name}`,
   * `{collection}:{name}` and `i-{collection}:{name}` formats
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

// Two letter prefixes read like ordinary code tokens, so matching all of them
// would turn `ic:something` in a string or `i-mi-casa` in a class list into an
// icon. These three are the ones people actually write, the rest stay opt-in
// through `allIconCollections`.
const shortIconCollections = ['bi', 'ph', 'ri']

/**
 * Every Iconify collection, minus the two letter prefixes that collide with
 * ordinary code. Pass `allIconCollections` to match those too.
 */
export const defaultIconCollections: string[] = allIconCollections.filter(
  collection => collection.length > 2 || shortIconCollections.includes(collection),
)

const iconNameRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

export interface ParsedIconName {
  collection: string
  name: string
  format: 'i' | 'colon'
}

interface CollectionIndex {
  lookup: Set<string>
  // Longest first so `i-simple-icons-github` doesn't split on a shorter prefix
  sorted: string[]
}

// `parseIconName` runs on every token, and the default list is ~230 entries
// long, so the lookups are built once per collections array
const collectionIndexes = new WeakMap<string[], CollectionIndex>()

function indexCollections(collections: string[]): CollectionIndex {
  let index = collectionIndexes.get(collections)
  if (!index) {
    index = {
      lookup: new Set(collections),
      sorted: [...collections].sort((a, b) => b.length - a.length),
    }
    collectionIndexes.set(collections, index)
  }
  return index
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

  const { lookup, sorted } = indexCollections(collections)

  if (cleanText.startsWith('i-')) {
    const rest = cleanText.slice(2)

    // `i-{collection}:{name}`, the spelling that settles a collection whose
    // name would otherwise read as part of another one
    // (`i-material-symbols:light-mode` over `i-material-symbols-light-mode`)
    const separator = rest.indexOf(':')
    if (separator > 0) {
      const collection = rest.slice(0, separator)
      const name = rest.slice(separator + 1)
      if (lookup.has(collection) && name && iconNameRegex.test(name)) {
        return { collection, name, format: 'i' }
      }
    }

    // `i-{collection}-{name}`
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
    if (lookup.has(collection) && name && iconNameRegex.test(name)) {
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
