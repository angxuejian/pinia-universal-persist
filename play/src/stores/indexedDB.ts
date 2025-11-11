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
