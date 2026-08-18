/**
 * Full-viewport click-through watermark layer. It carries no session state:
 * the URL, opacity, and failure visibility are all local presentation facts.
 */
import { useState } from 'react'
import css from './BackgroundLayer.module.css'

/** Values the apply closure injects into this slot entry. */
export interface BackgroundLayerInjected {
  /** Image URL rendered as the layer's background. */
  imageUrl: string
  /** Layer opacity in the inclusive [0, 1] range. */
  opacity: number
}

/** Component props: the injected background values only. */
export type BackgroundLayerProps = BackgroundLayerInjected

/**
 * Render the full-screen layer, or nothing once the current image fails.
 * @param props - composed slot props.
 * @returns the watermark layer, or null for a failed URL.
 */
export function BackgroundLayer({ imageUrl, opacity }: BackgroundLayerProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  if (failedUrl === imageUrl) return null
  return (
    <div
      className={css.layer}
      aria-hidden="true"
      style={{
        opacity,
        backgroundImage: `url("${imageUrl}")`,
        pointerEvents: 'none',
      }}
    >
      <img
        className={css.probe}
        src={imageUrl}
        alt=""
        aria-hidden="true"
        onError={() => { setFailedUrl(imageUrl) }}
      />
    </div>
  )
}
