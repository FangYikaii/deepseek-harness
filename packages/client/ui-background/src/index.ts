/**
 * Browser-only background plugin, node half.
 *
 * Deliberately empty. The watermark is a browser-only presentation surface
 * contributed into the layout-owned `shell.overlay` slot; no host service,
 * tool, prompt section, or model-facing registration belongs here.
 */

/** Host plugin body - the browser half owns the complete behavior. */
export function apply(): void {}
