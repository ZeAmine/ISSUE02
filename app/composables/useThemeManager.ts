import { ROUTES } from '@/constants/routes'

interface RouteTheme {
  to: string
  from: string
}

export const ROUTE_THEMES: Record<string, string> = {
  [ROUTES.HOME]: 'light',
  [ROUTES.ABOUT]: 'dark',
  [ROUTES.WORKS]: 'dark',
  [ROUTES.WORK]: 'light'
}

export const PRELOADER_THEMES: Record<string, string> = {
  [ROUTES.HOME]: 'dark',
  [ROUTES.ABOUT]: 'light',
  [ROUTES.WORKS]: 'dark',
  [ROUTES.WORK]: 'dark'
}

export const SLUGGED_CONTENT_TYPES = ['article', 'case_study'] as const

/**
 * Gestion des thèmes en fonction des pages
 */
export const useThemePage = () => {
  const { $gsap: gsap } = useNuxtApp()
  const { setHeaderTheme } = useAppStore()
  const { headerTheme } = storeToRefs(useAppStore())

  let themeTransition: gsap.core.Tween | null = null

  const getRouteTheme = (routeName: string) => {
    if (routeName.startsWith('/projects')) {
      return ROUTE_THEMES[ROUTES.WORK]
    }
    return ROUTE_THEMES[routeName]
  }

  const getPreloaderTheme = (routeName: string) => {
    if (routeName.startsWith('/projects')) {
      return PRELOADER_THEMES[ROUTES.WORK]
    }
    return PRELOADER_THEMES[routeName]
  }

  const handleThemeTransition = ({ to, from }: RouteTheme) => {
    const targetTheme = getRouteTheme(to)
    const shouldChangeTheme = from && to && targetTheme && headerTheme.value !== targetTheme

    if (shouldChangeTheme) {
      themeTransition?.kill()
      themeTransition = gsap.delayedCall(0.1, () => {
        setHeaderTheme(targetTheme)
      })
    }
  }

  return {
    getRouteTheme,
    getPreloaderTheme,
    handleThemeTransition
  }
}

/**
 * Gestion du thème basé sur le scroll
 */
export const useThemeTrigger = ({
  headerTheme = 'dark',
  hasLeaveCallback = false
}: {
  headerTheme?: 'light' | 'dark'
  hasLeaveCallback?: boolean
} = {}) => {
  const { $ScrollTrigger: ScrollTrigger } = useNuxtApp()
  const router = useRouter()
  const { getRouteTheme } = useThemePage()
  const { setHeaderTheme } = useAppStore()
  const { isPreloaderDone } = storeToRefs(useAppStore())

  const container: Ref<HTMLElement | null> = ref(null)
  let scrollTrigger: ScrollTrigger | null = null

  const initScrollTrigger = () => {
    scrollTrigger = ScrollTrigger.create({
      trigger: container.value!,
      start: 'top 2%',
      end: 'bottom 2%',
      onEnter: handleEnter,
      onEnterBack: handleEnter,
      onLeaveBack: handleLeave,
      onLeave: hasLeaveCallback ? handleLeave : undefined
    })
  }

  const handleEnter = () => {
    if (!isPreloaderDone.value) return
    setHeaderTheme(headerTheme)
  }

  const handleLeave = () => {
    const currentRouteName = router.currentRoute.value.name as string
    const newTheme = getRouteTheme(currentRouteName)
    setHeaderTheme(newTheme)
  }

  onMounted(() => {
    if (!isPreloaderDone.value) return
    initScrollTrigger()
  })

  onUnmounted(() => {
    scrollTrigger?.kill()
    scrollTrigger = null
  })

  return {
    container
  }
}
