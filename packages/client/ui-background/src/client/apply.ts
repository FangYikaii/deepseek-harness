/**
 * Browser plugin body: wait for the layout-owned `shell.overlay` declaration,
 * then contribute one additive click-through background entry. The contribution
 * follows the declaration lifetime: it is removed on collapse and reinstalled
 * after redeclaration.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: makes `shell.overlay` a valid SlotMap key in this program.
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { BackgroundLayer } from './BackgroundLayer.tsx'
import type { Config } from './config.ts'

/** Required services: the client slot registry. */
export const inject = ['slots']

/**
 * Register the background layer behind the layout slot declaration.
 * @param ctx - client root context.
 * @param config - validated plugin config; the loader fills schema defaults.
 */
export function apply(ctx: ClientContext, config: Config): void {
  const imageUrl = config.imageUrl as string
  const opacity = config.opacity as number
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'ui-background',
    inject: () => ({ imageUrl, opacity }),
  }, BackgroundLayer))
}
