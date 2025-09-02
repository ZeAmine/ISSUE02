<!-- <script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Rect {
  width: number
  height: number
  top: number
  left: number
}

gsap.registerPlugin(ScrollTrigger)

const emitter = useEmitter()

// REFS
const containerRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const containerRect = ref<Rect | null>(null)
const wrapperRect = ref<Rect | null>(null)

// VARIABLES
let scrollTrigger: ScrollTrigger | null = null
const marqueeAnimation: gsap.core.Timeline | null = null
const scrollSpeed = 5

// METHODS
const updateDimensions = () => {
  if (!containerRef.value || !wrapperRef.value) return

  containerRect.value = containerRef.value.getBoundingClientRect()
  wrapperRect.value = wrapperRef.value.getBoundingClientRect()
  scrollTrigger?.refresh()
}
const calculateDuration = (): number => {
  if (!containerRect.value || !wrapperRect.value) return 0
  return (wrapperRect.value.width / containerRect.value.width) * scrollSpeed
}

// ANIMATIONS
const initMarqueeAnimation = () => {
  if (!wrapperRef.value) return

  const tl = gsap.timeline({
    repeat: -1,
    defaults: { ease: 'none' }
  })
  tl.fromTo(wrapperRef.value,
    { xPercent: 0 },
    {
      xPercent: -25,
      duration: calculateDuration()
    }
  )
}

const initScrollTrigger = () => {
  if (!containerRef.value) return

  scrollTrigger = ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: ({ isActive }) => {
      if (!marqueeAnimation) return

      if (marqueeAnimation.isActive() && !isActive) {
        marqueeAnimation.pause()
      } else {
        marqueeAnimation.play()
      }
    }
  })
}

// EVENTS
const setupEventListeners = () => {
  // $root.vp?.addEventListener('resize', updateDimensions)
  // emitter.on('WINDOW:RESIZE', updateDimensions)
}
const removeEventListeners = () => {
  // $root.vp?.removeEventListener('resize', updateDimensions)
  // emitter.off('WINDOW:RESIZE', updateDimensions)
}

// HOOKS
onMounted(async () => {
  updateDimensions()
  setupEventListeners()
  await nextTick()
  initMarqueeAnimation()
  initScrollTrigger()
})
onBeforeUnmount(() => {
  removeEventListeners()
  scrollTrigger?.kill()
  marqueeAnimation?.kill()
})

// EMITTER
defineExpose({
  updateDimensions,
  pause: () => marqueeAnimation?.pause(),
  play: () => marqueeAnimation?.play()
})
</script> -->

<template>
  <div ref="containerRef" class="marquee">
    <div ref="wrapperRef" class="marquee__wrapper">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  position: relative;
  width: 100%;
}

.marquee__wrapper {
  display: flex;
  white-space: nowrap;
  will-change: transform;
}
</style>
