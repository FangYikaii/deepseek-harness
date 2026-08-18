# Agent Note: ui-background 客户端插件

Status: implemented

[English](2026-08-18-ui-background-client-plugin.md) | 中文

## 问题

Web shell 没有一种由部署自行添加、且不参与交互的全屏水印背景方式。页面级背景不能放在 shell 组合之下，因为 shell 拥有自己的固定图层；功能专属表面也不能干扰点击、滚动或会话渲染。

## 决策

`@deepseek-ai/dsh-client-ui-background` 是一个纯浏览器客户端插件，Node 半侧为空。浏览器半侧调用 `ctx.slots.inject('shell.overlay', ...)`，向 `ui-layout` 拥有的 `shell.overlay` 槽注册一个列表项 `ui-background`。该层 `position: fixed`、`inset: 0`、`pointer-events: none`，使用 `background-size: cover` 和 `background-position: center`，并按配置的 `opacity` 渲染。

组件为同一 URL 渲染一个隐藏探测 `<img>`。它的 `onError` 将失败 URL 记为本地状态并返回 null，因此图片损坏时会移除图层，而不会把错误抛给应用。探测元素不显示且完全点击穿透。

配置位于 `src/client/config.ts`，是 Schemastery `Config`：`imageUrl` 默认为内嵌 data URI 演示图，`opacity` 默认为 `0.08`，并通过 `[0, 1]` 闭区间校验。client 条目 wire 不携带配置；Cordis loader 在 `apply` 运行前通过导出的 `Config` 解析 schema 默认值。

该包登记在 web-app bundle 中并声明为依赖，但 patch 行为 `disabled: true`。因此它默认不进入组装后的浏览器，只有 profile overlay 启用该行时才出现。它与其他 client 插件遵循相同的三处发现契约：client TypeScript 聚合、web-app patch 行、web-app 依赖。

该包没有模型可见表面。它不注册 prompt、工具、事件或宿主服务。

## 备选方案

**注册到 root 槽作为背景** - 拒绝。运行时拥有的 `root` 槽是单占用槽；第二条注册会遮蔽 `ui-layout`，并删除它声明的所有子槽。`shell.overlay` 才是文档规定的全屏表面附加槽。

**宿主侧 body 背景** - 拒绝。纯浏览器呈现属于 client 插件；移到宿主会把视觉功能耦合到宿主 bundle，并失去槽生命周期。

**只在 `<div>` 上使用 CSS `background-image`** - 拒绝。CSS 背景没有加载错误信号。隐藏探测 `<img>` 保留背景样式，同时提供浏览器级失败钩子。

## 后果

默认 web 应用因该行禁用而不变。overlay 可以在不修改应用代码的情况下启用背景，图层在 HMR 和插件卸载时遵循 `shell.overlay` 声明生命周期。代价是每个挂载图层多一个探测元素，并要求部署提供可达的图片 URL。

## 验证

包测试覆盖 `slots.inject` 生命周期（未声明、已声明、塌缩、重新声明和卸载）、`Config` 默认值与范围拒绝、图层的配置 URL/透明度/点击穿透行为，以及图片失败隐藏路径。该包在默认组合中禁用，因此默认组装输出不变；只有在组装表面受影响时才重放浏览器 smoke 套件。
