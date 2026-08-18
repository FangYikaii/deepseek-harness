// @vitest-environment jsdom
/**
 * Component behavior: the layer carries the configured image and opacity,
 * remains click-through, and disappears silently when that image fails.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { BackgroundLayer } from '../src/client/BackgroundLayer.tsx'

afterEach(() => {
  cleanup()
})

describe('BackgroundLayer', () => {
  it('renders the configured full-viewport watermark and probe', () => {
    const view = render(
      <BackgroundLayer imageUrl="https://example.test/background.png" opacity={0.25} />,
    )
    const layer = view.container.firstElementChild
    expect(layer).not.toBeNull()
    expect((layer as HTMLElement).style.opacity).toBe('0.25')
    expect((layer as HTMLElement).style.backgroundImage).toBe(
      'url("https://example.test/background.png")',
    )
    expect((layer as HTMLElement).style.pointerEvents).toBe('none')

    const probe = view.container.querySelector('img')
    expect(probe?.getAttribute('src')).toBe('https://example.test/background.png')
  })

  it('hides after a load failure and reappears for a different URL', () => {
    const view = render(
      <BackgroundLayer imageUrl="https://example.test/broken.png" opacity={0.08} />,
    )
    const probe = view.container.querySelector('img')
    expect(probe).not.toBeNull()

    fireEvent.error(probe as HTMLImageElement)
    expect(view.container.firstElementChild).toBeNull()

    view.rerender(
      <BackgroundLayer imageUrl="https://example.test/next.png" opacity={0.08} />,
    )
    expect(view.container.firstElementChild).not.toBeNull()
  })
})
