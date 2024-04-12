<template>
  <div class="color-picker-container">
    <ColorPicker v-model="colors[index]" @update:color="updateColor(index, $event)" v-for="(color, index) in colors" :key="index" />
  </div>
</template>

<script>
import { ColorPicker } from 'vue3-colorpicker'; 
import 'vue3-colorpicker/style.css';

export default {
  components: {
    ColorPicker 
  },
  data() {
    return {
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
    };
  },
  methods: {
    updateColor(index, color) {
      this.colors[index] = color;
    }
  }
}
</script>

<style>
.color-picker-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
