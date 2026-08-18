# @deepseek-ai/dsh-client-ui-background

[English](README.md) | 中文

可选浏览器插件：在 `ui-layout` 拥有的 `shell.overlay` 列表槽位中挂载全屏固定水印背景层。Node 半侧为空；浏览器半侧等待 `ui-layout` 声明槽位，然后注册名为 `ui-background` 的列表项。图层完全点击穿透（`pointer-events: none`），使用 `background-size: cover` 和 `background-position: center`，按配置的透明度渲染，并在图片加载失败时静默隐藏。

client 条目 wire 不携带配置；插件从 Schemastery `Config` 默认值解析 `imageUrl` 与 `opacity`。web-app bundle 声明该包但默认禁用，因此只有通过 overlay 启用 `ui-background` 行的部署才会显示。

## 模型体验

无。浏览器端背景层不改变任何模型请求。

#### KV Cache 影响

无；此包既不组装也不发送提供商请求。

## 已知限制与暂缓事项

- **图片可用性由部署负责** - URL 不可用或为空时，探测加载失败后图层会隐藏。
- **没有动态调整透明度或 URL 的设置界面** - 值来自插件配置，而非浏览器设置。
