# Agent Note: Windows absolute loader entry specifiers

Status: implemented

English | [中文](2026-08-18-windows-absolute-entry-specifiers.zh.md)

## Problem

The first-plugin tutorial (`pnpm dsh web --patch ./scratch-plugin/cordis.yml` with an absolute plugin path such as `C:/Users/.../greet-tool.ts`) failed to boot on Windows with `ERR_UNSUPPORTED_ESM_URL_SCHEME: ... Received protocol 'c:'`. `mountRootInclude` converted an absolute entry name to a file URL only inside its `bareModuleBaseUrl` branch; the default boot path — the `dsh` CLI and any boot without a host module base — mounted the plain `Include` builtin, whose inherited `EntryTree.import` hands a raw absolute specifier to Node's ESM loader. Node accepts a raw POSIX absolute path but parses a Windows drive path as a `c:` URL scheme and rejects it.

## Decision

`mountRootInclude` always installs the normalizing `HostResolvedRootInclude` subclass. Its `import` converts every absolute entry name with `pathToFileURL(name).href` before importing, and delegates to the default `EntryTree.import` (resolving bare and relative names against the profile config directory) whenever `bareModuleBaseUrl` is undefined. The host-module-base branch is unchanged.

## Alternatives considered

**Fix the vendored `EntryTree.import`.** Rejected: `vendor/` edits require the upstream sync procedure and logged divergence, while the harness already owns this normalization at its subclass seam — the same pattern `dsh-agent-presets`' `PresetTree.import` documents.

**Teach the tutorial a `file:///` workaround for Windows.** Rejected: the tutorial's instruction that the path must be absolute is the natural thing to write on Windows; the loader accepts it everywhere now, and a workaround would fork the documented flow by platform.

## Consequences

One normalization covers every boot path, so the tutorial's absolute-path form works on Windows and POSIX alike. On POSIX the raw absolute path already imported, so behavior there is unchanged. A boot test mounts an entry named by a platform-absolute path with no host module base and asserts it loads; it fails with `ERR_UNSUPPORTED_ESM_URL_SCHEME` on Windows before the change.
