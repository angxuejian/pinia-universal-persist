import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, defineStore, setActivePinia } from 'pinia';
import { ref, createApp } from 'vue';
import piniaUniversalPersist from '../index';
import * as indexedDB from '../core/indexedDB';
import { cookie } from '../core/cookie';

vi.mock('../core/indexedDB', () => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}));

vi.mock('../core/cookie', () => ({
  cookie: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

describe('piniaUniversalPersist (Vue3 setup store)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    const app = createApp({});
    const pinia = createPinia().use(piniaUniversalPersist);
    app.use(pinia);
    setActivePinia(pinia);
  });

  // ✅ Vue3 组合式 store 写法
  const useTestStore = defineStore(
    'test',
    () => {
      const name = ref('xinyi');
      const count = ref(1);
      return { name, count };
    },
    {
      persist: {
        key: 'pinia-test',
        storage: 'local',
      },
    },
  );

  it('should get the value from localStorage', async () => {
    useTestStore();
    await new Promise((r) => setTimeout(r, 0));

    const source = localStorage.getItem('pinia-test');
    expect(source).toBeTruthy();

    const data = JSON.parse(source!);
    expect(data.name).toBe('xinyi');
    expect(data.count).toBe(1);
  });

  it('should restore state from localStorage', async () => {
    localStorage.setItem('pinia-test', JSON.stringify({ name: 'stored', count: 5 }));

    const store = useTestStore();
    await new Promise((r) => setTimeout(r, 0));

    expect(store.name).toBe('stored');
    expect(store.count).toBe(5);
  });

  it('should persist to localStorage when store changes', async () => {
    const store = useTestStore();

    store.name = 'updated';
    await new Promise((r) => setTimeout(r, 0));

    const saved = JSON.parse(localStorage.getItem('pinia-test')!);
    expect(saved.name).toBe('updated');
  });

  it('should restore from sessionStorage', async () => {
    sessionStorage.setItem('pinia-test', JSON.stringify({ name: 'session', count: 2 }));

    // 默认key："pinia-" + ${store.$id}
    const useStore = defineStore(
      'test',
      () => {
        const name = ref('');
        const count = ref(0);
        return { name, count };
      },
      {
        persist: { storage: 'session' },
      },
    );

    const store = useStore();
    await new Promise((r) => setTimeout(r, 0));

    expect(store.name).toBe('session');
    expect(store.count).toBe(2);
  });

  it('should handle cookie readonly get', async () => {
    (cookie.get as any).mockReturnValue('cookie-value');

    const useStore = defineStore(
      'cookieStore',
      () => {
        const token = ref('');
        return { token };
      },
      {
        persist: {
          storage: 'cookie',
          cookieOptions: { key: 'token', readonly: true },
        },
      },
    );

    const store = useStore();
    await new Promise((r) => setTimeout(r, 0));

    expect(cookie.get).toHaveBeenCalledWith('token');
    expect(store.token).toBe('cookie-value');
  });

  it('should call cookie.set when readonly=false', async () => {
    (cookie.get as any).mockReturnValue(undefined);

    const useStore = defineStore(
      'cookieWriteStore',
      () => {
        const user = ref('xinyi');
        return { user };
      },
      {
        persist: {
          storage: 'cookie',
          cookieOptions: { readonly: false, days: 3 },
        },
      },
    );

    const store = useStore();
    store.user = 'updated';
    await new Promise((r) => setTimeout(r, 0));

    expect(cookie.set).toHaveBeenCalled();
    expect(cookie.set).toHaveBeenCalledWith('pinia-cookieWriteStore', { user: 'updated' }, 3);
  });

  it('should handle indexedDB get/set', async () => {
    (indexedDB.getItem as any).mockResolvedValue({ name: 'fromDB' });

    const useStore = defineStore(
      'dbStore',
      () => {
        const name = ref('init');
        return { name };
      },
      {
        persist: { storage: 'indexedDB' },
      },
    );

    const store = useStore();
    await new Promise((r) => setTimeout(r, 0));

    expect(indexedDB.getItem).toHaveBeenCalledWith('pinia-dbStore');
    expect(store.name).toBe('fromDB');

    store.name = 'changed';
    await new Promise((r) => setTimeout(r, 0));

    expect(indexedDB.setItem).toHaveBeenCalled();
  });
});
