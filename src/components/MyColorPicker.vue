<template>
  <div class="color-picker-container">
    <!-- This should now work if imported correctly -->
    <ColorPicker v-model="colors[index]" @update:color="updateColor(index, $event)" v-for="(color, index) in colors" :key="index" />
  </div>
</template>

<script>
import { ColorPicker } from 'vue3-colorpicker'; // Ensure correct import
import 'vue3-colorpicker/style.css';

export default {
  components: {
    ColorPicker // Ensure the component is registered correctly
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
