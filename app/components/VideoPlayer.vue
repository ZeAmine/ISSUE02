<script setup lang="ts">
import { checkTrigger, checkObserver } from '@vendor/checkTween'

const { $gsap: gsap, $ScrollTrigger: ScrollTrigger } = useNuxtApp()
const { windowSize } = storeToRefs(useAppStore())
const config = useRuntimeConfig()

// PROPS
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
  isAutoplay: {
    type: Boolean,
    default: false
  },
  hasControls: {
    type: Boolean,
    default: true
  },
  isFit: {
    type: Boolean,
    default: false
  },
  shouldLoad: {
    type: Boolean,
    default: true
  },
  isLooping: {
    type: Boolean,
    default: false
  },
  volume: {
    type: Number,
    default: 1
  },
  speed: {
    type: Number,
    default: 1
  },
  poster: {
    type: String,
    default: ''
  },
  preload: {
    type: String as PropType<'' | 'auto' | 'metadata' | 'none'>,
    default: 'metadata'
  },
  timeJumpValue: {
    type: Number,
    default: 10
  },
  lazyThreshold: {
    type: [String, Number],
    default: '-200% 100%'
  },
  hasObserver: {
    type: Boolean,
    default: false
  },
  useProvider: {
    type: Boolean,
    default: true
  }
})

// EMITS
const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeupdate: [time: number]
  loaded: [duration: string]
}>()

// REFS
const containerRef = shallowRef<HTMLDivElement | null>(null)
const videoElement = shallowRef<HTMLVideoElement | null>(null)
const progressBar = shallowRef<HTMLElement | null>(null)
const progressBarContainer = shallowRef<HTMLElement | null>(null)
const videoState = reactive({
  isPlaying: false,
  isMuted: props.isMuted,
  isLoaded: false,
  isInViewport: false
})
const currentTime = ref('00:00:00')
const duration = ref('00:00:00')
const animationFrameId = ref<number | null>(null)
const targetProgress = ref(0)

// VARIABLES
let observer: Observe | null = null
let scrollTrigger: ScrollTrigger | null = null
let loopTrigger: ScrollTrigger | null = null
let animation: gsap.core.Tween | null = null

// COMPUTED
const formattedDuration = computed(() => duration.value)
const playButtonLabel = computed(() => (videoState.isPlaying ? 'Pause' : 'Play'))
const muteButtonLabel = computed(() => (videoState.isMuted ? 'Unmute' : 'Mute'))
const videoSource = computed(() => {
  const src =
    windowSize.value.width < 1024 && props.data.srcSmall
      ? props.data.srcSmall
      : props.data.src || ''
  return getSourceUrl(src)
})
const containerStyle = computed(() => {
  if (props.isFit) return null

  const aspectRatio =
    props.data.height && props.data.width ? (props.data.height / props.data.width) * 100 : 56.25

  return {
    paddingTop: `${aspectRatio}%`
  }
})

// UTILS
const getSourceUrl = (src: string) => {
  if (!src) return ''

  if (props.useProvider && config.public.r2PublicUrl) {
    if (!src.startsWith('http')) {
      return `${config.public.r2PublicUrl}/${src.startsWith('/') ? src.substring(1) : src}`
    }
  }

  return src
}

// METHODS
const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${hours.toString().padStart(2, '0')}:${remainingMinutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const initVideo = () => {
  if (!props.shouldLoad || !videoElement.value) return false

  videoElement.value.src = videoSource.value
  videoElement.value.load()

  setupVideo()
}

const setupVideo = () => {
  if (!videoElement.value) return

  videoElement.value.playbackRate = props.speed
  videoElement.value.volume = props.volume

  if (progressBar.value) {
    gsap.set(progressBar.value, { width: '0%' })
  }
}

const startProgress = () => {
  const animate = () => {
    updateProgress()
    animateProgressBar()
    if (videoState.isPlaying) {
      animationFrameId.value = requestAnimationFrame(animate)
    }
  }
  animationFrameId.value = requestAnimationFrame(animate)
}

const stopProgress = () => {
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value)
    animationFrameId.value = null
  }
}

// HANDLERS
const play = async () => {
  if (!videoElement.value || !videoState.isLoaded) return

  try {
    await videoElement.value.play()
    videoState.isPlaying = true
    emit('play')
    startProgress()
  } catch (error) {
    console.error('Error playing video:', error)
  }
}

const pause = () => {
  if (!videoElement.value) return

  videoElement.value.pause()
  videoState.isPlaying = false
  emit('pause')
  stopProgress()
}

const togglePlay = async () => {
  if (videoState.isPlaying) {
    pause()
  } else {
    await play()
  }
}

const forward = () => {
  if (!videoElement.value) return

  videoElement.value.currentTime += props.timeJumpValue
}

const rewind = () => {
  if (!videoElement.value) return

  videoElement.value.currentTime -= props.timeJumpValue
}

const mute = () => {
  if (!videoElement.value) return

  videoState.isMuted = !videoState.isMuted
  videoElement.value.muted = videoState.isMuted
}

// ANIMATIONS
const updateProgress = () => {
  if (!videoElement.value) return

  const videoCurrentTime = videoElement.value.currentTime
  const videoDuration = videoElement.value.duration

  targetProgress.value = (videoCurrentTime / videoDuration) * 100
  currentTime.value = formatTime(videoCurrentTime)

  if (!duration.value || duration.value === '00:00:00') {
    duration.value = formatTime(videoDuration)
  }
}

const animateProgressBar = () => {
  if (!progressBar.value) return

  gsap.to(progressBar.value, {
    width: `${targetProgress.value}%`,
    duration: 0.2
  })
}

const seekVideo = (event: MouseEvent) => {
  if (!videoElement.value || !progressBarContainer.value) return

  const bounds = progressBarContainer.value.getBoundingClientRect()
  const percentage = (event.clientX - bounds.left) / bounds.width
  videoElement.value.currentTime = percentage * videoElement.value.duration
}

// OBSERVER
const initObserver = () => {
  if (!containerRef.value) return

  observer = new Observe({
    element: containerRef.value as HTMLElement,
    config: {
      root: null,
      margin: '10px',
      threshold: 0.2
    }
  })

  observer.on('IN', () => {
    handleEnter()
    observer?.stop()
  })
  observer.on('OUT', handleLeave)
}

// SCROLL TRIGGER
const initScrollTrigger = () => {
  if (!containerRef.value) return

  scrollTrigger = ScrollTrigger.create({
    trigger: containerRef.value,
    start: props.lazyThreshold,
    once: true,
    onEnter: initVideo
  })

  if (props.isLooping && props.isAutoplay) {
    loopTrigger = ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: play,
      onEnterBack: play,
      onLeave: pause,
      onLeaveBack: pause
    })
  }
}

// EVENTS
const handleCanPlay = () => {
  if (!videoElement.value || videoState.isLoaded) return

  setupVideo()
  videoState.isLoaded = true
  duration.value = formatTime(videoElement.value.duration)

  if (props.isAutoplay && videoState.isInViewport) {
    play()
  }

  emit('loaded', formattedDuration.value)
}

const handleEnter = () => {
  if (!containerRef.value) return
  videoState.isInViewport = true

  const video = containerRef.value.querySelector('video') as HTMLVideoElement
  if (!video) return

  animation?.kill()
  animation = gsap.to(video, {
    opacity: 1,
    duration: 0.8,
    ease: '--o3',
    delay: 0.2
  })
}

const handleLeave = () => {
  videoState.isInViewport = false
}

const handleKeyboardControls = (event: KeyboardEvent) => {
  if (!containerRef.value?.contains(document.activeElement)) return

  switch (event.key) {
    case ' ':
    case 'k':
      event.preventDefault()
      togglePlay()
      break
    case 'ArrowRight':
      event.preventDefault()
      forward()
      break
    case 'ArrowLeft':
      event.preventDefault()
      rewind()
      break
    case 'm':
      event.preventDefault()
      mute()
      break
  }
}

const handleTimeUpdate = () => {
  updateProgress()
  emit('timeupdate', videoElement.value?.currentTime || 0)
}

const handleVideoEnded = () => {
  if (!props.isLooping) {
    videoState.isPlaying = false
    emit('ended')
    stopProgress()
  }
}

// WATCHERS
watch(
  () => props.shouldLoad,
  (newValue: boolean) => {
    if (!videoState.isLoaded && videoElement.value && newValue) {
      cleanupTriggers()
      initVideo()
    }
  }
)

watch(
  () => props.isMuted,
  (newValue: boolean) => {
    if (videoElement.value) {
      videoState.isMuted = newValue
      videoElement.value.muted = newValue
    }
  }
)

watch(
  () => props.isLooping,
  (newValue: boolean) => {
    if (videoElement.value) {
      videoElement.value.loop = newValue
    }
  }
)

// LISTENERS
const addListeners = () => {
  if (!videoElement.value) return

  videoElement.value.addEventListener('timeupdate', handleTimeUpdate)
  videoElement.value.addEventListener('loadedmetadata', handleCanPlay)
  videoElement.value.addEventListener('ended', handleVideoEnded)
  if (progressBarContainer.value) {
    progressBarContainer.value.addEventListener('click', seekVideo)
  }
  window.addEventListener('keydown', handleKeyboardControls)
}

const removeListeners = () => {
  if (!videoElement.value) return

  videoElement.value.removeEventListener('timeupdate', handleTimeUpdate)
  videoElement.value.removeEventListener('loadedmetadata', handleCanPlay)
  videoElement.value.removeEventListener('ended', handleVideoEnded)
  if (progressBarContainer.value) {
    progressBarContainer.value.removeEventListener('click', seekVideo)
  }
  window.removeEventListener('keydown', handleKeyboardControls)
}

const cleanupTriggers = () => {
  checkTrigger(scrollTrigger)
  checkTrigger(loopTrigger)
  checkObserver(observer)
}

// LIFECYCLE
onMounted(() => {
  if (props.hasObserver) {
    initObserver()
  }
  if (props.shouldLoad) {
    initScrollTrigger()
  }
  addListeners()
})

onBeforeUnmount(() => {
  removeListeners()
  stopProgress()
  cleanupTriggers()
})

// EXPOSE
defineExpose({
  play,
  pause,
  togglePlay,
  forward,
  rewind
})
</script>

<template>
  <div
    ref="containerRef"
    class="video-player"
    :class="[
      {
        'video-player--fit': isFit,
        'video-player--paused': !videoState.isPlaying,
        'video-player--muted': videoState.isMuted,
        'video-player--loaded': videoState.isLoaded
      }
    ]"
    :style="containerStyle"
  >
    <video
      ref="videoElement"
      :width="data.width"
      :height="data.height"
      :preload="preload"
      playsinline
      :loop="isLooping"
      :autoplay="isAutoplay"
      :muted="videoState.isMuted"
      @ended="handleVideoEnded"
      @canplay="handleCanPlay"
    />
    <div v-if="hasControls" class="video-player-controls">
      <div class="video-player-btns">
        <button class="video-player-btn play-btn" :aria-label="playButtonLabel" @click="togglePlay">
          <span v-if="!videoState.isPlaying">Play</span>
          <span v-else>Pause</span>
        </button>
        <button class="video-player-btn mute-btn" :aria-label="muteButtonLabel" @click="mute">
          <span v-if="!videoState.isMuted">Mute</span>
          <span v-else>Unmute</span>
        </button>
      </div>
      <div ref="progressBarContainer" class="video-player-progress-container">
        <div ref="progressBar" class="video-player-progress"></div>
      </div>
      <div class="video-player-time">
        <span class="video-player-time-current">{{ currentTime }}</span>
        <span class="video-player-time-separator">/</span>
        <span class="video-player-time-duration">{{ formattedDuration }}</span>
      </div>
    </div>
  </div>
</template>
