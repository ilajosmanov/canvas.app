<script setup lang="ts">
import { useStore } from 'effector-vue/composition'

import DrawCanvas from './components/DrawCanvas.vue'
import Node from './components/Node.vue'
import { $nodes, nodeAdded } from './entities/node'

const nodes = useStore($nodes)
</script>

<template>
  <DrawCanvas @create-node="nodeAdded">
    <Node
      v-for="node in nodes"
      :key="node.id"
      :x="node.x"
      :y="node.y"
      class="w-12 h-12"
    >
      <svg class="w-full h-full border border-gray-300">
        <path />
      </svg>
    </Node>
  </DrawCanvas>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body,
html {
  @apply w-screen h-screen overflow-hidden;
}

#app {
  @apply w-full h-full overflow-hidden;
}
</style>
