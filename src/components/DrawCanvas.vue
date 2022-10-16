<script setup lang="ts">
import {
  ComponentPublicInstance,
  computed,
  onMounted,
  onUnmounted,
  provide,
  reactive,
} from 'vue'

import { Canvas } from '../shared/config/di'

import Node from './Node.vue'

const emit = defineEmits<{
  (event: 'create-node', coords: { x: number; y: number }): void
}>()

let scale = $ref(1)

const node = $ref<ComponentPublicInstance>()

const coords = reactive({
  x: 0,
  y: 0,
})
const origin = reactive({
  x: 0,
  y: 0,
})

function handleCreateNode(e: MouseEvent) {
  const target = node.$el as HTMLElement
  const rect = target.getBoundingClientRect()

  emit('create-node', {
    x: (e.clientX - rect.left - target.clientLeft) * (1 / scale),
    y: (e.clientY - rect.top - target.clientTop) * (1 / scale),
  })
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()

  const speed = 0.1

  if (e.deltaY % 2 !== 0) {
    let newScale = scale + ((e.deltaY % 2) * -1) / 20

    if (newScale > 0.1 && newScale < 5) {
      scale = newScale
    }

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

provide(
  Canvas,
  computed(() => ({
    ...coords,
    scale,
  }))
)
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

  <Node
    ref="node"
    :x="coords.x"
    :y="coords.y"
    :scale="scale"
    class="w-0 h-0 node"
    @click="handleCreateNode"
  >
    <slot />
  </Node>
</template>
