import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useTheme } from '../../../utils/useTheme.js'

const STORAGE_KEY = 'portfolio-theme'

describe('useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })
  afterEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('restores a previously stored theme', () => {
    window.localStorage.setItem(STORAGE_KEY, 'light')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('reflects the active theme on the <html> element', () => {
    window.localStorage.setItem(STORAGE_KEY, 'light')
    renderHook(() => useTheme())
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggles between dark and light and persists the choice', () => {
    window.localStorage.setItem(STORAGE_KEY, 'dark')
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('light')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
  })
})
