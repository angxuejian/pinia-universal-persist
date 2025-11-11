<template>
  <input v-model="userStore.token" type="text" />
  <textarea v-model="userStore.info"> </textarea>

  <input v-model="temStore.step" type="number" />

  <p>labtools: {{ cookieStore.labtools_sessionid }}</p>
  <p>csrftoken: {{ cookieStore.csrftoken }}</p>

  <input v-model="tokenStore.token" type="text" name="" id="" />

  <ul>
    <li v-for="(item, index) in cacheStore.data" :key="index">
      <p>{{ item.name }}</p>
    </li>
  </ul>

  <button @click="add">add</button>
</template>

<script lang="ts" setup>
import { useUserStore } from './stores/local';
import { useTempStore } from './stores/session';
import { useCookieReadonlyStore } from './stores/cookie-readonly';
import { useTokenStore } from './stores/token';
import { useCacheStore } from './stores/indexedDB';
import { onMounted } from 'vue';

const userStore = useUserStore();
const temStore = useTempStore();
const cookieStore = useCookieReadonlyStore();
const tokenStore = useTokenStore();
const cacheStore = useCacheStore();

const add = async () => {
  cacheStore.data.push({
    name: Math.random() + '--- test',
  });
};

onMounted(() => {
  console.log(
    '由于 piniaUniversalPersist 插件 获取本地缓存时为了兼容indexedDB，改为异步操作，在 onMounted 中已经无法同步拿到最新的值，dom上则是最新的本地缓存数据',
  );
  console.log(`
    userStore \n
    userStore.token: ${userStore.token}\n
    userStore.info: ${userStore.info}\n
    ----------------------------------------------\n
    useTempStore\n
    temStore.step: ${temStore.step}\n
    ----------------------------------------------\n
  `);
});
</script>
