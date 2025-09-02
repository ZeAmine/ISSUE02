<script setup lang="ts">
import { Text } from '@/animations/texts'

const route = useRoute()
const { headerTheme, isPreloaderDone } = storeToRefs(useAppStore())
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
        'header--preloader-done': isPreloaderDone
      }
    ]"
  ></header>
</template>
