# @deepseek-ai/dsh-client-ui-background

English | [中文](README.zh.md)

Opt-in browser plugin that mounts a fixed full-viewport watermark image over the layout-owned `shell.overlay` list slot. The node half is empty; the browser half waits for `ui-layout` to declare the slot, then registers one list entry named `ui-background`. The layer is click-through (`pointer-events: none`), uses `background-size: cover` and `background-position: center`, renders with the configured opacity, and hides silently when the image fails to load.

The client entry wire carries no config; the plugin resolves `imageUrl` and `opacity` from the Schemastery `Config` defaults. The web-app bundle lists the package but disables it by default, so it only appears in deployments whose overlay enables the `ui-background` row.

## Model Experience

None, as the browser-only background layer changes no model request.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

- **Image availability is the deployment's responsibility** - an unavailable or empty URL hides the layer after the probe load fails.
- **No dynamic opacity or URL setting UI** - values come from plugin config, not browser settings.
