import { describe, expect, it } from 'vitest'
import { getStyles } from '../../../utils/styles.jsx'
import { brandPalettes } from '../../../utils/colors'

describe('getStyles', () => {
  it('defaults to the dark theme palette', () => {
    const styles = getStyles()
    expect(styles.siteHeaderTitle.color).toBe(brandPalettes.dark.primaryText)
  })

  it('uses the light theme palette when requested', () => {
    const styles = getStyles('light')
    expect(styles.siteHeaderTitle.color).toBe(brandPalettes.light.primaryText)
    expect(styles.sectionHeading.color).toBe(brandPalettes.light.primaryText)
  })

  it('produces different box-shadows for light vs dark cards', () => {
    const light = getStyles('light')
    const dark = getStyles('dark')
    expect(light.card.boxShadow).not.toBe(dark.card.boxShadow)
  })
})
