<script setup lang="ts">
import { Text } from '@/animations/texts'

const route = useRoute()
const { isNavOpen, headerTheme, isPreloaderDone } = storeToRefs(useAppStore())
const { setHeaderTheme } = useAppStore()
const { getRouteTheme } = useThemePage()
const { selectAll } = useTools()

// REFS
const headerRef = shallowRef<HTMLElement | null>(null)
const textSplits = ref<Text[]>([])
const isHeaderVisible = ref(false)

// COMPUTED
const routeName = computed(() => route.path as string)
const initialTheme = computed(() => getRouteTheme(routeName.value))

// METHODS
const splitText = () => {
  const header = headerRef.value as HTMLElement
  const textLines = selectAll('.st-l', header)
  textSplits.value = textLines.map((el: HTMLElement) => new Text({ element: el }))
}

// ANIMATIONS
const animateEnter = () => {
  textSplits.value.forEach((text) => text.animateIn())
}

// EVENTS
const handlePreloaderComplete = () => {
  setHeaderTheme(initialTheme.value)
  animateEnter()
}

// LISTENERS
const addListeners = () => {
  eventEmitter.on('PRELOADER:COMPLETE', handlePreloaderComplete)
}

const removeListeners = () => {
  eventEmitter.off('PRELOADER:COMPLETE', handlePreloaderComplete)
}

// HOOKS
onMounted(() => {
  splitText()
  addListeners()
})

onUnmounted(() => {
  removeListeners()
})
</script>

<template>
  <header
    ref="headerRef"
    :class="[
      'header',
      `header--${headerTheme}`,
      {
        'header--visible': isHeaderVisible,
        'header--nav-open': isNavOpen,
        'header--preloader-done': isPreloaderDone
      }
    ]"
  >
    <nuxt-link class="header-logo">
      <div class="header-logo-icon">
        <svg viewBox="0 0 219 221">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M218.292 110.783L218.5 0.961914H151.86C79.8226 0.961914 79.615 0.961914 69.3387 6.56714C65.9133 8.43555 53.4572 20.165 32.0743 41.5479L0 73.6223H32.0743C49.7204 73.6223 63.9411 73.9337 63.6297 74.2451C63.3183 74.5565 59.9967 75.3869 56.2599 76.2173C31.5553 81.4073 10.2762 101.233 2.38741 126.561C0.415202 133.1 0 136.525 0.1038 147.84C0.1038 159.569 0.519002 162.475 2.90641 169.638C7.68123 183.962 16.4005 196.418 27.8185 205.034C41.105 214.999 52.1078 218.943 69.0273 219.67C83.3518 220.396 93.628 218.216 106.292 211.988C116.879 206.798 131.308 192.578 136.705 182.094C140.027 175.554 141.272 172.233 144.594 159.777C145.321 157.285 145.632 165.693 145.736 188.01L145.84 219.877L153.417 220.189C157.465 220.396 173.762 220.5 189.436 220.5H217.981L218.292 110.783ZM72.6603 74.1413L72.3489 110.783L72.1413 147.321H108.99H145.84V110.471V73.6223L109.302 73.8299L72.6603 74.1413Z"
          />
        </svg>
      </div>
    </nuxt-link>
    <nav class="header-nav">
      <nuxt-link to="/" class="header-nav-link">Home</nuxt-link>
      <nuxt-link to="/about" class="header-nav-link st-l">About</nuxt-link>
      <nuxt-link to="/works" class="header-nav-link st-l">Works</nuxt-link>
    </nav>
  </header>
</template>
