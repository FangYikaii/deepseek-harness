# Agent Note: ui-background client plugin

Status: implemented

English | [中文](2026-08-18-ui-background-client-plugin.zh.md)

## Problem

The web shell has no deployment-owned way to add a non-interactive full-viewport watermark background. A page-level background must not sit under shell composition because the shell owns its own fixed layers, and a feature-specific surface must not interfere with clicks, scrolling, or session rendering.

## Decision

`@deepseek-ai/dsh-client-ui-background` is a browser-only client plugin. Its node half is empty. Its browser half calls `ctx.slots.inject('shell.overlay', ...)` and registers one list entry, `ui-background`, into the layout-owned `shell.overlay` slot. That entry is `position: fixed`, `inset: 0`, `pointer-events: none`, uses `background-size: cover` and `background-position: center`, and renders with the configured `opacity`.

The component renders a hidden probe `<img>` for the same URL. Its `onError` records the failing URL as local state and returns null, so a broken image removes the layer without surfacing an error to the app. The probe is display-hidden and click-through.

Configuration lives in `src/client/config.ts` as a Schemastery `Config`: `imageUrl` defaults to an embedded data-URI demo image, and `opacity` defaults to `0.08` with inclusive `[0, 1]` validation. The client entry wire does not carry config; the Cordis loader resolves the schema defaults through the exported `Config` before `apply` runs.

The package is registered in the web-app bundle and declared as a dependency, but its patch row is `disabled: true`. It therefore stays absent from the default assembled browser and appears only when a profile overlay enables the row. This is the same three-surface discovery contract as every other client plugin: client TypeScript aggregate, web-app patch row, and web-app dependency.

The package has no model-visible surface. It registers no prompt, tool, event, or host service.

## Alternatives considered

**A root-slot background entry** - rejected. The runtime-owned `root` slot is single-occupancy; a second entry shadows `ui-layout` and removes every child slot it declares. `shell.overlay` is the documented additive seat for frame-wide surfaces.

**A host-side body background** - rejected. Browser-only presentation belongs in a client plugin; moving it into the host would couple a purely visual feature to the host bundle and lose the slot lifecycle.

**CSS `background-image` on a `<div>` only** - rejected. A CSS background has no load-error signal. The hidden probe `<img>` preserves the background style while adding a browser-level failure hook.

## Consequences

The default web app is unchanged because the row is disabled. An overlay can opt the background in without editing app code, and the layer follows the `shell.overlay` declaration lifecycle under HMR and plugin unload. The trade-off is a small probe element per mounted layer and the requirement that deployments supply a reachable image URL.

## Verification

The package tests cover the `slots.inject` lifecycle (undeclared, declared, collapse, redeclaration, and teardown), the `Config` defaults and range rejection, the layer's configured URL/opacity/click-through behavior, and the image-failure hide path. The package is disabled in the default composition, so the assembled default output is unchanged; the browser smoke suite is replayed only when the assembly surface is affected.
