import WebFontLoader from 'webfontloader'
import { eventEmitter } from '@/utils/EventEmitter'

export default defineNuxtPlugin(async () => {
  const { setIsFontLoaded } = useAppStore()

  const loadFonts = async () => {
    try {
      await new Promise<void>((resolve) => {
        const timeoutId = setTimeout(() => {
          setIsFontLoaded()
          resolve()
        }, 3000)

        WebFontLoader.load({
          custom: {
            families: ['hnt:n4,n5,n7', 'ac:n4,i4']
          },
          classes: false,
          active: () => {
            clearTimeout(timeoutId)
            setIsFontLoaded()
            eventEmitter.emit('FONTS:LOADED')
            resolve()
          },
          inactive: () => {
            clearTimeout(timeoutId)
            console.warn('Font loading failed, using fallback fonts')
            setIsFontLoaded()
            resolve()
          }
        })
      })
    } catch (error) {
      console.error('Error in font loading:', error)
      setIsFontLoaded()
    }
  }

  await loadFonts()
})
