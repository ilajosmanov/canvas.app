<script setup lang="ts">
import { ComponentPublicInstance, onMounted, onUnmounted, reactive } from 'vue'

import Node from './Node.vue'

const emit = defineEmits<{
  (event: 'create-node', coords: { x: number; y: number }): void
}>()

const node = $ref<ComponentPublicInstance>()

let scale = $ref(1)
const coords = reactive({
  x: 1,
  y: 1,
})

function getRealPoints(x: number, y: number) {
  const el = node.$el as HTMLElement
  const rect = el.getBoundingClientRect()

  return {
    x: (x - rect.left - el.clientLeft) * (1 / scale),
    y: (y - rect.top - el.clientTop) * (1 / scale),
  }
}

function zoom(newScale: number, x: number, y: number) {
  const ratio = 1 - newScale / scale

  coords.x += (x - coords.x) * ratio
  coords.y += (y - coords.y) * ratio

  scale = newScale
}

function handleCreateNode(e: MouseEvent) {
  emit('create-node', getRealPoints(e.clientX, e.clientY))
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()

  const speed = 0.1

  if (e.deltaY % 2 !== 0) {
    let newScale = scale + ((e.deltaY % 2) * -1) / 20

    zoom(newScale, e.clientX, e.clientY)
    return
  }

  if (e.deltaY < 0) {
    coords.y += e.deltaY * -speed
  } else {
    coords.y -= e.deltaY * speed
  }

  if (e.deltaX < 0) {
    coords.x -= e.deltaX * speed
  } else {
    coords.x += e.deltaX * -speed
  }
}

onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
})
</script>

<template>
  <svg class="fixed inset-0 w-full h-full" @click="handleCreateNode">
    <filter id="roughpaper" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.03"
        result="noise"
        numOctaves="5"
      />

      <feDiffuseLighting in="noise" lighting-color="white" surfaceScale="2">
        <feDistantLight azimuth="35" elevation="75" />
      </feDiffuseLighting>
    </filter>

    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      filter="url(#roughpaper)"
      fill="none"
    />
  </svg>

  <Node ref="node" :x="coords.x" :y="coords.y" :scale="scale" class="w-0 h-0">
    <slot />
  </Node>
</template>
