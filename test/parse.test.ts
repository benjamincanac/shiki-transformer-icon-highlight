import { describe, expect, it } from 'vitest'
import { parseIconName } from '../src'

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
})
