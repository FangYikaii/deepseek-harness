// @vitest-environment jsdom
/**
 * Client apply wiring: the plugin waits for the layout-owned `shell.overlay`
 * declaration, contributes one additive list entry, and follows declaration
 * collapse/redeclaration through `slots.inject`.
 */
import { Context } from '@deepseek-ai/cordis'
import { SlotRegistry } from '@deepseek-ai/dsh-client-runtime/client'
import { describe, expect, it } from 'vitest'
import { apply, inject } from '@deepseek-ai/dsh-client-ui-background/client'
import { BackgroundLayer } from '../src/client/BackgroundLayer.tsx'
import { Config } from '../src/client/config.ts'

const SLOT = 'shell.overlay'

async function bench(declare = true) {
  const ctx = new Context()
  await ctx.plugin(SlotRegistry).await()
  const slots = ctx.get('slots') as SlotRegistry
  const declareHost = declare
    ? slots.register(
      { name: 'root', children: { [SLOT]: { kind: 'list', scope: 'root' } } } as never,
      () => null,
    )
    : undefined
  return { ctx, slots, declareHost }
}

describe('ui-background client apply', () => {
  it('declares only the slot service', () => {
    expect(inject).toEqual(['slots'])
  })

  it('materializes Config defaults and rejects opacity outside [0, 1]', () => {
    const resolved = Config({})
    expect(resolved.opacity).toBe(0.08)
    expect(resolved.imageUrl).toMatch(/^data:image\/svg\+xml,/)
    expect(() => Config({ opacity: -0.1 })).toThrow()
    expect(() => Config({ opacity: 1.1 })).toThrow()
  })

  it('registers one list entry with the injected configured values', async () => {
    const b = await bench()
    const fiber = b.ctx.plugin(
      { inject: [...inject], apply },
      { imageUrl: 'https://example.test/background.png', opacity: 0.2 },
    )
    await fiber.await()

    expect(b.slots.entries(SLOT)).toHaveLength(1)
    const entry = b.slots.entries(SLOT)[0]!
    expect(entry.options).toMatchObject({ id: 'ui-background' })
    expect(entry.component).toBe(BackgroundLayer)
    expect((entry.inject as () => { imageUrl: string; opacity: number })()).toEqual({
      imageUrl: 'https://example.test/background.png',
      opacity: 0.2,
    })
  })

  it('removes the entry on plugin teardown', async () => {
    const b = await bench()
    const fiber = b.ctx.plugin(
      { inject: [...inject], apply },
      { imageUrl: 'https://example.test/background.png', opacity: 0.2 },
    )
    await fiber.await()
    await fiber.dispose()
    expect(b.slots.entries(SLOT)).toHaveLength(0)
  })

  it('waits for the declaration and follows collapse and redeclaration', async () => {
    const b = await bench(false)
    const fiber = b.ctx.plugin(
      { inject: [...inject], apply },
      { imageUrl: 'https://example.test/background.png', opacity: 0.2 },
    )
    await fiber.await()
    expect(b.slots.entries(SLOT)).toHaveLength(0)

    const host = b.slots.register(
      { name: 'root', children: { [SLOT]: { kind: 'list', scope: 'root' } } } as never,
      () => null,
    )
    expect(b.slots.entries(SLOT)).toHaveLength(1)

    host()
    expect(b.slots.entries(SLOT)).toHaveLength(0)

    b.slots.register(
      { name: 'root', children: { [SLOT]: { kind: 'list', scope: 'root' } } } as never,
      () => null,
    )
    await Promise.resolve()
    expect(b.slots.entries(SLOT)).toHaveLength(1)
  })
})
