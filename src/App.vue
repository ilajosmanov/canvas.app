<script setup lang="ts">
import DrawCanvas from './components/DrawCanvas.vue'
import FrameContainer from './components/FrameContainer.vue'
</script>

<template>
  <FrameContainer>
    <DrawCanvas />
  </FrameContainer>
</template>

<style>
body,
html {
  @apply w-screen h-screen;
}

#app {
  @apply w-full h-full;
}
</style>
