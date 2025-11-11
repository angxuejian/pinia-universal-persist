import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCookieReadonlyStore = defineStore(
  'cookieReadonlyStore',
  () => {
    const labtools_sessionid = ref('');
    const csrftoken = ref('');

    return { labtools_sessionid, csrftoken };
  },
  {
    persist: [
      {
        storage: 'cookie',
        cookieOptions: {
          key: 'labtools_sessionid',
        },
      },
      {
        storage: 'cookie',
        cookieOptions: {
          key: 'csrftoken',
        },
      },
    ],
  },
);
