import z from '@deepseek-ai/schemastery'

/**
 * Built-in demo image. The data URI keeps the default useful without a
 * network request; deployments override it with their own asset URL.
 */
const DEFAULT_IMAGE_URL = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27%3E%3Cdefs%3E%3ClinearGradient id=%27g%27 x1=%270%27 y1=%270%27 x2=%271%27 y2=%271%27%3E%3Cstop offset=%270%27 stop-color=%27%232a4dff%27 stop-opacity=%27.45%27/%3E%3Cstop offset=%271%27 stop-color=%27%230a1c3d%27 stop-opacity=%27.35%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%27160%27 height=%27160%27 fill=%27url(%23g)%27/%3E%3C/svg%3E'

/** Browser-only background plugin configuration. */
export interface Config {
  /** Image URL rendered as a fixed full-viewport watermark. */
  imageUrl?: string
  /** Layer opacity, validated to the inclusive [0, 1] range. */
  opacity?: number
}

export const Config: z<Config> = z.object({
  imageUrl: z.string().default(DEFAULT_IMAGE_URL),
  opacity: z.number().min(0).max(1).default(0.08),
})
