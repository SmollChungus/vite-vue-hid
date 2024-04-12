<template>
  <div id="app">
    <h1>Custom Keyboard and Color Picker</h1>
    <MyColorPicker @color-update="handleColorUpdate"/>
    <Keyboard :colors="keyboardColors" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Keyboard from './components/Keyboard.vue';
import MyColorPicker from './components/MyColorPicker.vue'; // Correct import

const keyboardColors = ref([]);

function handleColorUpdate({ index, color }) {
  keyboardColors.value[index] = color.hex;
}
</script>

<style>
/* Global styles, e.g., body margins */
body {
  font-family: Arial, sans-serif;
}
#app {
  text-align: center;
  padding: 20px;
}
</style>
