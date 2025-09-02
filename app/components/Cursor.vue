<script setup lang="ts">
import { useCursor, useCursorLabel } from '@/composables/useCursor'

const { $gsap: gsap } = useNuxtApp()

interface Thumbnail {
  defaultSrc: string
  width: number
  height: number
  alt: string
}

const props = defineProps({
  thumbnails: {
    type: Array as PropType<Thumbnail[]>,
    default: () => []
  }
})

const { label, updateLabel, hideLabel } = useCursorLabel()

// REFS
const cursorRef = ref(null)
const currentThumbIndex = ref(0)
const isHoverEnabled = ref(false)
const hasMouseMoved = ref(false)

let moveX: (x: number) => void
let moveY: (y: number) => void

// METHODS
const initCursorPosition = () => {
  moveX = gsap.quickTo(cursorRef.value, 'x', { duration: 0.6, ease: '--o56' })
  moveY = gsap.quickTo(cursorRef.value, 'y', { duration: 0.6, ease: '--o56' })

  // Position initiale
  const x = window.innerWidth / 2
  const y = window.innerHeight / 2
  moveX(x)
  moveY(y)
}

const updateMousePosition = (event: MouseEvent) => {
  if (!moveX || !moveY) return

  if (!hasMouseMoved.value) {
    hasMouseMoved.value = true
  }

  moveX(event.clientX)
  moveY(event.clientY)
}

const navigateThumbnails = (direction: number) => {
  const total = props.thumbnails.length
  currentThumbIndex.value = (currentThumbIndex.value + direction + total) % total
}

const enableHover = () => {
  isHoverEnabled.value = true
}

const disableHover = () => {
  isHoverEnabled.value = false
}

// LIFECYCLE
onMounted(() => {
  initCursorPosition()
  window.addEventListener('mousemove', updateMousePosition)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition)
})

// EXPOSE
defineExpose({
  navigateThumbnails,
  updateLabel,
  hideLabel
})
</script>

<template>
  <div ref="cursorRef" class="cursor">
    <div
      :class="[
        'carousel-cursor__thumbnails',
        { 'carousel-cursor__thumbnails--visible': isHoverEnabled }
      ]"
    >
      <figure
        v-for="(thumbnail, index) in thumbnails"
        :key="index"
        class="carousel-cursor__thumbnail"
        :style="{ display: currentThumbIndex === index ? 'block' : 'none' }"
      >
        <BaseImage
          :data="{
            src: thumbnail.defaultSrc,
            width: thumbnail.width,
            height: thumbnail.height
          }"
          :alt="thumbnail.alt"
        />
      </figure>
    </div>
    <p :class="['cursor-label st-l', { 'cursor-label--visible': hasMouseMoved }]">
      {{ label }}
    </p>
  </div>
</template>
