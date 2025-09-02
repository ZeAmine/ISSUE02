<script setup lang="ts">
import type { PropType } from 'vue'

import { eventEmitter } from '@/utils/EventEmitter'
import { checkTrigger, checkObserver } from '@vendor/checkTween'

const { $gsap: gsap, $ScrollTrigger: ScrollTrigger } = useNuxtApp()
const { isMobile } = storeToRefs(useViewportStore())
const { windowSize } = useAppStore()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  alt: {
    type: String,
    default: ''
  },
  lazyType: {
    type: String as PropType<'lazy' | 'eager'>,
    default: 'lazy'
  },
  imageSizes: {
    type: String,
    default: null
  },
  isFit: {
    type: Boolean,
    default: false
  },
  onLoaded: {
    type: Function,
    default: () => ({})
  },
  lazyThreshold: {
    type: [String, Number],
    default: '-200% 100%'
  },
  hasProvider: {
    type: Boolean,
    default: false
  },
  shouldLoad: {
    type: Boolean,
    default: true
  },
  shouldTriggerRefresh: {
    type: Boolean,
    default: true
  },
  hasParallax: {
    type: Boolean,
    default: false
  },
  parallaxOffset: {
    type: Number,
    default: 30
  },
  hasObserver: {
    type: Boolean,
    default: false
  }
})

// REFS
const containerRef = shallowRef<HTMLPictureElement | null>(null)
const isLoading = ref(false)
const isLoaded = ref(false)
const hasEnteredOnce = ref(false)
const isInViewport = ref(false)

// VARIABLES
let observer: Observe | null = null
let scrollTrigger: ScrollTrigger | null = null
let parallaxTrigger: ScrollTrigger | null = null

// COMPUTED
const defaultSizes = computed(
  () =>
    props.imageSizes ||
    '(max-width: 480px) 100vw, ' +
      '(max-width: 768px) 100vw, ' +
      '(max-width: 1024px) 100vw, ' +
      '(max-width: 1440px) 100vw, ' +
      '(max-width: 1920px) 100vw, ' +
      '(max-width: 2560px) 100vw, ' +
      '100vw'
)

const srcSets = computed(() => {
  const widths = [480, 768, 1024, 1440, 1920, 2560]
  const aspect = props.data.height / props.data.width
  return widths
    .map((width: number) => {
      const height = Math.round(aspect * width)
      return `${props.data.src}?auto=format,compress&w=${width}&h=${height}&fm=webp ${width}w`
    })
    .join(', ')
})

const placeholderSrc = computed(() => {
  const { width, height, responsiveImage } = props.data
  const finalWidth = responsiveImage?.width || width
  const finalHeight = responsiveImage?.height || height
  return `data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20${finalWidth}%20${finalHeight}%22%3E%3Crect%20width=%22${finalWidth}%22%20height=%22${finalHeight}%22%20style=%22fill:%23000000%22%3E%3C/rect%3E%3C/svg%3E`
})

const imageSrc = computed(() => {
  const src =
    windowSize.width < 1024 && props.data.srcSmall ? props.data.srcSmall : props.data.src || ''
  return src
})

const shouldUseParallax = computed(() => {
  return props.hasParallax && !isMobile.value
})

// METHODS
const initLoading = () => {
  if (!props.shouldTriggerRefresh) return false
  isLoading.value = true
}

const initLazyLoading = () => {
  if (props.lazyType !== 'lazy') {
    initLoading()
    return
  }

  scrollTrigger = ScrollTrigger.create({
    trigger: containerRef.value,
    start: props.lazyThreshold,
    once: true,
    onEnter: () => {
      initLoading()
      checkTrigger(scrollTrigger)
    }
  })
}

const cleanupTriggers = () => {
  checkTrigger(scrollTrigger)
  checkTrigger(parallaxTrigger)
  checkObserver(observer)
}

// TRIGGERS
const initObserver = () => {
  if (!containerRef.value) return

  observer = new Observe({
    element: containerRef.value as HTMLElement,
    config: { root: null, margin: '10px', threshold: 0.2 }
  })
  observer.on('IN', handleEnter)
  observer.on('OUT', handleLeave)
}

const initParallax = () => {
  if (!shouldUseParallax.value || !isLoaded.value || !containerRef.value) return

  const image = containerRef.value.querySelector('.base-image-img') as HTMLImageElement
  if (!image) return

  parallaxTrigger = ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.5,
    onUpdate: (self) => {
      const yPercent = props.parallaxOffset * (self.progress - 0.5)
      gsap.set(image, { yPercent })
    }
  })
}

// ANIMATIONS
const animateEnter = () => {
  isInViewport.value = true

  const container = containerRef.value as HTMLElement
  const img = container.querySelector('img') as HTMLImageElement
  if (!img) return

  gsap.to(img, {
    opacity: 1,
    duration: isMobile.value ? 0.8 : 1.3,
    ease: '--o2'
  })
}

// EVENTS
const handleLoaded = () => {
  isLoaded.value = true
  isLoading.value = false

  if (shouldUseParallax.value) {
    initParallax()
  }

  props.onLoaded?.()
}

const handleEnter = () => {
  isInViewport.value = true

  if (!hasEnteredOnce.value) {
    animateEnter()
    hasEnteredOnce.value = true
  }
}

const handleLeave = () => {
  isInViewport.value = false
}

const handleRefresh = () => {
  if (!props.shouldTriggerRefresh) {
    checkTrigger(scrollTrigger)
    return false
  }
  if (props.shouldTriggerRefresh && !isLoaded.value && props.shouldLoad && !scrollTrigger) {
    initLazyLoading()
  }
}

const handleResize = () => {
  ScrollTrigger.refresh()
}

// LISTENERS
const addListeners = () => {
  eventEmitter.on('WINDOW:RESIZE', handleResize)
  eventEmitter.on('SCROLL_TRIGGER:REFRESH_INIT', handleRefresh)
}

const removeListeners = () => {
  eventEmitter.off('WINDOW:RESIZE', handleResize)
  eventEmitter.off('SCROLL_TRIGGER:REFRESH_INIT', handleRefresh)
}

// WATCHERS
watch(
  () => props.shouldLoad,
  (newValue: boolean) => {
    if (!isLoaded.value && props.shouldTriggerRefresh && newValue) {
      checkTrigger(scrollTrigger)
      initLoading()
    }
  }
)

// LIFECYCLE
onMounted(() => {
  if (props.hasObserver) {
    initObserver()
  }
  if (props.shouldLoad) {
    initLazyLoading()
  }
  addListeners()
})

onBeforeUnmount(() => {
  removeListeners()
  cleanupTriggers()
})
</script>

<template>
  <picture
    ref="containerRef"
    class="base-image"
    :class="{
      'base-image--fit': isFit,
      'base-image--parallax': hasParallax,
      'base-image--hidden': hasObserver
      // 'base-image--loaded': isLoaded,
    }"
  >
    <source type="image/webp" :srcset="srcSets" />
    <source type="image/jpeg" :srcset="srcSets" />
    <template v-if="isLoading || isLoaded">
      <nuxt-img
        class="base-image-img"
        :src="imageSrc"
        :alt="alt || `${data.title}`"
        :width="data.width"
        :height="data.height"
        :sizes="defaultSizes"
        :loading="lazyType"
        decoding="async"
        @load="handleLoaded"
      />
    </template>
    <nuxt-img
      v-else
      class="base-image-placeholder"
      :src="placeholderSrc"
      :width="data.width"
      :height="data.height"
      :alt="alt"
    />
  </picture>
</template>
