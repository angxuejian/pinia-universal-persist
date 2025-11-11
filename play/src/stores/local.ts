import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('');
    const info = ref(null);

    return { token, info };
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage, // 或 'local'
    },
  },
);
