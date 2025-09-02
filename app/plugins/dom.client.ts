import { defineNuxtPlugin } from '#app'
import { Dom } from '@/utils/Dom'

export default defineNuxtPlugin(() => {
  const domInstance = new Dom()
  return {
    provide: {
      dom: domInstance
    }
  }
})
