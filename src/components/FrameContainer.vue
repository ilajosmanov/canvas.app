<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  reactive,
} from 'vue'

import { frameContainer } from '../shared/config/di'

const frameRef = $ref<HTMLDivElement | null>(null)

let isFrameReady = $ref(false)
let isAltPressed = $ref(false)

const scroll = reactive({ x: 0, y: 0 })
const size = reactive({ width: 0, height: 0 })

function handleAltKey(e: KeyboardEvent) {
  isAltPressed = e.altKey
}

function handleScroll(e: UIEvent) {
  const { scrollLeft, scrollTop } = e.target as HTMLElement
  scroll.x = scrollLeft
  scroll.y = scrollTop
}

onMounted(async () => {
  if (frameRef !== null) {
    size.width = window.innerWidth * 1.5
    size.height = window.innerHeight * 1.5

    if (frameRef !== null) {
      await nextTick()
      frameRef.scrollTo(
        size.width / 2 - window.innerWidth / 2,
        size.height / 2 - window.innerHeight / 2
      )
    }
  }

  window.addEventListener('keydown', handleAltKey)
  window.addEventListener('keyup', handleAltKey)

  isFrameReady = true
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleAltKey)
  window.removeEventListener('keyup', handleAltKey)

  isFrameReady = false
})

provide(
  frameContainer,
  computed(() => ({
    ...size,
    scroll,
    isAltPressed,
  }))
)
</script>

<template>
  <div
    ref="frameRef"
    class="w-full h-full overflow-x-auto overflow-y-auto relative"
    @scroll="handleScroll"
  >
    <div
      :style="{
        width: size.width + 'px',
        height: size.height + 'px',
      }"
    >
      <slot v-if="isFrameReady" />
    </div>
  </div>
</template>
