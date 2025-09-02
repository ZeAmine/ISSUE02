import { useViewportStore } from '@stores/viewport'
import type { IViewportState } from '@types'

function detectDeviceFromUA(userAgent: string): IViewportState['device'] {
  const ua = userAgent || ''
  const isTablet = /iPad|Tablet|Nexus 7|Nexus 10|SM-T|Tab|Kindle|Silk/i.test(ua)
  const isMobile = /Mobi|Android(?!.*Tablet)|iPhone|iPod|Phone|Mobile/i.test(ua)
  if (isTablet) return 'tablet'
  if (isMobile) return 'mobile'
  return 'desktop'
}

function guessViewport(
  device: IViewportState['device']
): Pick<IViewportState, 'width' | 'height' | 'orientation' | 'aspectRatio' | 'device' | 'isTouch'> {
  if (device === 'mobile') {
    const width = 390
    const height = 844
    return {
      width,
      height,
      aspectRatio: width / height,
      orientation: height >= width ? 'portrait' : 'landscape',
      device: 'mobile',
      isTouch: true
    }
  }
  if (device === 'tablet') {
    const width = 768
    const height = 1024
    return {
      width,
      height,
      aspectRatio: width / height,
      orientation: height >= width ? 'portrait' : 'landscape',
      device: 'tablet',
      isTouch: true
    }
  }

  const width = 1440
  const height = 900
  return {
    width,
    height,
    aspectRatio: width / height,
    orientation: width >= height ? 'landscape' : 'portrait',
    device: 'desktop',
    isTouch: false
  }
}

export default defineNuxtPlugin(() => {
  const headers = useRequestHeaders(['user-agent'])
  const device = detectDeviceFromUA(headers['user-agent'] || '')
  const viewport = guessViewport(device)
  const { setViewportState } = useViewportStore()
  console.log(viewport)
  setViewportState(viewport as IViewportState)
})
