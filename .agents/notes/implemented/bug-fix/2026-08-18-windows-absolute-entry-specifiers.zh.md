# Agent Note: Windows 绝对路径 loader 条目 specifier

Status: implemented

[English](2026-08-18-windows-absolute-entry-specifiers.md) | 中文

## Problem

首个插件教程（`pnpm dsh web --patch ./scratch-plugin/cordis.yml`，插件路径写绝对路径，如 `C:/Users/.../greet-tool.ts`）在 Windows 上启动失败，报 `ERR_UNSUPPORTED_ESM_URL_SCHEME: ... Received protocol 'c:'`。`mountRootInclude` 只在 `bareModuleBaseUrl` 分支内把绝对条目名转成 file URL；默认启动路径——`dsh` CLI 以及任何不提供宿主模块基址的 boot——挂载的是普通 `Include` builtin，其继承的 `EntryTree.import` 会把未经处理的绝对 specifier 直接交给 Node 的 ESM loader。Node 接受裸 POSIX 绝对路径，但会把 Windows 盘符路径解析成 `c:` URL scheme 并拒绝。

## Decision

`mountRootInclude` 始终安装做归一化的 `HostResolvedRootInclude` 子类。其 `import` 在导入前把每个绝对条目名用 `pathToFileURL(name).href` 转换；当 `bareModuleBaseUrl` 为 undefined 时，委托默认的 `EntryTree.import`（裸包名与相对名仍相对 profile 配置目录解析）。宿主模块基址分支不变。

## Alternatives considered

**改 vendored 的 `EntryTree.import`。** 否决：`vendor/` 修改要走上游同步流程并登记分歧，而 harness 已经在该子类接缝处拥有这层归一化——与 `dsh-agent-presets` 的 `PresetTree.import` 相同的模式。

**教程里教 Windows 用户写 `file:///` 绕行写法。** 否决：教程「路径必须为绝对路径」的要求正是 Windows 用户自然会写的形式；现在 loader 在各平台都接受它，绕行写法会按平台分裂文档化的流程。

## Consequences

一条归一化覆盖所有启动路径，教程的绝对路径写法在 Windows 与 POSIX 上同样可用。POSIX 上裸绝对路径原本就能导入，行为不变。新增 boot 测试：无宿主模块基址时挂载一个平台绝对路径条目并断言其加载成功；改动前该测试在 Windows 上以 `ERR_UNSUPPORTED_ESM_URL_SCHEME` 失败。
