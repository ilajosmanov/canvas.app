<script setup lang="ts">
import { toPx } from '../shared/lib/to-px'

const node = $ref<HTMLElement>()

const props = defineProps({
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  scale: {
    type: Number,
    default: null,
  },
})

const uiCoords = $computed(() => {
  return {
    x: toPx(props.x),
    y: toPx(props.y),
    scale: props.scale ?? 1,
  }
})
</script>

<template>
  <div ref="node" class="node absolute left-0 top-0 border border-gray-400">
    <slot />
  </div>
</template>

<style scoped>
.node {
  transform: translate(v-bind('uiCoords.x'), v-bind('uiCoords.y'))
    scale(v-bind('uiCoords.scale'));
}
</style>
