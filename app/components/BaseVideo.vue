<script setup lang="ts">
import { eventEmitter } from '@/utils/EventEmitter'
import { checkTrigger, checkObserver } from '@vendor/checkTween'

const { $ScrollTrigger: ScrollTrigger, $gsap: gsap } = useNuxtApp()
const { isMobile } = storeToRefs(useViewportStore())
const { windowSize } = useAppStore()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  lazyType: {
    type: String,
    default: 'scroll'
  },
  isMuted: {
    type: Boolean,
    default: true
  },
  isPlaying: {
    type: Boolean,
    default: true
  },
  isAutoplaying: {
    type: Boolean,
    default: true
  },
  isLooping: {
    type: Boolean,
    default: true
  },
  hasControls: {
    type: Boolean,
    default: false
  },
  isFit: {
    type: Boolean,
    default: false
  },
  shouldLoad: {
    type: Boolean,
    default: true
  },
  preload: {
    type: String as PropType<'' | 'auto' | 'metadata' | 'none'>,
    default: 'metadata'
  },
  volume: {
    type: Number,
    default: 1
  },
  speed: {
    type: Number,
    default: 1
  },
  onEnded: {
    type: Function as PropType<(event: Event) => void>,
    default: () => ({})
  },
  onLoaded: {
    type: Function as PropType<() => void>,
    default: () => ({})
  },
  lazyThreshold: {
    type: [String, Number],
    default: '-200% 100%'
  },
  shouldTriggerRefresh: {
    type: Boolean,
    default: true
  },
  hasUnsetSrc: {
    type: Boolean,
    default: true
  },
  delayParam: {
    type: String,
    default: null
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
  },
  hasProvider: {
    type: Boolean,
    default: false
  }
})

// REFS
const containerRef = shallowRef<HTMLDivElement | null>(null)
const videoRef = shallowRef<HTMLVideoElement | null>(null)
const isLoaded = ref(false)
const hasEnteredOnce = ref(false)
const isInViewport = ref(false)

// VARIABLES
let observer: Observe | null = null
let scrollTrigger: ScrollTrigger | null = null
let loopTrigger: ScrollTrigger | null = null
let parallaxTrigger: ScrollTrigger | null = null

// COMPUTEDS
const videoSrc = computed(() => {
  return windowSize.width < 1024 && props.data.srcSmall ? props.data.srcSmall : props.data.src || ''
})

const containerStyle = computed(() => {
  if (props.isFit) return null
  return {
    paddingTop: `${(props.data.height / props.data.width) * 100}%`
  }
})

// METHODS
const initVideo = () => {
  if (!props.shouldTriggerRefresh || !videoRef.value) return false

  videoRef.value.src = videoSrc.value

  if (!props.hasProvider) {
    videoRef.value.load()
  }
}

const playVideo = () => {
  if (isLoaded.value && videoRef.value) {
    videoRef.value.play()
  }
}

const pauseVideo = () => {
  if (isLoaded.value && videoRef.value) {
    videoRef.value.pause()
  }
}

// ANIMATIONS
const animateEnter = () => {
  const container = containerRef.value as HTMLElement
  const video = container.querySelector('video') as HTMLVideoElement
  if (!video) return

  gsap.to(video, {
    opacity: 1,
    duration: isMobile.value ? 0.8 : 1.3,
    ease: '--o2'
  })
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

const initScrollTrigger = () => {
  if (!containerRef.value) return

  scrollTrigger = ScrollTrigger.create({
    trigger: containerRef.value,
    start: props.lazyThreshold,
    once: true,
    onEnter: initVideo
  })

  if (props.isLooping && props.isAutoplaying) {
    loopTrigger = ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: playVideo,
      onEnterBack: playVideo,
      onLeave: pauseVideo,
      onLeaveBack: pauseVideo
    })
  }
}

const initParallax = () => {
  if (!props.hasParallax || !isLoaded.value || !containerRef.value) return

  const video = containerRef.value.querySelector('video') as HTMLVideoElement
  if (!video) return

  parallaxTrigger = ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.5,
    onUpdate: (self) => {
      const yPercent = props.parallaxOffset * (self.progress - 0.5)
      gsap.set(video, { yPercent })
    }
  })
}

const cleanupTriggers = () => {
  checkTrigger(scrollTrigger)
  checkTrigger(loopTrigger)
  checkTrigger(parallaxTrigger)
  checkObserver(observer)
}

// EVENTS
const handleCanPlay = () => {
  if (!videoRef.value || isLoaded.value) return

  isLoaded.value = true

  if (!props.hasProvider) {
    videoRef.value.playbackRate = props.speed
    videoRef.value.volume = props.volume
  }

  if (props.hasParallax) {
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

const handleResize = () => {
  ScrollTrigger.refresh()
}

const handleRefresh = () => {
  if (!props.shouldTriggerRefresh) {
    checkTrigger(scrollTrigger)
    return false
  }
  if (props.shouldTriggerRefresh && !isLoaded.value && props.shouldLoad && !scrollTrigger) {
    initScrollTrigger()
  }
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
    if (!isLoaded.value && videoRef.value && newValue) {
      cleanupTriggers()
      initVideo()
    }
  }
)

watch(
  () => props.isPlaying,
  (newValue: boolean) => {
    if (!isLoaded.value || !videoRef.value) return
    if (newValue) {
      videoRef.value.play()
    } else {
      videoRef.value.pause()
    }
  }
)

// LIFECYCLE
onMounted(() => {
  if (props.shouldLoad) {
    initScrollTrigger()
  }
  addListeners()
})

useSetup(() => {
  if (props.hasObserver) {
    initObserver()
  }
})

onBeforeUnmount(() => {
  removeListeners()
  cleanupTriggers()
})
</script>

<template>
  <div
    ref="containerRef"
    :class="[
      'base-video',
      {
        'base-video--fit': isFit,
        'base-video--parallax': hasParallax,
        'base-video--hidden': hasObserver
        // 'base-video--loaded': isLoaded
      }
    ]"
    :style="containerStyle"
  >
    <video
      ref="videoRef"
      :height="data.height"
      :width="data.width"
      :preload="preload"
      playsinline
      :autoplay="isAutoplaying"
      :loop="isLooping"
      :muted="isMuted"
      :loading="!hasProvider ? lazyType : undefined"
      :controls="hasControls"
      :controlslist="hasControls ? 'nodownload noplaybackrate' : undefined"
      :crossorigin="hasControls ? 'anonymous' : undefined"
      @ended="onEnded"
      @canplay="handleCanPlay"
    />
  </div>
</template>
