import { onMounted, onBeforeUnmount, watch } from 'vue'

import { useAppStore } from '@stores/app'

interface LifecycleOptions<T = never> {
  onMount?: (arg?: T) => void
  onDestroy?: (arg?: T) => void
  onSetup?: (arg?: T) => void
}

export const useMount = (hook: (arg?: never) => void): void => {
  onMounted(() => hook())
}

export const useDestroy = (hook: (arg?: never) => void): void => {
  const cb = (): void => hook()

  onBeforeUnmount(() => cb())
}

export const useSetup = (hook: (arg?: never) => void): void => {
  const s = useAppStore()
  const cb = (): void => hook()

  onMounted((): void => {
    if (s.isPreloaderComplete && !s.isTransitioning) cb()
  })

  watch(
    () => s.isPreloaderComplete && !s.isTransitioning,
    (v): void => {
      if (v) cb()
    }
  )
}

export default function ({ onMount, onDestroy, onSetup }: LifecycleOptions): void {
  if (onMount) useMount(onMount)
  if (onDestroy) useDestroy(onDestroy)
  if (onSetup) useSetup(onSetup)
}
