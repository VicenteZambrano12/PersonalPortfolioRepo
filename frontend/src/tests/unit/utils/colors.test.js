import { describe, expect, it } from 'vitest'
import { brandPalettes, hexToRgba } from '../../../utils/colors'

describe('hexToRgba', () => {
  it('converts a hex color to an rgba string with default alpha', () => {
    expect(hexToRgba('#0F172A')).toBe('rgba(15, 23, 42, 1)')
  })

  it('applies the provided alpha value', () => {
    expect(hexToRgba('#FFFFFF', 0.5)).toBe('rgba(255, 255, 255, 0.5)')
  })

  it('works without a leading #', () => {
    expect(hexToRgba('000000')).toBe('rgba(0, 0, 0, 1)')
  })
})

describe('brandPalettes', () => {
  it('defines matching color keys for both dark and light themes', () => {
    expect(Object.keys(brandPalettes.dark).sort()).toEqual(Object.keys(brandPalettes.light).sort())
  })
})
