import type { PiniaPluginContext } from 'pinia';
import { cookie } from './cookie';
import * as indexedDB from './indexedDB';

export interface PersistConfig {
  key?: string;
  storage: Storage | 'cookie' | 'indexedDB' | 'local' | 'session';
  paths?: string[];
  cookieOptions?: {
    key?: string;
    days?: number;
    readonly?: boolean;
  };
}

export function piniaUniversalPersist(context: PiniaPluginContext) {
  const { store, options } = context;
  const persist: PersistConfig | PersistConfig[] | undefined = (options as any).persist;
  if (!persist) return;

  const configs = Array.isArray(persist) ? persist : [persist];

  /**
   * 将get | set 改为同步方法后，既可在 onMounted 中获取最新的数据
   */
  configs.forEach(async (config) => {
    const key = config.key || `pinia-${store.$id}`;
    const storage = config.storage;
    const paths = config.paths;
    const cookieKey = config.cookieOptions?.key ?? null;
    const cookieDays = config.cookieOptions?.days ?? 7;
    const cookieReadonly = config.cookieOptions?.readonly ?? true;

    const get = async () => {
      let data: any = null;

      if (storage === 'local' || storage === localStorage) {
        const raw = localStorage.getItem(key);
        if (raw) data = JSON.parse(raw);
      } else if (storage === 'session' || storage === sessionStorage) {
        const raw = sessionStorage.getItem(key);
        if (raw) data = JSON.parse(raw);
      } else if (storage === 'cookie') {
        if (cookieReadonly) {
          if (cookieKey) {
            const value = cookie.get(cookieKey);
            data = { [cookieKey]: value };
          }
        } else {
          data = cookie.get(key);
        }
      } else if (storage === 'indexedDB') {
        data = await indexedDB.getItem(key);
      }

      return data;
    };

    const set = async () => {
      const partial = paths
        ? paths.reduce((acc, path) => {
            acc[path] = (store as any)[path];
            return acc;
          }, {} as any)
        : store.$state;

      if (storage === 'local' || storage === localStorage) {
        localStorage.setItem(key, JSON.stringify(partial));
      } else if (storage === 'session' || storage === sessionStorage) {
        sessionStorage.setItem(key, JSON.stringify(partial));
      } else if (storage === 'cookie') {
        if (!cookieReadonly) {
          const safeData = JSON.parse(JSON.stringify(partial));
          cookie.set(key, safeData, cookieDays);
        }
      } else if (storage === 'indexedDB') {
        const safeData = JSON.parse(JSON.stringify(partial));
        await indexedDB.setItem(key, safeData);
      }
    };

    const data = await get();
    if (data) {
      store.$patch(data);
    } else {
      await set();
    }
    store.$subscribe(() => set());
  });
}
