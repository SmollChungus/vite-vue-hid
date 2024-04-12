<template>
    <div>
      <div class="keyboard" :style="{ width: `${layoutState.keyboardWidth}px` }">
        <Key v-for="key in layoutState.keys" 
          :key="key.label"
          :label="key.label" 
          :isActive="key.isActive"
          :isWide="key.w ? key.w > 1 : false"
          :clampedRescale="key.clampedRescale" 
          @update-key-state="handleKeyStateChange"
          :style="getKeyStyle(key)" />

      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { reactive } from 'vue';
  import Key from './Key.vue';
  import keyboardData from '../keyboards/pw65he.json';
  import { onMounted, onUnmounted } from 'vue';


  interface KeyData {
    isActive?: boolean;
    label: string;
    x: number;
    y: number;
    col: number;
    row: number;
    w?: number;
    h?: number;
    rescale: number;
    clampedRescale: number;

  }

  interface HIDDataDetail {
  row: number;
  col: number;
  rescale: number;
}
  
  const baseKeyWidth: number = 50; 
  const baseKeyHeight: number = 50; 
  

const keys = reactive<KeyData[]>(keyboardData.layouts.LAYOUT.layout.map((key: any) => ({
  label: key.label,
  x: key.x,
  y: key.y,
  col: key.matrix[1], 
  row: key.matrix[0],
  w: key.w || 1,
  h: key.h || 1,
  isActive: false,
  rescale: 0, 
  clampedRescale: 0,

})));

  
  const totalColumns: number = Math.max(...keys.map((key: KeyData) => key.x + (key.w || 1)));
  const keyboardWidth: number = totalColumns * baseKeyWidth;
  
  const layoutState = reactive({
    keys,
    totalColumns,
    keyboardWidth,
  });
  
  function getKeyStyle(key: KeyData): Record<string, string> {
    const width: number = baseKeyWidth * (key.w || 1);
    const height: number = baseKeyHeight * (key.h || 1);
    const left: number = baseKeyWidth * key.x;
    const top: number = baseKeyHeight * key.y;
    return {
      position: 'absolute',
      width: `${width}px`,
      height: `${height}px`,
      left: `${left}px`,
      top: `${top}px`,
    };
  }
  
  const handleKeyStateChange = ({ label, state }: { label: string, state: boolean }): void => {
    const key = layoutState.keys.find((k: KeyData) => k.label === label);
    if (key) key.isActive = state;
  };
  
  onMounted(() => {
  document.addEventListener('hid-data', (event) => {
    handleHidData(event as CustomEvent<HIDDataDetail>);
  });
});

  onUnmounted(() => {
    console.log("onUnMounted - Remember to refactor if you plan to remove this listener");
  });

  function handleHidData(event: CustomEvent<HIDDataDetail>) {
  const { row, col, rescale } = event.detail;
  const clampedRescale = Math.min(Math.max(rescale, 0), 100);

  console.log(`Row: ${row}, Col: ${col}, Rescale: ${rescale}, Clamped: ${clampedRescale}`);

  const keyToUpdate = layoutState.keys.find(key => key.row === row && key.col === col);
  if (keyToUpdate) {
    keyToUpdate.rescale = rescale; 
    keyToUpdate.clampedRescale = clampedRescale;
    console.log(`Updated Key: ${keyToUpdate.label}, New Rescale: ${keyToUpdate.clampedRescale}`);
  } else {
    console.log("Key not found.");
  }
}
  </script>
  <style scoped>
  .keyboard {
    position: relative;
    margin: 0 auto;
  }
  </style>
  