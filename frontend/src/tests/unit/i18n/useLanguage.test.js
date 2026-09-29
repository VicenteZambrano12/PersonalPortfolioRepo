import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useLanguage } from '../../../i18n/useLanguage.js'

const STORAGE_KEY = 'portfolio-language'

describe('useLanguage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })
  afterEach(() => {
    window.localStorage.clear()
  })

  it('defaults to English when nothing is stored', () => {
    const { result } = renderHook(() => useLanguage())
    expect(result.current.language).toBe('en')
    expect(result.current.t.code).toBe('en')
  })

  it('restores a previously stored language', () => {
    window.localStorage.setItem(STORAGE_KEY, 'es')
    const { result } = renderHook(() => useLanguage())
    expect(result.current.language).toBe('es')
    expect(result.current.t.code).toBe('es')
  })

  it('ignores an invalid stored value and falls back to English', () => {
    window.localStorage.setItem(STORAGE_KEY, 'fr')
    const { result } = renderHook(() => useLanguage())
    expect(result.current.language).toBe('en')
  })

  it('persists the language and updates the translation dictionary on change', () => {
    const { result } = renderHook(() => useLanguage())

    act(() => {
      result.current.setLanguage('es')
    })

    expect(result.current.language).toBe('es')
    expect(result.current.t.code).toBe('es')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('es')
  })
})
