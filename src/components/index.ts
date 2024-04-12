// index.ts
import { createApp } from 'vue';
import App from '../App.vue'; // Adjust the path as necessary

document.addEventListener('DOMContentLoaded', function() {
  const mountNode = document.querySelector('#app');
  if (!mountNode.__vue_app__) {
    createApp(App).mount(mountNode);
  }
});
