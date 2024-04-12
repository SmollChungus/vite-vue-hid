<template>
  <button class="key" :class="{ 'is-active': isActive, 'key-wide': isWide }">
    <span class="key-fill" :style="{ height: `${props.clampedRescale}%` }"></span>
    {{ label }}
  </button>
</template>

<script setup>
const props = defineProps({
  label: String,
  isActive: Boolean,
  isWide: Boolean,
  clampedRescale: Number // Use the clampedRescale prop here
});


function updateKeyState(state) {
  emit('update-key-state', { label: props.label, state });
}
  </script>
  
  <style scoped>
  .key {
    position: relative;
    overflow: hidden;
    background-color: #000000;
    border: 1px solid #ba8282;
    text-decoration: #8ae496;
    color: #762121;
    border-radius: 4px;
    padding: 10px 20px;
    margin: 5px;
    cursor: pointer;
    user-select: none; /* Prevent text selection */
    transition: background-color 0.2s, transform 0.2s;
    white-space: nowrap; /* Ensure text doesn't wrap */
    text-align: center; /* Center text */
  }
  
  /* Adjust the styles for wide keys */
  .key-wide {
    width: auto; /* Adjust width automatically based on the content and padding */
    padding: 10px 40px; /* Example padding for wide keys */
  }
  
  .key.is-active {
    background-color: #dc4707; /* Key color when active/pressed */
    color: #710b0b;
    transform: scale(0.95); /* Slight press effect */
  }
  
  .key-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #60a3eb; /* Highlight color */
    transition: height 0.2s;
}
  /* You can add further styles for different states or themes */
  </style>
  