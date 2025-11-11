import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTokenStore = defineStore(
  'tokenStore',
  () => {
    const token = ref('this_test_token');
    return { token };
  },
  {
    persist: {
      key: 'token-pref',
      storage: 'cookie',
      cookieOptions: { days: 3, readonly: false },
    },
  },
);
