import { describe, expect, it } from 'vitest'
import { allIconCollections, parseIconName } from '../src'

describe('parseIconName', () => {
  it('parses i-{collection}-{name} format', () => {
    expect(parseIconName('i-lucide-rocket')).toEqual({
      collection: 'lucide',
      name: 'rocket',
      format: 'i',
    })
    expect(parseIconName('i-simple-icons-github')).toEqual({
      collection: 'simple-icons',
      name: 'github',
      format: 'i',
    })
    expect(parseIconName('i-vscode-icons-file-type-vue')).toEqual({
      collection: 'vscode-icons',
      name: 'file-type-vue',
      format: 'i',
    })
  })

  it('parses i-{collection}:{name} format', () => {
    expect(parseIconName('i-material-symbols:light-mode-outline-rounded', ['material-symbols'])).toEqual({
      collection: 'material-symbols',
      name: 'light-mode-outline-rounded',
      format: 'i',
    })
    expect(parseIconName('\'i-lucide:rocket\'')).toEqual({
      collection: 'lucide',
      name: 'rocket',
      format: 'i',
    })
    // an unknown collection stays unmatched, as in the other formats
    expect(parseIconName('i-unknown:rocket')).toBeNull()
  })

  it('parses {collection}:{name} format', () => {
    expect(parseIconName('lucide:rocket')).toEqual({
      collection: 'lucide',
      name: 'rocket',
      format: 'colon',
    })
    expect(parseIconName('simple-icons:github')).toEqual({
      collection: 'simple-icons',
      name: 'github',
      format: 'colon',
    })
  })

  it('strips quotes', () => {
    expect(parseIconName('\'i-lucide-rocket\'')).toEqual({
      collection: 'lucide',
      name: 'rocket',
      format: 'i',
    })
    expect(parseIconName('"lucide:rocket"')).toEqual({
      collection: 'lucide',
      name: 'rocket',
      format: 'colon',
    })
    expect(parseIconName('`ph:alarm`')).toEqual({
      collection: 'ph',
      name: 'alarm',
      format: 'colon',
    })
  })

  it('returns null for unknown collections', () => {
    expect(parseIconName('i-unknown-icon')).toBeNull()
    expect(parseIconName('unknown:icon')).toBeNull()
  })

  it('returns null for invalid names', () => {
    expect(parseIconName('i-lucide-')).toBeNull()
    expect(parseIconName('lucide:')).toBeNull()
    expect(parseIconName('lucide:rocket!')).toBeNull()
    expect(parseIconName('not-an-icon')).toBeNull()
    expect(parseIconName('https://example.com')).toBeNull()
  })

  it('supports custom collections', () => {
    expect(parseIconName('i-heroicons-rocket-launch', ['heroicons'])).toEqual({
      collection: 'heroicons',
      name: 'rocket-launch',
      format: 'i',
    })
    expect(parseIconName('i-lucide-rocket', ['heroicons'])).toBeNull()
  })

  it('matches collections outside the old default', () => {
    expect(parseIconName('i-heroicons-rocket-launch')).toEqual({
      collection: 'heroicons',
      name: 'rocket-launch',
      format: 'i',
    })
    expect(parseIconName('i-pixelarticons-camera')).toEqual({
      collection: 'pixelarticons',
      name: 'camera',
      format: 'i',
    })
    expect(parseIconName('iconoir:city')).toEqual({
      collection: 'iconoir',
      name: 'city',
      format: 'colon',
    })
    expect(parseIconName('carbon:cloud')).toEqual({
      collection: 'carbon',
      name: 'cloud',
      format: 'colon',
    })
  })

  it('keeps the short collections people actually write', () => {
    expect(parseIconName('i-bi-rocket-takeoff')).toEqual({
      collection: 'bi',
      name: 'rocket-takeoff',
      format: 'i',
    })
    expect(parseIconName('ri:home-line')).toEqual({
      collection: 'ri',
      name: 'home-line',
      format: 'colon',
    })
  })

  it('leaves the other two letter collections out of the default', () => {
    expect(parseIconName('ic:baseline-home')).toBeNull()
    expect(parseIconName('i-ic-baseline-home')).toBeNull()
    expect(parseIconName('i-mi-casa')).toBeNull()
    expect(parseIconName('la:code')).toBeNull()
    // still reachable for anyone who asks for every collection
    expect(parseIconName('ic:baseline-home', allIconCollections)).toEqual({
      collection: 'ic',
      name: 'baseline-home',
      format: 'colon',
    })
  })

  it('matches the longest collection first', () => {
    expect(parseIconName('i-mdi-light-home')).toEqual({
      collection: 'mdi-light',
      name: 'home',
      format: 'i',
    })
    expect(parseIconName('i-mdi-home')).toEqual({
      collection: 'mdi',
      name: 'home',
      format: 'i',
    })
    expect(parseIconName('i-material-symbols-light-mode')).toEqual({
      collection: 'material-symbols-light',
      name: 'mode',
      format: 'i',
    })
    // the colon form is the way to reach the shorter collection
    expect(parseIconName('i-material-symbols:light-mode')).toEqual({
      collection: 'material-symbols',
      name: 'light-mode',
      format: 'i',
    })
  })
})
