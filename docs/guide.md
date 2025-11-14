
# 指南

A universal Pinia persistence plugin supporting localStorage, sessionStorage, cookies, and IndexedDB.

pinia-universal-persist 是一个为 Pinia 设计的通用持久化插件，能够在使用 Pinia 状态管理的同时，将数据自动同步到多种本地缓存方案中。
无论你的应用在浏览器环境、低存储环境，还是需要长期/短期缓存，本插件都能提供灵活、稳定、可扩展的持久化能力。

::: tip 推荐
使用：[pinia-plugin-persistedstate](https://www.npmjs.com/package/pinia-plugin-persistedstate)
:::

## 核心能力

- 多存储支持 / 开箱支持四种常用的存储方式：

    - localStorage（持久存储）
    - sessionStorage（会话存储）
    - cookies（跨页面与服务端友好）
    - IndexedDB（异步大数据量存储）

- 自动同步 Pinia 状态
    - 在使用 Pinia store 时自动加载和写入缓存，无需额外逻辑。

- 按需持久化
    - 支持自定义 key、选择性持久化字段（paths）、cookie 配置、IndexedDB 配置等。

- 更稳定的缓存读写机制
    - 尤其针对 IndexedDB 这类异步缓存提供优化处理，确保状态恢复顺滑稳定。

::: warning 注意
💡 All storage types — localStorage, sessionStorage, cookies, and IndexedDB — are handled asynchronously for consistent behavior.
:::