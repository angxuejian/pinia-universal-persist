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
