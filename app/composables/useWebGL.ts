import { storeToRefs } from 'pinia'
import { onMounted, ref, type Ref, shallowRef } from 'vue'

import { useAppStore } from '@stores/app'
import { App } from '@webgl'

export function useWebGL(canvas: Ref<HTMLCanvasElement | null>) {
  const { isPreloaderDone } = storeToRefs(useAppStore())
  const webgl = shallowRef<App | null>(null)
  const isSupported = ref(true)

  const init = () => {
    if (!canvas.value) return

    try {
      const testCanvas = document.createElement('canvas')
      const hasWebGL = !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      )

      if (!hasWebGL) throw new Error('WebGL not supported')

      webgl.value = markRaw(new App(canvas.value))
    } catch (error) {
      console.error('WebGL initialization failed:', error)
      isSupported.value = false
    }
  }

  const start = () => {
    try {
      webgl.value?.start()
    } catch (error) {
      console.error('WebGL start failed:', error)
    }
  }

  const destroy = () => {
    try {
      webgl.value?.destroy()
      webgl.value = null
    } catch (error) {
      console.error('WebGL destruction failed:', error)
    }
  }

  onMounted(() => {
    init()

    if (!isPreloaderDone.value) {
      eventEmitter.on('PRELOADER:COMPLETE', start)
    } else {
      start()
    }

    if (import.meta.hot) {
      import.meta.hot.dispose(destroy)
    }
  })

  return {
    webgl,
    isSupported,
    destroy
  }
}
