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

  function contrast(first, second) {
    const luminance = (hex) => {
      const rgb = hex.match(/[a-f\d]{2}/gi).map((value) => {
        const channel = parseInt(value, 16) / 255
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
      })
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
    }
    const a = luminance(first)
    const b = luminance(second)
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
  }

  it.each(['dark', 'light'])('meets WCAG AA text contrast in %s mode', (theme) => {
    const palette = brandPalettes[theme]
    for (const background of [palette.background, palette.surface]) {
      for (const key of ['primaryText', 'secondaryText', 'accentCyan', 'accentBlue', 'accentViolet']) {
        expect(contrast(palette[key], background), `${theme} ${key}`).toBeGreaterThanOrEqual(4.5)
      }
    }
    expect(contrast(palette.onAccent, palette.accentViolet)).toBeGreaterThanOrEqual(4.5)
  })
})
