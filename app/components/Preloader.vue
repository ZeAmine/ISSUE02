<script setup lang="ts">
import { checkTween } from '@vendor/checkTween'
import { Preloader } from '@webgl/_preloader'

import { Text } from '@/animations/texts'

const route = useRoute()
const router = useRouter()
const { $gsap: gsap, $dom: dom, $lenisControls: lenis } = useNuxtApp()
const { setIsTransitioning, setIsPreloaderComplete, setIsPreloaderDone, setHeaderTheme } =
  useAppStore()
const { isPreloaderDone } = storeToRefs(useAppStore())
const { getPreloaderTheme } = useThemePage()
const { select, selectAll } = useTools()

// REFS
const preloaderRef = shallowRef<HTMLElement | null>(null)

const textSplits = ref<Text[]>([])
const currentPercent = ref(0)

// VARIABLES
let entryAnimation: gsap.core.Timeline | null = null
let progressAnimation: gsap.core.Timeline | null = null
let exitAnimation: gsap.core.Timeline | null = null

// COMPUTED
const routeName = computed(() => route.path as string)
const preloaderTheme = computed(() => getPreloaderTheme(routeName.value))
const isHomePage = computed(() => router.currentRoute.value.name === 'index')

// METHODS
const splitText = () => {
  if (!preloaderRef.value) return

  const texts = selectAll('.st-l', preloaderRef.value)
  textSplits.value = texts.map((el: HTMLElement) => {
    return new Text({ element: el })
  })
}

// ANIMATIONS
const animateEnter = () => {
  if (!preloaderRef.value) return

  entryAnimation = gsap.timeline({
    onStart: () => {
      eventEmitter.emit('PRELOADER:START')
    }
  })

  entryAnimation.add(() => {
    textSplits.value[1]?.show()
  }, 'start+=0.5')
  entryAnimation.add(() => {
    textSplits.value[0]?.show()
  }, 'start+=0.2')
}

const animateProgress = () => {
  if (!preloaderRef.value) return

  const numberEl = select('.preloader-number .l', preloaderRef.value) as HTMLElement
  if (!numberEl) return

  progressAnimation = gsap.timeline({
    delay: 0.6,
    onComplete: animateComplete
  })

  progressAnimation.to(currentPercent, {
    startAt: {
      value: 0
    },
    value: 100,
    duration: 3.4,
    ease: 'loadingOut',
    onUpdate: () => {
      const value = Math.floor(currentPercent.value)
      const formatedValue = value < 100 ? value.toString().padStart(2, '0') : '100'
      numberEl.textContent = formatedValue
    }
  })
}

const animateComplete = () => {
  if (!preloaderRef.value) return

  exitAnimation = gsap.timeline({
    delay: 0.2,
    onComplete: () => {
      setIsPreloaderComplete()
      lenis.start()
    }
  })

  exitAnimation.add(() => {
    textSplits.value.forEach((text) => {
      text.animateOut()
    })
  })
  exitAnimation.to(preloaderRef.value, {
    onStart: () => {
      gsap.delayedCall(0.4, () => {
        eventEmitter.emit('PRELOADER:COMPLETE')
        setIsPreloaderDone()
        setIsTransitioning()
        dom.show()
      })
    }
  })
}

const initLoaderWebGL = () => {
  const preloader = new Preloader()
  preloader.init()
}

// LIFECYCLE
onMounted(async () => {
  setIsTransitioning()
  lenis.scrollZero()
  lenis.stop()

  await nextTick()
  setHeaderTheme(preloaderTheme.value)
  dom.init()

  initLoaderWebGL()
  splitText()
  animateEnter()
  animateProgress()
})

onBeforeUnmount(() => {
  checkTween(entryAnimation)
  checkTween(progressAnimation)
  checkTween(exitAnimation)
})
</script>

<template>
  <div
    ref="preloaderRef"
    :class="[
      'preloader',
      {
        'preloader--home': isHomePage,
        'preloader--done': isPreloaderDone
      }
    ]"
  >
    <div class="preloader-number st-l">0</div>
    <div class="preloader-description st-l">
      Lorem ipsum dolor <i>sit amet</i>, consectetur adipiscing elit. Sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua.
    </div>
  </div>
</template>
