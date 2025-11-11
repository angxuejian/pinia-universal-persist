import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import piniaUniversalPersist from 'packages';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaUniversalPersist);
app.use(pinia);

app.mount('#app');
