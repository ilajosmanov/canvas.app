<script setup lang="ts">
import throttle from 'lodash.throttle'
import { inject, onMounted, reactive, watch } from 'vue'

import {
  type FrameContainerProvider,
  frameContainer,
} from '../shared/config/di'

let frame = $(inject<FrameContainerProvider>(frameContainer))

const canvasRef = $ref<HTMLDivElement | null>(null)

const MAX_SCALE = 10
const MIN_SCALE = 0.5

const origin = reactive<{ x: number | null; y: number | null }>({
  x: null,
  y: null,
})

const position = reactive({ top: 0, left: 0 })
const base = reactive({ width: 0, height: 0 })
const size = reactive({ width: 0, height: 0 })

let scale = $ref(1)

const handleWheel = throttle((e: WheelEvent) => {
  if (frame.isAltPressed) {
    if (canvasRef === null) return

    let _scale = scale + e.deltaY * -0.01
    const width = _scale * size.width

    if (e.deltaY < 0) {
      if (width / base.width >= MAX_SCALE) {
        return
      }
    } else if (e.deltaY > 0) {
      if (width / base.width <= MIN_SCALE) {
        return
      }
    }

    scale = _scale
  }
}, 20)

const handleMove = throttle((e: MouseEvent) => {
  if (canvasRef !== null) {
    origin.x = (canvasRef.offsetLeft - (e.clientX + frame.scroll.x)) * -1
    origin.y = (canvasRef.offsetTop - (e.clientY + frame.scroll.y)) * -1
  }
}, 20)

watch(
  () => frame.isAltPressed,
  (is) => {
    if (!is) {
      if (canvasRef === null) return

      const rect = canvasRef.getBoundingClientRect()

      scale = 1
      position.left = rect.left + frame.scroll.x
      position.top = rect.top + frame.scroll.y

      if (Math.ceil(rect.width / base.width) > MAX_SCALE) {
        size.width = base.width * MAX_SCALE
        size.height = base.height * MAX_SCALE
        return
      }

      if (Math.ceil(rect.width / base.width) < MIN_SCALE) {
        size.width = base.width * MIN_SCALE
        size.height = base.height * MIN_SCALE
        return
      }

      size.width = rect.width
      size.height = rect.height
    }
  }
)

onMounted(() => {
  if (canvasRef !== null) {
    size.width = frame.width / 4
    size.height = frame.height / 2

    position.left = frame.width / 2 - size.width / 2
    position.top = frame.height / 2 - size.height / 2

    base.width = size.width
    base.height = size.height
  }
})
</script>

<template>
  <div
    ref="canvasRef"
    :style="{
      width: `${size.width}px`,
      height: `${size.height}px`,
      top: `${position.top}px`,
      left: `${position.left}px`,
      transform: `scale(${scale})`,
      transformOrigin: `${origin.x}px ${origin.y}px`,
    }"
    class="shadow-sm border border-gray-300 rounded-md absolute"
    @mousemove.passive="handleMove"
    @wheel.stop.passive="handleWheel"
  ></div>
</template>
