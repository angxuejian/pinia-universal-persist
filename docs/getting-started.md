
# 快速开始

`pinia-universal-persist` 是一个为 Pinia 提供本地持久化能力的通用插件，支持以下存储方式：

- `localStorage`
- `sessionStorage`
- `cookies`
- `IndexedDB`

并允许对每个 Store 独立配置持久化策略。

## Clone

::: tip
未发布插件，请克隆仓库下载使用
:::

```bash
git clone https://github.com/angxuejian/pinia-universal-persist.git
```

## 在 Pinia 中注册插件

```ts
import { createPinia } from 'pinia';
import createPersistPlugin from 'pinia-universal-persist';

const pinia = createPinia();
pinia.use(createPersistPlugin);

app.use(pinia);

```

## PersistConfig 配置说明

```ts
export interface PersistConfig {
  key?: string; // 自定义存储 key。不传时将使用store id
  storage: Storage | 'cookie' | 'indexedDB' | 'local' | 'session';
  paths?: string[]; // 只持久化指定字段
  cookieOptions?: {
    key?: string;  // cookie 对应的 key（单字段映射）
    days?: number; // 过期时间
    readonly?: boolean; // 启用只读模式（不可修改）
  };
}
```
Pinia 中扩展：
```ts
declare module 'pinia' {
  export interface DefineStoreOptionsBase {
    persist?: PersistConfig | PersistConfig[];
  }
}
```
可以对同一个 store 使用多个持久化策略。

## 使用示例
下面将展示所有常见使用场景（Cookies、IndexedDB、Local、Session），并附带说明。

### 1. 多字段 Cookie 持久化（支持 readonly）

特性：

- 为 不同字段 独立设置不同 cookie key
- 可设置只读 cookie
- 每个字段对应一条 cookie，而非合并成一个对象

```ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCookieReadonlyStore = defineStore(
  'cookieReadonly',
  () => {
    const csrftoken = ref('');

    return { csrftoken };
  },
  {
    persist: [
      {
        storage: 'cookie',
        cookieOptions: {
          key: 'csrftoken',
        },
      },
    ],
  },
);

```

### 2. 使用 IndexedDB 持久化（适合大数据量）

```ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCacheStore = defineStore(
  'cache',
  () => {
    const data = ref<{ name: string }[]>([]);
    return { data };
  },
  {
    persist: {
      key: 'cache-store',
      storage: 'indexedDB',
    },
  },
);
```

适用场景：消息缓存、工单数据、离线数据、大表格、高频更新数据等。


### 3. LocalStorage 持久化（最常见）

```ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore(
  'user',
  () => {
    const info = ref(null);

    return { info };
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage, // 或 'local'
    },
  },
);

```

### 4. SessionStorage 持久化（标签页级别）

```ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTempStore = defineStore(
  'temp',
  () => {
    const step = ref(0);
    return { step };
  },
  {
    persist: {
      key: 'temp-step',
      storage: 'session',
    },
  },
);
```
适用于流程步骤、当前页状态等短时内容。


### 5. Cookie + 可配置有效期

```ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTokenStore = defineStore(
  'token',
  () => {
    const token = ref('this_test_token');
    return { token };
  },
  {
    persist: {
      key: 'token-pref',
      storage: 'cookie',
      cookieOptions: {
        days: 3,        // 有效期 3 天
        readonly: false, // 可写
      },
    },
  },
);
```

::: warning 注意
💡 All storage types — localStorage, sessionStorage, cookies, and IndexedDB — are handled asynchronously for consistent behavior.
:::
